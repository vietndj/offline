#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FEDU Customer Hub — Hub Sync Module
Module trung tâm để các hệ thống khác (scanner_daemon, telesale_server) 
gọi khi có thay đổi → sync vào fedu_customer_hub.db + STU Hub + Telegram context.
"""

import os
import re
import json
import sqlite3
from datetime import datetime, timezone, timedelta

DB_PATH = '/Users/vietmac/Documents/CODE/offline/customer_hub/fedu_customer_hub.db'
STU_JSON = '/Users/vietmac/Documents/CODE/stu.fedu.vn/students.json'
STU_JSON_ALT = '/Users/vietmac/Documents/CODE/facebook, skool/students.json'

VN_TZ = timezone(timedelta(hours=7))


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
    return cleaned if len(cleaned) >= 9 else ""


def get_db():
    """Get database connection with WAL mode."""
    conn = sqlite3.connect(DB_PATH, timeout=60)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA busy_timeout=60000")
    conn.row_factory = sqlite3.Row
    return conn


def sync_new_lead(phone: str, name: str = "", source: str = "facebook_inbox",
                  industry: str = "", reason: str = "", email: str = "",
                  facebook_url: str = "", message_text: str = "") -> dict:
    """
    Sync lead mới vào Hub DB + tạo context card.
    Gọi từ scanner_daemon.py khi phát hiện SĐT mới.
    Returns: context dict với thông tin tổng hợp.
    """
    phone = normalize_phone(phone)
    if not phone:
        return {"error": "Invalid phone"}

    conn = get_db()
    cursor = conn.cursor()
    now = datetime.now(VN_TZ).isoformat()

    # Check existing
    cursor.execute("SELECT * FROM customers WHERE phone = ?", (phone,))
    existing = cursor.fetchone()

    if existing:
        # Update if needed
        customer_id = existing['id']
        updates = {}
        if name and not existing['name']:
            updates['name'] = name
        if facebook_url and not existing['facebook_url']:
            updates['facebook_url'] = facebook_url
        if industry and not existing['industry']:
            updates['industry'] = industry

        if updates:
            # Append source
            sources = json.loads(existing['source_systems'] or '[]')
            if source not in sources:
                sources.append(source)
            updates['source_systems'] = json.dumps(sources, ensure_ascii=False)
            updates['updated_at'] = now

            set_clause = ', '.join(f"{k} = ?" for k in updates.keys())
            cursor.execute(f"UPDATE customers SET {set_clause} WHERE id = ?",
                           list(updates.values()) + [customer_id])
    else:
        # Insert new
        cursor.execute("""
            INSERT INTO customers (phone, name, source, industry, email, facebook_url,
                                   reason_raw, stage, source_systems, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?)
        """, (phone, name, source, industry, email, facebook_url,
              reason, json.dumps([source], ensure_ascii=False), now, now))
        customer_id = cursor.lastrowid

    # Add touchpoint
    if message_text:
        cursor.execute("""
            INSERT INTO touchpoints (customer_id, channel, direction, content, occurred_at)
            VALUES (?, ?, 'inbound', ?, ?)
        """, (customer_id, source, message_text, now))

    conn.commit()

    # Build context card
    context = build_context_card(cursor, customer_id, phone)
    conn.close()

    return context


def build_context_card(cursor, customer_id: int, phone: str) -> dict:
    """Tạo context card tổng hợp cho lead."""
    cursor.execute("SELECT * FROM customers WHERE id = ?", (customer_id,))
    cust = cursor.fetchone()
    if not cust:
        return {"phone": phone, "error": "Not found"}

    # Count touchpoints
    cursor.execute("""
        SELECT channel, count(*) as cnt, 
               SUM(CASE WHEN direction='inbound' THEN 1 ELSE 0 END) as inbound,
               SUM(CASE WHEN direction='outbound' THEN 1 ELSE 0 END) as outbound
        FROM touchpoints WHERE customer_id = ?
        GROUP BY channel
    """, (customer_id,))
    touchpoints = {row['channel']: {
        'total': row['cnt'], 'in': row['inbound'], 'out': row['outbound']
    } for row in cursor.fetchall()}

    # Count FB messages
    cursor.execute("SELECT count(*) FROM facebook_messages WHERE customer_id = ?", (customer_id,))
    fb_count = cursor.fetchone()[0]

    # Get insights
    cursor.execute("SELECT * FROM customer_insights WHERE customer_id = ? ORDER BY analyzed_at DESC LIMIT 1",
                   (customer_id,))
    insight = cursor.fetchone()

    # Build context
    context = {
        "phone": cust['phone'],
        "name": cust['name'] or "Chưa rõ tên",
        "industry": cust['industry'] or "Chưa rõ ngành",
        "occupation": cust['occupation'] or "",
        "stage": cust['stage'],
        "class_name": cust['class_name'] or "",
        "source": cust['source'] or "",
        "reason": cust['reason_raw'] or "Chưa rõ lý do",
        "engagement_score": cust['engagement_score'] or 0,
        "touchpoints": touchpoints,
        "fb_messages": fb_count,
        "sources": json.loads(cust['source_systems'] or '[]'),
        "created_at": cust['created_at'],
        "notes": cust['notes'] or "",
        "tags": cust['tags'] or "",
    }

    if insight:
        context["primary_need"] = insight['primary_need'] or ""
        context["recommended_approach"] = insight['recommended_approach'] or ""
        context["buying_signals"] = insight['buying_signals'] or ""

    return context


def format_telegram_context(ctx: dict) -> str:
    """Format context card cho Telegram message."""
    lines = []
    lines.append(f"🆕 LEAD MỚI TỪ FACEBOOK")
    lines.append(f"━━━━━━━━━━━━━━━━━━━━")
    lines.append(f"👤 {ctx['name']}")
    lines.append(f"📱 {ctx['phone']}")

    if ctx.get('industry'):
        lines.append(f"🏢 Ngành: {ctx['industry']}")
    if ctx.get('reason') and ctx['reason'] != "Chưa rõ lý do":
        lines.append(f"💡 Lý do: {ctx['reason']}")

    # Touchpoint summary
    tp = ctx.get('touchpoints', {})
    if tp:
        lines.append(f"\n📊 LỊCH SỬ TƯƠNG TÁC:")
        for channel, data in tp.items():
            lines.append(f"  • {channel}: {data['total']} lần ({data['in']} in / {data['out']} out)")

    if ctx.get('fb_messages', 0) > 0:
        lines.append(f"  • Facebook: {ctx['fb_messages']} tin nhắn")

    # Sources
    lines.append(f"\n📌 Nguồn: {', '.join(ctx.get('sources', []))}")

    # AI recommendation
    if ctx.get('recommended_approach'):
        lines.append(f"\n🤖 GỢI Ý TƯ VẤN:")
        lines.append(f"  {ctx['recommended_approach']}")

    if ctx.get('primary_need'):
        lines.append(f"  Nhu cầu chính: {ctx['primary_need']}")

    lines.append(f"\n⏰ {ctx.get('created_at', '')}")

    return '\n'.join(lines)


def sync_to_stu(phone: str, stage: str = "", name: str = "",
                class_name: str = "", industry: str = "", **kwargs):
    """
    Sync lead vào STU Hub (students.json) khi stage = paid hoặc enrolled.
    Gọi từ telesale_server.py khi update lead status.
    """
    phone = normalize_phone(phone)
    if not phone:
        return

    # Only sync to STU for paid/enrolled students
    if stage not in ('paid', 'enrolled'):
        return

    stu_path = STU_JSON if os.path.exists(STU_JSON) else STU_JSON_ALT
    if not os.path.exists(stu_path):
        return

    with open(stu_path, 'r', encoding='utf-8') as f:
        students = json.load(f)

    # Check if already exists
    for stu in students:
        if normalize_phone(stu.get('phone', '')) == phone:
            # Update existing
            if name:
                stu['name'] = name
            if class_name:
                stu['class'] = class_name
            if industry:
                stu['industry'] = industry
            stu['updated_at'] = datetime.now(VN_TZ).isoformat()
            stu['last_updated_vn'] = datetime.now(VN_TZ).strftime('%d/%m/%Y %H:%M')
            break
    else:
        # Add new student
        new_stu = {
            "id": len(students) + 1,
            "name": name or "Chưa rõ",
            "class": class_name or "Offline 3",
            "industry": industry or "",
            "industry_slug": "",
            "avatar_url": "",
            "phone": phone,
            "zalo_url": "",
            "facebook_url": kwargs.get('facebook_url', ''),
            "reference_channels": [],
            "videos": [],
            "consultations": [],
            "notes": kwargs.get('notes', ''),
            "contact_source": kwargs.get('source', 'led_hub'),
            "created_at": datetime.now(VN_TZ).isoformat(),
            "updated_at": datetime.now(VN_TZ).isoformat(),
            "last_updated_vn": datetime.now(VN_TZ).strftime('%d/%m/%Y %H:%M'),
            "completeness_score": 30,
            "health_status": "missing_data",
            "missing_items": ["avatar", "videos", "zalo"]
        }
        students.append(new_stu)

    with open(stu_path, 'w', encoding='utf-8') as f:
        json.dump(students, f, ensure_ascii=False, indent=2)


def sync_lead_update(phone: str, status: str = "", note: str = "",
                     tags: list = None, name: str = "", **kwargs):
    """
    Sync thay đổi từ LED Hub (Nhi/anh Việt) vào Hub DB.
    Gọi từ telesale_server.py trong update_lead().
    """
    phone = normalize_phone(phone)
    if not phone:
        return

    conn = get_db()
    cursor = conn.cursor()
    now = datetime.now(VN_TZ).isoformat()

    cursor.execute("SELECT id, source_systems FROM customers WHERE phone = ?", (phone,))
    row = cursor.fetchone()

    if row:
        updates = {'updated_at': now}
        if status:
            updates['stage'] = status
        if note:
            updates['notes'] = note
        if name:
            updates['name'] = name
        if tags is not None:
            updates['tags'] = json.dumps(tags, ensure_ascii=False)

        # Append led_hub source
        sources = json.loads(row['source_systems'] or '[]')
        if 'led_hub' not in sources:
            sources.append('led_hub')
            updates['source_systems'] = json.dumps(sources, ensure_ascii=False)

        set_clause = ', '.join(f"{k} = ?" for k in updates.keys())
        cursor.execute(f"UPDATE customers SET {set_clause} WHERE id = ?",
                       list(updates.values()) + [row['id']])
    else:
        # New lead from LED Hub
        cursor.execute("""
            INSERT INTO customers (phone, name, stage, notes, tags, source, source_systems, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 'led_hub', '["led_hub"]', ?, ?)
        """, (phone, name, status or 'new', note,
              json.dumps(tags or [], ensure_ascii=False), now, now))

    conn.commit()
    conn.close()

    # If stage changed to paid → sync to STU
    if status in ('paid', 'enrolled'):
        sync_to_stu(phone, status, name, kwargs.get('class_name', ''),
                    kwargs.get('industry', ''), **kwargs)
