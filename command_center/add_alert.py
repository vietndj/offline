with open("/Users/vietmac/Documents/CODE/offline/command_center/scanner_daemon.py", "r") as f:
    content = f.read()

func_def = """import subprocess
import requests

def alert_telegram_new_lead(phone, name, text):
    try:
        token = "7991600422:AAHNmZ9ixcQtf_pTVQewadrnYZ0apOEvxgk"
        chat_id = "2050406425"
        url = f"https://api.telegram.org/bot{token}/sendMessage"
        msg = f"🔔 KHÁCH ĐỂ LẠI SĐT TRÊN PAGE\\n👤 {name}\\n📱 {phone}\\n\\n💬 Lịch sử 5 tin gần nhất:\\n{text}\\n\\n👉 Zalo 1 chạm: https://zalo.me/{phone}"
        requests.post(url, json={"chat_id": chat_id, "text": msg})
    except:
        pass

"""
if "alert_telegram_new_lead" not in content:
    content = content.replace("import time", "import time\n" + func_def)

# Find the insertion spot
spot_old = """                    now = get_vn_time()
                    c_local.execute("INSERT INTO contacts (phone, name, source, stage, created_at, updated_at) VALUES (?, ?, 'facebook', 'new', ?, ?)",
                                   (extracted_phone, sender_name, now, now))
                    contact_id = c_local.lastrowid"""
                    
spot_new = """                    now = get_vn_time()
                    c_local.execute("INSERT INTO contacts (phone, name, source, stage, created_at, updated_at) VALUES (?, ?, 'facebook', 'new', ?, ?)",
                                   (extracted_phone, sender_name, now, now))
                    contact_id = c_local.lastrowid
                    alert_telegram_new_lead(extracted_phone, sender_name, text)"""

content = content.replace(spot_old, spot_new)

with open("/Users/vietmac/Documents/CODE/offline/command_center/scanner_daemon.py", "w") as f:
    f.write(content)
print("Updated alert logic")
