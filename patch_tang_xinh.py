import sys

with open('src/content.ts', 'r') as f:
    content = f.read()

target = """      {
        id: "tang-xinh-review",
        title: "Review khóa học Video Marketing Thực Chiến",
        author: "Tâng Xinh",
        role: "Học viên",
        desc: "Cảm nhận của học viên sau 2 ngày tham gia khóa học.",
        poster: "https://img.youtube.com/vi/QoFYOVrBl48/hqdefault.jpg",
        youtubeUrl: "https://youtu.be/QoFYOVrBl48",
        category: "expert_talkinghead",
        categoryLabel: "Chia Sẻ / Review"
      },"""

replacement = """      {
        id: "tang-xinh-review",
        title: "Review khóa học Video Marketing Thực Chiến",
        author: "Tâng Xinh",
        role: "Kinh doanh Hệ thống",
        desc: "Thường xuyên đào tạo và dẫn dắt đội ngũ, chị Tâng Xinh có những tiêu chuẩn rất khắt khe về tính hiệu quả. Dưới đây là lăng kính thực tế và những cảm nhận chân thực nhất của chị về tính ứng dụng của chương trình.",
        poster: "https://img.youtube.com/vi/QoFYOVrBl48/hqdefault.jpg",
        youtubeUrl: "https://youtu.be/QoFYOVrBl48",
        category: "expert_talkinghead",
        categoryLabel: "Chia Sẻ / Review"
      },"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/content.ts', 'w') as f:
        f.write(content)
    print("Replaced Tang Xinh desc")
else:
    print("Target not found")

