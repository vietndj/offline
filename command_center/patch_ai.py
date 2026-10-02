import re

with open("/Users/vietmac/Documents/CODE/offline/command_center/scanner_daemon.py", "r") as f:
    content = f.read()

old_insert = """            # Insert into conversations
            c_local.execute("SELECT id FROM conversations WHERE contact_id=? AND created_at=? AND channel='facebook'", (contact_id, created_time))
            if not c_local.fetchone():
                c_local.execute("INSERT INTO conversations (contact_id, channel, direction, content, created_at, fb_conversation_id) VALUES (?, 'facebook', ?, ?, ?, ?)",
                               (contact_id, direction, text, created_time, conv['id']))"""

new_insert = """            # Insert into conversations
            c_local.execute("SELECT id FROM conversations WHERE contact_id=? AND created_at=? AND channel='facebook'", (contact_id, created_time))
            if not c_local.fetchone():
                d_name = sender_name.split()[-1] if sender_name else "bạn"
                if extracted_phone:
                    ai_reply = f"Chào {d_name}, em là trợ lý của anh Việt bên lớp học làm video thực chiến.\\n\\nEm thấy mình vừa để lại SĐT {extracted_phone} trên page. Không biết {d_name} có đang tiện nghe máy khoảng 2 phút không, em gọi qua tư vấn lộ trình học phù hợp nhất cho mình nhé."
                else:
                    ai_reply = f"Chào {d_name}, em là trợ lý của anh Việt. Cảm ơn {d_name} đã quan tâm đến lớp học làm video thực chiến.\\n\\nĐể hỗ trợ nhanh nhất, {d_name} vui lòng để lại số điện thoại (kèm Zalo) để bên em gọi điện tư vấn chi tiết lộ trình cho mình nhé."
                
                c_local.execute("INSERT INTO conversations (contact_id, channel, direction, content, ai_suggested_reply, created_at, fb_conversation_id) VALUES (?, 'facebook', ?, ?, ?, ?, ?)",
                               (contact_id, direction, text, ai_reply, created_time, conv['id']))"""

if old_insert in content:
    content = content.replace(old_insert, new_insert)
    with open("/Users/vietmac/Documents/CODE/offline/command_center/scanner_daemon.py", "w") as f:
        f.write(content)
    print("Success patch")
else:
    print("Failed to find insert block")
