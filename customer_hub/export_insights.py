#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FEDU Customer Hub — Export: Actionable Insights cho Landing Page & Video
Bước 6/6: Xuất 2 file markdown insight để tối ưu landing page và kịch bản video.
"""

import os
import json
import sqlite3
from collections import Counter
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fedu_customer_hub.db")
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))


def export_landing_insights(cursor):
    """Xuất insight cho tối ưu landing page."""
    lines = []
    lines.append("# 🎯 LANDING PAGE INSIGHTS — FEDU Customer Hub")
    lines.append(f"_Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}_\n")
    
    # 1. TOP LÝ DO ĐĂNG KÝ
    lines.append("## 1. TOP LÝ DO ĐĂNG KÝ PHỔ BIẾN NHẤT\n")
    cursor.execute("""
        SELECT reason_category, count(*) as cnt 
        FROM customers 
        WHERE reason_category IS NOT NULL 
        GROUP BY reason_category 
        ORDER BY cnt DESC
    """)
    reasons = cursor.fetchall()
    
    category_labels = {
        'revenue': '💰 Tăng doanh thu/bán hàng',
        'learn_editing': '🎬 Học quay dựng video',
        'branding': '🏷️ Xây dựng thương hiệu',
        'growth': '📈 Tăng trưởng viral/views',
        'content_creation': '✍️ Sáng tạo nội dung',
        'marketing': '📣 Marketing & quảng cáo',
        'personal': '🌱 Phát triển bản thân',
        'other': '❓ Khác',
    }
    
    total_reasons = sum(r[1] for r in reasons)
    for cat, cnt in reasons:
        pct = cnt / total_reasons * 100 if total_reasons else 0
        label = category_labels.get(cat, cat)
        lines.append(f"- **{label}**: {cnt} leads ({pct:.0f}%)")
    
    lines.append("\n**→ GỢI Ý:** Copy/Headlines trên landing page nên nhấn mạnh nhóm nhu cầu lớn nhất. "
                 "Thêm case study và số liệu cụ thể cho nhóm top 3.\n")
    
    # 2. TOP LÝ DO CỤ THỂ (raw text)
    lines.append("## 2. NGUYÊN VĂN LÝ DO ĐĂNG KÝ (Top 20)\n")
    cursor.execute("""
        SELECT reason_raw, reason_category FROM customers 
        WHERE reason_raw IS NOT NULL AND reason_raw != '' 
        ORDER BY engagement_score DESC 
        LIMIT 20
    """)
    for reason, cat in cursor.fetchall():
        lines.append(f"- [{category_labels.get(cat, cat)[:5]}] _{reason}_")
    
    lines.append("\n**→ GỢI Ý:** Dùng nguyên văn khách hàng làm testimonial/headline. "
                 "Voice of Customer > copywriter.\n")
    
    # 3. TOP NGÀNH HÀNG
    lines.append("## 3. TOP NGÀNH HÀNG ĐĂNG KÝ\n")
    cursor.execute("""
        SELECT industry, count(*) as cnt 
        FROM customers 
        WHERE industry IS NOT NULL AND industry != '' 
        GROUP BY industry 
        ORDER BY cnt DESC 
        LIMIT 10
    """)
    industries = cursor.fetchall()
    for ind, cnt in industries:
        lines.append(f"- **{ind}**: {cnt} leads")
    
    lines.append("\n**→ GỢI Ý:** Thêm section \"Ai nên tham gia?\" với danh sách ngành hàng phù hợp. "
                 "Tạo landing page variant riêng cho top 3 ngành.\n")
    
    # 4. PHỄU CHUYỂN ĐỔI
    lines.append("## 4. PHỄU CHUYỂN ĐỔI\n")
    cursor.execute("SELECT stage, count(*) FROM customers GROUP BY stage ORDER BY count(*) DESC")
    stages = cursor.fetchall()
    total = sum(s[1] for s in stages)
    
    stage_labels = {
        'new': '🆕 Mới đăng ký', 'contacted': '📞 Đã liên hệ', 'called': '📱 Đã gọi',
        'considering': '🤔 Đang cân nhắc', 'paid': '✅ Đã thanh toán',
        'unqualified': '❌ Không phù hợp', 'postponed': '⏸️ Hoãn'
    }
    
    lines.append("```")
    for stage, cnt in stages:
        pct = cnt / total * 100 if total else 0
        bar = "█" * int(pct / 2)
        label = stage_labels.get(stage, stage)
        lines.append(f"{label:<25} {cnt:>4} ({pct:>5.1f}%) {bar}")
    lines.append("```")
    
    paid = next((c for s, c in stages if s == 'paid'), 0)
    lines.append(f"\n**Tỷ lệ chuyển đổi tổng: {paid}/{total} = {paid/total*100:.1f}%**")
    
    # Identify bottleneck
    new_count = next((c for s, c in stages if s == 'new'), 0)
    if new_count / total > 0.5:
        lines.append("\n> ⚠️ **BOTTLENECK**: {:.0f}% leads vẫn ở trạng thái 'Mới'. "
                     "Cần tăng tốc follow-up hoặc automate nurturing sequence.".format(new_count/total*100))
    
    # 5. KÊNH ACQUISITION
    lines.append("\n## 5. KÊNH ACQUISITION\n")
    cursor.execute("""
        SELECT source, count(*) as cnt 
        FROM customers 
        WHERE source IS NOT NULL AND source != '' 
        GROUP BY source 
        ORDER BY cnt DESC
    """)
    sources = cursor.fetchall()
    for src, cnt in sources:
        pct = cnt / total * 100 if total else 0
        lines.append(f"- **{src}**: {cnt} leads ({pct:.0f}%)")
    
    # Conversion rate per source
    lines.append("\n### Tỷ lệ chuyển đổi theo kênh:\n")
    for src, cnt in sources[:5]:
        cursor.execute("SELECT count(*) FROM customers WHERE source = ? AND stage = 'paid'", (src,))
        paid_src = cursor.fetchone()[0]
        cvr = paid_src / cnt * 100 if cnt else 0
        lines.append(f"- {src}: {paid_src}/{cnt} = **{cvr:.0f}%**")
    
    # 6. ENGAGEMENT DISTRIBUTION
    lines.append("\n## 6. KHÁCH HÀNG ENGAGEMENT CAO NHẤT\n")
    cursor.execute("""
        SELECT name, phone, industry, engagement_score, stage, reason_raw
        FROM customers 
        WHERE stage != 'paid' AND engagement_score > 0
        ORDER BY engagement_score DESC 
        LIMIT 10
    """)
    hot_leads = cursor.fetchall()
    lines.append("| Tên | SĐT | Ngành | Score | Stage | Lý do |")
    lines.append("|-----|-----|-------|-------|-------|-------|")
    for name, phone, ind, score, stage, reason in hot_leads:
        lines.append(f"| {name or '?'} | {phone} | {ind or '-'} | {score} | {stage} | {(reason or '-')[:40]} |")
    
    lines.append("\n**→ GỢI Ý:** Đây là 10 leads nóng nhất chưa convert. Priority follow-up.\n")
    
    # Write file
    filepath = os.path.join(OUTPUT_DIR, "landing_page_insights.md")
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    
    print(f"   ✅ {filepath}")
    return filepath


def export_video_insights(cursor):
    """Xuất insight cho tối ưu kịch bản video."""
    lines = []
    lines.append("# 🎬 VIDEO SCRIPT INSIGHTS — FEDU Customer Hub")
    lines.append(f"_Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}_\n")
    
    # 1. TOP NỖI ĐAU
    lines.append("## 1. TOP NỖI ĐAU KHÁCH HÀNG (cho Hook mở video)\n")
    cursor.execute("""
        SELECT reason_raw FROM customers 
        WHERE reason_raw IS NOT NULL AND reason_raw != ''
    """)
    all_reasons = [r[0] for r in cursor.fetchall()]
    
    # Extract pain points from reasons
    pain_keywords = Counter()
    pain_phrases = []
    for reason in all_reasons:
        lower = reason.lower()
        if any(w in lower for w in ['khó', 'không biết', 'chưa', 'thiếu', 'sợ', 'bị', 'mất', 'tốn', 'chán']):
            pain_phrases.append(reason)
        # Count keywords
        for word in ['khó khăn', 'không biết', 'chưa có', 'thiếu', 'sợ', 'bí ý tưởng', 'không có thời gian', 
                     'không biết bắt đầu', 'tốn tiền', 'không hiệu quả', 'không viral', 'ít view']:
            if word in lower:
                pain_keywords[word] += 1
    
    for phrase in pain_phrases[:10]:
        lines.append(f"- _{phrase}_")
    
    lines.append("\n**→ HOOK GỢI Ý:**")
    for pain, count in pain_keywords.most_common(5):
        lines.append(f'- "Bạn có đang **{pain}** khi làm video?" ({count} khách có nỗi đau này)')
    
    # 2. TOP CÂU HỎI FACEBOOK
    lines.append("\n## 2. TOP CÂU HỎI TỪ FACEBOOK INBOX\n")
    cursor.execute("""
        SELECT question_type, count(*) as cnt
        FROM facebook_messages 
        WHERE sender_type = 'customer' AND question_type IS NOT NULL
        GROUP BY question_type 
        ORDER BY cnt DESC
    """)
    fb_types = cursor.fetchall()
    
    type_labels = {
        'pricing': '💰 Hỏi giá/học phí',
        'schedule': '📅 Hỏi lịch/thời gian',
        'content': '📚 Hỏi nội dung học',
        'location': '📍 Hỏi địa điểm/hình thức',
        'registration': '✍️ Hỏi cách đăng ký',
        'instructor': '👨‍🏫 Hỏi về giảng viên',
        'general': '❓ Câu hỏi chung',
    }
    
    for qtype, cnt in fb_types:
        label = type_labels.get(qtype, qtype)
        lines.append(f"- **{label}**: {cnt} lần hỏi")
    
    lines.append("\n**→ GỢI Ý:** Trả lời top 3 câu hỏi phổ biến nhất ngay trong video. "
                 "Khách không cần phải inbox hỏi → tăng tỷ lệ đăng ký trực tiếp.\n")
    
    # 3. CÂU CHUYỆN CHUYỂN ĐỔI TIÊU BIỂU
    lines.append("## 3. KHÁCH HÀNG ĐÃ CHUYỂN ĐỔI — HÀNH TRÌNH\n")
    cursor.execute("""
        SELECT c.name, c.industry, c.reason_raw, c.engagement_score,
               count(t.id) as touchpoint_count
        FROM customers c
        LEFT JOIN touchpoints t ON c.id = t.customer_id
        WHERE c.stage = 'paid'
        GROUP BY c.id
        ORDER BY touchpoint_count DESC
        LIMIT 5
    """)
    converted = cursor.fetchall()
    
    for name, industry, reason, score, tp_count in converted:
        lines.append(f"### {name or '?'} ({industry or 'N/A'})")
        lines.append(f"- Lý do ban đầu: _{reason or 'N/A'}_")
        lines.append(f"- Touchpoints trước khi convert: **{tp_count}**")
        lines.append(f"- Engagement score: {score}")
        lines.append("")
    
    lines.append("**→ GỢI Ý:** Dùng làm kịch bản testimonial video. "
                 "Khách có nhiều touchpoints = story phong phú.\n")
    
    # 4. PHÂN TÍCH NGÀNH HÀNG CHO VIDEO TARGETING
    lines.append("## 4. NGÀNH HÀNG — GỢI Ý NỘI DUNG VIDEO THEO NGÀNH\n")
    cursor.execute("""
        SELECT industry, count(*) as cnt,
               GROUP_CONCAT(DISTINCT reason_category) as need_categories
        FROM customers 
        WHERE industry IS NOT NULL AND industry != '' 
        GROUP BY industry 
        ORDER BY cnt DESC 
        LIMIT 8
    """)
    for industry, cnt, needs in cursor.fetchall():
        lines.append(f"### {industry} ({cnt} leads)")
        lines.append(f"- Nhu cầu chính: {needs or 'chưa phân loại'}")
        lines.append(f"- **Ý tưởng video**: Case study {industry} dùng video tăng [KPI cụ thể]")
        lines.append("")
    
    # 5. THỜI ĐIỂM TƯƠNG TÁC
    lines.append("## 5. THỜI ĐIỂM TƯƠNG TÁC CAO NHẤT\n")
    cursor.execute("""
        SELECT 
            CAST(strftime('%H', occurred_at) AS INTEGER) as hour,
            count(*) as cnt
        FROM touchpoints 
        WHERE occurred_at IS NOT NULL AND occurred_at != ''
        GROUP BY hour
        ORDER BY cnt DESC
        LIMIT 10
    """)
    hours = cursor.fetchall()
    
    if hours:
        lines.append("| Giờ | Số tương tác |")
        lines.append("|-----|-------------|")
        for hour, cnt in sorted(hours, key=lambda x: x[0] if x[0] else 0):
            if hour is not None:
                lines.append(f"| {hour:02d}:00 | {cnt} |")
        
        top_hour = hours[0][0] if hours else 0
        lines.append(f"\n**→ GỢI Ý:** Đăng video lúc **{top_hour}:00** để tối đa reach. "
                     "Schedule call follow-up vào khung giờ khách active nhất.\n")
    
    # 6. SO SÁNH PAID VS UNPAID
    lines.append("## 6. SO SÁNH KHÁCH PAID vs CHƯA PAID\n")
    for stage_group, label in [('paid', '✅ Đã thanh toán'), ('new', '🆕 Chưa convert')]:
        cursor.execute(f"""
            SELECT reason_category, count(*) FROM customers 
            WHERE stage = ? AND reason_category IS NOT NULL 
            GROUP BY reason_category ORDER BY count(*) DESC LIMIT 3
        """, (stage_group,))
        top3 = cursor.fetchall()
        lines.append(f"**{label}** — Top nhu cầu:")
        for cat, cnt in top3:
            lines.append(f"  - {cat}: {cnt}")
        lines.append("")
    
    lines.append("**→ GỢI Ý:** So sánh để tìm 'trigger keywords' — từ khóa nào xuất hiện ở paid "
                 "nhưng không có ở unpaid → đó là selling point mạnh nhất.\n")
    
    # Write file
    filepath = os.path.join(OUTPUT_DIR, "video_script_insights.md")
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    
    print(f"   ✅ {filepath}")
    return filepath


def main():
    print("=" * 60)
    print("FEDU CUSTOMER HUB — Export Actionable Insights")
    print("=" * 60)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print("\n📄 Xuất Landing Page Insights...")
    lp_path = export_landing_insights(cursor)
    
    print("\n🎬 Xuất Video Script Insights...")
    vs_path = export_video_insights(cursor)
    
    conn.close()
    
    print("\n" + "=" * 60)
    print(f"✅ ĐÃ XUẤT 2 FILE INSIGHT:")
    print(f"   1. {lp_path}")
    print(f"   2. {vs_path}")
    print("=" * 60)


if __name__ == "__main__":
    main()
