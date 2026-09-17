#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script đóng gói và bắn danh sách Lead đã gọi (nhỡ hoặc chưa chốt) sang Alert Bot Telegram
kèm theo đầy đủ bối cảnh, nghề nghiệp, lịch sử đàm thoại và gợi ý xử lý trên đường đi.
"""

import os
import sys
import html

OFFLINE_DIR = "/Users/vietmac/Documents/CODE/offline"
RADAR_DIR = os.path.join(OFFLINE_DIR, "telesale_radar")
QUAN_GIA_DIR = "/Users/vietmac/Documents/CODE/Quản gia"

if RADAR_DIR not in sys.path:
    sys.path.append(RADAR_DIR)
if QUAN_GIA_DIR not in sys.path:
    sys.path.append(QUAN_GIA_DIR)

import telesale_engine as engine
import telegram_notify as notify

HUB_URL = "https://scheme-prominent-warehouse-catalyst.trycloudflare.com"

def esc(text: str) -> str:
    return html.escape(str(text or "").strip())

def main():
    leads = engine.aggregate_all_leads()

    # Nhóm 1: Top chốt nóng (Hot closers: Nguyễn Hữu Chiến, Nguyễn Trường Duy, Mai Spa, Ngân Gia Huy, Hồng Vân)
    hot_phones = ["0839666685", "0982529837", "0789122166", "0943490349", "0948310388"]

    # Nhóm loại / không gọi (Unqualified / Stopped)
    unqualified_phones = ["0978268594", "0932372888", "0358585851", "0966072234"]

    # Test phone
    test_phones = ["0982492003"]

    hot_leads = []
    missed_leads = []
    considering_leads = []
    unqualified_leads = []

    for l in leads:
        phone = l["phone"]
        if phone in test_phones or l["status"] == "paid":
            continue

        c = l.get("call_info", {})
        if c.get("total_calls", 0) <= 0:
            continue

        dur = c.get("last_call_duration", 0)

        if phone in unqualified_phones or l["status"] == "unqualified":
            unqualified_leads.append(l)
        elif phone in hot_phones:
            hot_leads.append(l)
        elif dur == 0 or "nhỡ" in l.get("note", "").lower() or "thuê bao" in l.get("note", "").lower():
            missed_leads.append(l)
        else:
            considering_leads.append(l)

    # Sắp xếp hot leads theo thứ tự ưu tiên
    hot_leads.sort(key=lambda x: hot_phones.index(x["phone"]) if x["phone"] in hot_phones else 99)

    print(f"📊 Thống kê: Hot: {len(hot_leads)} | Nhỡ: {len(missed_leads)} | Cân nhắc: {len(considering_leads)} | Đã dừng: {len(unqualified_leads)}")

    # -------------------------------------------------------------------------
    # MESSAGE 1: TOP CHỐT NÓNG TRÊN ĐƯỜNG (Ưu tiên số 1)
    # -------------------------------------------------------------------------
    msg1_lines = [
        "🔥 <b>[FEDU OFFLINE 3] TOP 5 LEAD CẦN CHỐT NÓNG TRÊN ĐƯỜNG</b>",
        f"🌐 <i>LED Hub Online:</i> <a href=\"{HUB_URL}\">Mở Bàn Gọi iPhone</a>",
        "─────────────────────────",
        "<i>(Đã đồng bộ Apple Contacts <b>offline3 - [Tên]</b>. Bấm vào SĐT để gọi ngay)</i>\n"
    ]

    for idx, l in enumerate(hot_leads, 1):
        name = esc(l["name"])
        phone = l["phone"]
        occ = esc(l.get("occupation") or "Chưa điền")
        c = l.get("call_info", {})
        last_call = esc(c.get("last_call_formatted") or "")
        last_time = esc(c.get("last_call_time") or "")

        context = ""
        suggestion = ""
        if phone == "0839666685":
            context = "Đàm thoại sâu 7m39s chiều qua (14/09). Anh Chiến mảng BĐS rất ưng lộ trình, chuẩn bị chuyển cọc 3.000.000đ."
            suggestion = "<i>'Chào anh Chiến, em Việt đây ạ. Hôm qua em trao đổi lộ trình lớp 19-20/09, anh Chiến đã chuyển cọc giữ chỗ chưa để em chốt danh sách hội trường cho anh nhé?'</i>"
        elif phone == "0982529837":
            context = "Đàm thoại 7m28s (11/09) & 39s (14/09). Mục đích xây kênh cá nhân trải nghiệm, rất ưng, đã gửi thông tin Aeon Long Biên & QR cọc 3tr."
            suggestion = "<i>'Chào anh Duy, em Việt đây ạ. Đợt này lớp 19-20/09 ở Aeon Long Biên em đang chốt danh sách học viên chính thức để gửi tài liệu trước, anh Duy vào cọc để em hoàn thiện danh sách nhé.'</i>"
        elif phone == "0789122166":
            context = "Đàm thoại sâu 12m28s rất thích, đã gửi QR cọc 3tr trên Zalo. Chiều qua 14/09 gọi lại bị nhỡ/bận."
            suggestion = "<i>'Chào chị Mai, em Việt đây ạ. Hôm qua em gọi thấy chị đang bận làm khách. Chị Mai đã bố trí được công việc ở spa cuối tuần này 19-20/09 để qua lớp thực chiến chưa ạ?'</i>"
        elif phone == "0943490349":
            context = "Chủ trường mầm non (Huy là tên con), đàm thoại 2m9s + 11s chiều qua. Định cho GV trong trường đi học, đã báo giảm 10% (còn 2tr7). Hẹn hôm nay (15/09) báo lại."
            suggestion = "<i>'Chào chị Ngân, em Việt đây ạ. Hôm qua chị hẹn hôm nay chốt lại xem cô giáo ở trường có sắp xếp được lịch 2 ngày 19-20/09 đi học không, em gọi xem chị đã chốt người đi chưa ạ?'</i>"
        elif phone == "0948310388":
            context = "Vừa đàm thoại 3m38s sáng nay (15/09 10:59). Đăng ký trực tiếp web."
            suggestion = "<i>'Chào chị Vân, em Việt đây ạ. Sáng nay trao đổi xong, chị Vân đã chuyển khoản cọc để em ghi nhận chỗ ngồi lớp 19-20/09 chưa ạ?'</i>"

        item_text = (
            f"<b>{idx}. {name}</b> (Ngành: {occ})\n"
            f"📞 <b>SĐT:</b> <code>{phone}</code> | <a href=\"https://offline.fedu.vn/zalo?phone={phone}\">Mở Zalo</a>\n"
            f"⏱️ <i>Lần gọi cuối:</i> {last_call} ({last_time})\n"
            f"📍 <b>Bối cảnh:</b> {context}\n"
            f"👉 <b>Gợi ý gọi trên đường:</b> {suggestion}\n"
        )
        msg1_lines.append(item_text)

    msg1 = "\n".join(msg1_lines)

    # -------------------------------------------------------------------------
    # MESSAGE 2: CUỘC GỌI NHỠ / THUÊ BAO CẦN GỌI LẠI TRÊN ĐƯỜNG
    # -------------------------------------------------------------------------
    msg2_lines = [
        "📵 <b>[FEDU OFFLINE 3] DANH SÁCH CUỘC GỌI NHỠ / THUÊ BAO CẦN GỌI LẠI</b>",
        "─────────────────────────\n",
        "🔴 <b>NHÓM 1: GỌI NHỠ HÔM QUA & SÁNG NAY (14 - 15/09):</b>"
    ]

    recent_missed = []
    older_missed = []
    for l in missed_leads:
        last_t = l.get("call_info", {}).get("last_call_time") or ""
        if "15/09" in last_t or "14/09" in last_t:
            recent_missed.append(l)
        else:
            older_missed.append(l)

    for idx, l in enumerate(recent_missed, 1):
        name = esc(l["name"])
        phone = l["phone"]
        occ = esc(l.get("occupation") or "Chưa điền")
        c = l.get("call_info", {})
        last_time = esc(c.get("last_call_time") or "")
        note = esc(l.get("note") or "")

        ctx = ""
        if phone == "0832126789":
            ctx = "KD Phân bón. Sáng nay 09:44 gọi nhỡ. Trước đó đàm thoại 3m21s nhóm học kịch bản bán phân bón, chiều qua báo team chưa về đủ."
        elif phone == "0898889090":
            ctx = "Thời trang online, làm video bán hàng. Chiều qua gọi nhỡ lúc 15:27, đang xem sắp xếp lịch."
        elif phone == "0767276677":
            ctx = "Luật sư xây kênh. Chiều qua gọi nhỡ 15:22. Đang ở Đà Nẵng, cân nhắc lịch gần Aeon Long Biên. Đã gửi Fanpage."
        elif phone == "0988578228":
            ctx = "Giáo viên. Gọi nhỡ trưa qua 13:41."
        elif phone == "0988978886":
            ctx = "BĐS. Chiều qua gọi nhỡ 14:40, trước đó 11/09 đã hẹn gọi lại."
        elif phone == "0963983566":
            ctx = "BĐS. Chiều qua gọi nhỡ 17:37 (2 cuộc). Sale đã TV trước đó."
        elif phone == "0936423998":
            ctx = "Chiều qua gọi nhỡ 15:29. Trước đó ngày 11/09 gọi 15s đang bận."
        elif phone == "0855855688":
            ctx = "Kinh doanh. Gọi nhỡ chiều qua 15:34. Đã gửi chi tiết qua Zalo hôm 13/09."
        else:
            ctx = note[:90]

        msg2_lines.append(
            f"<b>{idx}. {name}</b> ({occ})\n"
            f"📞 <code>{phone}</code> | <a href=\"https://offline.fedu.vn/zalo?phone={phone}\">Zalo</a> | Nhỡ: {last_time}\n"
            f"📍 {ctx}\n"
        )

    msg2_lines.append("\n🟡 <b>NHÓM 2: GỌI NHỠ / THUÊ BAO ĐỢT TRƯỚC (10 - 11/09):</b>")
    for idx, l in enumerate(older_missed, len(recent_missed) + 1):
        name = esc(l["name"])
        phone = l["phone"]
        occ = esc(l.get("occupation") or "Chưa điền")
        c = l.get("call_info", {})
        last_time = esc(c.get("last_call_time") or "")
        note = esc(l.get("note") or "")

        ctx = ""
        if phone == "0925513636":
            ctx = "Chủ nhà hàng. Gọi thuê bao 10/09, đã gửi tin nhắn Zalo + SMS + Email."
        elif phone == "0986293296":
            ctx = "Kiến trúc sư. Gọi nhỡ 10/09 15:00. Sale đã TV."
        elif phone == "0348662298":
            ctx = "Spa. Gọi nhỡ 10/09 22:04."
        elif phone == "0969863488":
            ctx = "Giảng viên. Thuê bao 10/09 14:51. Nhu cầu tiết kiệm chi phí thuê quay."
        elif phone == "0978161211":
            ctx = "Nấu ăn / Ẩm thực. Gọi nhỡ 11/09 17:13."
        elif phone == "0349615871":
            ctx = "Nội trợ. Gọi báo thuê bao 10/09 20:41."
        elif phone == "0356105104":
            ctx = "Gọi nhỡ 10/09 21:52."
        else:
            ctx = note[:80]

        msg2_lines.append(
            f"<b>{idx}. {name}</b> ({occ}) - <code>{phone}</code> | {last_time}\n"
            f"📍 {ctx}\n"
        )

    msg2 = "\n".join(msg2_lines)

    # -------------------------------------------------------------------------
    # MESSAGE 3: ĐÃ ĐÀM THOẠI - ĐANG CÂN NHẮC / LĂN TĂN LỊCH / THỜI GIAN
    # -------------------------------------------------------------------------
    msg3_lines = [
        "⏳ <b>[FEDU OFFLINE 3] ĐÃ ĐÀM THOẠI - ĐANG CÂN NHẮC / CHĂM SÓC THÊM</b>",
        "─────────────────────────\n"
    ]

    for idx, l in enumerate(considering_leads, 1):
        name = esc(l["name"])
        phone = l["phone"]
        occ = esc(l.get("occupation") or "Chưa điền")
        c = l.get("call_info", {})
        last_call = esc(c.get("last_call_formatted") or "")
        last_time = esc(c.get("last_call_time") or "")
        note = esc(l.get("note") or "")

        ctx = ""
        if phone == "0969468186":
            ctx = "Bảo hiểm nhân thọ. Đàm thoại 1m9s chiều qua (14/09). Nối tiếp về cách làm video bảo hiểm chạm cảm xúc."
        elif phone == "0327288139":
            ctx = "Làm xe máy. Đàm thoại 1m14s chiều qua (14/09), trước đó trao đổi 5m. Muốn xây kênh YouTube bán xe máy."
        elif phone == "0932695566":
            ctx = "Nội trợ (SN 1969). Đàm thoại sâu 11m30s hôm 10/09. Rất tiềm năng, lăn tăn tuổi tác sợ không theo kịp."
        elif phone == "0335156521":
            ctx = "Giáo viên tiểu học. Đã trao đổi 6m hôm 11/09, gọi lại đang bận họp. Chưa biết đi được không."
        elif phone == "0989188467":
            ctx = "Coach. Đàm thoại 6m hôm 11/09 (rủ bạn). Chiều qua gọi lại 11s báo bận. Nhu cầu trung bình."
        elif phone == "0921888586":
            ctx = "Nhà báo. Đàm thoại 3m13s + 2m4s chiều qua. Kêu nhà ở Cầu Diễn xa địa điểm Aeon Mall Long Biên."
        elif phone == "0905891899":
            ctx = "Tattoo artist ở tỉnh. Đàm thoại 2m24s hôm 10/09. Giọng rụt rè, băn khoăn chi phí."
        elif phone == "0988885835":
            ctx = "BĐS. Đàm thoại 2m35s hôm 11/09, chiều qua gọi lại 26s báo bận việc K3 không đi được."
        elif phone == "0902996666":
            ctx = "Beauty. Đàm thoại 19s chiều qua. Bận K3, hẹn K4 hoặc lớp Offline Sài Gòn."
        elif phone == "0968242848":
            ctx = "Xuất khẩu lao động. Đàm thoại 33s hôm 10/09. Sale đã TV."
        elif phone == "0936399755":
            ctx = "BĐS. Đàm thoại 23s hôm 10/09. Sale đã TV."
        elif phone == "0913083995":
            ctx = "Kinh doanh tự do. Đàm thoại 30s hôm 14/09."
        elif phone == "0973199899":
            ctx = "Nv văn phòng. Đàm thoại 25s hôm 11/09. Tư vấn đã gọi."
        elif phone == "0935683131":
            ctx = "Xây kênh cá nhân. Đàm thoại 4m36s hôm 09/09."
        else:
            ctx = note[:80]

        msg3_lines.append(
            f"<b>{idx}. {name}</b> ({occ})\n"
            f"📞 <code>{phone}</code> | {last_call} ({last_time}) | <a href=\"https://offline.fedu.vn/zalo?phone={phone}\">Zalo</a>\n"
            f"📍 {ctx}\n"
        )

    msg3_lines.append("\n🚫 <b>CÁC CA ĐÃ DỪNG / LỌC KHO (KHÔNG CẦN GỌI TRÊN ĐƯỜNG):</b>")
    msg3_lines.append("• <b>Nguyễn Thị Kim Oanh</b> (0978268594) - Sai tệp (chỉ làm Video AI).")
    msg3_lines.append("• <b>Nguyễn Thị Thanh Hoa</b> (0932372888) - Báo giá xong thoái thác, né chi phí.")
    msg3_lines.append("• <b>Đặng Hồng Châu</b> (0358585851) - Sale đã dừng gọi.")
    msg3_lines.append("• <b>Lâm Trà My</b> (0966072234) - Không đủ kinh phí offline, chuyển Skool Online.")

    msg3 = "\n".join(msg3_lines)

    # GỬI QUA ALERT BOT TELEGRAM
    print("\n🚀 Đang gửi Tin nhắn 1 (Top Chốt Nóng)...")
    ok1 = notify.send_message(msg1, bot_name="alert", force=True)
    print(f"Kết quả 1: {ok1}")

    print("\n🚀 Đang gửi Tin nhắn 2 (Cuộc gọi nhỡ / Thuê bao)...")
    ok2 = notify.send_message(msg2, bot_name="alert", force=True)
    print(f"Kết quả 2: {ok2}")

    print("\n🚀 Đang gửi Tin nhắn 3 (Cân nhắc / Chăm sóc)...")
    ok3 = notify.send_message(msg3, bot_name="alert", force=True)
    print(f"Kết quả 3: {ok3}")

    print("\n🎉 Hoàn thành gửi 3 tin nhắn sang Alert Bot Telegram!")

if __name__ == "__main__":
    main()
