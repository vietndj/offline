import sys

with open('./src/content.ts', 'r') as f:
    lines = f.readlines()

insert_idx = -1
for i, line in enumerate(lines):
    if 'id: "vu-hai-long",' in line:
        insert_idx = i - 1 # The line with `{` before `vu-hai-long`
        break

if insert_idx != -1:
    new_video = """      {
        id: "tang-xinh-review",
        title: "Review khóa học Video Marketing Thực Chiến",
        author: "Tâng Xinh",
        role: "Học viên",
        desc: "Cảm nhận của học viên sau 2 ngày tham gia khóa học.",
        poster: "https://img.youtube.com/vi/_6tSCzLc9u0/hqdefault.jpg",
        youtubeUrl: "https://youtu.be/_6tSCzLc9u0",
        category: "expert_talkinghead",
        categoryLabel: "Chia Sẻ / Review"
      },
"""
    lines.insert(insert_idx, new_video)
    with open('./src/content.ts', 'w') as f:
        f.writelines(lines)
    print("Inserted successfully.")
else:
    print("Could not find insertion point.")
