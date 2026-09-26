import os
import time
import sqlite3
import argparse
from datetime import datetime
import subprocess
import requests
import re
import sys
sys.path.append("/Users/vietmac/Documents/CODE/antigravity-config-backup/config/skills/facebook-inbox-audit/scripts")
try:
    from phone_lead_dispatcher import check_phone_in_stu_and_called
except:
    check_phone_in_stu_and_called = None


def guess_gender(name):
    name = str(name).strip().upper()
    parts = name.split()
    if not parts: return "chị"
    last_word = parts[-1]
    female = {"TRANG", "THU", "HOA", "LINH", "THỦY", "THUY", "HƯƠNG", "HUONG", "MAI", "PHƯƠNG", "PHUONG", "NHUNG", "YẾN", "YEN", "NGỌC", "NGOC", "THẢO", "THAO", "VY", "HÀ", "HA", "LAN", "ANH", "MY", "NGA", "QUỲNH", "QUYNH", "THANH", "TRÂM", "TRAM", "TUYẾT", "TUYET", "UYÊN", "UYEN", "VÂN", "VAN", "XUÂN", "XUAN", "LY", "HIỀN", "HIEN", "NHI", "TRINH", "THI", "HẰNG", "HANG", "LOAN", "OANH", "DIỆP", "DIEP", "GIANG", "HÂN", "HAN", "TIÊN", "TIEN", "TRÀ", "TRA", "HUYỀN", "HUYEN", "THƠ", "THO", "THUẬN"}
    male = {"HÙNG", "HUNG", "SƠN", "SON", "TÙNG", "TUNG", "LONG", "CƯỜNG", "CUONG", "TUẤN", "TUAN", "HOÀNG", "HOANG", "HẢI", "HAI", "QUANG", "DŨNG", "DUNG", "THÀNH", "THANH", "ĐỨC", "DUC", "HUY", "NAM", "PHONG", "PHÚC", "PHUC", "THẮNG", "THANG", "BÌNH", "BINH", "ĐẠT", "DAT", "HIẾU", "HIEU", "MINH", "BẢO", "BAO", "LÂM", "LAM", "SANG", "VINH", "KIÊN", "KIEN", "TÀI", "TAI", "TRỌNG", "TRONG", "TRÍ", "TRI", "VŨ", "VU", "BÁCH", "BACH", "CÔNG", "CONG", "ĐÔNG", "DONG", "HÀO", "HAO", "KHOA", "TOÀN", "TOAN", "VIỆT", "VIET"}
    if last_word in female: return "chị"
    if last_word in male: return "anh"
    if "THỊ " in name or " THỊ" in name: return "chị"
    if "VĂN " in name or " VĂN" in name: return "anh"
    return "chị"

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
        msg = f"🔔 KHÁCH ĐỂ LẠI SĐT TRÊN PAGE\n👤 {name}\n📱 {phone}\n\n💬 Lịch sử 5 tin gần nhất:\n{text}\n\n👉 Zalo 1 chạm: https://zalo.me/{phone}"
        requests.post(url, json={"chat_id": chat_id, "text": msg})
    except Exception as e:
        print(f"Lỗi gửi Telegram alert: {e}")

def scan_calls():
    print(f"[{datetime.now()}] Bắt đầu quét CallHistory...")
    db_path = os.path.expanduser("~/Library/Application Support/CallHistoryDB/CallHistory.storedata")
    if not os.path.exists(db_path):
        print("CallHistory DB not found")
        return

    try:
        uri = f"file:{db_path}?mode=ro"
        conn_mac = sqlite3.connect(uri, uri=True)
        c_mac = conn_mac.cursor()
        
        min_ts = get_apple_created_at(last_24h=True)
        c_mac.execute("SELECT ZADDRESS, ZDATE, ZDURATION, ZORIGINATED FROM ZCALLRECORD WHERE ZDATE > ?", (min_ts,))
        calls = c_mac.fetchall()
        conn_mac.close()
        
        conn_local = get_connection()
        c_local = conn_local.cursor()
        
        for address, date, duration, originated in calls:
            if not address:
                continue
            # Normalize phone
            phone = address.replace(" ", "").replace("-", "")
            if phone.startswith("+84"):
                phone = "0" + phone[3:]
                
            c_local.execute("SELECT id, stage FROM contacts WHERE phone LIKE ?", (f"%{phone[-9:]}%",))
            contact = c_local.fetchone()
            if contact:
                contact_id = contact["id"]
                stage = contact["stage"]
                
                unix_ts = date + APPLE_EPOCH_OFFSET
                dt = datetime.fromtimestamp(unix_ts).isoformat()
                
                direction = "outbound" if originated else "inbound"
                content = f"Call duration: {duration} seconds"
                
                # Insert conversation if not exists
                c_local.execute("SELECT id FROM conversations WHERE contact_id=? AND created_at=? AND channel='call'", (contact_id, dt))
                if not c_local.fetchone():
                    c_local.execute("INSERT INTO conversations (contact_id, channel, direction, content, created_at) VALUES (?, 'call', ?, ?, ?)", 
                                    (contact_id, direction, content, dt))
                    
                    if duration > 0 and stage == 'new':
                        c_local.execute("UPDATE contacts SET stage='contacted', updated_at=? WHERE id=?", (dt, contact_id))
        
        conn_local.commit()
        conn_local.close()
    except Exception as e:
        print(f"Lỗi quét CallHistory: {e}")

def scan_imessages():
    print(f"[{datetime.now()}] Bắt đầu quét iMessage/SMS...")
    db_path = os.path.expanduser("~/Library/Messages/chat.db")
    if not os.path.exists(db_path):
        print("Messages chat.db not found")
        return

    try:
        uri = f"file:{db_path}?mode=ro"
        conn_mac = sqlite3.connect(uri, uri=True)
        c_mac = conn_mac.cursor()
        
        min_ts = get_apple_created_at(last_24h=True) * 1000000000 # chat.db uses nanoseconds for dates usually
        # Fallback to standard Apple epoch if needed. chat.db created_at format can be tricky, typically nano seconds since 2001
        
        # We will just do a simple try-except
        c_mac.execute("SELECT handle.id, message.date, message.text, message.is_from_me FROM message JOIN handle ON message.handle_id = handle.ROWID ORDER BY message.date DESC LIMIT 100")
        messages = c_mac.fetchall()
        conn_mac.close()
        
        conn_local = get_connection()
        c_local = conn_local.cursor()
        
        for address, date, text, is_from_me in messages:
            if not address or not text:
                continue
            phone = address.replace(" ", "").replace("-", "")
            if phone.startswith("+84"):
                phone = "0" + phone[3:]
                
            c_local.execute("SELECT id FROM contacts WHERE phone LIKE ?", (f"%{phone[-9:]}%",))
            contact = c_local.fetchone()
            if contact:
                contact_id = contact["id"]
                
                # Handle varying created_at length
                date_val = date
                if date_val > 10**15:
                    date_val = date_val / 1000000000
                
                unix_ts = date_val + APPLE_EPOCH_OFFSET
                dt = datetime.fromtimestamp(unix_ts).isoformat()
                
                direction = "outbound" if is_from_me else "inbound"
                channel = "imessage" # simplify
                
                c_local.execute("SELECT id FROM conversations WHERE contact_id=? AND created_at=? AND channel=?", (contact_id, dt, channel))
                if not c_local.fetchone():
                    c_local.execute("INSERT INTO conversations (contact_id, channel, direction, content, created_at) VALUES (?, ?, ?, ?, ?)", 
                                    (contact_id, channel, direction, text, dt))
                    
        conn_local.commit()
        conn_local.close()
    except Exception as e:
        print(f"Lỗi quét Messages: {e}")

def scan_facebook():
    try:
        PAGE_ID = "839755019212216"
        TOKEN = "EAAegdQqWEkwBSQxUkVrG1rHI2DmOaH2JPlUi6WMfQmjZBaVEmheVnXXC4etBFtxiA0od4qS3YAs8Dph2MxlXBAGx5bgAqOmZBgjJVKxv6559xhx0aw6B6ld6NmzE8wlFJZCUzAisoKFg2QwwSVY3eDK11vK07jmSRggQyXuoVHkU71YT0EY04ydQWQpYZBUUOEWZCeWYofP5naLsf2bcZD"
        
        print(f"[{get_vn_time()}] Bắt đầu quét Fanpage Facebook...")
        url = f"https://graph.facebook.com/v21.0/{PAGE_ID}/conversations?fields=id,updated_time,messages.limit(10){{message,from,created_time}}&limit=10&access_token={TOKEN}"
        
        resp = requests.get(url)
        if resp.status_code != 200:
            print(f"Lỗi truy cập FB API: {resp.text}")
            return
            
        data = resp.json()
        conversations = data.get('data', [])
        
        conn_local = get_connection()
        c_local = conn_local.cursor()
        
        # Phone regex to extract phone from messages
        phone_regex = re.compile(r'(?:0|\+84|84)(?:\d[\s.-]?){8,10}')
        
        for conv in conversations:
            messages = conv.get('messages', {}).get('data', [])
            if not messages:
                continue
                
            last_msg = messages[0]
            sender = last_msg.get('from', {})
            sender_id = sender.get('id', '')
            sender_name = sender.get('name', 'Khách FB')
            created_time = last_msg.get('created_time')
            direction = "outbound" if sender_id == PAGE_ID else "inbound"
            
            combined_texts = []
            extracted_phone = None
            
            for m in messages:
                msg_text = m.get('message', '')
                m_sender = m.get('from', {}).get('id', '')
                if m_sender != PAGE_ID and msg_text and not extracted_phone:
                    phones = phone_regex.findall(msg_text)
                    if phones:
                        raw_p = phones[0]
                        p_digits = __import__('re').sub(r'\D', '', raw_p)
                        if p_digits.startswith('84'): p_digits = '0' + p_digits[2:]
                        elif len(p_digits) == 9 and not p_digits.startswith('0'): p_digits = '0' + p_digits
                        if len(p_digits) == 10:
                            extracted_phone = p_digits

            for m in reversed(messages[:5]):
                msg_text = m.get('message', '')
                m_sender = m.get('from', {}).get('id', '')
                prefix = "👤 " if m_sender != PAGE_ID else "🤖 "
                if msg_text:
                    combined_texts.append(f"{prefix}{msg_text}")
                
                if False: # Dummy to keep the regex block matching below
                    if phones:
                        raw_p = phones[0]
                        p_digits = re.sub(r'\D', '', raw_p)
                        if p_digits.startswith('84'): p_digits = '0' + p_digits[2:]
                        elif len(p_digits) == 9 and not p_digits.startswith('0'): p_digits = '0' + p_digits
                        if len(p_digits) == 10:
                            extracted_phone = p_digits

            text = "\n".join(combined_texts)
            contact_phone = extracted_phone if extracted_phone else f"FB_{sender_id}"
            
            c_local.execute("SELECT id FROM contacts WHERE phone=?", (contact_phone,))
            contact = c_local.fetchone()
            
            if not contact and extracted_phone:
                # Try to upgrade existing FB contact
                c_local.execute("SELECT id FROM contacts WHERE phone=?", (f"FB_{sender_id}",))
                fb_contact = c_local.fetchone()
                if fb_contact:
                    c_local.execute("UPDATE contacts SET phone=? WHERE id=?", (extracted_phone, fb_contact['id']))
                    contact_id = fb_contact['id']
                    alert_telegram_new_lead(extracted_phone, sender_name, text)
                else:
                    now = get_vn_time()
                    c_local.execute("INSERT INTO contacts (phone, name, source, stage, created_at, updated_at) VALUES (?, ?, 'facebook', 'new', ?, ?)",
                                   (extracted_phone, sender_name, now, now))
                    contact_id = c_local.lastrowid
                    alert_telegram_new_lead(extracted_phone, sender_name, text)
            elif not contact:
                now = get_vn_time()
                c_local.execute("INSERT INTO contacts (phone, name, source, stage, created_at, updated_at) VALUES (?, ?, 'facebook', 'new', ?, ?)",
                               (contact_phone, sender_name, now, now))
                contact_id = c_local.lastrowid
            else:
                contact_id = contact["id"]
                
                # If they previously didn't have a phone, and now they do, we might want to update it
                # But for simplicity, we just use the existing one. Or we could update it.
            
            # Insert into conversations
            c_local.execute("SELECT id FROM conversations WHERE contact_id=? AND created_at=? AND channel='facebook'", (contact_id, created_time))
            if not c_local.fetchone():
                d_name = sender_name.split()[-1] if sender_name else "bạn"
                # Phát hiện đại từ hoặc tự đoán
                text_lower = text.lower()
                if re.search(r'\b(chị|c)\b', text_lower):
                    p_khach, p_minh = "chị", "em Việt"
                elif re.search(r'\b(anh|a)\b', text_lower):
                    p_khach, p_minh = "anh", "em Việt"
                elif re.search(r'\b(em|e)\b', text_lower):
                    p_khach, p_minh = "em", "anh Việt"
                else:
                    p_khach = guess_gender(sender_name)
                    p_minh = "em Việt"
                
                # Viết hoa chữ đầu câu
                P_khach = p_khach.capitalize()

                if extracted_phone:
                    ai_reply = f"Chào {p_khach} {d_name}, {p_minh} đây.\n\nEm thấy {p_khach} vừa để lại SĐT {extracted_phone}. {P_khach} có đang tiện máy khoảng 2 phút không, em gọi qua trao đổi thẳng vào việc xem lớp video bên em có đúng thứ {p_khach} đang cần không nhé, cho đỡ mất thời gian."
                else:
                    ai_reply = f"Chào {p_khach} {d_name}, {p_minh} đây. Cảm ơn {p_khach} đã quan tâm lớp làm video bên em nhé.\n\n{P_khach} cứ để lại SĐT (hoặc Zalo) ở đây, lúc nào rảnh em gọi qua trao đổi thẳng vào việc luôn cho nhanh, xem có đúng thứ {p_khach} đang cần không nhé."
                
                # Fix pronoun inside string if p_khach == 'em' and p_minh == 'anh Việt'
                if p_minh == "anh Việt":
                    ai_reply = ai_reply.replace(" em ", " anh ").replace("Em thấy", "Anh thấy")
                
                c_local.execute("INSERT INTO conversations (contact_id, channel, direction, content, ai_suggested_reply, created_at, fb_conversation_id) VALUES (?, 'facebook', ?, ?, ?, ?, ?)",
                               (contact_id, direction, text, ai_reply, created_time, conv['id']))
                
                # CẬP NHẬT GHI CHÚ BỐI CẢNH (3 TIN NHẮN CUỐI CÙNG)
                last_3_msgs = []
                for m in reversed(messages[:3]):
                    msg_text = m.get('message', '')
                    m_sender = m.get('from', {}).get('id', '')
                    prefix = "👤 Học viên: " if m_sender != PAGE_ID else "🤖 Mình (Page): "
                    if msg_text:
                        last_3_msgs.append(f"{prefix}{msg_text}")
                
                chat_context = "\n".join(last_3_msgs)
                if chat_context:
                    note_append = f"[Lịch sử Chat FB gần nhất]\n{chat_context}"
                    c_local.execute("SELECT notes FROM contacts WHERE id=?", (contact_id,))
                    row = c_local.fetchone()
                    existing_notes = row['notes'] if row and row['notes'] else ""
                    
                    if "[Lịch sử Chat FB gần nhất]" in existing_notes:
                        import re
                        new_notes = re.sub(r'\[Lịch sử Chat FB gần nhất\].*', note_append, existing_notes, flags=re.DOTALL)
                    else:
                        new_notes = f"{existing_notes}\n\n{note_append}".strip()
                        
                    c_local.execute("UPDATE contacts SET notes=?, updated_at=? WHERE id=?", (new_notes, get_vn_time(), contact_id))
                    
        conn_local.commit()
        conn_local.close()
    except Exception as e:
        print(f"Lỗi quét Facebook: {e}")

def check_address_book():
    path = os.path.expanduser("~/Library/Application Support/AddressBook/Sources")
    if os.path.exists(path):
        print(f"[{datetime.now()}] Đã kiểm tra Apple Contacts thay đổi.")

def run_loop(interval):
    print(f"Khởi động Scanner Daemon (Interval: {interval}s)")
    fb_counter = 0
    while True:
        scan_calls()
        scan_imessages()
        check_address_book()
        
        if fb_counter % 3 == 0: # Every 15 mins if interval is 5 mins
            scan_facebook()
            
        broadcast_refresh()
        fb_counter += 1
        time.sleep(interval)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--test-once", action="store_true", help="Run once and exit")
    parser.add_argument("--interval", type=int, default=300, help="Scan interval in seconds")
    args = parser.parse_args()

    if args.test_once:
        scan_calls()
        scan_imessages()
        check_address_book()
        scan_facebook()
    else:
        run_loop(args.interval)
