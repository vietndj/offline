import os
import re
import json
import sqlite3
import datetime
from pathlib import Path
from urllib.parse import urlparse, parse_qs

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
VN_TZ = datetime.timezone(datetime.timedelta(hours=7))


def parse_sheet_timestamp(raw_ts: str, fallback_iso: str) -> str:
    """Chuyển đổi cột Thời Gian Đăng Ký trên Google Sheets về chuẩn ISO +07:00 (YYYY-MM-DDTHH:MM:SS+07:00)."""
    if not raw_ts or not str(raw_ts).strip():
        return fallback_iso
    s = str(raw_ts).strip()

    # Đã là ISO
    if re.match(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}", s):
        if "+" not in s and "Z" not in s:
            return s[:19] + "+07:00"
        return s

    formats = [
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d %H:%M",
        "%H:%M:%S %d/%m/%Y",
        "%H:%M:%S %d/%m/%y",
        "%d/%m/%Y %H:%M:%S",
        "%d/%m/%Y %H:%M",
        "%d/%m/%y %H:%M:%S",
        "%d/%m/%y %H:%M",
        "%Y-%m-%d",
    ]
    for fmt in formats:
        try:
            dt = datetime.datetime.strptime(s, fmt)
            return dt.replace(tzinfo=VN_TZ).isoformat()
        except Exception:
            pass

    # Google Sheets serial number (ví dụ: '46301,50097')
    try:
        val = float(s.replace(",", "."))
        if 30000 < val < 60000:
            dt = datetime.datetime(1899, 12, 30) + datetime.timedelta(days=val)
            return dt.replace(microsecond=0, tzinfo=VN_TZ).isoformat()
    except Exception:
        pass

    return fallback_iso


def detect_fb_ads_info(raw_source_url: str):
    """Phát hiện xem Lead từ offline.fedu.vn có phải từ Quảng Cáo Facebook (Paid Ads) không."""
    if not raw_source_url:
        return False, None
    s = str(raw_source_url).strip()
    low = s.lower()
    is_fb_ads = any(k in low for k in ("utm_source=fb", "fbclid=", "paid_social", "utm_campaign="))
    campaign_id = None
    m = re.search(r"utm_campaign=([0-9a-zA-Z_-]+)", s)
    if m:
        campaign_id = m.group(1)
    return is_fb_ads, campaign_id


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
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    count = 0
    new_count = 0
    updated_meta_count = 0
    new_ids = []
    now = datetime.datetime.now(VN_TZ).isoformat()

    # Duyệt từng dòng trong Sheet (lưu ý: Sheet có thể có dòng mới ở đầu bảng row[1])
    # Nếu trùng SĐT trong cùng Sheet, ưu tiên dòng có timestamp mới nhất
    seen_phones_in_sheet = set()

    for row in rows[1:]:
        if len(row) < 3:
            continue
        raw_ts = row[0] if len(row) > 0 else ""
        name = (row[1] if len(row) > 1 else "").strip()
        phone = normalize_phone(row[2] if len(row) > 2 else "")
        if not phone or phone in seen_phones_in_sheet:
            continue
        seen_phones_in_sheet.add(phone)

        email = (row[3] if len(row) > 3 else "").strip()
        occupation = (row[4] if len(row) > 4 else "").strip()
        reason = (row[5] if len(row) > 5 else "").strip()
        raw_source_url = (row[6] if len(row) > 6 else "").strip()

        sheet_iso = parse_sheet_timestamp(raw_ts, now)
        is_fb_ads, campaign_id = detect_fb_ads_info(raw_source_url)

        c.execute("SELECT id, source, created_at, updated_at, tags, notes, email, industry FROM contacts WHERE phone=?", (phone,))
        existing = c.fetchone()

        if existing is None:
            stage = 'new'
            notes_list = []
            if reason and reason != "Chưa điền":
                notes_list.append({
                    "text": reason,
                    "source": "offline.fedu.vn",
                    "author": "Khách tự điền",
                    "timestamp": sheet_iso,
                    "attachments": []
                })
            if is_fb_ads:
                camp_txt = f" (Campaign: {campaign_id})" if campaign_id else ""
                notes_list.append({
                    "text": f"🎯 Nguồn: Quảng cáo Facebook trả phí -> offline.fedu.vn{camp_txt}",
                    "source": "fb_ads",
                    "author": "Meta Ads",
                    "timestamp": sheet_iso,
                    "attachments": []
                })
            notes_val = json.dumps(notes_list, ensure_ascii=False) if notes_list else None
            tags_val = json.dumps(["🔥 QC Facebook"], ensure_ascii=False) if is_fb_ads else json.dumps([], ensure_ascii=False)

            c.execute('''
                INSERT INTO contacts (name, phone, email, industry, notes, tags, source, stage, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, 'offline.fedu.vn', ?, ?, ?)
            ''', (name, phone, email, occupation, notes_val, tags_val, stage, sheet_iso, sheet_iso))
            new_ids.append(c.lastrowid)
            new_count += 1
        else:
            # Đã tồn tại -> kiểm tra chuẩn hóa created_at theo thời gian đăng ký thực tế trên Sheet và gắn tag QC Facebook
            cid = existing["id"]
            cur_tags = []
            if existing["tags"]:
                try:
                    cur_tags = json.loads(existing["tags"]) if isinstance(existing["tags"], str) else []
                except Exception:
                    cur_tags = []
            tags_changed = False
            if is_fb_ads and "🔥 QC Facebook" not in cur_tags:
                cur_tags.insert(0, "🔥 QC Facebook")
                tags_changed = True

            cur_created = str(existing["created_at"] or "")
            # Nếu contact này có nguồn offline.fedu.vn và có thời gian chuẩn từ Sheet (khác giờ quét hoặc thiếu +07:00)
            need_fix_created = False
            if existing["source"] == "offline.fedu.vn" and raw_ts.strip():
                if cur_created[:19] != sheet_iso[:19] or "+" not in cur_created:
                    need_fix_created = True

            if tags_changed or need_fix_created:
                new_created = sheet_iso if need_fix_created else cur_created
                c.execute(
                    "UPDATE contacts SET created_at = ?, tags = ?, email = COALESCE(NULLIF(email, ''), ?), industry = COALESCE(NULLIF(industry, ''), ?) WHERE id = ?",
                    (new_created, json.dumps(cur_tags, ensure_ascii=False), email, occupation, cid)
                )
                updated_meta_count += 1

        count += 1

    conn.commit()
    conn.close()

    if new_ids:
        try:
            from apple_contacts_sync import batch_sync_contacts_to_apple
            sync_res = batch_sync_contacts_to_apple(new_ids)
            print(f"Đã tự động đồng bộ {sync_res.get('synced', 0)} lead mới vào Danh bạ iCloud.")
        except Exception as e:
            print(f"Lỗi đồng bộ tự động Danh bạ iCloud: {e}")

    if new_count > 0 or updated_meta_count > 0:
        try:
            import subprocess
            subprocess.run(
                [
                    sys.executable,
                    "/Users/vietmac/Documents/CODE/Quản gia/sync_offline_leads_to_stu.py",
                    "--apply-local",
                    "--push-d1",
                ],
                timeout=60,
                check=False,
            )
        except Exception as e_stu:
            print(f"Lỗi đồng bộ tự động Lead sang STU: {e_stu}")

    print(f"Đã duyệt {count} dòng. Thêm mới {new_count} contact, chuẩn hóa {updated_meta_count} contact vào LED.")


if __name__ == '__main__':
    sync_sheets_to_led()
