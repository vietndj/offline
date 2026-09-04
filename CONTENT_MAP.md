# CONTENT_MAP.md — Bản Đồ Quản Lý Nội Dung offline.fedu.vn

> **Nguyên tắc cốt lõi (Single Source of Truth):** 100% nội dung hiển thị (tiêu đề, câu chữ, số liệu thống kê, link video YouTube/Reels, poster, ảnh sự kiện, form nhãn, FAQ, thông báo lỗi) được tập trung tại duy nhất một file:
> 👉 **`src/content.ts`**
>
> Toàn bộ các component trong `src/sections/`, `src/components/`, `src/pages/` và `src/App.tsx` là **Pure View Components** (chỉ đọc dữ liệu từ biến `CONTENT`). Người dùng hoặc AI có thể đổi bất kỳ nội dung nào trên web chỉ trong vòng **vài giây** bằng cách sửa `src/content.ts` mà **không cần đụng tới mã JSX hay logic giao diện**.

---

## 1. Bảng Tra Cứu Toàn Diện (Visual & Code Lookup Table)

| # | Khối Giao Diện | File Component Hiển Thị | Vị Trí / Biến Trong `src/content.ts` | Các Trường & Dữ Liệu Có Thể Chỉnh Sửa |
|---|---|---|---|---|
| **1** | **Thông tin chung & Mạng xã hội** | Toàn bộ web | `CONTENT.site` | `brandName`, `brandSubtitle`, `domain`, `hotline`, `zaloUrl`, `facebookPageUrl`, `youtubeChannelUrl`, `copyright` |
| **2** | **SEO & Social Share Meta** | `index.html` (M3) & Meta | `CONTENT.seo` | `title`, `description`, `keywords`, `ogTitle`, `ogDescription`, `ogImage`, `ogUrl`, `twitterCard` |
| **3** | **Thanh Điều Hướng (Header)** | `src/components/Navbar.tsx` | `CONTENT.navbar` | `brand.title`, `brand.subtitle`, danh sách `links` (`label`, `href`), nhãn nút `cta` ("GIỮ CHỖ NGAY"), `mobileCta` |
| **4** | **Hero (Màn hình đầu tiên)** | `src/sections/HeroSection.tsx` | `CONTENT.hero` | `badge` (Sĩ số giới hạn), `headline` (H1), `subheadline`, mảng 9 `tags`, 3 thẻ `meta` (Thời gian, Địa điểm, Quy mô), `cta`, `ctaNote` |
| **5** | **Bằng Chứng Meta Suite & Kênh** | `src/sections/ProofSection.tsx` | `CONTENT.proof` | `badge`, `headline`, `description`, `reportCard` (3 số liệu view/click/SĐT & 3 trụ cột hành động), 3 tab soi ảnh HD `tabs` (ảnh, URL nguồn, metric gain), 4 thẻ kênh `channels.items` (ảnh, follower, ngày cập nhật), `ui` nhãn phóng to |
| **6** | **Bản Chất Cốt Lõi (So sánh 3 cột)** | `src/sections/DefinitionSection.tsx` | `CONTENT.definition` | `badge`, `headline`, `subheadline`, `highlightWord`, 3 cột `columns` (01. Video Ads, 02. Đu Trend, 03. Video Marketing có cấu trúc), khối đúc kết `callout` (quote trích dẫn của thầy Việt, nút CTA) |
| **7** | **Biểu Đồ Giữ Chân (Retention)** | `src/sections/GrowthChartSection.tsx` | `CONTENT.chart` | `badge`, `headline`, `description`, `legends` (chú giải màu sắc & đơn vị), 3 khối `insights` (Nỗi đau, Nút thắt, Giải pháp), dữ liệu điểm `data` (từng mốc giây), trích dẫn nghiên cứu `source` (link Meta Nielsen), kết luận `takeaway` (Kịch bản 3 Tầng) |
| **8** | **4 Định Dạng Video Thực Chiến** | `src/sections/MetaphorsSection.tsx` | `CONTENT.metaphors` | `badge`, `headline`, `subheadline`, `formatPrefix`, `labels` (Output, Gỡ rào cản, Ứng dụng, Thực hành, watchYoutubeTitle), 4 định dạng `items` (Voice Over, Walk & Talk, Talking Head, Storytelling: video mp4, poster, youtubeId, youtubeUrl, output, relief, application), nút `cta` |
| **9** | **4 Nút Thắt & Video Switcher** | `src/sections/PainSection.tsx` | `CONTENT.painPoints` | `badge`, `headline`, `subheadline`, `tabPrefix`, `sectionTag`, `outcomePrefix`, 4 tab `tabs` (vướng mắc, giải pháp studio, 2 thẻ phụ), 4 kho video `brollVideos`, `scriptVideos`, `lightingVideos`, `processVideos` (tiêu đề, shortTitle, link video, poster, fbUrl, youtubeUrl), `tab4Overlays` (5 bước quy trình, tag cam kết), `ui` (nhãn modal, nút mở FB/YT, brollBadgePrefix, scriptBadgePrefix, lightingBadgePrefix, processBadgePrefix) |
| **10** | **Lộ Trình Học 2 Ngày** | `src/sections/CurriculumSection.tsx` | `CONTENT.curriculum` | `badge`, `headline`, `subheadline`, 3 ảnh thực tế lớp `eventPhotos` (ảnh, caption, alt), `dayPrefix`, `goalLabel`, chi tiết 2 ngày `days` (mục tiêu ngày, bài học ca sáng, bài học ca chiều, thời gian), khối quà tặng `bonus` (tag, tiêu đề, mô tả, nút nhận quà) |
| **11** | **Banner Kêu Gọi Giữa Trang** | `src/sections/BannerCta.tsx` & `App.tsx` | `CONTENT.bannerCta` | `badge` ("PHÒNG STUDIO CHUYÊN NGHIỆP"), `title` ("Thực hành cầm tay chỉ việc 1-1 cùng Nguyễn Đức Việt"), `cta` ("ĐĂNG KÝ GIỮ CHỖ") |
| **12** | **Thành Phẩm Video Học Viên** | `src/sections/ShowcaseSection.tsx` | `CONTENT.showcase` | `badge`, `headline`, `subheadline`, danh mục bộ lọc `categories` (Spa, Đời thường, Bán hàng, Tất cả), 8 video thành phẩm `videos` (tên học viên, vai trò, mô tả, poster, videoUrl, youtubeUrl, danh mục), `ui` (nhãn xem video, vuốt ngang, aria) |
| **13** | **Case Study Học Viên Tiêu Biểu** | `src/sections/CaseStudySection.tsx` | `CONTENT.caseStudies` | `badge`, `headline`, `subheadline`, `formatBadge`, `playVideoBadge`, `nichePrefix`, `breakthroughTitle`, `watchButtonText`, `openYoutubeText`, `modalTitlePrefix`, thông tin case study `items` (tên, vai trò, ngách, thống kê, videoId, câu chuyện thực tế, 4 điểm đột phá) |
| **14** | **Bộ Lọc Đối Tượng Tuyển Sinh** | `src/sections/TargetSection.tsx` | `CONTENT.targetAudience` | `badge`, `headline`, `fitHeader` ("RẤT PHÙ HỢP NẾU BẠN LÀ:"), `notFitHeader` ("KHÔNG PHÙ HỢP NẾU BẠN:"), 4 tiêu chí phù hợp `fit`, 3 tiêu chí không phù hợp `notFit` |
| **15** | **Giảng Viên Đứng Lớp** | `src/sections/InstructorSection.tsx` | `CONTENT.instructor` | `badge`, `name` ("Nguyễn Đức Việt"), `mainRole`, `subRole`, `avatar`, 3 đoạn `bio`, câu trích dẫn `quote`, 4 chỉ số thống kê `stats` (15+ năm, 38.850+ follower, 3.4M+ view, 100% kèm 1-1) |
| **16** | **Form Ghi Danh Trực Tiếp** | `src/sections/RegisterSection.tsx` | `CONTENT.register` | `badge`, `headlinePrefix`, `headlineHighlight`, 3 thông tin khóa học `meta` (thời gian, địa điểm, quy mô), `inclusionsTitle` & danh sách quà bao gồm `inclusions`, form nhập liệu `form` (tiêu đề, phụ đề, nhãn 5 trường, placeholder, disclaimer lưu ý học phí, nút submit, thông báo lỗi validation và network) |
| **17** | **Câu Hỏi Thường Gặp (FAQs)** | `src/sections/FaqSection.tsx` | `CONTENT.faqSection` (hoặc `CONTENT.faqs`) | `badge`, `headline`, `description`, mảng 7 câu hỏi và câu trả lời chi tiết `items` (`q`, `a`) |
| **18** | **Thanh Nổi Giữ Chỗ Mobile** | `src/components/StickyBottomCta.tsx` | `CONTENT.stickyBottomCta` | `badge` ("OFFLINE HÀ NỘI"), `subtitle` ("Giới hạn ≤ 40 Học Viên"), `cta` ("GIỮ CHỖ") |
| **19** | **Popup Form Đăng Ký (Modal)** | `src/components/RegisterModal.tsx` | `CONTENT.registerModal` | `badge`, `title`, `subtitle`, nhãn & placeholder 5 trường `fields` (Họ tên, SĐT, Email, Ngành nghề, Vướng mắc), `cta`, `ctaSubmitting`, thông báo lỗi `errors` |
| **20** | **Trang Cảm Ơn / Xác Nhận Thành Công** | `src/pages/SuccessPage.tsx` | `CONTENT.successPage` | `badge` ("ĐĂNG KÝ GIỮ CHỖ THÀNH CÔNG"), `headline`, `description`, 3 mục tóm tắt `summary` (Thời gian, Địa điểm + ghi chú Zalo, Quy mô), nút quay lại `backHomeCta` |
| **21** | **Chân Trang (Footer)** | `src/components/Footer.tsx` | `CONTENT.footer` | `brand`, `description`, `policyTitle` ("QUY ĐỊNH & CAM KẾT"), `policyContent` (chính sách sĩ số ≤ 40), `copyright` |

---

## 2. Hướng Dẫn Thao Tác Chỉnh Sửa Trong 5 Giây

### Trường Hợp 1: Cập nhật Lịch học Khóa Mới (Thời gian, Sĩ số, Địa điểm)
Khi mở khóa học đợt tiếp theo (ví dụ: ngày 26–27/09/2026 tại TP.HCM thay vì 19–20/09/2026 tại Hà Nội):
1. Mở file `src/content.ts`.
2. Tìm khối `hero.meta`:
   ```typescript
   meta: [
     { id: "time", label: "THỜI GIAN", value: "2 Ngày Thực Chiến", desc: "Thứ 7 & Chủ Nhật (09:00 - 17:00)" },
     { id: "location", label: "ĐỊA ĐIỂM", value: "Hà Nội", desc: "Phòng Studio tiêu chuẩn chuyên nghiệp" },
     { id: "capacity", label: "QUY MÔ", value: "≤ 40 Học Viên", desc: "Kèm cặp 1-1 ra sản phẩm ngay tại lớp" }
   ]
   ```
3. Tìm khối `register.meta`:
   ```typescript
   meta: {
     time: { label: "THỜI GIAN", value: "19–20/09/2026", desc: "2 ngày offline thực chiến" },
     location: { label: "ĐỊA ĐIỂM", value: "Hà Nội", desc: "Chi tiết cập nhật trong nhóm Zalo" },
     scale: { label: "QUY MÔ", value: "Tối đa 40 người", desc: "Để đảm bảo chất lượng thực hành" }
   }
   ```
4. Tìm khối `successPage.summary`:
   ```typescript
   summary: {
     time: { label: "Thời gian: ", value: "2 Ngày Thứ 7 & Chủ Nhật (09:00 - 17:00)" },
     location: { label: "Địa điểm: ", value: "Studio Chuyên Nghiệp Hà Nội", note: " (Địa chỉ chi tiết gửi qua Zalo)" },
     scale: { label: "Quy mô: ", value: "Sĩ số giới hạn ≤ 40 học viên" }
   }
   ```
5. Sửa đổi các giá trị trên và lưu file.
👉 **Kết quả:** Cả Hero, Form đăng ký, Trang thành công và Footer đều được đồng bộ tức thì, không bị lệch ngày hay sót thông tin.

---

### Trường Hợp 2: Thay Đổi Video Clip Thành Phẩm Của Học Viên
Khi có video học viên mới ấn tượng hơn cần đưa lên:
1. Mở file `src/content.ts`.
2. Tìm mảng `showcase.videos`.
3. Sửa thông tin hoặc thêm mới một phần tử video:
   ```typescript
   {
     id: "video-id-moi",
     title: "Tiêu đề video mới của học viên",
     author: "Tên Học Viên",
     role: "Nghề nghiệp / Lĩnh vực",
     desc: "Mô tả kết quả đạt được sau 2 ngày học",
     poster: "/assets/showcase/poster_moi.jpg",
     youtubeUrl: "https://youtu.be/xxxxxxxxx",
     category: "expert_talkinghead",
     categoryLabel: "Bán Hàng / Talking Head"
   }
   ```
4. Lưu file. Carousel tự động nhận diện, bổ sung tab phân loại và hiển thị pop-up xem video chất lượng cao.

---

### Trường Hợp 3: Thêm Hoặc Sửa Câu Hỏi Thường Gặp (FAQs)
Khi có thắc mắc mới từ học viên cần giải đáp ngay trên web:
1. Mở file `src/content.ts`.
2. Tìm mảng `faqSection.items`.
3. Thêm một đối tượng mới:
   ```typescript
   {
     q: "Câu hỏi mới cần giải đáp là gì?",
     a: "Câu trả lời chi tiết và rõ ràng từ ban tổ chức khóa học."
   }
   ```
4. Lưu file. Accordion trên trang tự động đánh số thứ tự tiếp theo và hiển thị với đầy đủ hiệu ứng đóng/mở mượt mà.

---

### Trường Hợp 4: Cập Nhật Số Liệu Đối Soát Meta Business Suite
Khi các con số tương tác và chuyển đổi tăng trưởng:
1. Mở file `src/content.ts`.
2. Tìm `proof.reportCard.stats`:
   - Sửa `value: "6,0 Triệu"` thành con số mới (ví dụ `"8,5 Triệu"`).
   - Sửa `value: "50,8K"` click link thành số mới (ví dụ `"72,4K"`).
   - Sửa `value: "428+"` số ĐT thành số mới (ví dụ `"650+"`).
3. Lưu file. Các thẻ chỉ số trên trang chủ lập tức hiển thị con số mới.

---

### Trường Hợp 5: Đổi Khẩu Hiệu Kêu Gọi Hành Động (CTA)
Khi muốn thử nghiệm A/B testing văn phong kêu gọi hành động:
- Sửa `hero.cta`: ví dụ `"ĐĂNG KÝ GIỮ CHỖ NGAY"` → `"NHẬN TƯ VẤN & GIỮ CHỖ HỌC PHÍ"`
- Sửa `navbar.cta`: ví dụ `"GIỮ CHỖ NGAY"` → `"ĐĂNG KÝ HỌC"`
- Sửa `bannerCta.title` hoặc `bannerCta.cta`
- Lưu file. Giao diện tự động cập nhật chữ trên tất cả nút bấm mà không làm vỡ kích thước hay hiệu ứng nút.

---

## 3. Kiến Trúc Kiểm Định Tự Động (Automated Integrity Guarantee)
Mọi thay đổi trong `src/content.ts` đều được bảo vệ bởi hệ thống TypeScript types (`ContentData`):
- Nếu gõ sai tên trường hoặc thiếu một trường bắt buộc, lệnh `npm run typecheck` sẽ báo lỗi ngay lập tức kèm số dòng chính xác, ngăn chặn hoàn toàn tình trạng vỡ giao diện runtime trên môi trường live.
- Lệnh kiểm tra tính toàn vẹn:
  ```bash
  npm run typecheck
  npm run build
  ```
- Kết quả mong đợi: `0 errors, 0 warnings`, thời gian build < 2 giây.
