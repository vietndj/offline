#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FEDU Customer Hub — Collector: Local Sources
Thu thập và MERGE dữ liệu từ 4 nguồn local vào fedu_customer_hub.db:
1. Google Sheets (Danh Sách Học Viên)
2. radar_cache.json
3. offline_leads.json
4. students.json (STU Hub)
"""

import os
import re
import sys
import json
import sqlite3
from datetime import datetime, timezone, timedelta

# ─── Google Sheets dependencies ───
try:
    from google.oauth2.service_account import Credentials
    from googleapiclient.discovery import build
    HAS_GOOGLE = True
except ImportError:
    HAS_GOOGLE = False
    print("⚠️  google-api-python-client chưa cài. Chạy: pip3 install google-api-python-client google-auth")

try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))
    load_dotenv(os.path.join(os.path.dirname(__file__), '../.env.local'))
except Exception:
    pass

# ─── Paths ───
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fedu_customer_hub.db")
RADAR_CACHE = '/Users/vietmac/Documents/CODE/offline/telesale_radar/radar_cache.json'
OFFLINE_LEADS = '/Users/vietmac/Documents/CODE/Quản gia/offline_leads.json'
STUDENTS_JSON = '/Users/vietmac/Documents/CODE/stu.fedu.vn/students.json'
STUDENTS_JSON_ALT = '/Users/vietmac/Documents/CODE/facebook, skool/students.json'

# ─── Google Sheets Config ───
GOOGLE_SERVICE_ACCOUNT_EMAIL = "form-feedback-offline@vietndj-git-cms.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY = os.environ.get("GOOGLE_PRIVATE_KEY", "")
COURSE_SPREADSHEET_ID = "1PaHkFMdY615FasQDcqqeia94L1662YKES7cPuFIpKhg"
COURSE_SHEET_NAME = "Danh Sách Học Viên"

# ─── Stats ───
stats = {"sheets": 0, "radar": 0, "leads": 0, "students": 0, "total": 0}


def normalize_phone(phone: str) -> str:
    """Chuẩn hóa số điện thoại về dạng 0xxxxxxxxx"""
    if not phone:
        return ""
    cleaned = re.sub(r'[^\\d+]', '', str(phone)).strip()
    # Remove dots, spaces, dashes that regex missed
    cleaned = re.sub(r'[\s\.\-\(\)]', '', str(phone))
    cleaned = re.sub(r'[^\d+]', '', cleaned)
    if cleaned.startswith('+84'):
        cleaned = '0' + cleaned[3:]
    elif cleaned.startswith('84') and len(cleaned) >= 11:
        cleaned = '0' + cleaned[2:]
    elif len(cleaned) == 9 and not cleaned.startswith('0'):
        cleaned = '0' + cleaned
    if len(cleaned) < 9:
        return ""
    return cleaned


def parse_date(raw: str) -> str:
    """Parse various date formats to ISO string."""
    if not raw:
        return ""
    formats = [
        "%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M:%S.%fZ", "%Y-%m-%dT%H:%M:%SZ",
        "%d/%m/%Y %H:%M:%S", "%d/%m/%Y %H:%M", "%Y-%m-%d"
    ]
    for fmt in formats:
        try:
            return datetime.strptime(raw.strip(), fmt).isoformat()
        except Exception:
            pass
    # Google Sheets serial number
    try:
        val = float(raw.strip().replace(',', '.'))
        if 30000 < val < 60000:
            dt = datetime(1899, 12, 30) + timedelta(days=val)
            return dt.isoformat()
    except Exception:
        pass
    return raw.strip()


def upsert_customer(cursor, phone: str, data: dict, source_system: str):
    """INSERT hoặc UPDATE customer, giữ dữ liệu phong phú nhất."""
    if not phone:
        return

    # Check existing
    cursor.execute("SELECT id, source_systems FROM customers WHERE phone = ?", (phone,))
    row = cursor.fetchone()

    if row:
        # Update: chỉ ghi đè field NULL hoặc rỗng
        existing_id = row[0]
        existing_sources = json.loads(row[1]) if row[1] else []
        if source_system not in existing_sources:
            existing_sources.append(source_system)

        update_parts = []
        update_vals = []
        for field, value in data.items():
            if field in ('phone', 'id'):
                continue
            if value and str(value).strip():
                # Chỉ update nếu field hiện tại NULL hoặc rỗng
                update_parts.append(f"{field} = COALESCE(NULLIF({field}, ''), ?)")
                update_vals.append(str(value).strip())

        update_parts.append("source_systems = ?")
        update_vals.append(json.dumps(existing_sources, ensure_ascii=False))
        update_parts.append("updated_at = datetime('now','localtime')")

        if update_parts:
            sql = f"UPDATE customers SET {', '.join(update_parts)} WHERE id = ?"
            update_vals.append(existing_id)
            cursor.execute(sql, update_vals)
    else:
        # Insert new
        sources = json.dumps([source_system], ensure_ascii=False)
        fields = ['phone', 'source_systems']
        values = [phone, sources]
        for field, value in data.items():
            if field in ('phone', 'id') or not value:
                continue
            fields.append(field)
            values.append(str(value).strip())

        placeholders = ', '.join(['?'] * len(values))
        field_names = ', '.join(fields)
        cursor.execute(f"INSERT INTO customers ({field_names}) VALUES ({placeholders})", values)


def collect_google_sheets(cursor):
    """Thu thập từ Google Sheets Course."""
    if not HAS_GOOGLE or not GOOGLE_PRIVATE_KEY:
        print("⚠️  Bỏ qua Google Sheets (thiếu credentials)")
        return

    print("📊 Thu thập Google Sheets...")
    try:
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
        if not rows:
            print("   ⚠️  Google Sheets trống")
            return

        # Row 0 = header
        headers = rows[0] if rows else []
        print(f"   Headers: {headers}")

        count = 0
        for row in rows[1:]:
            if len(row) < 3:
                continue

            # Columns: A=timestamp, B=name, C=phone, D=email, E=occupation, 
            # F=reason, G=source, H=contact_status, I=paid_status, J=private_note, K=skool_status, L=sale_note
            phone = normalize_phone(row[2] if len(row) > 2 else "")
            if not phone:
                continue

            data = {
                'name': row[1] if len(row) > 1 else "",
                'email': row[3] if len(row) > 3 else "",
                'occupation': row[4] if len(row) > 4 else "",
                'reason_raw': row[5] if len(row) > 5 else "",
                'source': row[6] if len(row) > 6 else "",
                'stage': map_stage(row[7] if len(row) > 7 else ""),
                'notes': row[9] if len(row) > 9 else "",
                'created_at': parse_date(row[0] if len(row) > 0 else ""),
            }

            upsert_customer(cursor, phone, data, "google_sheets")
            count += 1

        stats["sheets"] = count
        print(f"   ✅ Google Sheets: {count} leads imported")

    except Exception as e:
        print(f"   ❌ Google Sheets error: {e}")


def map_stage(raw: str) -> str:
    """Map Google Sheets status to standard pipeline stage."""
    if not raw:
        return "new"
    raw_lower = raw.lower().strip()
    mapping = {
        "đã gọi": "called", "đã liên hệ": "contacted", "contacted": "contacted",
        "chưa gọi": "new", "mới": "new", "new": "new",
        "đang cân nhắc": "considering", "considering": "considering",
        "đã thanh toán": "paid", "paid": "paid", "đã cọc": "paid",
        "enrolled": "paid", "đã đăng ký": "paid",
        "không phù hợp": "unqualified", "unqualified": "unqualified",
        "hoãn": "postponed", "postponed": "postponed",
    }
    for key, value in mapping.items():
        if key in raw_lower:
            return value
    return "new"


def collect_radar_cache(cursor):
    """Thu thập từ radar_cache.json."""
    print("📡 Thu thập radar_cache.json...")
    if not os.path.exists(RADAR_CACHE):
        print("   ⚠️  File không tồn tại")
        return

    with open(RADAR_CACHE, 'r', encoding='utf-8') as f:
        cache = json.load(f)

    count = 0
    for phone_key, value in cache.items():
        if not isinstance(value, dict):
            continue
        phone = normalize_phone(phone_key)
        if not phone:
            continue

        data = {
            'name': value.get('name', ''),
            'stage': value.get('status', 'new'),
            'tags': json.dumps(value.get('tags', []), ensure_ascii=False) if value.get('tags') else '',
            'notes': value.get('note', ''),
        }

        upsert_customer(cursor, phone, data, "radar_cache")
        count += 1

    stats["radar"] = count
    print(f"   ✅ radar_cache: {count} leads imported")


def collect_offline_leads(cursor):
    """Thu thập từ offline_leads.json."""
    print("📋 Thu thập offline_leads.json...")
    if not os.path.exists(OFFLINE_LEADS):
        print("   ⚠️  File không tồn tại")
        return

    with open(OFFLINE_LEADS, 'r', encoding='utf-8') as f:
        leads = json.load(f)

    count = 0
    for phone_key, value in leads.items():
        if not isinstance(value, dict):
            continue
        phone = normalize_phone(value.get('phone', phone_key))
        if not phone:
            continue

        data = {
            'name': value.get('fullName', ''),
            'email': value.get('email', ''),
            'occupation': value.get('occupation', ''),
            'reason_raw': value.get('reason', ''),
            'stage': map_stage(value.get('status', 'new')),
            'zalo_url': value.get('zaloSnippet', ''),
        }

        upsert_customer(cursor, phone, data, "offline_leads")
        count += 1

    stats["leads"] = count
    print(f"   ✅ offline_leads: {count} leads imported")


def collect_students(cursor):
    """Thu thập từ students.json (STU Hub)."""
    print("🎓 Thu thập students.json (STU Hub)...")

    # Try primary path first, then alternate
    stu_path = STUDENTS_JSON if os.path.exists(STUDENTS_JSON) else STUDENTS_JSON_ALT
    if not os.path.exists(stu_path):
        print("   ⚠️  students.json không tồn tại")
        return

    with open(stu_path, 'r', encoding='utf-8') as f:
        students = json.load(f)

    if not isinstance(students, list):
        students = list(students.values()) if isinstance(students, dict) else []

    count = 0
    for stu in students:
        phone = normalize_phone(stu.get('phone', ''))
        if not phone:
            # Try to find in existing customers by name (fuzzy)
            name = stu.get('name', '')
            if name and name != 'test':
                cursor.execute("SELECT phone FROM customers WHERE name LIKE ? LIMIT 1", (f"%{name}%",))
                match = cursor.fetchone()
                if match:
                    phone = match[0]
                else:
                    continue  # Skip students without phone and no name match
            else:
                continue

        data = {
            'name': stu.get('name', ''),
            'class_name': stu.get('class', ''),
            'industry': stu.get('industry', ''),
            'industry_slug': stu.get('industry_slug', ''),
            'facebook_url': stu.get('facebook_url', ''),
            'zalo_url': stu.get('zalo_url', ''),
            'completeness_score': stu.get('completeness_score', 0),
            'notes': stu.get('notes', ''),
            'source': stu.get('contact_source', ''),
        }

        # Students with class = Offline X → stage = paid
        class_name = stu.get('class', '')
        if class_name and ('Offline' in class_name or 'Khóa Online' in class_name):
            data['stage'] = 'paid'

        upsert_customer(cursor, phone, data, "students_json")
        count += 1

    stats["students"] = count
    print(f"   ✅ students.json: {count} students imported")


def collect_fedu_command_db(cursor):
    """Thu thập từ fedu_command.db (Command Center)."""
    print("🗄️  Thu thập fedu_command.db...")
    cmd_db_path = '/Users/vietmac/Documents/CODE/offline/command_center/fedu_command.db'
    if not os.path.exists(cmd_db_path):
        print("   ⚠️  fedu_command.db không tồn tại")
        return

    try:
        cmd_conn = sqlite3.connect(cmd_db_path)
        cmd_conn.row_factory = sqlite3.Row
        cmd_cursor = cmd_conn.cursor()

        # Import contacts
        cmd_cursor.execute("SELECT * FROM contacts")
        contacts = cmd_cursor.fetchall()
        count = 0
        for c in contacts:
            phone = normalize_phone(c['phone'])
            if not phone:
                continue

            data = {
                'name': c['name'],
                'email': c['email'],
                'industry': c['industry'],
                'industry_slug': c['industry_slug'],
                'facebook_url': c['facebook_url'],
                'zalo_url': c['zalo_url'],
                'stage': c['stage'],
                'class_name': c['class_name'],
                'class_date': c['class_date'],
                'source': c['source'],
                'completeness_score': c['completeness_score'],
                'notes': c['notes'],
                'tags': c['tags'],
            }
            upsert_customer(cursor, phone, data, "fedu_command_db")
            count += 1

        # Import conversations as touchpoints
        cmd_cursor.execute("""
            SELECT conv.*, c.phone FROM conversations conv 
            JOIN contacts c ON conv.contact_id = c.id
        """)
        convos = cmd_cursor.fetchall()
        tp_count = 0
        for conv in convos:
            phone = normalize_phone(conv['phone'])
            if not phone:
                continue

            cursor.execute("SELECT id FROM customers WHERE phone = ?", (phone,))
            cust = cursor.fetchone()
            if not cust:
                continue

            # Check duplicate
            cursor.execute("""
                SELECT id FROM touchpoints 
                WHERE customer_id = ? AND channel = ? AND occurred_at = ?
            """, (cust[0], conv['channel'], conv['created_at']))
            if cursor.fetchone():
                continue

            cursor.execute("""
                INSERT INTO touchpoints (customer_id, channel, direction, content, occurred_at)
                VALUES (?, ?, ?, ?, ?)
            """, (
                cust[0],
                conv['channel'],
                conv['direction'] or 'inbound',
                conv['content'],
                conv['created_at']
            ))
            tp_count += 1

        cmd_conn.close()
        print(f"   ✅ fedu_command.db: {count} contacts, {tp_count} touchpoints imported")

    except Exception as e:
        print(f"   ❌ fedu_command.db error: {e}")


def main():
    print("=" * 60)
    print("FEDU CUSTOMER HUB — Local Data Collection")
    print("=" * 60)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Collect from all sources
    collect_google_sheets(cursor)
    conn.commit()

    collect_radar_cache(cursor)
    conn.commit()

    collect_offline_leads(cursor)
    conn.commit()

    collect_students(cursor)
    conn.commit()

    collect_fedu_command_db(cursor)
    conn.commit()

    # Summary
    cursor.execute("SELECT count(*) FROM customers")
    total = cursor.fetchone()[0]
    stats["total"] = total

    cursor.execute("SELECT stage, count(*) FROM customers GROUP BY stage ORDER BY count(*) DESC")
    stages = cursor.fetchall()

    cursor.execute("SELECT count(*) FROM touchpoints")
    tp_total = cursor.fetchone()[0]

    conn.close()

    print("\n" + "=" * 60)
    print(f"📊 TỔNG KẾT:")
    print(f"   Google Sheets: {stats['sheets']} leads")
    print(f"   radar_cache:   {stats['radar']} leads")
    print(f"   offline_leads: {stats['leads']} leads")
    print(f"   students.json: {stats['students']} students")
    print(f"   ─────────────────────────")
    print(f"   TOTAL UNIQUE:  {total} customers")
    print(f"   TOUCHPOINTS:   {tp_total}")
    print(f"\n   Pipeline breakdown:")
    for stage, count in stages:
        print(f"     {stage}: {count}")
    print("=" * 60)


if __name__ == "__main__":
    main()
