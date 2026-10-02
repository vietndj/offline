import sys

with open('src/content.ts', 'r') as f:
    content = f.read()

# 1. Update interface
interface_target = """    meta: {
      time: { label: string; value: string; desc: string };
      location: { label: string; value: string; desc: string };
      scale: { label: string; value: string; desc: string };
    };"""

interface_replacement = """    pricing: {
      standard: { label: string; value: string; note: string };
      earlyBird: { label: string; value: string; note: string };
      group2: { label: string; value: string; note: string };
      group3: { label: string; value: string; note: string };
      quote: string;
    };
    meta: {
      time: { label: string; value: string; desc: string };
      location: { label: string; value: string; desc: string };
      duration: { label: string; value: string; desc: string };
      scale: { label: string; value: string; desc: string };
    };"""

content = content.replace(interface_target, interface_replacement)

# 2. Update data
data_target = """    meta: {
      time: { label: "THỜI GIAN", value: "03/11 - 04/11/2026", desc: "2 ngày offline thực chiến" },
      location: { label: "ĐỊA ĐIỂM", value: "Hà Nội", desc: "Chi tiết cập nhật trong nhóm Zalo" },
      scale: { label: "QUY MÔ", value: "Tối đa 40 người", desc: "Để đảm bảo chất lượng thực hành" }
    },"""

data_replacement = """    pricing: {
      standard: { label: "HỌC PHÍ CHUẨN", value: "6.000.000đ", note: "Học viên" },
      earlyBird: { label: "Early Bird", value: "5.000.000đ", note: "Đăng ký sớm" },
      group2: { label: "Nhóm 2 người", value: "4.500.000đ", note: "Mỗi người" },
      group3: { label: "Nhóm 3 người", value: "4.000.000đ", note: "Mỗi người" },
      quote: "Mỗi ngày bạn chờ, là một ngày người khác đang kiếm tiền từ những thứ giống bạn."
    },
    meta: {
      time: { label: "KHAI GIẢNG", value: "03-04/11/2026", desc: "(Thứ 3 & Thứ 4)" },
      location: { label: "HÌNH THỨC", value: "Offline", desc: "Hà Nội" },
      duration: { label: "THỜI LƯỢNG", value: "4 buổi", desc: "2 ngày" },
      scale: { label: "SỐ CHỖ", value: "Chỉ còn 20 chỗ", desc: "" }
    },"""

content = content.replace(data_target, data_replacement)

with open('src/content.ts', 'w') as f:
    f.write(content)
print("Patched content.ts")
