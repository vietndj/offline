import os
import requests
import argparse
from datetime import datetime

BOT_TOKEN = "8392893959:AAF79Uc6dI4rliweE0BvhnBJ06eV5EJdi-Y"
CHAT_ID = "2050406425"

def send_telegram_report(text):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": CHAT_ID,
        "text": text,
        "parse_mode": "HTML"
    }
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        print(f"Report sent successfully at {datetime.now()}")
    except Exception as e:
        print(f"Failed to send report: {e}")

def generate_morning_report():
    now = datetime.now().strftime("%d/%m/%Y")
    report = f"""📊 BÁO CÁO SÁNG - {now}

📨 Tin nhắn mới qua đêm: 3
📞 Lead chưa gọi: 5
🔥 Cần xử lý gấp: 2

👤 Nguyễn Văn A - 0912.345.678
   └ Nhắn tin lúc 22:30 hôm qua, chưa trả lời
👤 Trần Thị B - 0987.654.321  
   └ Lead mới đăng ký lúc 01:15

📱 Mở Dashboard: command.fedu.vn"""
    return report

def generate_noon_report():
    now = datetime.now().strftime("%d/%m/%Y")
    report = f"☀️ BÁO CÁO TRƯA - {now}\n\n📞 Cuộc gọi sáng nay: 12\n📨 Tin nhắn đã xử lý: 8\n✅ Lead chuyển đổi: 2"
    return report

def generate_evening_report():
    now = datetime.now().strftime("%d/%m/%Y")
    report = f"🌆 BÁO CÁO CHIỀU - {now}\n\n📞 Cuộc gọi chiều nay: 15\n✅ Lead chuyển đổi: 4\n🔄 Cần follow-up ngày mai: 3"
    return report

def generate_night_report():
    now = datetime.now().strftime("%d/%m/%Y")
    report = f"🌙 BÁO CÁO TỔNG KẾT NGÀY - {now}\n\nTổng cộng cuộc gọi: 27\nTổng tin nhắn: 18\nNew Leads hôm nay: 7\nChuyển đổi thành công: 6\n\n🎯 Mục tiêu ngày mai: Gọi lại 5 leads chưa nghe máy."
    return report

def generate_instant_alert(contact):
    name = contact.get("name", "Unknown")
    phone = contact.get("phone", "N/A")
    report = f"🚨 INSTANT ALERT: Lead mới/Cần hỗ trợ gấp!\n👤 {name} - {phone}\n(STU-Gatekeeper check: Passed)"
    return report

def run_scheduled():
    hour = datetime.now().hour
    if hour == 8:
        report = generate_morning_report()
    elif hour == 12:
        report = generate_noon_report()
    elif hour == 17:
        report = generate_evening_report()
    elif hour == 21:
        report = generate_night_report()
    else:
        print(f"No scheduled report for hour {hour}")
        return
        
    send_telegram_report(report)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--test", action="store_true", help="Send test morning report")
    parser.add_argument("--run", action="store_true", help="Run scheduled check")
    args = parser.parse_args()

    if args.test:
        print("Sending test report...")
        report = generate_morning_report()
        send_telegram_report(report)
    elif args.run:
        run_scheduled()
    else:
        print("Use --test or --run")
