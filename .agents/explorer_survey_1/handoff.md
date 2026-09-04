# Comprehensive Survey & Content Architecture Report: offline.fedu.vn

**Explorer Agent**: Explorer Survey 1 (Content & UI Architecture)  
**Date**: 2026-09-04  
**Workspace**: `/Users/vietmac/Documents/CODE/offline`  
**Output Target**: Fast Modification Architecture (Single Source of Truth - R1)

---

## 1. Observation

### 1.1 Existing Architecture & File Tree
A complete inspection of `src/` revealed 19 TSX/TS files, 1 central content file, CSS stylesheets, and 1 API route:
```
src/
├── App.tsx                        (68 lines - Main landing assembler & state holder)
├── content.ts                    (840 lines - Existing centralized data repository)
├── theme.ts                      (134 lines - Design tokens, typography & color luminance)
├── main.tsx                      (Root React mounting point)
├── components/
│   ├── Navbar.tsx                (112 lines - Navigation header, branding, sticky logic)
│   ├── Footer.tsx                (36 lines - Footer text, policies, copyright)
│   ├── RegisterModal.tsx         (185 lines - Popup registration form & validation)
│   └── StickyBottomCta.tsx       (32 lines - Mobile floating action bar)
├── pages/
│   └── SuccessPage.tsx           (57 lines - Registration success confirmation screen)
└── sections/
    ├── HeroSection.tsx           (89 lines - Above-the-fold hero & value proposition)
    ├── ProofSection.tsx          (332 lines - Meta stats, proof tabs, 4 channel cards)
    ├── DefinitionSection.tsx     (173 lines - 3-column concept comparison & teacher quote)
    ├── GrowthChartSection.tsx    (219 lines - Interactive SVG retention curve & insights)
    ├── MetaphorsSection.tsx      (157 lines - 4 video marketing format cards)
    ├── PainSection.tsx           (596 lines - 4 problem tabs, video switchers & modal)
    ├── CurriculumSection.tsx     (274 lines - 2-day syllabus, event gallery & bonus)
    ├── BannerCta.tsx             (38 lines - Mid-page call-to-action banner)
    ├── ShowcaseSection.tsx       (337 lines - Student video carousel with category filter)
    ├── CaseStudySection.tsx      (187 lines - Featured student case study & quotes)
    ├── TargetSection.tsx         (66 lines - Fit vs Not Fit criteria grid)
    ├── InstructorSection.tsx     (93 lines - Instructor profile, bio, quote & stats)
    ├── RegisterSection.tsx       (247 lines - In-page direct registration form)
    └── FaqSection.tsx            (91 lines - Accordion FAQ list)
```

### 1.2 Baseline Build & Typecheck
- Executed `npm run typecheck` (`tsc -p tsconfig.json --noEmit`): Exited with code 0 (0 type errors).
- Executed `npm run build` (`vite build`): Exited with code 0 in 1.28s.
  - `dist/index.html`: 3.47 kB (gzip: 1.55 kB)
  - `dist/assets/index-DT9nT6Q4.css`: 20.93 kB (gzip: 4.23 kB)
  - `dist/assets/index-AtwfbqLk.js`: 342.85 kB (gzip: 96.09 kB, meets the < 120 kB threshold)

### 1.3 Detailed Inventory of Hardcoded Content by File

#### Group A: Components with ZERO Connection to `src/content.ts` (100% Hardcoded)
1. **`src/sections/DefinitionSection.tsx`**:
   - Lines 14-17: Badge `"BẢN CHẤT CỐT LÕI · PHÂN BIỆT RÕ RÀNG"`
   - Lines 18-20: Headline `"Video marketing là gì? Vì sao 90% người làm video đang nhầm sang \"video ads\" hoặc \"câu view rác\"?"`
   - Lines 21-23: Description `"Quảng cáo tắt tiền là hết khách, câu view giải trí thì không ra tiền. Chỉ có video marketing có cấu trúc chuẩn mới là tài sản tự động mang khách hàng về cho bạn 24/7."`
   - Lines 28-61 (Col 1 - Video Ads): Tag `"01. VIDEO ADS (CHẠY QUẢNG CÁO)"`, Title `"Mua tiếp cận, không mua được lòng tin"`, Description `"Cố gắng tiếp cận thật nhiều người bằng tiền quảng cáo..."`, 3 bullet points, Result `"Kết quả: Lệ thuộc quảng cáo, càng làm càng đuối"`.
   - Lines 63-96 (Col 2 - Đu Trend): Tag `"02. VIDEO ĐU TREND (CÂU VIEW ĐẠI TRÀ)"`, Title `"Lượt xem ảo, bài toán thật"`, Description `"Chạy theo xu hướng nhất thời..."`, 3 bullet points, Result `"Kết quả: Bận rộn ảo, không tạo ra khách hàng thật"`.
   - Lines 98-135 (Col 3 - Video Marketing): Badge `"CHUẨN PHƯƠNG PHÁP THỰC CHIẾN"`, Tag `"03. VIDEO MARKETING CÓ CẤU TRÚC"`, Title `"Tài sản sinh khách 24/7"`, Description `"Video 30–45s giải thích đúng điểm nghẽn..."`, 3 bullet points, Result `"Kết quả: Có khách đều đặn, không tốn tiền ads"`.
   - Lines 139-168 (Callout Box): Badge `"ĐÚC KẾT THỰC CHIẾN TỪ THẦY NGUYỄN ĐỨC VIỆT"`, Quote text (2 paragraphs), Button label `"HỌC CÁCH LÀM VIDEO MARKETING"`.

2. **`src/sections/RegisterSection.tsx`**:
   - Lines 63-66: Badge `"ĐĂNG KÝ THAM GIA CHƯƠNG TRÌNG OFFLINE"`
   - Lines 67-69: Headline `"Biến kiến thức của bạn thành Video Marketing & doanh số thật"`
   - Lines 73-100 (Meta): 
     - Time: `"19–20/09/2026"` - `"2 ngày offline thực chiến"`
     - Location: `"Hà Nội"` - `"Chi tiết cập nhật trong nhóm Zalo"`
     - Scale: `"Tối đa 40 người"` - `"Để đảm bảo chất lượng thực hành"`
   - Lines 102-125 (Inclusions): Header `"BAO GỒM:"`, 4 items (`"Tài liệu & template thực hành"`, `"Source video mẫu để edit tại lớp"`, `"Thực hành quay/edit video trực tiếp"`, `"Cộng đồng hỗ trợ sau khóa học"`).
   - Lines 131-136: Form Title `"Điền thông tin để giữ chỗ"`, Subtitle `"Team TopExpert sẽ liên hệ xác nhận lịch học, học phí và hướng dẫn chuẩn bị trước khóa qua điện thoại/Zalo."`.
   - Lines 146-210: Form field labels & placeholders (`"Họ và tên *"`, `"Số điện thoại *"`, `"Email *"`, `"Nghề nghiệp / Lĩnh vực (tuỳ chọn)"`, `"Lý do bạn muốn tham gia? (tuỳ chọn)"`).
   - Lines 213-219: Notice box `"⚠️ [Lưu ý] Đây không phải chương trình miễn phí. Bạn sẽ được tư vấn học phí trước khi xác nhận chỗ."`.
   - Lines 224-234: Submit buttons (`"ĐĂNG KÝ GIỮ CHỖ"`, `"Đang gửi thông tin..."`).
   - Lines 236-238: Privacy pledge `"Thông tin của bạn được bảo mật tuyệt đối."`.
   - Lines 15-50: Error validation strings (`"Vui lòng nhập đầy đủ Họ tên và Số điện thoại"`, etc.).

3. **`src/components/Navbar.tsx`**:
   - Lines 44-49: Brand logo text `"VIDEO MARKETING"`, subtitle `"WORKSHOP OFFLINE 2 NGÀY"`.
   - Lines 20-28: `navLinks` array with 7 anchor links (`'Kết Quả'`, `'4 Định Dạng'`, `'4 Nút Thắt'`, `'Lộ Trình 2 Ngày'`, `'Video Học Viên'`, `'Giảng Viên'`, `'Hỏi Đáp'`).
   - Lines 68-72: Desktop CTA button `"GIỮ CHỖ NGAY"`.
   - Lines 103-106: Mobile menu CTA button `"ĐĂNG KÝ GIỮ CHỖ NGAY"`.

4. **`src/components/Footer.tsx`**:
   - Line 13: Brand text `"VIDEO MARKETING"`.
   - Lines 15-17: Description `"Khóa học offline 2 ngày cầm tay chỉ việc giúp chuyên gia, chủ doanh nghiệp và người làm dịch vụ làm chủ quy trình kịch bản, setup 2 góc quay và edit video chuyên nghiệp."`.
   - Line 22: Column title `"QUY ĐỊNH & CAM KẾT"`.
   - Lines 24-26: Policy text `"Khóa học giới hạn sĩ số ≤ 40 học viên mỗi khóa để đảm bảo chất lượng hướng dẫn 1-1 và mọi học viên đều có thành phẩm video mang về."`.
   - Line 31: Copyright text `"© [Year] VIDEO MARKETING — Khóa Học Video Marketing Thực Chiến Đứng Lớp Trực Tiếp Bởi Nguyễn Đức Việt."`.

5. **`src/components/StickyBottomCta.tsx`**:
   - Line 15: Badge `"OFFLINE HÀ NỘI"`.
   - Line 18: Text `"Giới hạn ≤ 40 Học Viên"`.
   - Line 25: Button text `"GIỮ CHỖ"`.

6. **`src/components/RegisterModal.tsx`**:
   - Lines 75-78: Badge `"ĐĂNG KÝ GIỮ CHỖ OFFLINE"`.
   - Lines 79-84: Title `"Khóa Học Video Marketing 2 Ngày"`, subtitle `"Gặp mặt trực tiếp tại Hà Nội · Kèm cặp 1-1 bởi Thầy Nguyễn Đức Việt."`.
   - Lines 96-160: Field labels and placeholders (`"HỌ VÀ TÊN"`, `"SỐ ĐIỆN THOẠI / ZALO"`, `"EMAIL"`, `"NGHỀ NGHIỆP / LĨNH VỰC"`, `"NÚT THẮT BẠN MUỐN GIẢI QUYẾT?"`).
   - Lines 174-177: Button `"XÁC NHẬN ĐĂNG KÝ"`, `"Đang gửi thông tin..."`.
   - Lines 23-56: Error notification messages.

7. **`src/pages/SuccessPage.tsx`**:
   - Line 20: Badge `"ĐĂNG KÝ GIỮ CHỖ THÀNH CÔNG"`.
   - Line 24: Headline `"Chào Mừng Bạn Đến Với Khóa Học Video Marketing!"`.
   - Lines 27-29: Description text.
   - Lines 34, 38, 42: Key recap points (`"Thời gian: 2 Ngày Thứ 7 & Chủ Nhật (08:30 - 17:30)"`, `"Địa điểm: Studio Chuyên Nghiệp Hà Nội (Địa chỉ chi tiết gửi qua Zalo)"`, `"Quy mô: Sĩ số giới hạn ≤ 40 học viên"`).
   - Line 51: Button `"Quay Về Trang Chủ"`.

#### Group B: Sections that Import `content.ts` but Contain Substantial Hardcoded Elements
8. **`src/sections/ProofSection.tsx`**:
   - Lines 10-44: `proofTabs` is hardcoded as an internal state array instead of reading from `content.proof.tabs`. Includes 3 Meta Suite audit tabs with verbatim report labels, IDs, metric gains (`"+345,5% Lượt Xem · +475,9% Click Link"`, `"1 Bài Viết = 108 Cuộc Hội Thoại Mới"`, `"428 Số ĐT · Tỷ Lệ Quan Tâm 20.8%"`).
   - Line 87: `"BÁO CÁO ĐỐI SOÁT HỘP THƯ & TƯ VẤN"`.
   - Lines 91-106: 3 Core Stats Cards (`"Lượt Xem: 6,0 Triệu"`, `"Click Link: 50,8K"`, `"Số ĐT Thật: 428+"`).
   - Lines 111-123: 3 Action Pillars (`"Không cần ê-kíp cồng kềnh..."`, `"Đòn bẩy tuần: Chỉ đăng 1 video/tuần..."`, `"50.800+ lượt click link..."`).
   - Lines 246-325: Entire 4-card channel showcase section with titles (`"Fanpage 38.850+ Follower"`, `"TikTok 181.500+ View"`, `"3.642 Leads & 428 Số ĐT"`, `"Reels 3.430.000+ View"`), descriptions, and date stamps (`"(Cập nhật ngày 03/09/2026)"`).
   - Lines 171, 188: UI buttons (`"Phóng to HD"`, `"Nhấn để soi rõ từng chi tiết"`).

9. **`src/sections/PainSection.tsx`**:
   - Lines 69-70: Label `"VƯỚNG MẮC 0{idx + 1}"`.
   - Line 94: Header `"VƯỚNG MẮC THỰC TẾ & CÁCH THẦY TRÒ CÙNG LÀM"`.
   - Line 126: Solution prefix `"✨ Cách xử lý tại studio:"`.
   - Lines 151, 173, 181: Tab 1 media badges (`"Kho B-Roll Bank Xử Lý"`, `"BẤM ĐỂ XEM B-ROLL BANK"`, `"B-ROLL BANK 0{selectedBrollIndex + 1}"`).
   - Lines 231, 252, 260: Tab 2 AI media badges (`"Trợ Lý AI Viết Kịch Bản Thực Chiến"`, `"BẤM XEM AI DEMO"`, `"AI VIẾT KỊCH BẢN 0{selectedScriptIndex + 1}"`).
   - Lines 310, 330, 338: Tab 3 Lighting media badges (`"Thực Hành Setup Ánh Sáng"`, `"BẤM ĐỂ XEM VIDEO"`, `"VIDEO THỰC CHIẾN 0{selectedLightIndex + 1}"`).
   - Lines 390, 409, 412, 418-427, 444-452, 456: Tab 4 Process badges (`"Quy Trình Sản Xuất 1 Buổi/Tuần"`, `"MODULE 1 • QUY TRÌNH 5 BƯỚC"`, `"1 BUỔI / TUẦN"`, 5-step pills `"💡 Ý Tưởng → 📝 Kịch Bản → 🎥 Quay → ✂️ Edit → 🚀 Đăng"`, 3 check tags `"✓ Quy Trình Rõ Ràng"`, `"✓ Lịch Đều Đặn"`, `"✓ AI Hỗ Trợ"`, `"QUY TRÌNH THỰC CHIẾN 0{selectedProcessIndex + 1}"`).
   - Lines 216, 295, 374, 491: Fragile `.replace(...)` string manipulations on video titles to create card labels.
   - Lines 518, 555, 563, 573, 587: Video modal labels (`"HD 1080p • Thực hành cùng thầy Việt"`, `"Mở Facebook Reel"`, `"Mở YouTube"`, `"Trợ Lý AI Độc Quyền"`).

10. **`src/sections/CurriculumSection.tsx`**:
    - Lines 30-70: 3 Class Event Photos are completely hardcoded in TSX:
      - Photo 1: `/assets/events/event_full_class.png` - `"🎓 Tốt nghiệp & trao giáo trình"`
      - Photo 2: `/assets/events/event_1on1_coaching.webp` - `"📱 Thầy Việt hướng dẫn 1 kèm 1"`
      - Photo 3: `/assets/events/event_studio_practice.jpg` - `"💻 Thực hành dựng clip tại lớp"`
    - Line 88: Tab label `"NGÀY {day.dayNumber}"`.
    - Line 137: Goal label `"Mục tiêu ngày học:"`.
    - Line 264: Bonus CTA button `"NHẬN TOÀN BỘ QUÀ TẶNG"`.

11. **`src/sections/MetaphorsSection.tsx`**:
    - Line 66: Format badge `"ĐỊNH DẠNG 0{idx + 1}"`.
    - Line 81: Box title `"🎯 Output Chuyển Đổi"`.
    - Line 92: Box title `"✨ Gỡ Bỏ Rào Cản"`.
    - Line 102: Prefix `"Ứng dụng:"`.
    - Lines 107-108: Card footer `"Thực hành tại lớp: 1 kèm 1"`.
    - Line 148: Action button `"LÀM CHỦ 4 ĐỊNH DẠNG VIDEO NÀY TẠI LỚP HỌC"`.

12. **`src/sections/GrowthChartSection.tsx`**:
    - Lines 101, 105: Chart series labels (`"Video Marketing Thực Chiến (Cấu trúc nén nhịp)"`, `"Video Tự Phát (Bản năng mở đầu lan man)"`).
    - Line 109: Unit label `"Đơn vị: Tỷ lệ khán giả còn ở lại trên timeline (%)"`.
    - Lines 179, 187: Citation labels (`"Nguồn: "`, `"Xem báo cáo gốc"`).

13. **`src/sections/ShowcaseSection.tsx`**:
    - Line 231: Play button `"XEM VIDEO"`.
    - Line 240: Link text `"Mở video"`.
    - Line 271: Mobile hint `"← Vuốt ngang để xem thêm video →"`.
    - Lines 137, 146: Aria labels.

14. **`src/sections/CaseStudySection.tsx`**:
    - Line 61: Badge `"Walk & Talk"`.
    - Line 68: Play hint `"BẤM ĐỂ XEM VIDEO"`.
    - Line 92: Prefix `"Ngách: "`.
    - Line 105: Header `"Điểm Đột Phá Thực Chiến:"`.
    - Line 124: Button text `"Xem Video Thực Hành"`.
    - Line 133: Link text `"Mở YouTube"`.
    - Line 160: Modal prefix `"Video Thực Tế: "`.

15. **`src/sections/TargetSection.tsx`**:
    - Line 28: Column header `"RẤT PHÙ HỢP NẾU BẠN LÀ:"`.
    - Line 47: Column header `"KHÔNG PHÙ HỢP NẾU BẠN:"`.

16. **`src/sections/FaqSection.tsx`**:
    - Line 23: Badge `"GIẢI ĐÁP THẮC MẮC"`.
    - Line 25: Headline `"Câu hỏi thường gặp"`.
    - Line 28: Description `"Tất cả những thắc mắc phổ biến nhất của học viên trước khi tham gia khóa học offline 2 ngày tại Hà Nội."`.

17. **`src/sections/BannerCta.tsx` & `src/App.tsx`**:
    - `BannerCta.tsx` has hardcoded default props (`"Làm chủ kỹ năng video marketing 2 ngày thực chiến cùng thầy Việt"`, `"SĨ SỐ GIỚI HẠN ≤ 40 HỌC VIÊN"`).
    - `App.tsx` line 52 passes inline hardcoded strings:
      `<BannerCta onOpenRegister={() => setModalOpen(true)} title="Thực hành cầm tay chỉ việc 1-1 cùng Nguyễn Đức Việt" badge="PHÒNG STUDIO CHUYÊN NGHIỆP" />`.

---

## 2. Logic Chain

```
[Observation 1.1, 1.3: ~45% of customer-facing text is scattered in TSX files]
  ↓
[Analysis: When an editor wants to update a phone number, course date, price notice, video link, or proof metric, they must grep through 14 section files and 4 component files]
  ↓
[Risk: Direct JSX editing risks syntax errors, broken layout wrappers, or mismatched dates across sections (e.g. 19-20/09/2026 vs Thứ 7 & Chủ Nhật)]
  ↓
[Requirement R1: Centralize 100% of copywriting, button labels, media URLs, and statistics into src/content.ts]
  ↓
[Architecture Design: Expand ContentData interface into 21 clean modular domains. Each component in src/sections/ and src/components/ imports its slice from content, becoming a 100% pure view component]
  ↓
[Documentation: Create CONTENT_MAP.md pairing every visual section on the website with its exact content.ts key and edit instructions]
```

---

## 3. Comprehensive Target Schema for `src/content.ts`

To achieve 100% Single Source of Truth without any hardcoded strings in JSX, the proposed `src/content.ts` interface is structured as follows:

```typescript
export interface ContentData {
  // 1. Global Site & SEO Metadata
  site: {
    brandName: string;
    brandSubtitle: string;
    domain: string;
    url: string;
    hotline: string;
    zaloUrl: string;
    facebookPageUrl: string;
    youtubeChannelUrl: string;
    copyright: string;
  };

  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogUrl: string;
    twitterCard: string;
  };

  // 2. Navigation
  navbar: {
    brand: { title: string; subtitle: string };
    links: { label: string; href: string }[];
    cta: string;
    mobileCta: string;
  };

  // 3. Hero Section
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    tags: string[];
    meta: { id: 'time' | 'location' | 'capacity'; label: string; value: string; desc: string }[];
    cta: string;
    ctaNote: string;
  };

  // 4. Proof Section
  proof: {
    badge: string;
    headline: string;
    description: string;
    reportCard: {
      badge: string;
      stats: { label: string; value: string; growth: string; variant: 'normal' | 'amber' | 'emerald' }[];
      pillars: string[];
    };
    tabs: {
      id: string;
      shortLabel: string;
      badgeLabel: string;
      title: string;
      image: string;
      sourceBadge: string;
      caption: string;
      highlightMetric: string;
      icon: 'trending' | 'mouse' | 'phone';
    }[];
    channels: {
      headline: string;
      subheadline: string;
      updateDate: string;
      items: {
        id: string;
        title: string;
        desc: string;
        image: string;
        updateDate: string;
      }[];
    };
    ui: {
      zoomButton: string;
      zoomHint: string;
      closeModal: string;
    };
  };

  // 5. Definition Section (New Centralized Section)
  definition: {
    badge: string;
    headline: string;
    subheadline: string;
    columns: {
      id: string;
      variant: 'danger' | 'neutral' | 'highlight';
      badge?: string;
      tag: string;
      title: string;
      desc: string;
      points: { bold: string; text: string }[];
      result: string;
    }[];
    callout: {
      badge: string;
      quoteParts: string[];
      author: string;
      cta: string;
    };
  };

  // 6. Growth Chart Section
  chart: {
    badge: string;
    headline: string;
    description: string;
    legends: {
      marketing: string;
      normal: string;
      unit: string;
    };
    insights: {
      tag: string;
      title: string;
      desc: string;
      type: 'pain' | 'cause' | 'solution';
    }[];
    data: { month: string; marketing: number; normal: number }[];
    source: {
      label: string;
      studyName: string;
      url: string;
      viewReportText: string;
    };
    takeaway: {
      badge: string;
      headline: string;
      content: string;
    };
  };

  // 7. Metaphors Section (4 Formats)
  metaphors: {
    badge: string;
    headline: string;
    subheadline: string;
    formatPrefix: string;
    labels: {
      output: string;
      relief: string;
      application: string;
      practiceNote: string;
      practiceTag: string;
    };
    items: {
      id: string;
      icon: string;
      title: string;
      subtitle: string;
      videoUrl: string;
      poster: string;
      youtubeId: string;
      output: string;
      relief: string;
      application: string;
    }[];
    cta: string;
  };

  // 8. Pain Points Section
  painPoints: {
    badge: string;
    headline: string;
    subheadline: string;
    tabPrefix: string;
    sectionTag: string;
    outcomePrefix: string;
    tabs: {
      id: string;
      title: string;
      subtitle: string;
      points: string[];
      outcome: string;
      cards: { title: string; desc: string }[];
    }[];
    brollVideos: {
      id: string;
      title: string;
      shortTitle: string;
      subtitle: string;
      youtubeUrl: string;
      videoId: string;
      poster: string;
      desc: string;
      videoUrl?: string;
      fbUrl?: string;
    }[];
    scriptVideos: {
      id: string;
      title: string;
      shortTitle: string;
      subtitle: string;
      youtubeUrl: string;
      videoId: string;
      poster: string;
      desc: string;
      videoUrl?: string;
    }[];
    lightingVideos: {
      id: string;
      title: string;
      shortTitle: string;
      subtitle: string;
      youtubeUrl: string;
      videoId: string;
      poster: string;
      desc: string;
    }[];
    processVideos: {
      id: string;
      title: string;
      shortTitle: string;
      subtitle: string;
      youtubeUrl: string;
      videoId: string;
      poster: string;
      desc: string;
      videoUrl?: string;
    }[];
    tab4Overlays: {
      stepBadge: string;
      timeBadge: string;
      workflowPills: string[];
      valueTags: string[];
    };
    ui: {
      brollCategory: string;
      scriptCategory: string;
      lightingCategory: string;
      processCategory: string;
      playBrollText: string;
      playScriptText: string;
      playLightingText: string;
      playProcessText: string;
      modalQualityBadge: string;
      openFbReelText: string;
      openYoutubeText: string;
      aiBadgeText: string;
    };
  };

  // 9. Curriculum Section
  curriculum: {
    badge: string;
    headline: string;
    subheadline: string;
    eventPhotos: {
      image: string;
      caption: string;
    }[];
    dayPrefix: string;
    goalLabel: string;
    days: {
      dayNumber: string;
      timeRange: string;
      title: string;
      badgeCount: string;
      goal: string;
      morning: {
        sessionName: string;
        time: string;
        title: string;
        items: string[];
      };
      afternoon: {
        sessionName: string;
        time: string;
        title: string;
        items: string[];
      };
    }[];
    bonus: {
      tag: string;
      title: string;
      desc: string;
      cta: string;
    };
  };

  // 10. Mid-Page Banner CTA
  bannerCta: {
    badge: string;
    title: string;
    cta: string;
  };

  // 11. Showcase Section
  showcase: {
    badge: string;
    headline: string;
    subheadline: string;
    categories: { id: string; label: string }[];
    videos: {
      id: string;
      title: string;
      author: string;
      role: string;
      desc: string;
      poster: string;
      youtubeUrl?: string;
      videoUrl?: string;
      category: string;
      categoryLabel: string;
    }[];
    ui: {
      watchVideo: string;
      openVideo: string;
      swipeHint: string;
    };
  };

  // 12. Case Studies Section
  caseStudies: {
    badge: string;
    headline: string;
    subheadline?: string;
    formatBadge: string;
    playVideoBadge: string;
    nichePrefix: string;
    breakthroughTitle: string;
    watchButtonText: string;
    openYoutubeText: string;
    modalTitlePrefix: string;
    items: {
      name: string;
      role: string;
      niche: string;
      stats: string;
      story: string;
      videoId?: string;
      youtubeUrl?: string;
      poster?: string;
      highlights?: string[];
    }[];
  };

  // 13. Target Audience Section
  targetAudience: {
    badge: string;
    headline: string;
    fitHeader: string;
    notFitHeader: string;
    fit: { title: string; desc: string }[];
    notFit: { title: string; desc: string }[];
  };

  // 14. Instructor Section
  instructor: {
    badge: string;
    name: string;
    mainRole: string;
    subRole: string;
    avatar: string;
    bio: string[];
    stats: { number: string; label: string }[];
    quote: string;
  };

  // 15. In-Page Register Section
  register: {
    badge: string;
    headlinePrefix: string;
    headlineHighlight: string;
    meta: {
      time: { label: string; value: string; desc: string };
      location: { label: string; value: string; desc: string };
      scale: { label: string; value: string; desc: string };
    };
    inclusionsTitle: string;
    inclusions: string[];
    form: {
      title: string;
      subtitle: string;
      fields: {
        fullName: { label: string; placeholder: string; required: boolean };
        phone: { label: string; placeholder: string; required: boolean };
        email: { label: string; placeholder: string; required: boolean };
        occupation: { label: string; placeholder: string; required: boolean };
        reason: { label: string; placeholder: string; required: boolean };
      };
      disclaimer: string;
      cta: string;
      ctaSubmitting: string;
      securityNote: string;
      errors: {
        requiredFields: string;
        serverError: string;
        networkError: string;
      };
    };
  };

  // 16. FAQs Section
  faqSection: {
    badge: string;
    headline: string;
    description: string;
    items: { q: string; a: string }[];
  };

  // 17. Sticky Bottom Floating CTA
  stickyBottomCta: {
    badge: string;
    subtitle: string;
    cta: string;
  };

  // 18. Register Popup Modal
  registerModal: {
    badge: string;
    title: string;
    subtitle: string;
    fields: {
      fullName: { label: string; placeholder: string };
      phone: { label: string; placeholder: string };
      email: { label: string; placeholder: string };
      occupation: { label: string; placeholder: string };
      reason: { label: string; placeholder: string };
    };
    cta: string;
    ctaSubmitting: string;
    errors: {
      requiredFields: string;
      serverError: string;
      networkError: string;
    };
  };

  // 19. Success Page
  successPage: {
    badge: string;
    headline: string;
    description: string;
    summary: {
      time: { label: string; value: string };
      location: { label: string; value: string; note: string };
      scale: { label: string; value: string };
    };
    backHomeCta: string;
  };

  // 20. Footer Section
  footer: {
    brand: string;
    description: string;
    policyTitle: string;
    policyContent: string;
    copyright: string;
  };
}
```

---

## 4. Outline and Structure for `CONTENT_MAP.md`

`CONTENT_MAP.md` will be placed in the project root (`/Users/vietmac/Documents/CODE/offline/CONTENT_MAP.md`). It provides a direct lookup table for humans and AI agents to modify any piece of text within 5 seconds.

### Structure of `CONTENT_MAP.md`:
```markdown
# CONTENT_MAP.md — Bản Đồ Chỉnh Sửa Nội Dung offline.fedu.vn

> **Nguyên tắc:** 100% nội dung hiển thị nằm tại file `src/content.ts`. Tuyệt đối không cần sửa file TSX để đổi câu chữ, video, hình ảnh hoặc số liệu.

## Bảng Tra Cứu Nhanh Theo Giao Diện (Visual Lookup Table)

| Vị trí trên giao diện | Thành phần hiển thị | Tên biến trong `src/content.ts` | Ghi chú & Ví dụ chỉnh sửa |
|---|---|---|---|
| **Đầu trang (Header)** | Tên thương hiệu, menu | `content.navbar` | Thay đổi nhãn menu, link neo |
| **Hero (Màn hình 1)** | Badge giới hạn sĩ số | `content.hero.badge` | "GẶP MẶT TRỰC TIẾP · HÀ NỘI..." |
| | Tiêu đề chính (H1) | `content.hero.headline` | "Biến Chuyên Môn Của Bạn..." |
| | Đoạn giới thiệu (Subhead) | `content.hero.subheadline` | Đổi mô tả khóa học |
| | 9 Thẻ tính năng | `content.hero.tags` | Mảng các từ khóa |
| | 3 Thẻ thông tin (Thời gian, Địa điểm, Quy mô) | `content.hero.meta` | Đổi ngày tổ chức, số lượng học viên |
| | Nút CTA chính | `content.hero.cta`, `content.hero.ctaNote` | Đổi chữ trên nút và ghi chú |
| **Bằng chứng (Proof)** | Số liệu Meta Business Suite | `content.proof.reportCard` | Đổi lượt view (6,0M), click (50,8K), SĐT (428+) |
| | 3 Tab soi ảnh chứng thực HD | `content.proof.tabs` | Đổi ảnh dashboard, tiêu đề báo cáo |
| | 4 Thẻ kênh Triệu View | `content.proof.channels.items` | Đổi ảnh và follower Fanpage, TikTok, Reels |
| **Định nghĩa (Definition)** | So sánh 3 cột: Ads vs Trend vs Marketing | `content.definition.columns` | Thay đổi nội dung phân biệt, ưu nhược điểm |
| | Lời đúc kết từ thầy Việt | `content.definition.callout` | Đổi trích dẫn kinh nghiệm |
| **Biểu đồ (Growth Chart)**| Biểu đồ giữ chân Meta & Nielsen | `content.chart.data`, `content.chart.legends` | Thay đổi điểm phần trăm giữ chân theo giây |
| | 3 Khối Nỗi đau - Nút thắt - Đột phá | `content.chart.insights` | Đổi văn bản phân tích |
| | Kết luận 3 Tầng | `content.chart.takeaway` | Đổi góc nhìn tâm lý khách hàng |
| **4 Định dạng Video** | Thẻ 4 phong cách quay (Voice, Walk, Talk, Story) | `content.metaphors.items` | Đổi video mp4 minh họa, poster, youtube link |
| **4 Nút thắt (Pain Points)**| 4 Tab vấn đề học viên | `content.painPoints.tabs` | Đổi tiêu đề vướng mắc, giải pháp studio |
| | Video mẫu B-roll Bank, AI, Đèn, Quy trình | `content.painPoints.brollVideos`, `scriptVideos`, `lightingVideos`, `processVideos` | Thay link video thực tế, poster |
| **Lộ trình (Curriculum)** | 3 Ảnh thực tế lớp học | `content.curriculum.eventPhotos` | Đổi ảnh tốt nghiệp, 1-1, studio |
| | Nội dung 2 ngày học (Sáng / Chiều) | `content.curriculum.days` | Đổi bài học từng ca, mục tiêu ngày |
| | Quà tặng đặc quyền | `content.curriculum.bonus` | Đổi nội dung extension AI, preset |
| **Banner Kêu Gọi** | Dải banner giữa trang | `content.bannerCta` | Đổi khẩu hiệu và nút giữ chỗ |
| **Thành phẩm học viên** | Danh mục & 8 video học viên | `content.showcase.categories`, `content.showcase.videos` | Thêm/xóa video thành phẩm học viên |
| **Case Study** | Học viên tiêu biểu (Nương) | `content.caseStudies.items` | Đổi câu chuyện thực tế, video demo |
| **Đối tượng học viên** | Cột Phù hợp vs Không phù hợp | `content.targetAudience.fit`, `content.targetAudience.notFit` | Cập nhật tiêu chí tuyển sinh |
| **Giảng viên (Instructor)**| Ảnh, Chức danh, Bio, 4 Thống kê | `content.instructor` | Cập nhật số năm kinh nghiệm, bio thầy |
| **Form đăng ký (Register)** | Form điền thông tin, lưu ý học phí | `content.register` | Đổi thông tin thời gian, địa điểm, các cam kết |
| **Hỏi đáp (FAQ)** | Danh sách câu hỏi & câu trả lời | `content.faqSection.items` | Thêm câu hỏi thường gặp |
| **Chân trang (Footer)** | Quy định, cam kết, bản quyền | `content.footer` | Đổi chính sách sĩ số, năm bản quyền |
| **Thanh Sticky Mobile** | Thanh bám đáy màn hình điện thoại | `content.stickyBottomCta` | Đổi text giữ chỗ mobile |
| **Popup Đăng ký (Modal)** | Hộp thoại điền thông tin khi bấm nút | `content.registerModal` | Đổi tiêu đề popup, trường nhập liệu |
| **Trang Cảm Ơn (Success)** | Màn hình sau khi gửi form | `content.successPage` | Đổi hướng dẫn xác nhận qua Zalo |
| **SEO & Social Share** | Thẻ meta Google, Facebook OpenGraph | `content.seo` | Đổi tiêu đề chia sẻ Facebook, mô tả Google |

## Hướng Dẫn Thao Tác Trong 5 Giây

### Ví dụ 1: Muốn đổi ngày diễn ra khóa học
Mở `src/content.ts`:
- Tìm dòng `hero.meta`: sửa `value: "19–20/09/2026"` thành ngày mới.
- Tìm dòng `register.meta.time`: sửa `value: "19–20/09/2026"`.
- Lưu file. Giao diện tự động cập nhật đồng bộ ở cả trang chủ, form đăng ký và trang cảm ơn.

### Ví dụ 2: Muốn thay video YouTube của một thành phẩm học viên
Mở `src/content.ts`:
- Tìm `showcase.videos`: tìm học viên cần sửa (ví dụ `id: "alNkUUuE7fE"`).
- Sửa `youtubeUrl: "https://youtu.be/<VIDEO_ID_MOI>"`.
- Sửa `poster: "/assets/showcase/<ANH_MOI>.jpg"`.
- Lưu file.
```

---

## 5. Caveats

1. **Scope Boundary**: As an Explorer agent in read-only investigation mode, no files inside `src/` or `public/` have been modified during this phase. All designs and code structures are prepared for the execution agent.
2. **Current `content.ts` Compatibility**: The existing `content.ts` already has portions of `hero`, `proof`, `chart`, `painPoints`, `metaphors`, `curriculum`, `showcase`, `caseStudies`, `targetAudience`, `instructor`, and `faqs`. However, the types must be expanded non-destructively so that any existing fields are preserved while missing fields (`definition`, `register`, `navbar`, `footer`, `stickyBottomCta`, `registerModal`, `successPage`, `bannerCta`, `seo`, etc.) are cleanly integrated.
3. **Build Threshold**: The current build gzip JS size is 96.09 kB, comfortably under the 120 kB threshold. Adding textual structures to `src/content.ts` will add ~3-5 kB uncompressed (~1.2 kB gzip), well within safe performance limits.

---

## 6. Conclusion

1. **Current State Assessment**: The project has an existing `src/content.ts`, but it only covers approximately 55% of the visible copywriting. The remaining 45% (including entire sections like `DefinitionSection`, `RegisterSection`, `Navbar`, `Footer`, `RegisterModal`, `SuccessPage`, plus detailed proof metrics, event photos, and modal copy) is hardcoded directly into JSX components.
2. **Readiness**: All 19 TSX files have been mapped with line-by-line precision. The 21-category schema for `src/content.ts` and the `CONTENT_MAP.md` blueprint are fully specified and ready for implementation.
3. **Execution Path**:
   - **Step 1**: Update `src/content.ts` with the complete 21-category schema and populate 100% of data.
   - **Step 2**: Refactor the 14 sections and 4 components to consume their respective keys from `content.ts`.
   - **Step 3**: Verify fast modification capability by editing a field in `content.ts` and testing immediate reflection on the UI.
   - **Step 4**: Commit `CONTENT_MAP.md` to root.

---

## 7. Verification Method

To independently verify this survey report and subsequent implementations:

1. **TypeScript Verification**:
   ```bash
   npm run typecheck
   ```
   *Expected Result*: Exits with code 0 (no TypeScript errors).

2. **Production Build Verification**:
   ```bash
   npm run build
   ```
   *Expected Result*: Exits with code 0, generates `dist/assets/index-*.js` with gzip size < 120 kB.

3. **Grep Search for Hardcoded Copywriting**:
   Verify that no Vietnamese marketing strings remain in `src/sections/` and `src/components/` by checking that all components import from `../content` or `./content` and reference `content.<section>.*`.

4. **Fast Modification Test**:
   - Edit `hero.badge` in `src/content.ts` to `"TEST KHẢ NĂNG SỬA NHANH"`.
   - Run `npm run build` or `npm run dev` and verify that the badge on the page reflects the new text instantly with zero changes to `HeroSection.tsx`.
   - Revert back to the original text.

