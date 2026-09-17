#!/bin/bash
# -------------------------------------------------------------
# FEDU LED Hub Launcher
# Khởi chạy máy chủ LED Hub tự động đồng bộ cuộc gọi & iPhone
# -------------------------------------------------------------

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

PORT=8888

echo "🚀 [LED-HUB] Đang kiểm tra cổng $PORT..."
PID=$(lsof -ti :$PORT)
if [ ! -z "$PID" ]; then
    echo "⚠️ Đang dừng tiến trình cũ trên cổng $PORT (PID: $PID)..."
    kill -9 $PID
    sleep 1
fi

echo "⚡ [LED-HUB] Đang khởi chạy hệ thống LED Hub Engine..."
nohup python3 "$DIR/telesale_server.py" > "$DIR/radar_server.log" 2>&1 &
SERVER_PID=$!

echo "✅ Máy chủ đã chạy ngầm với PID: $SERVER_PID"
sleep 2

# Kiểm tra sức khỏe server
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/api/stats)
if [ "$STATUS" == "200" ]; then
    echo "🎉 [LED-HUB] Khởi động thành công! Đang mở trình duyệt..."
    open "http://localhost:$PORT"
else
    echo "⚠️ Đang chờ server phản hồi..."
    sleep 2
    open "http://localhost:$PORT"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 LED Hub URL: http://localhost:$PORT"
echo "📄 Log file: $DIR/radar_server.log"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
