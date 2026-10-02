import re

with open("/Users/vietmac/Documents/CODE/offline/command_center/scanner_daemon.py", "r") as f:
    content = f.read()

func_def = """
def guess_gender(name):
    name = str(name).strip().upper()
    parts = name.split()
    if not parts: return "chị"
    last_word = parts[-1]
    female = {"TRANG", "THU", "HOA", "LINH", "THỦY", "THUY", "HƯƠNG", "HUONG", "MAI", "PHƯƠNG", "PHUONG", "NHUNG", "YẾN", "YEN", "NGỌC", "NGOC", "THẢO", "THAO", "VY", "HÀ", "HA", "LAN", "ANH", "MY", "NGA", "QUỲNH", "QUYNH", "THANH", "TRÂM", "TRAM", "TUYẾT", "TUYET", "UYÊN", "UYEN", "VÂN", "VAN", "XUÂN", "XUAN", "LY", "HIỀN", "HIEN", "NHI", "TRINH", "THI", "HẰNG", "HANG", "LOAN", "OANH", "DIỆP", "DIEP", "GIANG", "HÂN", "HAN", "TIÊN", "TIEN", "TRÀ", "TRA", "HUYỀN", "HUYEN", "THƠ", "THO", "THUẬN"}
    male = {"HÙNG", "HUNG", "SƠN", "SON", "TÙNG", "TUNG", "LONG", "CƯỜNG", "CUONG", "TUẤN", "TUAN", "HOÀNG", "HOANG", "HẢI", "HAI", "QUANG", "DŨNG", "DUNG", "THÀNH", "THANH", "ĐỨC", "DUC", "HUY", "NAM", "PHONG", "PHÚC", "PHUC", "THẮNG", "THANG", "BÌNH", "BINH", "ĐẠT", "DAT", "HIẾU", "HIEU", "MINH", "BẢO", "BAO", "LÂM", "LAM", "SANG", "VINH", "KIÊN", "KIEN", "TÀI", "TAI", "TRỌNG", "TRONG", "TRÍ", "TRI", "VŨ", "VU", "BÁCH", "BACH", "CÔNG", "CONG", "ĐÔNG", "DONG", "HÀO", "HAO", "KHOA", "TOÀN", "TOAN", "VIỆT", "VIET"}
    if last_word in female: return "chị"
    if last_word in male: return "anh"
    if "THỊ " in name or " THỊ" in name: return "chị"
    if "VĂN " in name or " VĂN" in name: return "anh"
    return "chị"
"""

if "def guess_gender" not in content:
    content = content.replace("def alert_telegram_new_lead", func_def + "\ndef alert_telegram_new_lead")

old_ai = """                # Phát hiện đại từ
                text_lower = text.lower()
                if re.search(r'\\b(chị|c)\\b', text_lower):
                    p_khach, p_minh = "chị", "em Việt"
                elif re.search(r'\\b(anh|a)\\b', text_lower):
                    p_khach, p_minh = "anh", "em Việt"
                elif re.search(r'\\b(em|e)\\b', text_lower):
                    p_khach, p_minh = "em", "anh Việt"
                else:
                    p_khach, p_minh = "anh/chị", "em Việt"
"""

new_ai = """                # Phát hiện đại từ hoặc tự đoán
                text_lower = text.lower()
                if re.search(r'\\b(chị|c)\\b', text_lower):
                    p_khach, p_minh = "chị", "em Việt"
                elif re.search(r'\\b(anh|a)\\b', text_lower):
                    p_khach, p_minh = "anh", "em Việt"
                elif re.search(r'\\b(em|e)\\b', text_lower):
                    p_khach, p_minh = "em", "anh Việt"
                else:
                    p_khach = guess_gender(sender_name)
                    p_minh = "em Việt"
                
                # Viết hoa chữ đầu câu
                P_khach = p_khach.capitalize()
"""

# Also fix the f-strings to use P_khach where appropriate
old_ai_str1 = """                if extracted_phone:
                    ai_reply = f"Chào {p_khach} {d_name}, {p_minh} đây.\\n\\nEm thấy {p_khach} vừa để lại SĐT {extracted_phone}. {p_khach} có đang tiện máy khoảng 2 phút không, em gọi qua trao đổi thẳng vào việc xem lớp video bên em có đúng thứ {p_khach} đang cần không nhé, cho đỡ mất thời gian."
                else:
                    ai_reply = f"Chào {p_khach} {d_name}, {p_minh} đây. Cảm ơn {p_khach} đã quan tâm lớp làm video bên em nhé.\\n\\n{p_khach} cứ để lại SĐT (hoặc Zalo) ở đây, lúc nào rảnh em gọi qua trao đổi thẳng vào việc luôn cho nhanh, xem có đúng thứ {p_khach} đang cần không nhé."
"""

new_ai_str1 = """                if extracted_phone:
                    ai_reply = f"Chào {p_khach} {d_name}, {p_minh} đây.\\n\\nEm thấy {p_khach} vừa để lại SĐT {extracted_phone}. {P_khach} có đang tiện máy khoảng 2 phút không, em gọi qua trao đổi thẳng vào việc xem lớp video bên em có đúng thứ {p_khach} đang cần không nhé, cho đỡ mất thời gian."
                else:
                    ai_reply = f"Chào {p_khach} {d_name}, {p_minh} đây. Cảm ơn {p_khach} đã quan tâm lớp làm video bên em nhé.\\n\\n{P_khach} cứ để lại SĐT (hoặc Zalo) ở đây, lúc nào rảnh em gọi qua trao đổi thẳng vào việc luôn cho nhanh, xem có đúng thứ {p_khach} đang cần không nhé."
"""

if old_ai in content:
    content = content.replace(old_ai, new_ai)
    content = content.replace(old_ai_str1, new_ai_str1)
    with open("/Users/vietmac/Documents/CODE/offline/command_center/scanner_daemon.py", "w") as f:
        f.write(content)
    print("Success patch guesser")
else:
    print("Failed patch guesser")
