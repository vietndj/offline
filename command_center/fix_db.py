import sqlite3

conn = sqlite3.connect('/Users/vietmac/Documents/CODE/offline/command_center/fedu_command.db')
c = conn.cursor()

c.execute("SELECT conv.id, c.name, c.phone FROM conversations conv JOIN contacts c ON conv.contact_id = c.id WHERE conv.ai_suggested_reply IS NULL")
rows = c.fetchall()

for r in rows:
    conv_id, name, phone = r
    d_name = name.split()[-1] if name else "bạn"
    if phone and not str(phone).startswith('FB_'):
        ai_reply = f"Chào {d_name}, em là trợ lý của anh Việt bên lớp học làm video thực chiến.\n\nEm thấy mình vừa để lại SĐT {phone} trên page. Không biết {d_name} có đang tiện nghe máy khoảng 2 phút không, em gọi qua tư vấn lộ trình học phù hợp nhất cho mình nhé."
    else:
        ai_reply = f"Chào {d_name}, em là trợ lý của anh Việt. Cảm ơn {d_name} đã quan tâm đến lớp học làm video thực chiến.\n\nĐể hỗ trợ nhanh nhất, {d_name} vui lòng để lại số điện thoại (kèm Zalo) để bên em gọi điện tư vấn chi tiết lộ trình cho mình nhé."
    
    c.execute("UPDATE conversations SET ai_suggested_reply=? WHERE id=?", (ai_reply, conv_id))

conn.commit()
conn.close()
print("Fixed DB")
