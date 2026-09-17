#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Apple Contacts Sync & Call Scanner for FEDU Offline Leads.
- Thêm số mới vào danh bạ với tiền tố: "chưa gọi - [Tên]"
- Quét lịch sử cuộc gọi (macOS CallHistory) khi người dùng yêu cầu:
  Tự động đổi tiền tố "chưa gọi - [Tên]" thành "offline3 - [Tên]",
  ghi thời lượng cuộc gọi vào ghi chú danh bạ và cập nhật trạng thái Telesale Radar.
"""

import os
import sys
import json
import sqlite3
import subprocess
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional

# Constants & Paths
VN_TZ = timezone(timedelta(hours=7))
APPLE_EPOCH = datetime(2001, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
CALL_DB = os.path.expanduser("~/Library/Application Support/CallHistoryDB/CallHistory.storedata")
ADDRESSBOOK_BASE = os.path.expanduser("~/Library/Application Support/AddressBook/Sources")
RADAR_DIR = os.path.dirname(os.path.abspath(__file__))

if RADAR_DIR not in sys.path:
    sys.path.append(RADAR_DIR)

import telesale_engine as engine

PREFIX_PENDING = "chưa gọi - "
PREFIX_DONE = "offline3 - "

def normalize_phone(phone: str) -> str:
    return engine.normalize_phone(phone)

def add_contact(name: str, phone: str, email: str = "", note: str = "", prefix: str = PREFIX_PENDING) -> bool:
    clean_name = name.strip()
    clean_phone = normalize_phone(phone)
    if not clean_phone:
        print(f"❌ SĐT không hợp lệ: {phone}")
        return False

    for p in [PREFIX_PENDING, PREFIX_DONE, "offline3 -", "chưa gọi -"]:
        if clean_name.startswith(p):
            clean_name = clean_name[len(p):].strip()

    full_title = f"{prefix}{clean_name}"

    script = """
    on run argv
        set theName to item 1 of argv
        set thePhone to item 2 of argv
        set theEmail to item 3 of argv
        set theNote to item 4 of argv
        tell application "Contacts"
            set matches to {}
            if thePhone is not "" then
                set allPeople to (every person whose (name starts with "chưa gọi" or name starts with "offline3"))
                repeat with p in allPeople
                    repeat with ph in (phones of p)
                        if (value of ph as string) contains thePhone or thePhone contains (value of ph as string) then
                            set matches to {p}
                            set first name of p to theName
                            exit repeat
                        end if
                    end repeat
                    if (count of matches) > 0 then exit repeat
                end repeat
            end if

            if (count of matches) is 0 then
                set matches to (every person whose name is theName)
            end if

            if (count of matches) > 0 then
                set p to item 1 of matches
                set first name of p to theName
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
            return id of p
        end tell
    end run
    """
    try:
        res = subprocess.run(
            ["osascript", "-e", script, full_title, clean_phone, email, note],
            capture_output=True,
            text=True,
            timeout=10
        )
        if res.returncode == 0 and res.stdout.strip():
            print(f"✅ Đã lưu danh bạ: '{full_title}' | SĐT: {clean_phone}")
            return True
        else:
            print(f"⚠️ Thất bại khi lưu {full_title}: {res.stderr.strip()}")
            return False
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        return False

def get_pending_contacts() -> List[Dict[str, Any]]:
    pending = []
    import glob
    for db_path in glob.glob(f"{ADDRESSBOOK_BASE}/*/AddressBook-v22.abcddb"):
        try:
            conn = sqlite3.connect(f"file:{db_path}?mode=ro", uri=True)
            cur = conn.cursor()
            cur.execute("""
                SELECT r.ZFIRSTNAME, r.ZLASTNAME, p.ZFULLNUMBER, n.ZTEXT
                FROM ZABCDRECORD r
                LEFT JOIN ZABCDPHONENUMBER p ON p.ZOWNER = r.Z_PK
                LEFT JOIN ZABCDNOTE n ON n.ZCONTACT = r.Z_PK
                WHERE r.ZFIRSTNAME LIKE '%chưa gọi%' OR r.ZLASTNAME LIKE '%chưa gọi%'
            """)
            rows = cur.fetchall()
            conn.close()
            for r in rows:
                first, last, full_phone, note = r
                full_name = f"{first or ""} {last or ""}".strip()
                phone = normalize_phone(full_phone or "")
                clean_name = full_name.replace(PREFIX_PENDING, "").replace("chưa gọi -", "").strip()
                if phone:
                    pending.append({
                        "raw_name": full_name,
                        "clean_name": clean_name,
                        "phone": phone,
                        "note": (note or "").strip()
                    })
        except Exception:
            continue
    return pending

def scan_calls_and_update() -> Dict[str, Any]:
    engine.ensure_contacts_app()
    call_map = engine.get_call_history_map()
    msg_map = engine.get_messages_map()
    pending = get_pending_contacts()

    updated = []
    still_pending = []

    print(f"\n🔍 Đang quét {len(pending)} liên hệ 'chưa gọi' trong danh bạ...")

    for p in pending:
        phone = p["phone"]
        clean_name = p["clean_name"]
        raw_name = p["raw_name"]
        old_note = p["note"]

        call_info = call_map.get(phone)
        msg_info = msg_map.get(phone)

        has_call = call_info and call_info.get("total_calls", 0) > 0
        has_msg = msg_info and msg_info.get("total_messages", 0) > 0

        if has_call or has_msg:
            new_title = f"{PREFIX_DONE}{clean_name}"
            call_note_snippet = ""
            new_status = "contacted"

            if has_call:
                dur = call_info.get("last_call_duration", 0)
                dur_fmt = call_info.get("last_call_formatted", "0s")
                call_time = call_info.get("last_call_time", "")
                if dur > 0:
                    new_status = "called"
                    call_note_snippet = f"📞 Đã đàm thoại {dur_fmt} ({call_time})"
                else:
                    new_status = "contacted"
                    call_note_snippet = f"📵 Cuộc gọi nhỡ / không nhấc máy ({call_time})"
            elif has_msg:
                new_status = "contacted"
                last_m = msg_info.get("messages", [{}])[0]
                call_note_snippet = f"💬 Đã nhắn tin ({last_m.get("time", "")}): {last_m.get("text", "")[:40]}"

            new_note = f"{call_note_snippet} | {old_note}".strip(" | ")

            rename_script = """
            on run argv
                set oldName to item 1 of argv
                set newName to item 2 of argv
                set theNote to item 3 of argv
                set thePhone to item 4 of argv
                tell application "Contacts"
                    set matched to {}
                    if thePhone is not "" then
                        set allP to (every person whose name starts with "chưa gọi")
                        repeat with p in allP
                            repeat with ph in (phones of p)
                                if (value of ph as string) contains thePhone or thePhone contains (value of ph as string) then
                                    set matched to {p}
                                    exit repeat
                                end if
                            end repeat
                            if (count of matched) > 0 then exit repeat
                        end repeat
                    end if
                    if (count of matched) is 0 then
                        set matched to (every person whose name is oldName)
                    end if
                    if (count of matched) > 0 then
                        set p to item 1 of matched
                        set first name of p to newName
                        if theNote is not "" then
                            set note of p to theNote
                        end if
                        save
                        return "UPDATED"
                    end if
                    return "NOT_FOUND"
                end tell
            end run
            """
            res = subprocess.run(
                ["osascript", "-e", rename_script, raw_name, new_title, new_note, phone],
                capture_output=True,
                text=True,
                timeout=10
            )

            radar_res = engine.update_lead(
                phone=phone,
                status=new_status,
                note=new_note,
                name=clean_name
            )

            updated.append({
                "name": clean_name,
                "phone": phone,
                "old_title": raw_name,
                "new_title": new_title,
                "status": new_status,
                "detail": call_note_snippet,
                "radar_updated": radar_res.get("success", True)
            })
            print(f"  ✨ ĐÃ CẬP NHẬT: '{raw_name}' ➔ '{new_title}' | {call_note_snippet}")
        else:
            still_pending.append({
                "name": clean_name,
                "phone": phone,
                "title": raw_name
            })

    print(f"\n📊 Kết quả quét:")
    print(f"  • Đã cập nhật xong: {len(updated)} liên hệ")
    print(f"  • Vẫn đang chờ gọi: {len(still_pending)} liên hệ")

    return {
        "updated_count": len(updated),
        "pending_count": len(still_pending),
        "updated": updated,
        "pending": still_pending
    }

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Apple Contacts Manager & Radar Call Scanner")
    parser.add_argument("--scan", action="store_true", help="Quét lịch sử cuộc gọi và cập nhật danh bạ/radar")
    parser.add_argument("--list", action="store_true", help="Liệt kê danh sách liên hệ 'chưa gọi'")
    args = parser.parse_args()

    if args.scan:
        scan_calls_and_update()
    elif args.list:
        p_list = get_pending_contacts()
        print(f"📋 Danh sách {len(p_list)} liên hệ 'chưa gọi' trong danh bạ:")
        for p in p_list:
            print(f"  • {p["raw_name"]} ({p["phone"]}) - {p["note"]}")
    else:
        parser.print_help()
