# Original User Request

## 2026-09-04T00:35:55Z

Tối ưu hóa toàn diện dự án với tiêu chuẩn ưu tiên cao nhất là cấu trúc mã nguồn giúp việc chỉnh sửa nội dung sau này nhanh nhất có thể (Single Source of Truth), đồng thời tối ưu hiệu năng tải trang, chuẩn hóa SEO và triển khai lên https://offline.fedu.vn.

Working directory: /Users/vietmac/Documents/CODE/offline
Integrity mode: development

## Requirements

### R1. [ƯU TIÊN CAO NHẤT] Tối Ưu Cấu Trúc Để Chỉnh Sửa Nhanh (Fast Modification Architecture)
- **Tập trung hóa 100% nội dung (Single Source of Truth):** Quét và chuyển toàn bộ các đoạn text, tiêu đề, số liệu thống kê, link video, hình ảnh, FAQ còn bị hardcode trong các file TSX về duy nhất một file quản lý nội dung trung tâm (`src/content.ts`).
- **Độc lập giữa Giao diện (UI) và Dữ liệu (Content):** Các component chỉ đóng vai trò hiển thị (pure view components), nhận dữ liệu từ `content.ts`. Khi người dùng muốn đổi câu chữ, thay video YouTube, sửa số liệu hay cập nhật kịch bản, chỉ cần mở đúng file `content.ts` và sửa trong vòng vài giây mà không sợ làm vỡ giao diện.
- **Xây dựng Content Map (Bản đồ nội dung):** Đính kèm bảng chú giải rõ ràng từng khối trên giao diện tương ứng với biến/dòng nào trong `content.ts` để người dùng hoặc AI có thể định vị và chỉnh sửa tức thì.

### R2. Tối Ưu Hóa Hiệu Năng Tải Trang & Dọn Dẹp Mã Nguồn
- Dọn dẹp triệt để các file rác, file nháp, tài nguyên media dung lượng lớn không sử dụng trong repo.
- Tối ưu kích thước bundle JavaScript và CSS (code splitting, tree-shaking, lazy-load các khối media/video nặng).
- Đảm bảo toàn bộ mã nguồn TypeScript và Vite build đạt chuẩn không có cảnh báo hay lỗi kiểu dữ liệu.

### R3. Chuẩn Hóa SEO & Social Share Metadata
- Cấu hình đầy đủ thẻ Meta SEO, OpenGraph (og:title, og:description, og:image, og:url), Twitter Card trong `index.html`.
- Thiết lập Favicon, canonical URL và file `robots.txt` chuẩn cho tên miền `https://offline.fedu.vn`.

### R4. Kiểm Thử Hệ Thống Ghi Danh & API
- Kiểm tra toàn diện luồng đăng ký của Form ghi danh tại `/api/register` (đảm bảo đồng bộ chính xác dữ liệu vào Google Sheets và gửi thông báo qua Telegram Bot).
- Đảm bảo fallback thông minh và phản hồi rõ ràng khi người dùng gửi form trong mọi trường hợp mạng.

### R5. Triển Khai & Kiểm Định Trực Tuyến (Production Deployment)
- Triển khai phiên bản cập nhật mới nhất lên hệ thống trực tuyến kết nối tên miền `https://offline.fedu.vn`.
- Xác minh bằng script tự động kiểm tra mã phản hồi HTTP 200, chứng chỉ SSL và nội dung mới nhất hiển thị trên môi trường live.

## Acceptance Criteria

### Khả Năng Chỉnh Sửa Nhanh (Tiêu chuẩn ưu tiên hàng đầu)
- [ ] 100% các đoạn text copywriting, nhãn nút, link video, số liệu thống kê đều được đưa vào `src/content.ts`, không còn text tĩnh hardcode trong thư mục `src/sections/`.
- [ ] Thử nghiệm chỉnh sửa nhanh 1 trường trong `content.ts` và kiểm tra phản ánh ngay lập tức trên UI mà không cần can thiệp vào logic component.
- [ ] Có file hướng dẫn `CONTENT_MAP.md` liệt kê chi tiết vị trí từng phần tử trên trang tương ứng với cấu trúc biến trong `content.ts`.

### Hiệu Năng & Mã Nguồn
- [ ] Lệnh `npm run typecheck` và `npm run build` thực thi thành công 100% với 0 lỗi.
- [ ] Kích thước file bundle JavaScript chính sau nén gzip giữ ở mức tối ưu (< 120KB).
- [ ] Không còn thư mục rác hoặc file media dung lượng lớn không sử dụng lưu trữ trong repo.

### SEO & Metadata
- [ ] `index.html` chứa đầy đủ các thẻ: title chuẩn SEO, meta description, og:title, og:description, og:image hợp lệ, twitter:card.
- [ ] Tồn tại file `public/robots.txt` hợp lệ cho phép thu thập dữ liệu tìm kiếm.

### Kiểm Thử Luồng Đăng Ký
- [ ] Endpoint `/api/register` được kiểm thử với kịch bản gửi payload mẫu hợp lệ và trả về `{ success: true }`.

### Trực Tuyến & Tên Miền
- [ ] `https://offline.fedu.vn` truy cập thành công (HTTP 200), SSL hợp lệ.
- [ ] Kiểm tra thực tế trên trang live hiển thị các khối nội dung cập nhật mới nhất.
