#!/bin/bash
# -------------------------------------------------------------
# FEDU LED Hub - Online Remote Access (Cloudflare Tunnel)
# Mở đường link HTTPS bảo mật truy cập từ iPhone qua 4G/5G
# -------------------------------------------------------------

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

PORT=8888

# 1. Đảm bảo server backend đang chạy
PID=$(lsof -ti :$PORT)
if [ -z "$PID" ]; then
    echo "⚡ [ONLINE] Đang khởi chạy máy chủ LED Hub..."
    nohup python3 "$DIR/telesale_server.py" > "$DIR/radar_server.log" 2>&1 &
    sleep 2
fi

# 2. Kiểm tra tiến trình tunnel
TUNNEL_PID=$(pgrep -f "cloudflared tunnel --url http://localhost:$PORT")
if [ -z "$TUNNEL_PID" ]; then
    echo "🌐 [ONLINE] Đang thiết lập đường truyền bảo mật Cloudflare Tunnel..."
    rm -f "$DIR/tunnel.log"
    nohup cloudflared tunnel --url "http://localhost:$PORT" > "$DIR/tunnel.log" 2>&1 &
    sleep 6
fi

# 3. Trích xuất URL công khai
ONLINE_URL=$(grep -o 'https://[a-zA-Z0-9-]*\.trycloudflare\.com' "$DIR/tunnel.log" | head -n 1)

# Lấy địa chỉ IP mạng nội bộ Wi-Fi
WIFI_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1")

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 LED HUB ĐÃ SẴN SÀNG TRÊN ĐIỆN THOẠI!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 1. KHI Ở NGOÀI ĐƯỜNG (DÙNG 4G / 5G HOẶC WIFI KHÁC):"
echo "   👉 Đường link HTTPS:"
echo "   $ONLINE_URL"
echo ""
echo "🏠 2. KHI Ở NHÀ (CÙNG MẠNG WIFI VỚI MÁY MAC):"
echo "   👉 http://$WIFI_IP:$PORT"
echo ""
echo "💡 MẸO DÙNG NHƯ APP TRÊN IPHONE:"
echo "   1. Mở link trên bằng Safari."
echo "   2. Bấm nút Chia sẻ (biểu tượng hình vuông có mũi tên trỏ lên)."
echo "   3. Chọn 'Thêm vào MH chính' (Add to Home Screen)."
echo "   -> Điện thoại sẽ có icon ứng dụng như App thật!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Gửi link vào Telegram bot nếu có
BOT_TOKEN="7991600422:AAHNmZ9ixcQtf_pTVQewadrnYZ0apOEvxgk"
CHAT_ID="2050406425"
if [ ! -z "$ONLINE_URL" ]; then
    curl -s -X POST "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" \
        -d "chat_id=$CHAT_ID" \
        -d "text=🚀 [LED Hub Online Link]%0A%0AĐường link truy cập từ xa qua 4G/5G:%0A$ONLINE_URL" > /dev/null 2>&1 &
fi
