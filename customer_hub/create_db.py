#!/usr/bin/env python3
"""
FEDU Customer Hub — Database Schema Creator
Tạo SQLite database hợp nhất toàn bộ dữ liệu khách hàng từ 14 nguồn.
"""

import sqlite3
import os

DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DB_DIR, "fedu_customer_hub.db")


def create_database():
    """Tạo database với 5 bảng chính + indexes."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # ═══════════════════════════════════════════════
    # BẢNG 1: KHÁCH HÀNG (Hợp nhất tất cả nguồn)
    # ═══════════════════════════════════════════════
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        -- Định danh
        phone TEXT UNIQUE NOT NULL,
        name TEXT,
        email TEXT,
        -- Thông tin nghề nghiệp
        industry TEXT,
        industry_slug TEXT,
        occupation TEXT,
        business_name TEXT,
        -- Kênh liên lạc
        facebook_url TEXT,
        zalo_url TEXT,
        tiktok_url TEXT,
        -- Trạng thái pipeline
        stage TEXT DEFAULT 'new',
        class_name TEXT,
        class_date TEXT,
        -- Nguồn & Attribution
        source TEXT,
        utm_source TEXT,
        utm_medium TEXT,
        utm_campaign TEXT,
        landing_page_url TEXT,
        -- Lý do đăng ký
        reason_raw TEXT,
        reason_category TEXT,
        -- Scores
        completeness_score REAL DEFAULT 0,
        engagement_score REAL DEFAULT 0,
        -- Metadata
        tags TEXT,
        notes TEXT,
        apple_contact_synced INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now','localtime')),
        updated_at TEXT DEFAULT (datetime('now','localtime')),
        -- Tracking nguồn gốc
        source_systems TEXT
    )
    """)

    # ═══════════════════════════════════════════════
    # BẢNG 2: TOUCHPOINTS (Mọi tương tác với khách)
    # ═══════════════════════════════════════════════
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS touchpoints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        channel TEXT NOT NULL,
        direction TEXT,
        content TEXT,
        content_summary TEXT,
        duration_seconds REAL,
        attachments TEXT,
        sentiment TEXT,
        intent TEXT,
        pain_points TEXT,
        occurred_at TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now','localtime')),
        FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
    """)

    # ═══════════════════════════════════════════════
    # BẢNG 3: FACEBOOK MESSAGES (Chi tiết inbox Page)
    # ═══════════════════════════════════════════════
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS facebook_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        fb_conversation_id TEXT,
        fb_message_id TEXT UNIQUE,
        sender_type TEXT,
        message_text TEXT,
        has_phone INTEGER DEFAULT 0,
        extracted_phone TEXT,
        question_type TEXT,
        fb_created_at TEXT,
        created_at TEXT DEFAULT (datetime('now','localtime')),
        FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
    """)

    # ═══════════════════════════════════════════════
    # BẢNG 4: CUSTOMER INSIGHTS (Phân tích AI)
    # ═══════════════════════════════════════════════
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS customer_insights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        primary_need TEXT,
        objections TEXT,
        buying_signals TEXT,
        recommended_approach TEXT,
        pain_point_category TEXT,
        trigger_keyword TEXT,
        content_resonance TEXT,
        analyzed_at TEXT DEFAULT (datetime('now','localtime')),
        FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
    """)

    # ═══════════════════════════════════════════════
    # BẢNG 5: CAMPAIGN METRICS (Thống kê tổng hợp)
    # ═══════════════════════════════════════════════
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS campaign_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        period TEXT,
        total_leads INTEGER,
        source_breakdown TEXT,
        industry_breakdown TEXT,
        stage_breakdown TEXT,
        top_pain_points TEXT,
        top_objections TEXT,
        top_reasons TEXT,
        avg_touchpoints_to_convert REAL,
        avg_days_to_convert REAL,
        computed_at TEXT DEFAULT (datetime('now','localtime'))
    )
    """)

    # ═══════════════════════════════════════════════
    # INDEXES
    # ═══════════════════════════════════════════════
    indexes = [
        "CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone)",
        "CREATE INDEX IF NOT EXISTS idx_customers_stage ON customers(stage)",
        "CREATE INDEX IF NOT EXISTS idx_customers_source ON customers(source)",
        "CREATE INDEX IF NOT EXISTS idx_customers_industry ON customers(industry_slug)",
        "CREATE INDEX IF NOT EXISTS idx_touchpoints_customer ON touchpoints(customer_id)",
        "CREATE INDEX IF NOT EXISTS idx_touchpoints_channel ON touchpoints(channel)",
        "CREATE INDEX IF NOT EXISTS idx_touchpoints_occurred ON touchpoints(occurred_at)",
        "CREATE INDEX IF NOT EXISTS idx_fb_messages_conversation ON facebook_messages(fb_conversation_id)",
        "CREATE INDEX IF NOT EXISTS idx_fb_messages_customer ON facebook_messages(customer_id)",
    ]
    for idx in indexes:
        cursor.execute(idx)

    conn.commit()
    conn.close()

    print(f"✅ Database created: {DB_PATH}")
    print(f"   Size: {os.path.getsize(DB_PATH)} bytes")


if __name__ == "__main__":
    create_database()
