#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FEDU Customer Hub — Analyzer: Phân tích nhu cầu & phân loại
Bước 5/6: Phân loại reason_raw, Facebook messages, tính engagement_score, 
          sinh campaign_metrics.
"""

import os
import re
import json
import sqlite3
from datetime import datetime
from collections import Counter

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fedu_customer_hub.db")


def classify_reason(text: str) -> str:
    """Phân loại lý do đăng ký bằng keyword matching."""
    if not text:
        return "other"
    text_lower = text.lower()
    
    rules = [
        (["quay", "edit", "dựng", "capcut", "premiere", "video edit", "hậu kỳ", "cắt ghép"], "learn_editing"),
        (["bán", "doanh thu", "khách", "đơn hàng", "sale", "tăng doanh", "kinh doanh", "chuyển đổi", "chốt đơn"], "revenue"),
        (["thương hiệu", "brand", "nhận diện", "định vị", "uy tín"], "branding"),
        (["viral", "view", "thuật toán", "reach", "tăng follow", "tiktok", "reel", "xu hướng", "trend"], "growth"),
        (["nội dung", "content", "ý tưởng", "kịch bản", "storytelling", "viết bài", "sáng tạo nội dung"], "content_creation"),
        (["cá nhân", "đam mê", "sở thích", "tự phát triển", "học hỏi"], "personal"),
        (["marketing", "quảng cáo", "ads", "digital", "truyền thông"], "marketing"),
    ]
    
    for keywords, category in rules:
        for kw in keywords:
            if kw in text_lower:
                return category
    return "other"


def classify_question(text: str) -> str:
    """Phân loại câu hỏi từ Facebook message."""
    if not text:
        return "general"
    text_lower = text.lower()
    
    rules = [
        (["giá", "bao nhiêu", "phí", "học phí", "chi phí", "đầu tư", "triệu", "nghìn", "vnđ", "đồng"], "pricing"),
        (["lịch", "khi nào", "ngày", "tháng", "bắt đầu", "khai giảng", "thời gian"], "schedule"),
        (["học gì", "nội dung", "chương trình", "giáo trình", "buổi học", "lesson"], "content"),
        (["ở đâu", "địa chỉ", "online", "offline", "trực tiếp", "hà nội", "sài gòn", "hcm"], "location"),
        (["đăng ký", "đăng kí", "tham gia", "đk", "register", "sign up"], "registration"),
        (["ai ", "giảng viên", "thầy", "dạy", "kinh nghiệm", "background"], "instructor"),
    ]
    
    for keywords, category in rules:
        for kw in keywords:
            if kw in text_lower:
                return category
    return "general"


def analyze_reasons(cursor):
    """Phân loại reason_raw cho tất cả customers."""
    print("\n🔍 Phân loại lý do đăng ký...")
    
    cursor.execute("SELECT id, reason_raw FROM customers WHERE reason_raw IS NOT NULL AND reason_raw != ''")
    rows = cursor.fetchall()
    
    categories = Counter()
    for cust_id, reason in rows:
        category = classify_reason(reason)
        cursor.execute("UPDATE customers SET reason_category = ? WHERE id = ?", (category, cust_id))
        categories[category] += 1
    
    print(f"   ✅ Phân loại {len(rows)} lý do:")
    for cat, count in categories.most_common():
        print(f"     {cat}: {count}")
    return categories


def analyze_facebook_messages(cursor):
    """Phân loại câu hỏi từ Facebook messages."""
    print("\n💬 Phân loại Facebook messages...")
    
    cursor.execute("SELECT id, message_text FROM facebook_messages WHERE sender_type = 'customer' AND message_text IS NOT NULL")
    rows = cursor.fetchall()
    
    types = Counter()
    for msg_id, text in rows:
        qtype = classify_question(text)
        cursor.execute("UPDATE facebook_messages SET question_type = ? WHERE id = ?", (qtype, msg_id))
        types[qtype] += 1
    
    print(f"   ✅ Phân loại {len(rows)} messages:")
    for t, count in types.most_common():
        print(f"     {t}: {count}")
    return types


def compute_engagement_scores(cursor):
    """Tính engagement_score cho mỗi customer."""
    print("\n📊 Tính engagement scores...")
    
    cursor.execute("SELECT id, stage FROM customers")
    customers = cursor.fetchall()
    
    for cust_id, stage in customers:
        score = 0
        
        # Touchpoint scores
        cursor.execute("""
            SELECT channel, direction, count(*) 
            FROM touchpoints 
            WHERE customer_id = ? 
            GROUP BY channel, direction
        """, (cust_id,))
        
        for channel, direction, count in cursor.fetchall():
            if channel == 'call':
                score += count * (3 if direction == 'inbound' else 2)
            elif channel in ('imessage', 'sms'):
                score += count * (2 if direction == 'inbound' else 1)
            elif channel == 'facebook_inbox':
                score += count * 1
            else:
                score += count * 1
        
        # Facebook message scores
        cursor.execute("SELECT count(*) FROM facebook_messages WHERE customer_id = ?", (cust_id,))
        fb_count = cursor.fetchone()[0]
        score += fb_count * 1
        
        # Stage bonus
        stage_bonus = {
            'paid': 10, 'considering': 5, 'contacted': 2, 'called': 3,
            'new': 0, 'unqualified': -2, 'postponed': 1
        }
        score += stage_bonus.get(stage, 0)
        
        cursor.execute("UPDATE customers SET engagement_score = ? WHERE id = ?", (score, cust_id))
    
    # Show top engaged
    cursor.execute("SELECT name, phone, engagement_score, stage FROM customers ORDER BY engagement_score DESC LIMIT 10")
    top = cursor.fetchall()
    
    print(f"   ✅ Scores computed for {len(customers)} customers")
    print(f"\n   Top 10 engaged:")
    for name, phone, score, stage in top:
        print(f"     {name or '?'} ({phone}): score={score}, stage={stage}")


def compute_campaign_metrics(cursor):
    """Tính campaign_metrics tổng hợp."""
    print("\n📈 Tính campaign metrics...")
    
    period = "2026-Q2-Q3"  # June - September
    
    # Total leads
    cursor.execute("SELECT count(*) FROM customers")
    total = cursor.fetchone()[0]
    
    # Source breakdown
    cursor.execute("SELECT source, count(*) FROM customers GROUP BY source ORDER BY count(*) DESC")
    sources = {row[0] or 'unknown': row[1] for row in cursor.fetchall()}
    
    # Industry breakdown
    cursor.execute("SELECT industry, count(*) FROM customers WHERE industry IS NOT NULL AND industry != '' GROUP BY industry ORDER BY count(*) DESC LIMIT 15")
    industries = {row[0]: row[1] for row in cursor.fetchall()}
    
    # Stage breakdown
    cursor.execute("SELECT stage, count(*) FROM customers GROUP BY stage ORDER BY count(*) DESC")
    stages = {row[0]: row[1] for row in cursor.fetchall()}
    
    # Reason breakdown (top pain points)
    cursor.execute("SELECT reason_category, count(*) FROM customers WHERE reason_category IS NOT NULL GROUP BY reason_category ORDER BY count(*) DESC")
    reasons = {row[0]: row[1] for row in cursor.fetchall()}
    
    # Avg touchpoints for paid customers
    cursor.execute("""
        SELECT AVG(tp_count) FROM (
            SELECT c.id, count(t.id) as tp_count 
            FROM customers c 
            LEFT JOIN touchpoints t ON c.id = t.customer_id 
            WHERE c.stage = 'paid' 
            GROUP BY c.id
        )
    """)
    avg_tp = cursor.fetchone()[0] or 0
    
    # Avg days to convert (from created_at to last touchpoint for paid)
    cursor.execute("""
        SELECT AVG(julianday(max_tp) - julianday(c.created_at)) FROM (
            SELECT t.customer_id, MAX(t.occurred_at) as max_tp 
            FROM touchpoints t 
            JOIN customers c ON t.customer_id = c.id 
            WHERE c.stage = 'paid' 
            GROUP BY t.customer_id
        ) sub
        JOIN customers c ON sub.customer_id = c.id
    """)
    avg_days = cursor.fetchone()[0] or 0
    
    # Insert
    cursor.execute("""
        INSERT INTO campaign_metrics 
        (period, total_leads, source_breakdown, industry_breakdown, stage_breakdown,
         top_pain_points, top_objections, top_reasons, 
         avg_touchpoints_to_convert, avg_days_to_convert)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        period, total, 
        json.dumps(sources, ensure_ascii=False),
        json.dumps(industries, ensure_ascii=False),
        json.dumps(stages, ensure_ascii=False),
        json.dumps(reasons, ensure_ascii=False),
        json.dumps({}, ensure_ascii=False),  # Placeholder for objections
        json.dumps(reasons, ensure_ascii=False),
        avg_tp, avg_days
    ))
    
    print(f"   ✅ Metrics computed for period: {period}")
    print(f"   Total leads: {total}")
    print(f"   Conversion rate: {stages.get('paid', 0)}/{total} = {stages.get('paid', 0)/total*100:.1f}%")
    print(f"   Avg touchpoints to convert: {avg_tp:.1f}")
    print(f"   Avg days to convert: {avg_days:.1f}")


def create_customer_insights(cursor):
    """Sinh insight cho từng customer dựa trên data tổng hợp."""
    print("\n🧠 Sinh customer insights...")
    
    cursor.execute("""
        SELECT c.id, c.name, c.reason_raw, c.reason_category, c.stage, c.industry,
               c.engagement_score
        FROM customers c
        WHERE c.reason_raw IS NOT NULL AND c.reason_raw != ''
    """)
    customers = cursor.fetchall()
    
    count = 0
    for cust_id, name, reason, category, stage, industry, score in customers:
        # Determine primary need
        primary_need = {
            'learn_editing': 'Học kỹ năng quay dựng video',
            'revenue': 'Tăng doanh thu qua video marketing',
            'branding': 'Xây dựng thương hiệu cá nhân/doanh nghiệp',
            'growth': 'Tăng trưởng kênh & viral content',
            'content_creation': 'Sáng tạo nội dung chuyên nghiệp',
            'personal': 'Phát triển bản thân & đam mê',
            'marketing': 'Marketing & quảng cáo hiệu quả',
        }.get(category, 'Tìm hiểu chung về khóa học')
        
        # Buying signals based on stage
        signals = []
        if stage == 'paid':
            signals = ['Đã thanh toán']
        elif stage == 'considering':
            signals = ['Đang cân nhắc', 'Đã hỏi thông tin chi tiết']
        elif stage == 'called':
            signals = ['Đã liên lạc qua điện thoại']
        elif stage == 'contacted':
            signals = ['Đã liên hệ']
        
        # Recommended approach
        if score >= 5 and stage not in ('paid', 'unqualified'):
            approach = 'HOT LEAD - Follow up ngay, gửi case study ngành ' + (industry or 'phù hợp')
        elif stage == 'considering':
            approach = 'Gửi testimonial, offer early-bird, tạo urgency'
        elif stage == 'new':
            approach = 'Gọi giới thiệu, hỏi nhu cầu cụ thể, gửi brochure'
        else:
            approach = 'Nurture qua content, retarget ads'
        
        # Check if insight already exists
        cursor.execute("SELECT id FROM customer_insights WHERE customer_id = ?", (cust_id,))
        if cursor.fetchone():
            continue
        
        cursor.execute("""
            INSERT INTO customer_insights 
            (customer_id, primary_need, buying_signals, recommended_approach, pain_point_category)
            VALUES (?, ?, ?, ?, ?)
        """, (
            cust_id, primary_need,
            json.dumps(signals, ensure_ascii=False),
            approach, category
        ))
        count += 1
    
    print(f"   ✅ Created {count} customer insights")


def main():
    print("=" * 60)
    print("FEDU CUSTOMER HUB — Needs Analysis & Classification")
    print("=" * 60)
    
    conn = sqlite3.connect(DB_PATH, timeout=60)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA busy_timeout=60000")
    cursor = conn.cursor()
    
    analyze_reasons(cursor)
    conn.commit()
    
    analyze_facebook_messages(cursor)
    conn.commit()
    
    compute_engagement_scores(cursor)
    conn.commit()
    
    create_customer_insights(cursor)
    conn.commit()
    
    compute_campaign_metrics(cursor)
    conn.commit()
    
    # Final verification
    cursor.execute("SELECT count(*) FROM customer_insights")
    insights = cursor.fetchone()[0]
    cursor.execute("SELECT count(*) FROM campaign_metrics")
    metrics = cursor.fetchone()[0]
    
    conn.close()
    
    print("\n" + "=" * 60)
    print(f"✅ PHÂN TÍCH HOÀN TẤT:")
    print(f"   Customer insights: {insights}")
    print(f"   Campaign metrics: {metrics} periods")
    print("=" * 60)


if __name__ == "__main__":
    main()
