import os
import sqlite3
import datetime
from pathlib import Path

# Thêm path để dùng chung biến/hàm
import sys
sys.path.append("/Users/vietmac/Documents/CODE/offline/customer_hub")
try:
    from collect_local import HAS_GOOGLE, GOOGLE_PRIVATE_KEY, GOOGLE_SERVICE_ACCOUNT_EMAIL, COURSE_SPREADSHEET_ID, COURSE_SHEET_NAME, normalize_phone
    from google.oauth2.service_account import Credentials
    from googleapiclient.discovery import build
except Exception as e:
    print("Cannot import google libraries:", e)
    HAS_GOOGLE = False

DB_PATH = Path('/Users/vietmac/Documents/CODE/offline/command_center/fedu_command.db')

def sync_sheets_to_led():
    if not HAS_GOOGLE or not GOOGLE_PRIVATE_KEY:
        print("Thiếu Google credentials.")
        return

    print("Bắt đầu lấy dữ liệu từ Google Sheets...")
    creds = Credentials.from_service_account_info({
        "type": "service_account",
        "client_email": GOOGLE_SERVICE_ACCOUNT_EMAIL,
        "private_key": GOOGLE_PRIVATE_KEY.replace('\\n', '\n'),
        "token_uri": "https://oauth2.googleapis.com/token",
    }, scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"])

    service = build('sheets', 'v4', credentials=creds, cache_discovery=False)
    result = service.spreadsheets().values().get(
        spreadsheetId=COURSE_SPREADSHEET_ID,
        range=f"'{COURSE_SHEET_NAME}'!A1:L"
    ).execute()

    rows = result.get('values', [])
    if len(rows) <= 1:
        print("Google Sheets không có data.")
        return

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    count = 0
    new_count = 0
    now = datetime.datetime.now().isoformat()
    
    for row in rows[1:]:
        if len(row) < 3: continue
        name = row[1]
        phone = normalize_phone(row[2])
        if not phone: continue
        email = row[3] if len(row) > 3 else ""
        occupation = row[4] if len(row) > 4 else ""
        reason = row[5] if len(row) > 5 else ""
        
        c.execute("SELECT id FROM contacts WHERE phone=?", (phone,))
        if c.fetchone() is None:
            c.execute('''
                INSERT INTO contacts (name, phone, email, industry, notes, source, stage, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, 'Google Sheets', 'new', ?, ?)
            ''', (name, phone, email, occupation, reason, now, now))
            new_count += 1
        count += 1
        
    conn.commit()
    conn.close()
    
    print(f"Đã duyệt {count} dòng. Thêm mới {new_count} contact vào LED.")

if __name__ == '__main__':
    sync_sheets_to_led()
