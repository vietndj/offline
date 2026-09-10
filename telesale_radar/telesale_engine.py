#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Telesale Radar Engine (telesale_engine.py)
Bộ xử lý trung tâm đa nguồn cho tư vấn học viên Offline FEDU:
- macOS CallHistoryDB (Lịch sử cuộc gọi từng giây)
- macOS Messages chat.db (Lịch sử SMS/iMessage 2 chiều)
- Apple Contacts SQLite & AppleScript (Đồng bộ 2 chiều tức thì trên iPhone/Mac)
- Google Sheets (Bảng live [FEDU] Danh Sách Học Viên)
- Student Hub (LMS Archive: students.json)
- Quản lý ngày đăng ký, lưu kho STU, chống trùng lặp & kéo thả
"""

import os
import re
import sys
import glob
import json
import sqlite3
import subprocess
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional

try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))
    load_dotenv(os.path.join(os.path.dirname(__file__), '../.env.local'))
except Exception:
    pass

VN_TZ = timezone(timedelta(hours=7))
NOW_VN = datetime.now(VN_TZ)
APPLE_EPOCH = datetime(2001, 1, 1, tzinfo=timezone.utc)

# Paths
CALL_DB = os.path.expanduser('~/Library/Application Support/CallHistoryDB/CallHistory.storedata')
MSG_DB = os.path.expanduser('~/Library/Messages/chat.db')
ADDRESSBOOK_BASE = os.path.expanduser('~/Library/Application Support/AddressBook/Sources')
STU_JSON = '/Users/vietmac/Documents/CODE/facebook, skool/students.json'
OFFLINE_LEADS_JSON = '/Users/vietmac/Documents/CODE/Quản gia/offline_leads.json'
LOCAL_RADAR_CACHE = '/Users/vietmac/Documents/CODE/offline/telesale_radar/radar_cache.json'

# Google Sheets Config
GOOGLE_SERVICE_ACCOUNT_EMAIL = "form-feedback-offline@vietndj-git-cms.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY = (
    "-----BEGIN PRIVATE KEY-----\n"
    "MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDTkXmjGxkiIuCC\n"
    "D3z0pKQE0lIJewMjIWfu5oPT12wxOB7SNZw+PHURG4suLaKD7lNAYGe9J4AB3reu\n"
    "Tc0u7lbYoLsydxRa3WQ8NALYcEldWc7NnQvtd7bz6VEbPfKwjCLE5btg7B30FKKw\n"
    "Fz26wnmvaBDOudopx6dI69GHa2Paj0BRTj2JZ92OjU1OPb+ONULe2UGBnuxLSK8N\n"
    "u3qIM1ooQFB2D2irtXoPvD6DJmO6HmjIjoO2rSrWqusX9qwVwnbfMDL7BmeG/0rZ\n"
    "E3QI+VjU6geWyUJ/XVWgUVtM8EA9IihM1DkDif2yatPfJ3E6iv5TDYOsHo3rQXWt\n"
    "ob1fHk7rAgMBAAECggEAGPmk4tDJnEKCv0fFx/mBlUIgxha77ZM9ejHDIShekMbf\n"
    "uI/0lFI9vZnDSd3AQBPLxx86T9WQYmggxdZQYPhozyTWRGRTRlC5SvQW2+cRehAm\n"
    "fhZKeKt3sP57gRxEgHvihNzbzFrDRHOFKwVrV5cqlz7RMR42d1Um1dBkyTgvrvag\n"
    "LXUrgqhPfN8U9ILSJDFXJF2o0bSJuiqhLiWWshp4rF857ngg2HDVO14Mp7Mk85tb\n"
    "KOsUr+UUEuPMtTP1jJrO2m3shesTSeVG1J81bDtoeXUDHaloYTmoGyMMjwje0lou\n"
    "CIiXmlHQF3z9UVYa3WgwF03vQ+542MacOnTa6jlZxQKBgQD0ZZO0ohr4rSwyJn0O\n"
    "9ce7B3GfJR4RKg/xRoNGaYPlIrfYgKEU4GirWTtFhL0UlsFVWBZJqSYt6j7Antvo\n"
    "FWfWsO7nn8ptbgWWwgHGtzFjAs7AKjzcbdf8SFJRG/kizSvQffuDxXAZSxU5c3lb\n"
    "2fEowhYkuFZw+ep3noCYJaZDDQKBgQDdnOWiq3JY1oHJwEV9uCDqm6JtyTVY2Rth\n"
    "DRi1DF1V2yoveAStanTfpfdRYp09HMS83fkCWMgPcDlJdi/m18pfJrOOK4xpYT3Y\n"
    "OkaA6i6l3QsQAly2/EJp6XzGYyYCFMhzewrNM9zT5fu4jgNqawGFgWnG5F7YSh8W\n"
    "PuAciSg71wKBgBPA1gRmicmJraXMCJWZ9e++9UcIp/p5LNqyeU/KnXd6q+Na2iom\nzS70Ql8nEGVGng+40+xWOJjDcxj8fgevGzp2CIk+GA1qNBdwTNZz3hEDnBRaFZs3\n"
    "YZqpecXGfgd7D8yFMjv/TEUvFWMUWz26Ssyhi0qif5IYEQRkEj655EtNAoGAN4jE\nxuHd0sNWXN9wypNktEXyCz77vlsRkF1+zofdr9EvHhweV/KwfQcTFfL3YkQeTRH2\n"
    "/46N+8hsoqsaT+fNj9Cb+EmTcyjqHZBk8JM+w1PEHOvqnfRTFEVtfi2EbcsVfFLe\nHxQbB4K/dL0pv/Y2uGT4w92gouTYK3PwJ1Z7nZsCgYA1lXF3fW+0sDX7A8AgaDQ3\n"
    "AVlY6JMYbOUGI4qEHmAcdycykGeMAafBxicmbrWGEa6QF6pZ8m+9RQUH9cfASd4X\nY6mNtQ5COwZ/6hD6JIL2n/Fk/Kl+pRjjctfcZMPwam9hn6FDybCwuDP5RjD1xg40\n"
    "rnev+mxuY6JF6giGE0oJbw==\n"
    "-----END PRIVATE KEY-----\n"
)
COURSE_SPREADSHEET_ID = "1PaHkFMdY615FasQDcqqeia94L1662YKES7cPuFIpKhg"
COURSE_SHEET_NAME = "Danh Sách Học Viên"


def normalize_phone(phone: str) -> str:
    """Chuẩn hóa số điện thoại về dạng 10 số (0xxxxxxxxx)"""
    if not phone:
        return ""
    cleaned = re.sub(r'[^\d+]', '', str(phone)).strip()
    if cleaned.startswith('+84'):
        cleaned = '0' + cleaned[3:]
    elif cleaned.startswith('84') and len(cleaned) >= 11:
        cleaned = '0' + cleaned[2:]
    elif len(cleaned) == 9 and not cleaned.startswith('0'):
        cleaned = '0' + cleaned
    if len(cleaned) < 9:
        return ""
    return cleaned


def format_duration(seconds: float) -> str:
    s = int(seconds)
    if s < 60:
        return f"{s}s"
    m = s // 60
    rem = s % 60
    return f"{m}m {rem}s" if rem > 0 else f"{m}m"


def format_lead_registration(raw_date_str: str) -> Dict[str, Any]:
    """Định dạng ngày đăng ký thành thời gian trực quan (Hôm nay, Hôm qua, X ngày trước)"""
    if not raw_date_str:
        return {"badge": "Chưa rõ ngày", "is_hot": False, "formatted": ""}
    
    dt = None
    formats = [
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%dT%H:%M:%S.%fZ",
        "%Y-%m-%dT%H:%M:%SZ",
        "%d/%m/%Y %H:%M:%S",
        "%d/%m/%Y %H:%M",
        "%Y-%m-%d"
    ]
    for fmt in formats:
        try:
            dt = datetime.strptime(raw_date_str.strip(), fmt)
            break
        except Exception:
            pass
            
    if not dt:
        m = re.search(r'(\d{4})-(\d{2})-(\d{2})', raw_date_str)
        if m:
            dt = datetime(int(m.group(1)), int(m.group(2)), int(m.group(3)))
        else:
            m = re.search(r'(\d{2})/(\d{2})/(\d{4})', raw_date_str)
            if m:
                dt = datetime(int(m.group(3)), int(m.group(2)), int(m.group(1)))

    if not dt:
        clean_str = raw_date_str[:16].strip()
        return {"badge": clean_str, "is_hot": False, "formatted": clean_str}

    now_current = datetime.now(VN_TZ)
    today = now_current.date()
    lead_date = dt.date()
    days_diff = (today - lead_date).days
    time_part = dt.strftime("%H:%M") if (dt.hour or dt.minute) else ""

    if days_diff == 0:
        badge = f"Hôm nay {time_part}".strip()
        is_hot = True
    elif days_diff == 1:
        badge = f"Hôm qua {time_part}".strip()
        is_hot = True
    elif days_diff == 2:
        badge = f"2 ngày trước ({dt.strftime('%d/%m')})"
        is_hot = False
    elif days_diff > 2:
        badge = f"{days_diff} ngày trước ({dt.strftime('%d/%m')})"
        is_hot = False
    else:
        badge = dt.strftime("%d/%m/%Y %H:%M")
        is_hot = True

    return {
        "badge": badge,
        "is_hot": is_hot,
        "formatted": dt.strftime("%d/%m/%Y %H:%M")
    }


def extract_text_from_attributed_body(data: bytes) -> str:
    if not data:
        return ""
    try:
        pos = data.find(b'NSString')
        if pos != -1:
            sub = data[pos + 8:]
            match = re.search(
                b'[\x01-\x1f\x80-\xff]*([^\x00-\x1f\x80-\x9f].*?)(\x02iI|\x00|\x1d|\x15|\x0cNSDictionary|$)',
                sub,
                re.DOTALL
            )
            if match:
                clean = match.group(1).decode('utf-8', errors='ignore').strip()
                return re.sub(r'^[\W_]+', '', clean)
        return data.decode('utf-8', errors='ignore').strip()
    except Exception:
        return ""


def ensure_contacts_app():
    try:
        subprocess.run(['open', '-g', '-a', 'Contacts'], capture_output=True, timeout=3)
    except Exception:
        pass


# -------------------------------------------------------------
# 1. TẢI DỮ LIỆU CUỘC GỌI TỪ MACOS CALLHISTORYDB
# -------------------------------------------------------------
def get_call_history_map() -> Dict[str, Dict[str, Any]]:
    call_map: Dict[str, Dict[str, Any]] = {}
    if not os.path.exists(CALL_DB):
        return call_map

    try:
        conn = sqlite3.connect(f"file:{CALL_DB}?mode=ro", uri=True)
        cur = conn.cursor()
        cur.execute("""
            SELECT ZADDRESS, ZDATE, ZDURATION, ZORIGINATED, ZANSWERED
            FROM ZCALLRECORD
            ORDER BY ZDATE DESC
        """)
        rows = cur.fetchall()
        conn.close()

        for r in rows:
            raw_addr, zdate, duration, originated, answered = r
            if not raw_addr:
                continue
            phone = normalize_phone(raw_addr)
            if not phone:
                continue

            call_time = APPLE_EPOCH + timedelta(seconds=zdate)
            vn_time = call_time.astimezone(VN_TZ).strftime("%d/%m %H:%M")
            dur = float(duration or 0)
            is_outgoing = (originated == 1)
            is_answered = (dur > 0 or answered == 1)

            if phone not in call_map:
                call_map[phone] = {
                    "total_calls": 0,
                    "total_duration": 0.0,
                    "last_call_time": vn_time,
                    "last_call_duration": dur,
                    "last_call_formatted": format_duration(dur),
                    "last_call_type": "outgoing" if is_outgoing else "incoming",
                    "last_call_answered": is_answered,
                    "calls": []
                }

            call_map[phone]["total_calls"] += 1
            call_map[phone]["total_duration"] += dur
            call_map[phone]["calls"].append({
                "time": vn_time,
                "date": vn_time,
                "duration": dur,
                "formatted_duration": format_duration(dur),
                "duration_formatted": format_duration(dur),
                "type": "outgoing" if is_outgoing else "incoming",
                "answered": is_answered
            })
    except Exception as e:
        print(f"⚠️ Lỗi đọc CallHistory: {e}")

    return call_map


# -------------------------------------------------------------
# 2. TẢI DỮ LIỆU TIN NHẮN TỪ MACOS MESSAGES CHAT.DB
# -------------------------------------------------------------
def get_messages_map() -> Dict[str, Dict[str, Any]]:
    msg_map: Dict[str, Dict[str, Any]] = {}
    if not os.path.exists(MSG_DB):
        return msg_map

    try:
        conn = sqlite3.connect(f"file:{MSG_DB}?mode=ro", uri=True)
        cur = conn.cursor()
        cur.execute("""
            SELECT h.id, m.date, m.text, m.attributedBody, m.is_from_me
            FROM message m
            JOIN handle h ON m.handle_id = h.ROWID
            ORDER BY m.date DESC
        """)
        rows = cur.fetchall()
        conn.close()

        for r in rows:
            handle_id, raw_date, text, attr_body, is_from_me = r
            if not handle_id or '@' in handle_id:
                continue

            phone = normalize_phone(handle_id)
            if not phone:
                continue

            t = (raw_date / 1e9) if (raw_date and raw_date > 1e12) else (raw_date or 0)
            msg_time = APPLE_EPOCH + timedelta(seconds=t)
            vn_time = msg_time.astimezone(VN_TZ).strftime("%d/%m %H:%M")

            body = text
            if not body and attr_body:
                body = extract_text_from_attributed_body(attr_body)
            body = (body or "").strip()

            if phone not in msg_map:
                msg_map[phone] = {
                    "total_messages": 0,
                    "sent_count": 0,
                    "received_count": 0,
                    "last_message_time": vn_time,
                    "last_message_text": body[:120],
                    "last_message_sender": "me" if is_from_me == 1 else "them",
                    "messages": []
                }

            msg_map[phone]["total_messages"] += 1
            if is_from_me == 1:
                msg_map[phone]["sent_count"] += 1
            else:
                msg_map[phone]["received_count"] += 1

            msg_map[phone]["messages"].append({
                "time": vn_time,
                "text": body,
                "sender": "me" if is_from_me == 1 else "them"
            })
    except Exception as e:
        print(f"⚠️ Lỗi đọc Messages chat.db: {e}")

    return msg_map


# -------------------------------------------------------------
# 3. TẢI VÀ ĐỒNG BỘ APPLE CONTACTS (2-WAY SYNC)
# -------------------------------------------------------------
def get_apple_contacts_map() -> Dict[str, Dict[str, Any]]:
    contacts_map: Dict[str, Dict[str, Any]] = {}

    for db_path in glob.glob(f"{ADDRESSBOOK_BASE}/*/AddressBook-v22.abcddb"):
        try:
            conn = sqlite3.connect(f"file:{db_path}?mode=ro", uri=True)
            cur = conn.cursor()
            cur.execute("""
                SELECT r.ZFIRSTNAME, r.ZLASTNAME, p.ZFULLNUMBER, n.ZTEXT
                FROM ZABCDRECORD r
                LEFT JOIN ZABCDPHONENUMBER p ON p.ZOWNER = r.Z_PK
                LEFT JOIN ZABCDNOTE n ON n.ZCONTACT = r.Z_PK
                WHERE r.ZFIRSTNAME LIKE '%offline3%' OR r.ZLASTNAME LIKE '%offline3%'
            """)
            rows = cur.fetchall()
            conn.close()

            for r in rows:
                first, last, full_phone, note = r
                full_name = f"{first or ''} {last or ''}".strip()
                phone = normalize_phone(full_phone or "")
                clean_name = full_name.replace("offline3 - ", "").replace("offline3 -", "").strip()

                if phone:
                    contacts_map[phone] = {
                        "name": clean_name or full_name,
                        "raw_name": full_name,
                        "phone": phone,
                        "note": (note or "").strip()
                    }
        except Exception:
            continue

    return contacts_map


def update_apple_contact_note(contact_name_or_phone: str, note_text: str, raw_name: Optional[str] = None) -> bool:
    """Cập nhật ghi chú vào Apple Contacts (iCloud đẩy ngay sang iPhone trong 2s)"""
    ensure_contacts_app()
    target_name = raw_name or contact_name_or_phone
    clean_phone = normalize_phone(contact_name_or_phone)

    script = """
    on run argv
        set theName to item 1 of argv
        set thePhone to item 2 of argv
        set theNote to item 3 of argv
        tell application "Contacts"
            set pList to {}
            if theName is not "" then
                set pList to (every person whose name is theName)
                if (count of pList) is 0 then
                    set pList to (every person whose name contains theName)
                end if
            end if
            if (count of pList) is 0 and thePhone is not "" then
                repeat with p in (every person whose name starts with "offline3")
                    repeat with ph in (every phone of p)
                        set pVal to value of ph
                        if pVal contains thePhone or thePhone contains pVal then
                            set pList to {p}
                            exit repeat
                        end if
                    end repeat
                    if (count of pList) > 0 then exit repeat
                end repeat
            end if
            if (count of pList) > 0 then
                set p to item 1 of pList
                set note of p to theNote
                save
                return "OK"
            else
                return "NOT_FOUND"
            end if
        end tell
    end run
    """
    try:
        res = subprocess.run(
            ["osascript", "-e", script, target_name, clean_phone, note_text],
            capture_output=True,
            text=True,
            timeout=8
        )
        return res.stdout.strip() == "OK"
    except Exception as e:
        print(f"❌ Lỗi ghi Apple Contact Note: {e}")
        return False


def create_or_update_apple_contact(name: str, phone: str, email: str = "", note: str = "") -> bool:
    ensure_contacts_app()
    clean_name = name.strip()
    if clean_name.lower() in ["học viên", "khách", "lead", ""]:
        clean_name = "Học viên mới"
    full_title = f"offline3 - {clean_name}" if not clean_name.startswith("offline3") else clean_name
    clean_phone = normalize_phone(phone)

    script = """
    on run argv
        set theName to item 1 of argv
        set thePhone to item 2 of argv
        set theEmail to item 3 of argv
        set theNote to item 4 of argv
        tell application "Contacts"
            set matches to (every person whose name is theName)
            if (count of matches) is 0 and thePhone is not "" then
                -- Check if an offline3 contact with this phone already exists under another name
                set pList to (every person whose name starts with "offline3 - ")
                repeat with p in pList
                    repeat with ph in (phones of p)
                        if (value of ph as string) contains thePhone or thePhone contains (value of ph as string) then
                            set matches to {p}
                            set name of p to theName
                            exit repeat
                        end if
                    end repeat
                    if (count of matches) > 0 then exit repeat
                end repeat
            end if

            if (count of matches) > 0 then
                set p to item 1 of matches
                if theNote is not "" then
                    set note of p to theNote
                end if
                if thePhone is not "" and (count of (every phone of p whose value is thePhone)) is 0 then
                    make new phone at end of phones of p with properties {label:"mobile", value:thePhone}
                end if
                if theEmail is not "" and (count of (every email of p whose value is theEmail)) is 0 then
                    make new email at end of emails of p with properties {label:"work", value:theEmail}
                end if
            else
                set p to make new person with properties {first name:theName, note:theNote}
                if thePhone is not "" then
                    make new phone at end of phones of p with properties {label:"mobile", value:thePhone}
                end if
                if theEmail is not "" then
                    make new email at end of emails of p with properties {label:"work", value:theEmail}
                end if
            end if
            save
            return "OK"
        end tell
    end run
    """
    try:
        res = subprocess.run(
            ["osascript", "-e", script, full_title, clean_phone, email, note],
            capture_output=True,
            text=True,
            timeout=8
        )
        return res.stdout.strip() == "OK"
    except Exception as e:
        print(f"❌ Lỗi tạo Apple Contact: {e}")
        return False


def send_imessage_or_sms(phone: str, message: str) -> Dict[str, Any]:
    """Gửi SMS hoặc iMessage qua Apple Messages.app hoặc mở màn hình soạn tin nhắn"""
    clean_p = normalize_phone(phone)
    if not clean_p:
        return {"success": False, "error": "Số điện thoại không hợp lệ"}

    script = """
    on run argv
        set thePhone to item 1 of argv
        set theMessage to item 2 of argv
        set sms_account_id to "51561F97-CD51-4252-AABB-3490A3DEECE9"
        set imsg_account_id to "542532E2-01CD-42FC-A2CE-A64F9AE8F35E"
        tell application "Messages"
            try
                set targetAccount to account id sms_account_id
                set targetBuddy to participant thePhone of targetAccount
                send theMessage to targetBuddy
                return "SUCCESS_SMS"
            on error
                try
                    set targetAccount to account id imsg_account_id
                    set targetBuddy to participant thePhone of targetAccount
                    send theMessage to targetBuddy
                    return "SUCCESS_IMSG"
                on error errStr
                    return "ERROR: " & errStr
                end try
            end error
        end tell
    end run
    """
    try:
        res = subprocess.run(["osascript", "-e", script, clean_p, message], capture_output=True, text=True, timeout=8)
        out = res.stdout.strip()
        if "SUCCESS" in out:
            return {"success": True, "type": out}
    except Exception:
        pass

    # Fallback: mở ứng dụng Tin nhắn thẳng tới số điện thoại này
    try:
        subprocess.run(["open", f"sms:{clean_p}"], check=True)
        return {"success": True, "type": "OPENED_SMS_APP"}
    except Exception as e:
        return {"success": False, "error": str(e)}

# -------------------------------------------------------------
# 3.5. RESEND CLOUD EMAIL DISPATCH (ZERO-DESKTOP-APP)
# -------------------------------------------------------------
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
RESEND_FROM_EMAIL = os.environ.get("RESEND_FROM_EMAIL", "Em Việt - Giáo viên FPT <viet@fedu.vn>")


def send_consultation_email(to_email: str, name: str, script_msg: str, occ: str = "", reason: str = "") -> Dict[str, Any]:
    """Gửi email xác nhận & tư vấn may đo qua Resend API ngầm (100% Cloud, không động vào Apple Mail)"""
    if not to_email or "@" not in to_email or to_email.strip().lower() in ["chưa điền", "chua dien", "none", ""]:
        return {"success": False, "error": "Email không hợp lệ hoặc chưa điền"}

    import urllib.request
    import ssl

    clean_email = to_email.strip()
    subject = f"Xác nhận đăng ký Lớp Offline Video Marketing Hà Nội (19 - 20/09) - Em Việt (Giáo viên FPT)"

    html_content = f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <div style="background-color: #0f172a; padding: 24px; text-align: left;">
      <span style="font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #38bdf8;">LỚP VIDEO MARKETING THỰC CHIẾN HÀ NỘI • 19 - 20/09</span>
      <h1 style="margin: 8px 0 0 0; font-size: 20px; color: #ffffff; font-weight: 700;">Khóa Học Video Marketing Thực Chiến Hà Nội</h1>
    </div>
    <div style="padding: 24px;">
      <p style="font-size: 16px; margin-top: 0;">Chào <b>{name}</b>,</p>
      <p style="font-size: 15px; line-height: 1.6; color: #334155;">
        Em là <b>Việt</b> (Giáo viên FPT, người trực tiếp hướng dẫn lớp Video Marketing Offline ngày 19 - 20/09 tại Hà Nội mà mình vừa đăng ký qua Page 30 Ngày Làm Video Viral). Em gửi email này để trực tiếp xác nhận thông tin giữ chỗ và hỗ trợ mình chuẩn bị chu đáo nhất trước buổi học.
      </p>
      <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; font-weight: 700; color: #1e3a8a; font-size: 14px;">💬 Lời nhắn trực tiếp từ em Việt:</p>
        <p style="margin: 8px 0 0 0; color: #1e293b; font-size: 15px; line-height: 1.6; font-style: italic;">"{script_msg}"</p>
      </div>
      <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #0f172a;">📅 Lịch trình & Địa điểm tổ chức:</h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #334155; line-height: 1.8;">
          <li><b>Thời gian:</b> 02 ngày thực chiến Thứ 7 & Chủ Nhật (19 - 20/09)</li>
          <li><b>Địa điểm:</b> Hà Nội (BTC sẽ gửi định vị chi tiết trước ngày học)</li>
          <li><b>Hình thức học:</b> Cầm tay chỉ việc, bẻ góc máy, tư duy kịch bản và thực hành quay dựng tại lớp</li>
        </ul>
      </div>
      <p style="font-size: 14px; color: #475569; line-height: 1.6;">
        Anh/chị có thể phản hồi trực tiếp vào email này hoặc kết nối Zalo theo hotline: <b>0934 688 632</b> để em trực tiếp giải đáp bài toán video của mình nhé.
      </p>
      <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
        <p style="margin: 0; font-weight: 600; color: #0f172a;">Thân mến,</p>
        <p style="margin: 4px 0 0 0; font-weight: 700; font-size: 16px; color: #0f172a;">Em Việt - Giáo viên FPT</p>
        <p style="margin: 2px 0 0 0; color: #475569; font-size: 13px;">Trực tiếp đứng lớp Video Marketing Offline Hà Nội (19 - 20/09)</p>
        <p style="margin: 2px 0 0 0; color: #94a3b8; font-size: 12px;">Hotline / Zalo trao đổi trực tiếp: 0934 688 632 • Website: https://offline.fedu.vn</p>
      </div>
    </div>
  </div>
</body>
</html>"""

    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) FeduCockpit/1.0"
    }
    payload = {
        "from": RESEND_FROM_EMAIL,
        "to": [clean_email],
        "reply_to": "vietndj@gmail.com",
        "bcc": ["vietndj@gmail.com"],
        "subject": subject,
        "html": html_content
    }
    try:
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as res:
            data = json.loads(res.read().decode())
            return {"success": True, "id": data.get("id")}
    except Exception as e:
        return {"success": False, "error": str(e)}


# -------------------------------------------------------------
# 4. GOOGLE SHEETS SYNC
# -------------------------------------------------------------
def get_google_sheet_rows() -> List[Dict[str, Any]]:
    rows_data = []
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build

        creds_dict = {
            'type': 'service_account',
            'client_email': GOOGLE_SERVICE_ACCOUNT_EMAIL,
            'private_key': GOOGLE_PRIVATE_KEY,
            'token_uri': 'https://oauth2.googleapis.com/token'
        }
        creds = service_account.Credentials.from_service_account_info(
            creds_dict,
            scopes=['https://www.googleapis.com/auth/spreadsheets']
        )
        service = build('sheets', 'v4', credentials=creds)
        res = service.spreadsheets().values().get(
            spreadsheetId=COURSE_SPREADSHEET_ID,
            range=f"'{COURSE_SHEET_NAME}'!A1:L"
        ).execute()

        raw_rows = res.get('values', [])
        if len(raw_rows) > 1:
            for idx, r in enumerate(raw_rows[1:], start=2):
                row = r + [''] * (12 - len(r))
                phone = normalize_phone(row[2])
                if not phone:
                    continue
                rows_data.append({
                    "row_index": idx,
                    "submitted_at": row[0],
                    "name": row[1],
                    "phone": phone,
                    "email": row[3],
                    "occupation": row[4],
                    "reason": row[5],
                    "source": row[6],
                    "contact_status": row[7],
                    "paid_status": row[8],
                    "private_note": row[9],
                    "skool_status": row[10],
                    "sale_note": row[11].strip() if len(row) > 11 else ""
                })
    except Exception as e:
        print(f"⚠️ Lỗi đọc Google Sheets: {e}")

    return rows_data


def update_google_sheet_lead(row_index: int, contact_status: str, paid_status: str, note: str) -> bool:
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build

        creds_dict = {
            'type': 'service_account',
            'client_email': GOOGLE_SERVICE_ACCOUNT_EMAIL,
            'private_key': GOOGLE_PRIVATE_KEY,
            'token_uri': 'https://oauth2.googleapis.com/token'
        }
        creds = service_account.Credentials.from_service_account_info(
            creds_dict,
            scopes=['https://www.googleapis.com/auth/spreadsheets']
        )
        service = build('sheets', 'v4', credentials=creds)

        range_to_update = f"'{COURSE_SHEET_NAME}'!H{row_index}:J{row_index}"
        values = [[contact_status, paid_status, note]]
        body = {'values': values}

        service.spreadsheets().values().update(
            spreadsheetId=COURSE_SPREADSHEET_ID,
            range=range_to_update,
            valueInputOption='USER_ENTERED',
            body=body
        ).execute()
        return True
    except Exception as e:
        print(f"❌ Lỗi ghi Google Sheet: {e}")
        return False


def append_google_sheet_lead(name: str, phone: str, email: str = "", occ: str = "", reason: str = "", source: str = "Telesale Radar", status: str = "", paid: str = "", note: str = "") -> bool:
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build

        creds_dict = {
            'type': 'service_account',
            'client_email': GOOGLE_SERVICE_ACCOUNT_EMAIL,
            'private_key': GOOGLE_PRIVATE_KEY,
            'token_uri': 'https://oauth2.googleapis.com/token'
        }
        creds = service_account.Credentials.from_service_account_info(
            creds_dict,
            scopes=['https://www.googleapis.com/auth/spreadsheets']
        )
        service = build('sheets', 'v4', credentials=creds)
        now_str = datetime.now(VN_TZ).strftime("%Y-%m-%d %H:%M:%S")
        row_values = [[now_str, name, phone, email, occ, reason, source, status, paid, note, ""]]
        service.spreadsheets().values().append(
            spreadsheetId=COURSE_SPREADSHEET_ID,
            range=f"'{COURSE_SHEET_NAME}'!A:K",
            valueInputOption='USER_ENTERED',
            insertDataOption='INSERT_ROWS',
            body={'values': row_values}
        ).execute()
        return True
    except Exception as e:
        print(f"❌ Lỗi thêm mới vào Google Sheet: {e}")
        return False


# -------------------------------------------------------------
# 5. CACHE VÀ STUDENT HUB KHO ARCHIVE
# -------------------------------------------------------------
def load_local_cache() -> Dict[str, Any]:
    if os.path.exists(LOCAL_RADAR_CACHE):
        try:
            with open(LOCAL_RADAR_CACHE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def save_local_cache(cache: Dict[str, Any]):
    os.makedirs(os.path.dirname(LOCAL_RADAR_CACHE), exist_ok=True)
    with open(LOCAL_RADAR_CACHE, 'w', encoding='utf-8') as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)


def get_stu_hub_map() -> Dict[str, Dict[str, Any]]:
    stu_map = {}
    if os.path.exists(STU_JSON):
        try:
            with open(STU_JSON, 'r', encoding='utf-8') as f:
                data = json.load(f)
                for s in data:
                    phone = normalize_phone(s.get('phone', ''))
                    if phone:
                        stu_map[phone] = s
        except Exception:
            pass
    return stu_map


def get_offline_leads_json_map() -> Dict[str, Dict[str, Any]]:
    leads_map = {}
    if os.path.exists(OFFLINE_LEADS_JSON):
        try:
            with open(OFFLINE_LEADS_JSON, 'r', encoding='utf-8') as f:
                data = json.load(f)
                for p, v in data.items():
                    phone = normalize_phone(p)
                    if phone:
                        leads_map[phone] = v
        except Exception:
            pass
    return leads_map


# -------------------------------------------------------------
# 6. TỔNG HỢP LEAD ĐA NGUỒN (SMART AGGREGATOR)
# -------------------------------------------------------------

def detect_salutation(full_name: str):
    name_parts = (full_name or "").strip().split()
    short_name = name_parts[-1] if name_parts else "bạn"
    first_lower = short_name.lower()

    female_keywords = [
        'thị', 'lan', 'phương', 'hương', 'hằng', 'mai', 'thảo', 'trang', 'nhung',
        'linh', 'nga', 'ngân', 'oanh', 'quỳnh', 'yến', 'dung', 'diệp', 'thủy',
        'thu', 'trâm', 'hạnh', 'vân', 'huyền', 'ly', 'loan', 'huệ', 'sen',
        'mỹ', 'ngọc', 'hiền', 'tuyết', 'liên', 'nhi', 'vy', 'mi', 'mơ', 'bích',
        'diệu', 'hoa', 'hồng', 'anh'
    ]
    male_keywords = [
        'văn', 'dũng', 'cường', 'tuấn', 'hùng', 'hoàng', 'nam', 'hải', 'minh',
        'thắng', 'thành', 'đức', 'huy', 'quân', 'long', 'toàn', 'sơn', 'tùng',
        'phong', 'trung', 'nghĩa', 'trọng', 'duy', 'việt', 'tân', 'kiên', 'bách',
        'đạt', 'khoa', 'khánh', 'bình', 'tiến', 'vương', 'quang', 'bảo'
    ]

    parts_lower = [p.lower() for p in name_parts]
    if 'thị' in parts_lower or first_lower in female_keywords:
        return 'chị', f"Chào chị {short_name}", short_name
    if 'văn' in parts_lower or first_lower in male_keywords:
        return 'anh', f"Chào anh {short_name}", short_name
    return 'mình', f"Chào anh/chị {short_name}", short_name

def generate_suggested_script(full_name: str, phone: str, email: str, occupation: str, reason: str) -> str:
    occ = (occupation or "").strip()
    occ_lower = occ.lower()
    email_lower = (email or "").lower()
    reason_lower = (reason or "").lower()

    pronoun, greeting, short_name = detect_salutation(full_name)
    has_real_occ = occ and "chưa điền" not in occ_lower and "chua dien" not in occ_lower and occ_lower != "none"

    # 1. Nhóm F&B / Nhà hàng / Quán ăn / Ẩm thực / Cà phê
    if any(k in occ_lower for k in ['nhà hàng', 'quán ăn', 'quán', 'f&b', 'ẩm thực', 'cà phê', 'cafe', 'đồ uống', 'bếp', 'nấu']):
        return (
            f"{greeting}, em là Việt bên lớp video offline đây ạ. "
            f"Thấy mình vừa đăng ký lớp thực chiến tại Hà Nội và có ghi đang làm bên nhà hàng, ẩm thực. "
            f"Đợt này {pronoun} đang muốn quay món ăn, không gian để kéo khách tới quán hay muốn tự lên hình chia sẻ câu chuyện làm nghề ạ?"
        )

    # 2. Nhóm Bất động sản / Nhà đất / Thổ cư
    if any(k in occ_lower or k in reason_lower for k in ['sổ', 'bđs', 'bất động sản', 'nhà đất', 'thổ cư', 'đất', 'dự án']):
        return (
            f"{greeting}, em là Việt bên lớp video offline đây ạ. "
            f"Thấy mình vừa đăng ký lớp thực chiến tại Hà Nội và có ghi làm bên mảng BĐS. "
            f"Đợt này {pronoun} đang đánh mảng dự án hay thổ cư, và đã từng tự quay clip nào chưa hay đang bắt đầu từ số 0 ạ?"
        )

    # 3. Nhóm Tóc / Salon / Barbershop
    if any(k in occ_lower or k in email_lower for k in ['hair', 'tóc', 'salon', 'barber']):
        return (
            f"{greeting}, em là Việt bên lớp video offline đây ạ. "
            f"Thấy mình vừa đăng ký lớp thực chiến tại Hà Nội và có ghi làm salon tóc. "
            f"Đợt này {pronoun} đang muốn quay mẫu tóc thực tế để kéo khách tới tiệm hay muốn hút học viên học nghề ạ?"
        )

    # 4. Nhóm Spa / Thẩm mỹ / Mỹ phẩm / Skincare / Nha khoa / Phun xăm
    if any(k in occ_lower for k in ['spa', 'thẩm mỹ', 'mỹ phẩm', 'skincare', 'da', 'phun xăm', 'nha khoa', 'clinic']):
        return (
            f"{greeting}, em là Việt bên lớp video offline đây ạ. "
            f"Thấy mình vừa đăng ký lớp thực chiến tại Hà Nội và có ghi làm mảng spa, làm đẹp. "
            f"Đợt này {pronoun} đang muốn quay cận cảnh quy trình chăm sóc khách hay muốn tự lên hình tư vấn ạ?"
        )

    # 5. Nhóm Thời trang / May mặc / Phụ kiện
    if any(k in occ_lower for k in ['thời trang', 'quần áo', 'váy', 'may mặc', 'phụ kiện']):
        return (
            f"{greeting}, em là Việt bên lớp video offline đây ạ. "
            f"Thấy mình vừa đăng ký lớp thực chiến tại Hà Nội và có ghi làm bên thời trang. "
            f"Đợt này {pronoun} đang muốn tự quay phối đồ/sản phẩm để kéo khách, hay đang vướng khâu lên kịch bản ạ?"
        )

    # 6. Nhóm Giảng viên / Đào tạo / Đóng gói sản phẩm giáo dục
    if any(k in occ_lower or k in reason_lower for k in ['giảng viên', 'giáo viên', 'đào tạo', 'coach', 'giáo dục', 'đóng gói', 'khóa học', 'sản phẩm đào tạo']):
        return (
            f"{greeting}, em là Việt bên lớp video offline đây ạ. "
            f"Thấy mình vừa đăng ký lớp thực chiến tại Hà Nội và có ghi đang làm giảng dạy, muốn đóng gói lại sản phẩm đào tạo và làm video bài giảng. "
            f"Đợt này {pronoun} đang giảng dạy về chuyên môn gì, và đang vướng ở khâu cấu trúc đóng gói sản phẩm hay khâu bấm máy quay bài giảng vậy ạ?"
        )

    # 6.5. Nhóm Bác sĩ / Luật sư / Chuyên gia / Bảo hiểm
    if any(k in occ_lower for k in ['bác sĩ', 'luật sư', 'bảo hiểm', 'chuyên gia']):
        return (
            f"{greeting}, em là Việt bên lớp video offline đây ạ. "
            f"Thấy mình vừa đăng ký lớp thực chiến tại Hà Nội và có ghi làm bên {occ}. "
            f"Đợt này {pronoun} đang muốn xây kênh chuyên gia để hút khách hàng/học viên, hay đang bắt đầu từ số 0 ạ?"
        )

    # 7. Có điền nghề nghiệp khác cụ thể
    if has_real_occ:
        return (
            f"{greeting}, em là Việt bên lớp video offline đây ạ. "
            f"Thấy mình vừa đăng ký lớp thực chiến tại Hà Nội và có ghi làm bên mảng {occ}. "
            f"Đợt này mình đã lập kênh để đăng thử video nào chưa hay đang bắt đầu từ số 0 vậy ạ?"
        )

    # 8. Chưa điền nghề nghiệp
    return (
        f"{greeting}, em là Việt bên lớp video offline đây ạ. "
        f"Thấy mình vừa đăng ký giữ chỗ lớp thực chiến 2 ngày 19 - 20/09 tại Hà Nội. "
        f"Không biết đợt này mình đã có kênh đăng clip nào chưa, hay đang bắt đầu từ số 0 để làm hình ảnh cho công việc vậy ạ?"
    )

def aggregate_all_leads() -> List[Dict[str, Any]]:
    call_map = get_call_history_map()
    msg_map = get_messages_map()
    contacts_map = get_apple_contacts_map()
    sheet_rows = get_google_sheet_rows()
    stu_map = get_stu_hub_map()
    local_leads_map = get_offline_leads_json_map()
    cache = load_local_cache()

    all_phones = set()
    phone_data: Dict[str, Dict[str, Any]] = {}

    # 1. Ingest từ Google Sheet
    for r in sheet_rows:
        phone = r['phone']
        all_phones.add(phone)
        phone_data[phone] = {
            "phone": phone,
            "name": r['name'].replace("offline3 - ", "").strip(),
            "email": r['email'],
            "occupation": r['occupation'],
            "reason": r['reason'],
            "source": r['source'] or "Google Sheet",
            "registered_at": r['submitted_at'],
            "sheet_row_index": r['row_index'],
            "sheet_contact_status": r['contact_status'],
            "sheet_paid_status": r['paid_status'],
            "sheet_private_note": r['private_note'],
            "sheet_sale_note": r.get('sale_note', '').strip()
        }

    # 2. Ingest từ Apple Contacts
    for phone, c in contacts_map.items():
        all_phones.add(phone)
        if phone not in phone_data:
            phone_data[phone] = {
                "phone": phone,
                "name": c['name'],
                "email": "",
                "occupation": "",
                "reason": "",
                "source": "Apple Contacts",
                "registered_at": ""
            }
        else:
            if not phone_data[phone].get('name'):
                phone_data[phone]['name'] = c['name']

    # 3. Ingest từ offline_leads.json
    for phone, lead in local_leads_map.items():
        all_phones.add(phone)
        if phone not in phone_data:
            phone_data[phone] = {
                "phone": phone,
                "name": lead.get('fullName', '').replace("offline3 - ", "").strip(),
                "email": lead.get('email', ''),
                "occupation": lead.get('occupation', ''),
                "reason": lead.get('reason', ''),
                "source": "Landing Page / Telegram",
                "registered_at": lead.get('createdAt', '')
            }
        else:
            if not phone_data[phone].get('occupation') and lead.get('occupation'):
                phone_data[phone]['occupation'] = lead.get('occupation')
            if not phone_data[phone].get('reason') and lead.get('reason'):
                phone_data[phone]['reason'] = lead.get('reason')
            if not phone_data[phone].get('registered_at') and lead.get('createdAt'):
                phone_data[phone]['registered_at'] = lead.get('createdAt')

    # 4. Làm giàu dữ liệu từ Student Hub (chỉ enrich cho lead đã có trong Sheet/Telegram/Contacts, TUYỆT ĐỐI KHÔNG nạp học viên cũ K1/K2 làm lead mới)
    for phone, stu in stu_map.items():
        if phone in all_phones:
            if not phone_data[phone].get('occupation') and stu.get('industry'):
                phone_data[phone]['occupation'] = stu.get('industry')
            if not phone_data[phone].get('registered_at') and stu.get('created_at'):
                phone_data[phone]['registered_at'] = stu.get('created_at')

    # Lọc bỏ các số điện thoại không hợp lệ (không đủ 10 số chuẩn)
    valid_phones = [p for p in all_phones if len(p) == 10 and p.startswith('0')]

    result_list = []
    for phone in valid_phones:
        base = phone_data[phone]
        name = base.get('name') or "Học viên"
        contact_info = contacts_map.get(phone, {})
        contact_note = contact_info.get('note', '')

        # Dữ liệu cuộc gọi
        call_info = call_map.get(phone, {
            "total_calls": 0,
            "total_duration": 0.0,
            "last_call_time": None,
            "last_call_duration": 0.0,
            "last_call_formatted": "Chưa gọi",
            "last_call_type": None,
            "last_call_answered": False,
            "calls": []
        })

        # Dữ liệu tin nhắn
        msg_info = msg_map.get(phone, {
            "total_messages": 0,
            "sent_count": 0,
            "received_count": 0,
            "last_message_time": None,
            "last_message_text": "",
            "last_message_sender": None,
            "messages": []
        })

        user_override = cache.get(phone, {})
        user_status = user_override.get('status')
        user_tags = list(user_override.get('tags', []))
        user_note = user_override.get('note', '')
        is_archived = user_override.get('is_archived', False)

        sheet_sale_note = base.get('sheet_sale_note', '').strip()
        is_sale_consulted = bool(sheet_sale_note and any(k in sheet_sale_note.lower() for k in ['tv', 'sale']))

        # ƯU TIÊN NOTE: Contact Note của Apple Contacts là NGUỒN CHÂN LÝ SỐNG!
        # Nếu Contacts có note, ta lấy Note của Contacts để bảo đảm 2-way sync hoàn hảo!
        if contact_note and contact_note.strip():
            final_note = contact_note.strip()
        elif user_note and user_note.strip():
            final_note = user_note.strip()
        else:
            final_note = base.get('sheet_private_note', '').strip()

        # Nếu Sale đã tư vấn ở cột L: tự động gắn tag và ghi chú rõ ràng
        if is_sale_consulted:
            if "Sale đã TV" not in user_tags:
                user_tags.append("Sale đã TV")
            if "[Sale đã TV]" not in final_note and "đã tv" not in final_note.lower() and "sale đã" not in final_note.lower():
                final_note = f"[Sale đã TV] {final_note}".strip() if final_note else f"[Sale đã TV: {sheet_sale_note}]"

        # Format ngày đăng ký thông minh (Relative date: Hôm nay, Hôm qua, X ngày trước)
        raw_reg = base.get('registered_at', '')
        reg_info = format_lead_registration(raw_reg)

        sheet_paid_raw = (base.get('sheet_paid_status') or '').lower().strip()
        is_sheet_paid = any(k in sheet_paid_raw for k in ['đã cọc', 'cọc k3', 'đã ck', 'chuyển khoản', 'đã đóng'])

        # TỰ ĐỘNG XÁC ĐỊNH TRẠNG THÁI PIPELINE
        if user_status:
            pipeline_status = user_status
        elif is_sheet_paid or "đã chuyển khoản" in final_note.lower() or "[đã cọc" in final_note.lower():
            pipeline_status = "paid"
        elif "sai tệp" in final_note.lower() or "chưa đủ kinh phí" in final_note.lower() or "sang skool" in final_note.lower():
            pipeline_status = "unqualified"
        elif "hẹn" in final_note.lower() or "suy nghĩ" in final_note.lower() or "cân nhắc" in final_note.lower() or "giảm 10%" in final_note.lower():
            pipeline_status = "considering"
        elif is_sale_consulted:
            # Sale đã tư vấn -> Chuyển sang 'contacted' (Đã liên hệ) để anh Việt KHÔNG gọi trùng ở cột 'Chưa gọi' (new)!
            pipeline_status = "contacted"
        elif call_info['total_calls'] > 0 and call_info['total_duration'] > 0:
            pipeline_status = "called"
        elif msg_info['total_messages'] > 0 or call_info['total_calls'] > 0:
            pipeline_status = "contacted"
        else:
            pipeline_status = "new"

        # Gợi ý kịch bản 1-chạm vietmac-voice
        suggested_script = generate_suggested_script(
            name, phone, base.get('email', ''), base.get('occupation', ''), base.get('reason', '')
        )

        # Trích đoạn hội thoại gần nhất để gợi nhớ (Chat & Call Memory)
        recent_snippet = ""
        if msg_info['messages']:
            last_m = msg_info['messages'][0]
            sender_label = "Khách" if last_m['sender'] == "them" else "Tôi"
            msg_txt = last_m["text"][:90]
            recent_snippet = sender_label + " (" + str(last_m["time"]) + "): " + msg_txt
        elif call_info['total_calls'] > 0:
            if call_info['last_call_duration'] > 0:
                recent_snippet = f"📞 Đàm thoại {call_info['last_call_formatted']} ({call_info['last_call_time']})"
            else:
                recent_snippet = f"📵 Gọi nhỡ / Bận ({call_info['last_call_time']})"

        lead_record = {
            "id": phone,
            "suggested_script": suggested_script,
            "recent_snippet": recent_snippet,
            "name": name,
            "phone": phone,
            "email": base.get('email', ''),
            "occupation": base.get('occupation', 'Chưa điền'),
            "reason": base.get('reason', 'Chưa điền'),
            "source": base.get('source', 'Đăng ký web'),
            "registered_at": raw_reg,
            "registration_info": reg_info,
            "status": pipeline_status,
            "is_archived": is_archived,
            "archive_category": user_override.get('archive_category', 'paid' if pipeline_status == 'paid' else ('unqualified' if pipeline_status == 'unqualified' else 'postponed')),
            "note": final_note,
            "tags": user_tags,
            "sale_note": sheet_sale_note,
            "is_sale_consulted": is_sale_consulted,
            "has_apple_contact": phone in contacts_map,
            "apple_contact_name": contact_info.get('raw_name', f"offline3 - {name}"),
            "apple_contact_note": contact_note,
            "zalo_url": f"zalo://conversation?phone={phone}",
            "zalo_app_url": f"zalo://conversation?phone={phone}",
            "zalo_bridge_url": f"https://offline.fedu.vn/zalo?phone={phone}",
            "zalo_web_url": f"https://zalo.me/{phone}",
            "sheet_row_index": base.get('sheet_row_index'),
            "call_info": call_info,
            "sms_info": msg_info,
            "stu_note": stu_map.get(phone, {}).get('notes', ''),
            "stu_class": stu_map.get(phone, {}).get('class', ''),
            "stu_consultations": stu_map.get(phone, {}).get('consultations', []),
            "last_activity_time": call_info['last_call_time'] or msg_info['last_message_time'] or raw_reg or ""
        }
        result_list.append(lead_record)

    # Thứ tự ưu tiên hiển thị
    status_order = {
        "paid": 1,
        "considering": 2,
        "called": 3,
        "new": 4,
        "contacted": 5,
        "unqualified": 6
    }
    result_list.sort(
        key=lambda x: (
            status_order.get(x['status'], 99),
            0 if x['registration_info']['is_hot'] else 1,
            x['call_info']['total_duration'] * -1
        )
    )

    return result_list


# -------------------------------------------------------------
# 7. CẬP NHẬT 1-CHẠM & LƯU KHO STU
# -------------------------------------------------------------
def update_lead(
    phone: str,
    status: Optional[str] = None,
    note: Optional[str] = None,
    tags: Optional[List[str]] = None,
    name: Optional[str] = None
) -> Dict[str, Any]:
    clean_phone = normalize_phone(phone)
    if not clean_phone:
        return {"success": False, "error": "Số điện thoại không hợp lệ"}

    cache = load_local_cache()
    if clean_phone not in cache:
        cache[clean_phone] = {}

    if status:
        cache[clean_phone]['status'] = status
    if note is not None:
        cache[clean_phone]['note'] = note
    if tags is not None:
        cache[clean_phone]['tags'] = tags
    if name:
        cache[clean_phone]['name'] = name

    cache[clean_phone]['updated_at'] = datetime.now(VN_TZ).strftime("%d/%m/%Y %H:%M:%S")
    save_local_cache(cache)

    contacts_map = get_apple_contacts_map()
    stu_map = get_stu_hub_map()
    local_leads_map = get_offline_leads_json_map()
    
    resolved_name = name or cache.get(clean_phone, {}).get('name')
    if not resolved_name and clean_phone in contacts_map:
        resolved_name = contacts_map[clean_phone]['name']
    if not resolved_name and clean_phone in stu_map:
        resolved_name = stu_map[clean_phone].get('name')
    if not resolved_name and clean_phone in local_leads_map:
        resolved_name = local_leads_map[clean_phone].get('fullName')
    full_name = resolved_name or "Học viên"

    note_to_sync = note if note is not None else cache[clean_phone].get('note', '')

    # 1. ĐỒNG BỘ SANG APPLE CONTACTS (Tên chính xác + SĐT)
    contact_updated = False
    raw_name = contacts_map.get(clean_phone, {}).get('raw_name') or f"offline3 - {full_name}"
    if clean_phone in contacts_map:
        contact_updated = update_apple_contact_note(clean_phone, note_to_sync, raw_name=raw_name)
    else:
        contact_updated = create_or_update_apple_contact(full_name, clean_phone, "", note_to_sync)

    # 2. ĐỒNG BỘ SANG GOOGLE SHEETS
    sheet_updated = False
    sheet_rows = get_google_sheet_rows()
    target_row = next((r for r in sheet_rows if r['phone'] == clean_phone), None)
    status_label_map = {
        "new": "Chưa liên hệ",
        "contacted": "Đã gửi tin",
        "called": "Đã gọi điện",
        "considering": "Đang cân nhắc / Hẹn lại",
        "paid": "Đã chốt cọc K3",
        "unqualified": "Không phù hợp / Chuyển Skool"
    }
    status_label = status_label_map.get(status, status or "Đang tư vấn")
    paid_label = "Đã cọc K3" if status == "paid" else ""

    if target_row:
        row_idx = target_row['row_index']
        sheet_updated = update_google_sheet_lead(row_idx, status_label, paid_label, note_to_sync)
    else:
        sheet_updated = append_google_sheet_lead(
            name=full_name,
            phone=clean_phone,
            status=status_label,
            paid=paid_label,
            note=note_to_sync
        )

    # 3. ĐỒNG BỘ SANG STUDENT HUB (students.json)
    stu_updated = False
    if os.path.exists(STU_JSON):
        try:
            with open(STU_JSON, 'r', encoding='utf-8') as f:
                stu_data = json.load(f)
            stu_found = False
            for s in stu_data:
                if normalize_phone(s.get('phone', '')) == clean_phone:
                    stu_found = True
                    timestamp_str = datetime.now(VN_TZ).strftime("%d/%m/%Y %H:%M")
                    existing_notes = s.get('notes', '')
                    s['notes'] = f"• [{timestamp_str}] {note_to_sync}\n{existing_notes}".strip()
                    s['updated_at'] = datetime.now(timezone.utc).isoformat()
                    s['last_updated_vn'] = timestamp_str
                    break
            if stu_found:
                with open(STU_JSON, 'w', encoding='utf-8') as f:
                    json.dump(stu_data, f, ensure_ascii=False, indent=2)
                stu_updated = True
        except Exception:
            pass

    return {
        "success": True,
        "phone": clean_phone,
        "status": status,
        "apple_contact_synced": contact_updated,
        "google_sheet_synced": sheet_updated,
        "student_hub_synced": stu_updated
    }


def archive_lead_to_stu(phone: str, final_note: str = "", stu_class: str = "Offline 3 (Đã CK)", status: str = "Đã cọc / Hoàn thành", category: str = "paid") -> Dict[str, Any]:
    """Lưu học viên đã xử lý xong vào kho Student Hub (students.json) và ẩn khỏi radar gọi hàng ngày"""
    clean_phone = normalize_phone(phone)
    if not clean_phone:
        return {"success": False, "error": "Số điện thoại không hợp lệ"}

    # 1. Update cache: mark is_archived = True
    cache = load_local_cache()
    if clean_phone not in cache:
        cache[clean_phone] = {}
    cache[clean_phone]['is_archived'] = True
    cache[clean_phone]['archive_category'] = category
    cache[clean_phone]['archived_at'] = datetime.now(VN_TZ).strftime("%d/%m/%Y %H:%M:%S")
    cache[clean_phone]['note'] = final_note
    if category == 'paid':
        cache[clean_phone]['status'] = 'paid'
    elif category == 'unqualified':
        cache[clean_phone]['status'] = 'unqualified'
    elif category == 'postponed':
        cache[clean_phone]['status'] = 'considering'
    cache[clean_phone]['updated_at'] = datetime.now(VN_TZ).strftime("%d/%m/%Y %H:%M:%S")
    save_local_cache(cache)

    leads = aggregate_all_leads()
    lead = next((l for l in leads if l['phone'] == clean_phone), None)
    lead_name = lead['name'] if lead else "Học viên"
    occupation = lead['occupation'] if lead else "Chưa điền"
    email = lead['email'] if lead else ""

    # 2. Upsert into students.json
    stu_updated = False
    if os.path.exists(STU_JSON):
        try:
            with open(STU_JSON, 'r', encoding='utf-8') as f:
                stu_data = json.load(f)

            timestamp_str = datetime.now(VN_TZ).strftime("%d/%m/%Y %H:%M")
            existing = next((s for s in stu_data if normalize_phone(s.get('phone', '')) == clean_phone), None)
            note_entry = f"• [{timestamp_str}] [KHO STU ARCHIVE]: {final_note}"

            if existing:
                existing['notes'] = f"{note_entry}\n{existing.get('notes', '')}".strip()
                existing['class'] = stu_class or existing.get('class', 'Offline 3')
                existing['updated_at'] = datetime.now(timezone.utc).isoformat()
                existing['last_updated_vn'] = timestamp_str
            else:
                slug_id = re.sub(r'[^a-z0-9]+', '_', lead_name.lower().strip()).strip('_') or f"stu_{clean_phone}"
                new_stu = {
                    "id": slug_id,
                    "name": lead_name,
                    "class": stu_class or "Offline 3",
                    "industry": occupation,
                    "industry_slug": re.sub(r'[^a-z0-9]+', '_', occupation.lower().strip()).strip('_'),
                    "avatar_url": "assets/avatar_vietnd.png",
                    "thumbnail_url": "assets/avatar_vietnd.png",
                    "drive_folder_url": "",
                    "local_folder_path": "",
                    "phone": clean_phone,
                    "zalo_url": f"zalo://conversation?phone={clean_phone}",
                    "zalo_app_url": f"zalo://conversation?phone={clean_phone}",
                    "zalo_web_url": f"https://zalo.me/{clean_phone}",
                    "facebook_url": None,
                    "reference_channels": [],
                    "videos": [],
                    "consultations": [
                        {
                            "id": f"cst_{slug_id}_archive",
                            "date": timestamp_str,
                            "channel": "telesale",
                            "topic": f"📦 Lưu kho Student Hub từ Telesale Radar: {status}",
                            "student_inquiry": final_note or "Đã hoàn thành phiên tư vấn và chuyển vào kho STU.",
                            "marketing_use": "Dữ liệu lưu trữ hồ sơ học viên."
                        }
                    ],
                    "notes": note_entry,
                    "contact_source": "telesale_radar",
                    "contact_source_label": "Telesale Radar",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                    "last_updated_vn": timestamp_str,
                    "completeness_score": 50,
                    "health_status": "good",
                    "missing_items": []
                }
                stu_data.append(new_stu)

            with open(STU_JSON, 'w', encoding='utf-8') as f:
                json.dump(stu_data, f, ensure_ascii=False, indent=2)
            stu_updated = True
        except Exception as e:
            print(f"❌ Lỗi ghi STU Hub Archive: {e}")

    # 3. Update Apple Contacts note
    contacts_map = get_apple_contacts_map()
    raw_name = contacts_map.get(clean_phone, {}).get('raw_name') or f"offline3 - {lead_name}"
    update_apple_contact_note(clean_phone, f"[KHO STU] {final_note}", raw_name=raw_name)

    # 4. Sync Google Sheet
    sheet_updated = False
    try:
        sheet_rows = get_google_sheet_rows()
        target_row = next((r for r in sheet_rows if r['phone'] == clean_phone), None)
        sheet_status_map = {
            "paid": "Đã chốt cọc K3",
            "unqualified": "Không phù hợp / Lưu kho",
            "postponed": "Bảo lưu / Hẹn khóa sau"
        }
        sheet_status = sheet_status_map.get(category, "Đã lưu kho STU")
        sheet_paid = "Đã cọc K3" if category == "paid" else ""
        if target_row:
            sheet_updated = update_google_sheet_lead(target_row['row_index'], sheet_status, sheet_paid, final_note)
        else:
            sheet_updated = append_google_sheet_lead(
                name=lead_name,
                phone=clean_phone,
                status=sheet_status,
                paid=sheet_paid,
                note=final_note
            )
    except Exception as e:
        print(f"❌ Lỗi ghi Google Sheet khi lưu kho: {e}")

    return {
        "success": True,
        "phone": clean_phone,
        "name": lead_name,
        "stu_updated": stu_updated,
        "sheet_updated": sheet_updated,
        "is_archived": True
    }


def unarchive_lead(phone: str) -> Dict[str, Any]:
    """Khôi phục học viên từ kho STU trở lại bảng Telesale Radar"""
    clean_phone = normalize_phone(phone)
    if not clean_phone:
        return {"success": False, "error": "Số điện thoại không hợp lệ"}
    cache = load_local_cache()
    if clean_phone in cache:
        cache[clean_phone]['is_archived'] = False
        cache[clean_phone]['updated_at'] = datetime.now(VN_TZ).strftime("%d/%m/%Y %H:%M:%S")
        save_local_cache(cache)
    return {"success": True, "phone": clean_phone, "is_archived": False}


if __name__ == "__main__":
    print("🚀 Đang tổng hợp dữ liệu từ tất cả các nguồn...")
    leads = aggregate_all_leads()
    print(f"✅ Đã tổng hợp thành công {len(leads)} học viên!")
    for idx, l in enumerate(leads[:8], start=1):
        reg = l['registration_info']['badge']
        call_s = l['call_info']['last_call_formatted']
        print(f" {idx:2d}. [{l['status'].upper():11s}] {l['name']:20s} | {l['phone']:11s} | 📅 {reg:18s} | 📞 {call_s:8s}")
