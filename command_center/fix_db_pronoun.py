import sqlite3
import re

conn = sqlite3.connect('/Users/vietmac/Documents/CODE/offline/command_center/fedu_command.db')
c = conn.cursor()

c.execute("SELECT conv.id, c.name, c.phone, conv.content FROM conversations conv JOIN contacts c ON conv.contact_id = c.id")
rows = c.fetchall()

for r in rows:
    conv_id, name, phone, text = r
    d_name = name.split()[-1] if name else "bạn"
    
    text_lower = (text or "").lower()
    if re.search(r'\b(chị|c)\b', text_lower):
        p_khach, p_minh = "chị", "em Việt"
    elif re.search(r'\b(anh|a)\b', text_lower):
        p_khach, p_minh = "anh", "em Việt"
    elif re.search(r'\b(em|e)\b', text_lower):
        p_khach, p_minh = "em", "anh Việt"
    else:
        p_khach, p_minh = "anh/chị", "em Việt"

    if phone and not str(phone).startswith('FB_'):
        ai_reply = f"Chào {p_khach} {d_name}, {p_minh} đây.\n\nEm thấy {p_khach} vừa để lại SĐT {phone}. {p_khach} có đang tiện máy khoảng 2 phút không, em gọi qua trao đổi thẳng vào việc xem lớp video bên em có đúng thứ {p_khach} đang cần không nhé, cho đỡ mất thời gian."
    else:
        ai_reply = f"Chào {p_khach} {d_name}, {p_minh} đây. Cảm ơn {p_khach} đã quan tâm lớp làm video bên em nhé.\n\n{p_khach} cứ để lại SĐT (hoặc Zalo) ở đây, lúc nào rảnh em gọi qua trao đổi thẳng vào việc luôn cho nhanh, xem có đúng thứ {p_khach} đang cần không nhé."
    
    if p_minh == "anh Việt":
        ai_reply = ai_reply.replace(" em ", " anh ").replace("Em thấy", "Anh thấy")

    c.execute("UPDATE conversations SET ai_suggested_reply=? WHERE id=?", (ai_reply, conv_id))

conn.commit()
conn.close()
print("Fixed DB pronoun")
