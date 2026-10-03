import sys

with open('src/content.ts', 'r') as f:
    content = f.read()

content = content.replace("03-04/11/2026", "31/10 - 01/11/2026")
content = content.replace("Thứ 3 & Thứ 4", "Thứ 7 & Chủ Nhật")
content = content.replace("Tối thứ Ba", "Tối thứ Bảy")

with open('src/content.ts', 'w') as f:
    f.write(content)
print("Updated src/content.ts")

with open('CONTENT_MAP.md', 'r') as f:
    content_map = f.read()

content_map = content_map.replace("03/11 - 04/11/2026", "31/10 - 01/11/2026")
content_map = content_map.replace("Thứ 3 & Thứ 4", "Thứ 7 & Chủ Nhật")

with open('CONTENT_MAP.md', 'w') as f:
    f.write(content_map)
print("Updated CONTENT_MAP.md")
