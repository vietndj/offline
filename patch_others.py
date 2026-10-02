import sys

with open('src/content.ts', 'r') as f:
    content = f.read()

# Replace in meta array
content = content.replace(
    'label: "QUY MÔ", value: "≤ 40 Học Viên", desc: "Kèm cặp 1-1 ra sản phẩm ngay tại lớp"',
    'label: "SỐ CHỖ", value: "Chỉ còn 20 chỗ", desc: ""'
)

# Replace in SuccessPage summary
content = content.replace(
    'label: "Quy mô: ", value: "Sĩ số giới hạn ≤ 40 học viên"',
    'label: "Số chỗ: ", value: "Chỉ còn 20 chỗ"'
)

with open('src/content.ts', 'w') as f:
    f.write(content)
print("Patched other sections")
