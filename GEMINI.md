# OFFLINE PROJECT INSTRUCTIONS & KEYWORD RULES

## 📌 TỪ KHÓA ĐẶC BIỆT: "LED" = "LEAD" (FEDU LED HUB)
- **`LED` (viết hoa) ≡ `LEAD`** (Học viên đăng ký khóa học Offline / Khách hàng tiềm năng).
- **Tuyệt đối không nhầm sang bóng đèn LED của smart-home.**
- **Mantra kích hoạt:** `LED`, `QUÉT LED`, `MỞ LED`, `LED HUB`, `BÀN GỌI LED`.

### Khi nhận lệnh "QUÉT LED" / "MỞ LED":
1. Quét đối soát cuộc gọi & tin nhắn (`python3 telesale_radar/manage_radar_contacts.py --scan`).
2. Tự động kiểm tra lead mới & lưu Apple Contacts `offline3 - [Tên]` để đồng bộ iPhone/iCloud.
3. Khởi chạy server nếu chưa chạy (`telesale_radar/telesale_server.py`) và mở `http://localhost:8888`.
4. Đảm bảo tunnel online Cloudflare sẵn sàng cho iPhone qua 4G/5G (`telesale_radar/start_online.sh`).
