#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FEDU Customer Hub — Collector: Facebook Inbox (4 tháng)
Thu thập toàn bộ tin nhắn từ Facebook Page "30 Ngày Viral" qua Graph API.
Có checkpoint chống thất thoát.
"""

import os
import re
import json
import time
import sqlite3
import requests
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fedu_customer_hub.db")
CHECKPOINT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_fb_checkpoint.json")

# Facebook Config (from scanner_daemon.py)
PAGE_ID = "839755019212216"
PAGE_TOKEN = "EAAegdQqWEkwBSQxUkVrG1rHI2DmOaH2JPlUi6WMfQmjZBaVEmheVnXXC4etBFtxiA0od4qS3YAs8Dph2MxlXBAGx5bgAqOmZBgjJVKxv6559xhx0aw6B6ld6NmzE8wlFJZCUzAisoKFg2QwwSVY3eDK11vK07jmSRggQyXuoVHkU71YT0EY04ydQWQpYZBUUOEWZCeWYofP5naLsf2bcZD"
API_VERSION = "v21.0"
BASE_URL = f"https://graph.facebook.com/{API_VERSION}"

# 4 months ago
SINCE_DATE = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
SINCE_TIMESTAMP = int((datetime.now() - timedelta(days=120)).timestamp())

# Rate limiting
SLEEP_BETWEEN_CALLS = 0.5
MAX_RETRIES = 3


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


def extract_phone(text: str) -> str:
    """Extract phone number from message text."""
    if not text:
        return ""
    patterns = [
        r'(?:\+84|84|0)\s*\d[\d\s\.\-]{7,12}',
        r'0\d{9,10}',
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return normalize_phone(match.group())
    return ""


def api_call(url: str, retries: int = MAX_RETRIES) -> dict:
    """Make Graph API call with retries."""
    for attempt in range(retries):
        try:
            time.sleep(SLEEP_BETWEEN_CALLS)
            resp = requests.get(url, timeout=30)
            if resp.status_code == 200:
                return resp.json()
            elif resp.status_code == 429:
                print(f"   ⚠️  Rate limited (attempt {attempt+1}/{retries})")
                time.sleep(5 * (attempt + 1))
            elif resp.status_code in (400, 401, 403):
                print(f"   ❌ Auth/Permission error {resp.status_code}: {resp.text[:200]}")
                return {}
            else:
                print(f"   ⚠️  API Error {resp.status_code} (attempt {attempt+1}): {resp.text[:200]}")
                time.sleep(2 * (attempt + 1))
        except Exception as e:
            print(f"   ⚠️  Request error (attempt {attempt+1}): {e}")
            time.sleep(2 * (attempt + 1))
    return {}


def load_checkpoint() -> set:
    """Load processed conversation IDs."""
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE, 'r') as f:
            data = json.load(f)
            return set(data.get('processed_conversations', []))
    return set()


def save_checkpoint(processed: set):
    """Save checkpoint."""
    with open(CHECKPOINT_FILE, 'w') as f:
        json.dump({
            'processed_conversations': list(processed),
            'last_run': datetime.now().isoformat(),
        }, f, ensure_ascii=False, indent=2)


def get_or_create_customer(cursor, phone: str, name: str = "") -> int:
    """Get customer_id or create new customer."""
    cursor.execute("SELECT id FROM customers WHERE phone = ?", (phone,))
    row = cursor.fetchone()
    if row:
        return row[0]

    cursor.execute("""
        INSERT INTO customers (phone, name, source, source_systems) 
        VALUES (?, ?, 'facebook_inbox', '["facebook_inbox"]')
    """, (phone, name))
    return cursor.lastrowid


def main():
    print("=" * 60)
    print("FEDU CUSTOMER HUB — Facebook Inbox Collector (4 tháng)")
    print(f"Since: {SINCE_DATE}")
    print("=" * 60)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    processed = load_checkpoint()

    # Step 1: Get all conversations
    print("\n📥 Fetching conversations...")
    conversations = []
    url = f"{BASE_URL}/{PAGE_ID}/conversations?fields=id,participants,updated_time&limit=100&access_token={PAGE_TOKEN}"

    page_count = 0
    while url:
        data = api_call(url)
        if not data or 'data' not in data:
            if not data:
                print("   ❌ Không thể kết nối API. Kiểm tra token.")
            break

        for conv in data['data']:
            updated = conv.get('updated_time', '')
            # Filter by date
            if updated and updated[:10] >= SINCE_DATE:
                conversations.append(conv)

        # Pagination
        paging = data.get('paging', {})
        url = paging.get('next', '')
        page_count += 1
        print(f"   Page {page_count}: {len(data['data'])} conversations (total collected: {len(conversations)})")

        # Stop if we've gone past our date range
        if data['data']:
            last_updated = data['data'][-1].get('updated_time', '')
            if last_updated and last_updated[:10] < SINCE_DATE:
                print(f"   Reached conversations before {SINCE_DATE}, stopping pagination.")
                break

    print(f"\n📊 Total conversations in 4 months: {len(conversations)}")

    # Step 2: Fetch messages for each conversation
    total_messages = 0
    new_customers = 0
    skipped = 0

    for i, conv in enumerate(conversations):
        conv_id = conv['id']

        if conv_id in processed:
            skipped += 1
            continue

        # Get participant name (the customer)
        customer_name = ""
        participants = conv.get('participants', {}).get('data', [])
        for p in participants:
            if str(p.get('id', '')) != PAGE_ID:
                customer_name = p.get('name', '')
                break

        # Fetch all messages in this conversation
        msg_url = f"{BASE_URL}/{conv_id}/messages?fields=id,message,from,created_time,attachments&limit=500&access_token={PAGE_TOKEN}"
        conv_messages = 0
        conv_customer_id = None

        while msg_url:
            msg_data = api_call(msg_url)
            if not msg_data or 'data' not in msg_data:
                break

            for msg in msg_data['data']:
                msg_id = msg.get('id', '')
                msg_text = msg.get('message', '')
                msg_from = msg.get('from', {})
                msg_time = msg.get('created_time', '')

                # Determine sender type
                sender_type = "page" if str(msg_from.get('id', '')) == PAGE_ID else "customer"

                # Extract phone from customer messages
                extracted = extract_phone(msg_text) if sender_type == "customer" else ""
                has_phone = 1 if extracted else 0

                # Link to customer if phone found
                if extracted and not conv_customer_id:
                    conv_customer_id = get_or_create_customer(cursor, extracted, customer_name)
                    new_customers += 1

                # Insert message (skip duplicates)
                try:
                    cursor.execute("""
                        INSERT OR IGNORE INTO facebook_messages 
                        (customer_id, fb_conversation_id, fb_message_id, sender_type, 
                         message_text, has_phone, extracted_phone, fb_created_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        conv_customer_id,
                        conv_id,
                        msg_id,
                        sender_type,
                        msg_text,
                        has_phone,
                        extracted,
                        msg_time,
                    ))
                    conv_messages += 1
                except sqlite3.IntegrityError:
                    pass  # Duplicate fb_message_id

            # Message pagination
            msg_paging = msg_data.get('paging', {})
            msg_url = msg_paging.get('next', '')

        total_messages += conv_messages
        processed.add(conv_id)

        # Create touchpoint for the conversation
        if conv_customer_id:
            cursor.execute("""
                INSERT OR IGNORE INTO touchpoints 
                (customer_id, channel, direction, content, occurred_at)
                VALUES (?, 'facebook_inbox', 'inbound', ?, ?)
            """, (
                conv_customer_id,
                f"Facebook conversation with {customer_name} ({conv_messages} messages)",
                conv.get('updated_time', datetime.now().isoformat()),
            ))

        # Checkpoint every 50 conversations
        if (i + 1) % 50 == 0:
            conn.commit()
            save_checkpoint(processed)
            print(f"   💾 Checkpoint at conversation {i+1}/{len(conversations)}, messages: {total_messages}")

        # Progress
        if (i + 1) % 10 == 0:
            print(f"   Processing {i+1}/{len(conversations)}... ({total_messages} messages)")

    # Final commit & checkpoint
    conn.commit()
    save_checkpoint(processed)

    # Summary
    cursor.execute("SELECT count(*) FROM facebook_messages")
    fb_total = cursor.fetchone()[0]

    cursor.execute("SELECT sender_type, count(*) FROM facebook_messages GROUP BY sender_type")
    by_sender = cursor.fetchall()

    conn.close()

    print("\n" + "=" * 60)
    print(f"📊 FACEBOOK INBOX — TỔNG KẾT:")
    print(f"   Conversations processed: {len(conversations)} (skipped {skipped} đã có)")
    print(f"   Messages imported: {total_messages}")
    print(f"   Total in DB: {fb_total}")
    print(f"   New customers found: {new_customers}")
    for sender, count in by_sender:
        print(f"   {sender}: {count} messages")
    print("=" * 60)


if __name__ == "__main__":
    main()
