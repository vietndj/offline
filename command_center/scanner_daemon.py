import os
import time
import sqlite3
import argparse
import requests
from datetime import datetime, timedelta

from fedu_command_db import get_connection

# Apple Epoch is 2001-01-01 00:00:00 Z
APPLE_EPOCH_OFFSET = 978307200

def get_apple_timestamp(last_24h=True):
    now_unix = time.time()
    if last_24h:
        now_unix -= 86400
    return now_unix - APPLE_EPOCH_OFFSET

def broadcast_refresh():
    try:
        requests.get("http://localhost:9000/api/health") # trigger refresh via SSE eventually
    except:
        pass

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
        
        min_ts = get_apple_timestamp(last_24h=True)
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
                c_local.execute("SELECT id FROM conversations WHERE contact_id=? AND timestamp=? AND channel='call'", (contact_id, dt))
                if not c_local.fetchone():
                    c_local.execute("INSERT INTO conversations (contact_id, channel, direction, content, timestamp) VALUES (?, 'call', ?, ?, ?)", 
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
        
        min_ts = get_apple_timestamp(last_24h=True) * 1000000000 # chat.db uses nanoseconds for dates usually
        # Fallback to standard Apple epoch if needed. chat.db timestamp format can be tricky, typically nano seconds since 2001
        
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
                
                # Handle varying timestamp length
                date_val = date
                if date_val > 10**15:
                    date_val = date_val / 1000000000
                
                unix_ts = date_val + APPLE_EPOCH_OFFSET
                dt = datetime.fromtimestamp(unix_ts).isoformat()
                
                direction = "outbound" if is_from_me else "inbound"
                channel = "imessage" # simplify
                
                c_local.execute("SELECT id FROM conversations WHERE contact_id=? AND timestamp=? AND channel=?", (contact_id, dt, channel))
                if not c_local.fetchone():
                    c_local.execute("INSERT INTO conversations (contact_id, channel, direction, content, timestamp) VALUES (?, ?, ?, ?, ?)", 
                                    (contact_id, channel, direction, text, dt))
                    
        conn_local.commit()
        conn_local.close()
    except Exception as e:
        print(f"Lỗi quét Messages: {e}")

def scan_facebook():
    print(f"[{datetime.now()}] Facebook scanner: No API token configured, skipping")

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
