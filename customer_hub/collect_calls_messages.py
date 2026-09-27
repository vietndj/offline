#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FEDU Customer Hub — Collector: Call History + iMessage (4 tháng)
Đọc macOS CallHistory.storedata và Messages chat.db (read-only),
chỉ import touchpoints cho customers đã có trong hub.
"""

import os
import re
import shutil
import sqlite3
import tempfile
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fedu_customer_hub.db")
CALL_DB = os.path.expanduser('~/Library/Application Support/CallHistoryDB/CallHistory.storedata')
MSG_DB = os.path.expanduser('~/Library/Messages/chat.db')

# Core Data epoch: 2001-01-01 00:00:00 UTC
CORE_DATA_EPOCH = 978307200  # Unix timestamp of 2001-01-01
FOUR_MONTHS_AGO = datetime.now() - timedelta(days=120)
FOUR_MONTHS_CORE_DATA = (FOUR_MONTHS_AGO.timestamp() - CORE_DATA_EPOCH)
# Messages uses nanoseconds since 2001-01-01
FOUR_MONTHS_COCOA_NS = int(FOUR_MONTHS_CORE_DATA * 1e9)


def normalize_phone(phone: str) -> str:
    if not phone:
        return ""
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


def core_data_to_iso(timestamp: float) -> str:
    """Convert Core Data timestamp to ISO string."""
    try:
        unix_ts = timestamp + CORE_DATA_EPOCH
        return datetime.fromtimestamp(unix_ts).isoformat()
    except:
        return ""


def cocoa_ns_to_iso(nanoseconds: int) -> str:
    """Convert Cocoa nanosecond timestamp to ISO string."""
    try:
        seconds = nanoseconds / 1e9
        unix_ts = seconds + CORE_DATA_EPOCH
        return datetime.fromtimestamp(unix_ts).isoformat()
    except:
        return ""


def safe_copy_db(source: str) -> str:
    """Copy database to temp to avoid WAL locks."""
    tmp_dir = tempfile.mkdtemp()
    tmp_path = os.path.join(tmp_dir, os.path.basename(source))
    shutil.copy2(source, tmp_path)
    # Also copy WAL and SHM if they exist
    for ext in ['-wal', '-shm']:
        src_extra = source + ext
        if os.path.exists(src_extra):
            shutil.copy2(src_extra, tmp_path + ext)
    return tmp_path


def collect_calls(hub_cursor, customer_phones: dict):
    """Collect call history for known customers."""
    print("\n📞 Thu thập Call History...")
    
    if not os.path.exists(CALL_DB):
        print("   ⚠️  CallHistory.storedata không tồn tại")
        return 0

    try:
        tmp_db = safe_copy_db(CALL_DB)
        conn = sqlite3.connect(tmp_db)
        cursor = conn.cursor()

        # Query calls from last 4 months
        cursor.execute("""
            SELECT ZADDRESS, ZDURATION, ZDATE, ZORIGINATED, ZANSWERED
            FROM ZCALLRECORD 
            WHERE ZDATE > ?
            ORDER BY ZDATE DESC
        """, (FOUR_MONTHS_CORE_DATA,))

        rows = cursor.fetchall()
        print(f"   Total calls in 4 months: {len(rows)}")

        matched = 0
        for address, duration, date, originated, answered in rows:
            if not address:
                continue
            phone = normalize_phone(address)
            if not phone or phone not in customer_phones:
                continue

            customer_id = customer_phones[phone]
            direction = "outbound" if originated else "inbound"
            occurred = core_data_to_iso(date)
            status = "answered" if answered else "missed"
            content = f"Call ({status}), duration: {int(duration or 0)}s"

            # Check duplicate
            hub_cursor.execute("""
                SELECT id FROM touchpoints 
                WHERE customer_id = ? AND channel = 'call' AND occurred_at = ?
            """, (customer_id, occurred))
            if hub_cursor.fetchone():
                continue

            hub_cursor.execute("""
                INSERT INTO touchpoints 
                (customer_id, channel, direction, content, duration_seconds, occurred_at)
                VALUES (?, 'call', ?, ?, ?, ?)
            """, (customer_id, direction, content, duration or 0, occurred))
            matched += 1

        conn.close()
        # Cleanup temp
        shutil.rmtree(os.path.dirname(tmp_db), ignore_errors=True)

        print(f"   ✅ Matched calls: {matched} (of {len(rows)} total)")
        return matched

    except Exception as e:
        print(f"   ❌ Call History error: {e}")
        return 0


def collect_messages(hub_cursor, customer_phones: dict):
    """Collect iMessage/SMS for known customers."""
    print("\n💬 Thu thập iMessage/SMS...")
    
    if not os.path.exists(MSG_DB):
        print("   ⚠️  chat.db không tồn tại")
        return 0

    try:
        tmp_db = safe_copy_db(MSG_DB)
        conn = sqlite3.connect(tmp_db)
        cursor = conn.cursor()

        # Query messages from last 4 months
        cursor.execute("""
            SELECT 
                m.text, 
                m.date, 
                m.is_from_me,
                h.id as handle_id
            FROM message m 
            JOIN chat_message_join cmj ON m.ROWID = cmj.message_id
            JOIN chat c ON cmj.chat_id = c.ROWID
            JOIN chat_handle_join chj ON c.ROWID = chj.chat_id
            JOIN handle h ON chj.handle_id = h.ROWID
            WHERE m.date > ?
            ORDER BY m.date DESC
        """, (FOUR_MONTHS_COCOA_NS,))

        rows = cursor.fetchall()
        print(f"   Total messages in 4 months: {len(rows)}")

        matched = 0
        for text, date, is_from_me, handle_id in rows:
            if not handle_id:
                continue
            phone = normalize_phone(handle_id)
            if not phone or phone not in customer_phones:
                continue

            customer_id = customer_phones[phone]
            direction = "outbound" if is_from_me else "inbound"
            occurred = cocoa_ns_to_iso(date)

            # Skip empty messages
            if not text or not text.strip():
                continue

            # Check duplicate
            hub_cursor.execute("""
                SELECT id FROM touchpoints 
                WHERE customer_id = ? AND channel = 'imessage' AND occurred_at = ?
            """, (customer_id, occurred))
            if hub_cursor.fetchone():
                continue

            # Truncate very long messages
            content = text[:1000] if text else ""

            hub_cursor.execute("""
                INSERT INTO touchpoints 
                (customer_id, channel, direction, content, occurred_at)
                VALUES (?, 'imessage', ?, ?, ?)
            """, (customer_id, direction, content, occurred))
            matched += 1

        conn.close()
        shutil.rmtree(os.path.dirname(tmp_db), ignore_errors=True)

        print(f"   ✅ Matched messages: {matched} (of {len(rows)} total)")
        return matched

    except Exception as e:
        print(f"   ❌ iMessage error: {e}")
        return 0


def main():
    print("=" * 60)
    print("FEDU CUSTOMER HUB — Call History + iMessage Collector")
    print(f"Since: {FOUR_MONTHS_AGO.strftime('%Y-%m-%d')}")
    print("=" * 60)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Load all known customer phones
    cursor.execute("SELECT id, phone FROM customers")
    customer_phones = {row[1]: row[0] for row in cursor.fetchall()}
    print(f"\n📋 Known customers: {len(customer_phones)}")

    # Collect calls
    call_count = collect_calls(cursor, customer_phones)
    conn.commit()

    # Collect messages
    msg_count = collect_messages(cursor, customer_phones)
    conn.commit()

    # Summary
    cursor.execute("SELECT channel, count(*) FROM touchpoints GROUP BY channel ORDER BY count(*) DESC")
    channels = cursor.fetchall()

    cursor.execute("SELECT count(*) FROM touchpoints")
    total = cursor.fetchone()[0]

    conn.close()

    print("\n" + "=" * 60)
    print(f"📊 TỔNG KẾT:")
    print(f"   Calls matched: {call_count}")
    print(f"   Messages matched: {msg_count}")
    print(f"   Total touchpoints in DB: {total}")
    print(f"\n   Breakdown by channel:")
    for channel, count in channels:
        print(f"     {channel}: {count}")
    print("=" * 60)


if __name__ == "__main__":
    main()
