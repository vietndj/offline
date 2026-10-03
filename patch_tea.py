import sys

with open('src/content.ts', 'r') as f:
    content = f.read()

target = """      {
        id: "dinner-bbq",
        title: "Tiệc nướng BBQ tối ngày 1 (Lựa chọn mở)",
        desc: "• Tiệc nướng ngoài trời tối thứ 3\\n• Giao lưu tâm sự chuyện làm nghề\\n• Lựa chọn tham gia tự do (chia đều chi phí)",
        tag: "Tối thứ Bảy · Tuỳ chọn",
        icon: "Flame",
        image: "/assets/venue/perk_bbq.jpg",
        highlight: "Hỏi nhu cầu cuối ngày 1"
      },"""

replacement = """      {
        id: "afternoon-tea",
        title: "Tiệc trà chiều giao lưu (Sau bế giảng)",
        desc: "• Trà chiều, bánh ngọt, cà phê sau buổi học cuối\\n• Giao lưu tâm sự chuyện làm nghề, kết nối học viên\\n• Không gian thư giãn chia sẻ kinh nghiệm",
        tag: "Chiều Chủ Nhật · Kết nối",
        icon: "Coffee",
        image: "/assets/venue/perk_teabreak.jpg",
        highlight: "Giao lưu cuối khóa"
      },"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/content.ts', 'w') as f:
        f.write(content)
    print("Replaced BBQ with Afternoon Tea")
else:
    print("Could not find the exact BBQ block. Check the exact text.")

