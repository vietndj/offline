import re

with open("/Users/vietmac/Documents/CODE/offline/command_center/scanner_daemon.py", "r") as f:
    content = f.read()

old_ai = """                if extracted_phone:
                    ai_reply = f"Chào {d_name}, Việt đây.\\n\\nMình thấy bạn vừa để lại SĐT {extracted_phone}. Bạn có đang tiện máy khoảng 2 phút không, mình gọi qua trao đổi thẳng vào việc xem lớp video bên mình có đúng thứ bạn đang cần không nhé, cho đỡ mất thời gian của nhau."
                else:
                    ai_reply = f"Chào {d_name}, Việt đây. Cảm ơn bạn đã quan tâm lớp làm video bên mình nhé.\\n\\n{d_name} cứ để lại SĐT (hoặc Zalo) ở đây, lúc nào rảnh mình gọi qua trao đổi thẳng vào việc luôn cho nhanh, xem có đúng thứ bạn đang cần không nhé."
"""

new_ai = """                # Phát hiện đại từ
                text_lower = text.lower()
                if re.search(r'\\b(chị|c)\\b', text_lower):
                    p_khach, p_minh = "chị", "em Việt"
                elif re.search(r'\\b(anh|a)\\b', text_lower):
                    p_khach, p_minh = "anh", "em Việt"
                elif re.search(r'\\b(em|e)\\b', text_lower):
                    p_khach, p_minh = "em", "anh Việt"
                else:
                    p_khach, p_minh = "anh/chị", "em Việt"

                if extracted_phone:
                    ai_reply = f"Chào {p_khach} {d_name}, {p_minh} đây.\\n\\nEm thấy {p_khach} vừa để lại SĐT {extracted_phone}. {p_khach} có đang tiện máy khoảng 2 phút không, em gọi qua trao đổi thẳng vào việc xem lớp video bên em có đúng thứ {p_khach} đang cần không nhé, cho đỡ mất thời gian."
                else:
                    ai_reply = f"Chào {p_khach} {d_name}, {p_minh} đây. Cảm ơn {p_khach} đã quan tâm lớp làm video bên em nhé.\\n\\n{p_khach} cứ để lại SĐT (hoặc Zalo) ở đây, lúc nào rảnh em gọi qua trao đổi thẳng vào việc luôn cho nhanh, xem có đúng thứ {p_khach} đang cần không nhé."
                
                # Fix pronoun inside string if p_khach == 'em' and p_minh == 'anh Việt'
                if p_minh == "anh Việt":
                    ai_reply = ai_reply.replace(" em ", " anh ").replace("Em thấy", "Anh thấy")
"""

if old_ai in content:
    content = content.replace(old_ai, new_ai)
    with open("/Users/vietmac/Documents/CODE/offline/command_center/scanner_daemon.py", "w") as f:
        f.write(content)
    print("Success daemon patch")
else:
    print("Failed daemon patch")
