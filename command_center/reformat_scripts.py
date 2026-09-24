import json
import re

file_path = "/Users/vietmac/Documents/CODE/offline/command_center/generate_real_duyettin_scripts.py"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

def add_emojis(text):
    # Basic replacements
    text = text.replace("Dạ em chào", "Dạ em chào 👋")
    text = text.replace("Chào em!", "Chào em! 👋")
    text = text.replace("Chào bạn,", "Chào bạn 👋,")
    text = text.replace("Chào Quỳnh!", "Chào Quỳnh! 👋")
    text = text.replace("Chào anh", "Chào anh 👋")
    text = text.replace("Chào chị", "Chào chị 👋")
    
    text = text.replace("Bên em có lớp Offline", "📍 Bên em có lớp Offline")
    text = text.replace("Lớp này em trực tiếp", "🎥 Lớp này em trực tiếp")
    text = text.replace("Đặc biệt em cam kết:", "🔥 Đặc biệt em cam kết:")
    text = text.replace("Học phí trọn gói", "💰 Học phí trọn gói")
    text = text.replace("Nếu chị còn thắc mắc", "📞 Nếu chị còn thắc mắc")
    text = text.replace("Nếu anh cần hỏi", "📞 Nếu anh cần hỏi")
    text = text.replace("Nếu em cần hỏi", "📞 Nếu em cần hỏi")
    text = text.replace("Nếu chị cần trao đổi", "📞 Nếu chị cần trao đổi")
    
    text = text.replace("Hiện tại chị", "👉 Hiện tại chị")
    text = text.replace("Hiện tại anh", "👉 Hiện tại anh")
    text = text.replace("Hiện tại em", "👉 Hiện tại em")
    text = text.replace("Hiện tại bạn", "👉 Hiện tại bạn")
    text = text.replace("Hiện tại Tài", "👉 Hiện tại Tài")
    text = text.replace("Hiện tại Châu", "👉 Hiện tại Châu")
    
    # Ensure double newlines for spacing
    text = text.replace("\\n\\n", "||DBL_NL||")
    text = text.replace("\\n", "\\n\\n")
    text = text.replace("||DBL_NL||", "\\n\\n")
    
    return text

def replacer(match):
    prefix = match.group(1)
    reply_content = match.group(2)
    suffix = match.group(3)
    
    formatted_reply = add_emojis(reply_content)
    return prefix + formatted_reply + suffix

new_content = re.sub(r'("approved_reply":\s*")(.*?)("\n\s*\})', replacer, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Formatted successfully")
