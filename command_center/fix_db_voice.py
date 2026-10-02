import sqlite3

conn = sqlite3.connect('/Users/vietmac/Documents/CODE/offline/command_center/fedu_command.db')
c = conn.cursor()

c.execute("SELECT conv.id, c.name, c.phone FROM conversations conv JOIN contacts c ON conv.contact_id = c.id")
rows = c.fetchall()

for r in rows:
    conv_id, name, phone = r
    d_name = name.split()[-1] if name else "bạn"
    if phone and not str(phone).startswith('FB_'):
        ai_reply = f"Chào {d_name}, Việt đây.\n\nMình thấy bạn vừa để lại SĐT {phone}. Bạn có đang tiện máy khoảng 2 phút không, mình gọi qua trao đổi thẳng vào việc xem lớp video bên mình có đúng thứ bạn đang cần không nhé, cho đỡ mất thời gian của nhau."
    else:
        ai_reply = f"Chào {d_name}, Việt đây. Cảm ơn bạn đã quan tâm lớp làm video bên mình nhé.\n\n{d_name} cứ để lại SĐT (hoặc Zalo) ở đây, lúc nào rảnh mình gọi qua trao đổi thẳng vào việc luôn cho nhanh, xem có đúng thứ bạn đang cần không nhé."
    
    c.execute("UPDATE conversations SET ai_suggested_reply=? WHERE id=?", (ai_reply, conv_id))

conn.commit()
conn.close()
print("Fixed DB voice")
