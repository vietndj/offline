import re

with open("/Users/vietmac/Documents/CODE/offline/command_center/scanner_daemon.py", "r") as f:
    content = f.read()

func_def = """import subprocess
import requests
import sys
sys.path.append("/Users/vietmac/Documents/CODE/antigravity-config-backup/config/skills/facebook-inbox-audit/scripts")
try:
    from phone_lead_dispatcher import check_phone_in_stu_and_called
except:
    check_phone_in_stu_and_called = None

def alert_telegram_new_lead(phone, name, text):
    try:
        # 1. BẮT BUỘC KIỂM TRA STU GATEKEEPER TRƯỚC KHI BẮN TELEGRAM
        if check_phone_in_stu_and_called:
            is_called, reason = check_phone_in_stu_and_called(phone, name)
            if is_called:
                print(f"🛑 [STU-Gatekeeper] Chặn alert cho {name} ({phone}) vì: {reason}")
                return # BỎ QUA KHÔNG BẮN ALERT

        # 2. Nếu chưa gọi -> Bắn alert
        print(f"✅ [STU-Gatekeeper] SĐT mới tinh chưa gọi: {phone} -> Đang bắn Telegram...")
        token = "7991600422:AAHNmZ9ixcQtf_pTVQewadrnYZ0apOEvxgk"
        chat_id = "2050406425"
        url = f"https://api.telegram.org/bot{token}/sendMessage"
        msg = f"🔔 KHÁCH ĐỂ LẠI SĐT TRÊN PAGE\\n👤 {name}\\n📱 {phone}\\n\\n💬 Lịch sử 5 tin gần nhất:\\n{text}\\n\\n👉 Zalo 1 chạm: https://zalo.me/{phone}"
        requests.post(url, json={"chat_id": chat_id, "text": msg})
    except Exception as e:
        print(f"Lỗi gửi Telegram alert: {e}")
"""

# Replace the old func_def with the new one
start_idx = content.find("def alert_telegram_new_lead(")
if start_idx != -1:
    end_idx = content.find("def scan_calls():", start_idx)
    old_func = content[start_idx:end_idx]
    
    # But wait, there are imports at the top
    # Let's just replace the whole file from top up to scan_calls() ?
    # Better to just use regex to replace the old alert_telegram_new_lead function
    
    content = content.replace(old_func, func_def + "\n")
    with open("/Users/vietmac/Documents/CODE/offline/command_center/scanner_daemon.py", "w") as f:
        f.write(content)
    print("Patched alert_telegram_new_lead")
else:
    print("Could not find alert_telegram_new_lead")
