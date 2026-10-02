with open("/Users/vietmac/Documents/CODE/offline/command_center/scanner_daemon.py", "r") as f:
    content = f.read()

old_ai = """                if extracted_phone:
                    ai_reply = f"Chào {d_name}, em là trợ lý của anh Việt bên lớp học làm video thực chiến.\\n\\nEm thấy mình vừa để lại SĐT {extracted_phone} trên page. Không biết {d_name} có đang tiện nghe máy khoảng 2 phút không, em gọi qua tư vấn lộ trình học phù hợp nhất cho mình nhé."
                else:
                    ai_reply = f"Chào {d_name}, em là trợ lý của anh Việt. Cảm ơn {d_name} đã quan tâm đến lớp học làm video thực chiến.\\n\\nĐể hỗ trợ nhanh nhất, {d_name} vui lòng để lại số điện thoại (kèm Zalo) để bên em gọi điện tư vấn chi tiết lộ trình cho mình nhé."
"""

new_ai = """                if extracted_phone:
                    ai_reply = f"Chào {d_name}, Việt đây.\\n\\nMình thấy bạn vừa để lại SĐT {extracted_phone}. Bạn có đang tiện máy khoảng 2 phút không, mình gọi qua trao đổi thẳng vào việc xem lớp video bên mình có đúng thứ bạn đang cần không nhé, cho đỡ mất thời gian của nhau."
                else:
                    ai_reply = f"Chào {d_name}, Việt đây. Cảm ơn bạn đã quan tâm lớp làm video bên mình nhé.\\n\\n{d_name} cứ để lại SĐT (hoặc Zalo) ở đây, lúc nào rảnh mình gọi qua trao đổi thẳng vào việc luôn cho nhanh, xem có đúng thứ bạn đang cần không nhé."
"""

if old_ai in content:
    content = content.replace(old_ai, new_ai)
    with open("/Users/vietmac/Documents/CODE/offline/command_center/scanner_daemon.py", "w") as f:
        f.write(content)
    print("Success daemon patch")
else:
    print("Failed daemon patch")

