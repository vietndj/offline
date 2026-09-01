export interface ContentData {
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    tags: string[];
    meta: { label: string; value: string; desc: string }[];
    cta: string;
    ctaNote: string;
  };
  proof: {
    badge: string;
    headline: string;
    revenue: string;
    timeline: string;
    dailyPeak: string;
    description: string;
    dashboardImg: string;
    offlineClassImg: string;
    mockups: {
      fanpage: string;
      tiktok: string;
      tiktokStats: string;
      fbReels: string;
      tiktokVideo: string;
    };
  };
  chart: {
    badge: string;
    headline: string;
    description: string;
    data: { month: string; marketing: number; normal: number }[];
    bullets: { title: string; normal: string; marketing: string }[];
  };
  painPoints: {
    badge: string;
    headline: string;
    subheadline: string;
    tabs: {
      id: string;
      title: string;
      subtitle: string;
      points: string[];
      outcome: string;
      media: string;
      cards: { title: string; desc: string }[];
    }[];
  };
  curriculum: {
    badge: string;
    headline: string;
    subheadline: string;
    days: {
      day: string;
      date: string;
      theme: string;
      summary: string;
      modules: { time: string; title: string; desc: string; bullets: string[] }[];
    }[];
  };
  showcase: {
    badge: string;
    headline: string;
    subheadline: string;
    videos: { id: string; title: string; author: string; role: string; desc: string }[];
  };
  caseStudies: {
    badge: string;
    headline: string;
    items: {
      name: string;
      role: string;
      niche: string;
      stats: string;
      story: string;
      image?: string;
    }[];
  };
  targetAudience: {
    badge: string;
    headline: string;
    fit: { title: string; desc: string }[];
    notFit: { title: string; desc: string }[];
  };
  instructor: {
    badge: string;
    name: string;
    role: string;
    avatar: string;
    bio: string[];
    stats: { number: string; label: string }[];
    quote: string;
  };
  faqs: { q: string; a: string }[];
}

export const content: ContentData = {
  hero: {
    badge: "GẶP MẶT TRỰC TIẾP · HÀ NỘI · SĨ SỐ GIỚI HẠN",
    headline: "Biến Chuyên Môn Của Bạn Thành Video Marketing Đắt Giá",
    subheadline: "Khóa học offline 2 ngày cầm tay chỉ việc giúp chuyên gia, giảng viên, coach và người làm giáo dục làm chủ toàn bộ quy trình: Viết kịch bản One-line, setup 2 góc quay điện thoại, edit video chuyên nghiệp và ứng dụng AI tự động hóa. Không cần giỏi kỹ thuật từ trước.",
    tags: [
      "KỊCH BẢN CHUYỂN ĐỔI",
      "SETUP 2 GÓC QUAY",
      "QUAY 2 CAM",
      "EDIT CHUYÊN NGHIỆP",
      "AI TỰ ĐỘNG HÓA"
    ],
    meta: [
      { label: "THỜI GIAN", value: "2 Ngày Thực Chiến", desc: "Thứ 7 & Chủ Nhật (08:30 - 17:30)" },
      { label: "ĐỊA ĐIỂM", value: "Hà Nội", desc: "Phòng Studio tiêu chuẩn FEDU" },
      { label: "QUY MÔ", value: "≤ 30 Học Viên", desc: "Kèm cặp 1-1 ra sản phẩm ngay tại lớp" }
    ],
    cta: "ĐĂNG KÝ GIỮ CHỖ NGAY",
    ctaNote: "Chỉ nhận tối đa 30 học viên mỗi đợt để đảm bảo chất lượng cầm tay chỉ việc."
  },
  proof: {
    badge: "VÀ ĐÂY LÀ KẾT QUẢ THỰC TẾ",
    headline: "Doanh Thu Từ Video Marketing Có Cấu Trúc",
    revenue: "912.936.999 VNĐ",
    timeline: "Sau 75 ngày vừa làm sản phẩm từ số 0 vừa bán",
    dailyPeak: "Có ngày đạt > 43.939.000 VNĐ / ngày",
    description: "Tất cả đều được xây dựng trên những Fanpage & kênh TikTok hoàn toàn mới, bắt đầu từ con số 0 nhờ đúng công thức Video Marketing có cấu trúc chuyển đổi.",
    dashboardImg: "/assets/image_1781254269670-D7DNqlA1.png",
    offlineClassImg: "/assets/image_1781257789234-CGDyQOer.png",
    mockups: {
      fanpage: "/assets/image_1781259464562-cWhsbWKV.png",
      tiktok: "/assets/image_1781259495026-yBmDnAJ1.png",
      tiktokStats: "/assets/image_1781281379611-PpKU1pTE.png",
      fbReels: "/assets/image_1781281388562-DGSN1Etr.png",
      tiktokVideo: "/assets/image_1781281916199-DoWUR6eO.png"
    }
  },
  chart: {
    badge: "HIỆU SUẤT TĂNG TRƯỞNG",
    headline: "Video Marketing mang thu nhập và thương hiệu X10 lần so với video thông thường",
    description: "Khi làm video theo bản năng, bạn tốn rất nhiều thời gian nhưng người xem lướt qua nhanh và không có chuyển đổi. Khi có cấu trúc kịch bản và góc quay chuyển đổi, từng video đều trở thành cỗ máy thu hút khách hàng tiềm năng 24/7.",
    data: [
      { month: "Tháng 1", marketing: 20, normal: 18 },
      { month: "Tháng 2", marketing: 28, normal: 20 },
      { month: "Tháng 3", marketing: 64, normal: 30 },
      { month: "Tháng 4", marketing: 56, normal: 35 },
      { month: "Tháng 5", marketing: 75, normal: 48 },
      { month: "Tháng 6", marketing: 90, normal: 52 }
    ],
    bullets: [
      {
        title: "Khả năng giữ chân người xem (Retention Rate)",
        normal: "Lướt qua sau 1-2 giây vì mở đầu dài dòng, thiếu điểm nhấn",
        marketing: "Hook 3 giây sắc bén bóc đúng nỗi đau, giữ chân >60% tới cuối video"
      },
      {
        title: "Tỷ lệ chuyển đổi ra tin nhắn & đơn hàng",
        normal: "Lẹt đẹt vài like của người quen, không ai hỏi mua khóa học hay dịch vụ",
        marketing: "Khách hàng tiềm năng tự động inbox hỏi tư vấn và đăng ký đều đặn mỗi ngày"
      },
      {
        title: "Thời gian sản xuất & sự bền bỉ",
        normal: "Mất 1-2 ngày mò mẫm làm 1 clip, làm 3 hôm là nản rồi bỏ cuộc",
        marketing: "Quy trình chuẩn hóa 1 buổi quay được cả tuần, AI hỗ trợ kịch bản 30 ngày"
      }
    ]
  },
  painPoints: {
    badge: "THÁO GỠ NÚT THẮT",
    headline: "Tháo Gỡ 4 Nút Thắt Lớn Nhất Khi Làm Video Marketing Giáo Dục",
    subheadline: "Trong 2 ngày học trực tiếp, Thầy Việt sẽ cùng bạn tháo gỡ triệt để từng điểm nghẽn để bạn tự tin làm video mượt mà.",
    tabs: [
      {
        id: "tab-1",
        title: "1. Bật máy lên là đơ",
        subtitle: "Không biết nói gì trước camera",
        points: [
          "Sợ ống kính, nói vấp, nhìn vào camera bị gượng gạo",
          "Nghĩ trong đầu rất hay nhưng khi bấm quay thì quên sạch từ",
          "Giải pháp: Khung mở đầu Hook 3 giây + Kỹ thuật ngắt câu từng nhịp không sợ vấp",
          "Kỹ thuật chèn góc quay phụ (B-roll) che sạch lỗi nói vấp cực kỳ tự nhiên"
        ],
        outcome: "Tự tin bấm máy và nói lưu loát, không còn cảm giác ngại ngùng trước ống kính.",
        media: "/assets/gif2_opt-CAxvnZZj.webp",
        cards: [
          { title: "Hook 3s Đầu", desc: "Đập tan tâm lý do dự bằng câu mở đầu gãy gọn đánh thẳng vào vấn đề." },
          { title: "Mạch Dẫn Ý", desc: "Chia nhỏ kịch bản thành 3-4 câu ngắn, nói từng câu một rồi cắt ghép." },
          { title: "Điểm Chốt CTA", desc: "Lời kêu gọi hành động tự nhiên, không gượng ép bán hàng." }
        ]
      },
      {
        id: "tab-2",
        title: "2. Kịch bản lan man",
        subtitle: "Nói dài dòng nhưng không có chuyển đổi",
        points: [
          "Nói quá nhiều kiến thức hàn lâm khiến người xem buồn ngủ",
          "Video nhiều view nhưng không ai nhắn tin hỏi dịch vụ hay khóa học",
          "Giải pháp: Công thức Kịch bản One-line (1 Video chỉ giải quyết đúng 1 vấn đề)",
          "Cấu trúc 5 bước: Hook → Bóc Nỗi Đau → Insight Mới → Giải Pháp → Lời Kêu Gọi"
        ],
        outcome: "Mỗi video làm ra đều có mục đích chuyển đổi rõ ràng, nói ngắn mà thấm sâu.",
        media: "/assets/gif3_opt-BENmiLaC.webp",
        cards: [
          { title: "One-line Formula", desc: "Khóa chặt thông điệp cốt lõi trước khi bấm máy, bỏ hết phần thừa." },
          { title: "Cắt Bỏ Rườm Rà", desc: "Loại bỏ 50% câu chữ sáo rỗng để tập trung vào giá trị thực tế." },
          { title: "Khung Chuyển Đổi", desc: "Dẫn dắt người xem từ sự tò mò sang mong muốn sở hữu giải pháp." }
        ]
      },
      {
        id: "tab-3",
        title: "3. Video nhìn nghiệp dư",
        subtitle: "Hình ảnh tối, âm thanh rè, góc quay đơn điệu",
        points: [
          "Hình ảnh bị tối, da mặt nhợt nhạt, phòng quay lộn xộn",
          "Âm thanh có tiếng vang, tiếng ồn xung quanh nghe rất khó chịu",
          "Giải pháp: Kỹ thuật setup 2 góc quay điện thoại tạo cảm giác như trường quay chuyên nghiệp",
          "Cách bố trí ánh sáng tự nhiên + đèn cơ bản giúp hình ảnh trong trẻo, da sáng đẹp"
        ],
        outcome: "Video có chiều sâu điện ảnh, âm thanh rõ nét giúp nâng tầm uy tín chuyên gia.",
        media: "/assets/gif4_opt-CoJcWNzO.webp",
        cards: [
          { title: "2 Góc Máy Điện Thoại", desc: "1 góc chính diện + 1 góc cận 45 độ tạo nhịp cắt chuyển cảnh sinh động." },
          { title: "Ánh Sáng Trong Trẻo", desc: "Bố trí đèn keylight & fill light chuẩn giúp da sáng mịn tự nhiên." },
          { title: "Âm Thanh Chuẩn Studio", desc: "Lọc tạp âm, cân bằng âm lượng giúp giọng nói ấm và rõ ràng." }
        ]
      },
      {
        id: "tab-4",
        title: "4. Cả thèm chóng chán",
        subtitle: "Không duy trì được tần suất đăng đều đặn",
        points: [
          "Mỗi lần làm video là một cực hình mò mẫm từ sáng đến tối",
          "Làm được vài clip rồi cạn kiệt ý tưởng, bỏ bẵng kênh cả tháng",
          "Giải pháp: Quy trình sản xuất theo tuần (1 buổi quay đóng gói cả tuần nội dung)",
          "Bộ Prompt AI độc quyền gợi ý 30 góc kịch bản viral chỉ trong 5 phút"
        ],
        outcome: "Sở hữu cỗ máy sản xuất video bền bỉ, tiết kiệm 80% thời gian sản xuất.",
        media: "/assets/image_1782189176146-dnh32Fxr.png",
        cards: [
          { title: "Lịch Sản Xuất Tuần", desc: "Tách bạch khâu viết kịch bản, khâu quay và khâu dựng thành quy trình." },
          { title: "Kho Ý Tưởng AI", desc: "Ứng dụng AI đào sâu góc nhìn thực chiến, không lo bí đề tài." },
          { title: "Tái Sử Dụng Nội Dung", desc: "1 kịch bản chuyển đổi thành video ngắn, bài viết và chuỗi email." }
        ]
      }
    ]
  },
  curriculum: {
    badge: "CHƯƠNG TRÌNH ĐÀO TẠO 2 NGÀY",
    headline: "Lộ Trình Cầm Tay Chỉ Việc Từng Bước",
    subheadline: "Thiết kế thực chiến 100% — Học đến đâu bấm máy và dựng thành phẩm ngay trên lớp đến đó.",
    days: [
      {
        day: "NGÀY 01",
        date: "Thứ Bảy (08:30 - 17:30)",
        theme: "Làm Chủ Công Cụ Edit & Tư Duy Hình Ảnh Chuẩn Chuyên Gia",
        summary: "Nắm vững kỹ thuật dựng video nhanh, chuyển cảnh mượt mà và tối ưu âm thanh, màu sắc chuyên nghiệp.",
        modules: [
          {
            time: "08:30 - 10:00",
            title: "Tư duy ngôn ngữ hình ảnh & Cỡ cảnh điện ảnh",
            desc: "Hiểu đúng cách khán giả tiếp nhận video. Quy tắc toàn - trung - cận để không bao giờ bị nhàm chán.",
            bullets: ["Quy tắc 3 giây đầu giữ chân", "Tỷ lệ khung hình 9:16 chuẩn đa nền tảng", "Cách ngắt nhịp hình ảnh theo câu nói"]
          },
          {
            time: "10:15 - 12:00",
            title: "Làm chủ phần mềm dựng video (CapCut PC / Premiere)",
            desc: "Thiết lập không gian làm việc khoa học, học các phím tắt dựng thần tốc x3 tốc độ làm việc.",
            bullets: ["Cắt gọt footage bỏ phần thừa", "Tự động tạo phụ đề auto-caption chuẩn tiếng Việt", "Highlight từ khóa giữ nhịp thị giác"]
          },
          {
            time: "13:30 - 15:30",
            title: "Chỉnh màu, làm đẹp da & Thiết kế âm thanh (Sound Design)",
            desc: "Biến video quay bằng điện thoại thành hình ảnh trong trẻo, mịn da tự nhiên và âm thanh sống động.",
            bullets: ["Cân bằng sáng tối và tone màu da", "Phối nhạc nền BGM đúng cảm xúc", "Chèn hiệu ứng âm thanh SFX tạo điểm nhấn"]
          },
          {
            time: "15:45 - 17:30",
            title: "Thực hành dựng hoàn chỉnh video mẫu đầu tiên",
            desc: "Tự tay dựng 1 video hoàn chỉnh từ source có sẵn dưới sự kèm cặp trực tiếp của Thầy Việt.",
            bullets: ["Xuất file chuẩn 1080x1920 60fps nét căng", "Checklist kiểm tra 10 lỗi thường gặp trước khi đăng"]
          }
        ]
      },
      {
        day: "NGÀY 02",
        date: "Chủ Nhật (08:30 - 17:30)",
        theme: "Kịch Bản One-line · Setup Quay 2 Cam · Hoàn Thiện Thành Phẩm",
        summary: "Bấm máy thực tế với 2 góc quay điện thoại và xuất bản video hoàn chỉnh của chính bạn ngay tại lớp.",
        modules: [
          {
            time: "08:30 - 10:00",
            title: "Công thức viết Kịch bản One-line & Ứng dụng AI",
            desc: "Xác định thông điệp cốt lõi và dùng Prompt AI tạo khung kịch bản chuyển đổi cho chính ngành nghề của bạn.",
            bullets: ["Công thức Vấn đề → Nỗi đau → Giải pháp → CTA", "Prompt AI tạo 30 ý tưởng kịch bản", "Thầy Việt sửa kịch bản trực tiếp cho từng học viên"]
          },
          {
            time: "10:15 - 12:00",
            title: "Thực hành Setup ánh sáng, micro và 2 góc quay điện thoại",
            desc: "Trực tiếp bố trí đèn, micro và căn chỉnh 2 góc máy ngay trong phòng studio của lớp học.",
            bullets: ["Setup góc máy chính diện & góc 45 độ", "Kỹ thuật thu âm không vang, không rè", "Cách nhìn camera và biểu cảm tự nhiên"]
          },
          {
            time: "13:30 - 16:00",
            title: "Quay & Dựng thành phẩm video của chính bạn",
            desc: "Bạn trực tiếp quay kịch bản của mình và dựng thành phẩm ngay trên laptop/điện thoại.",
            bullets: ["Ghép 2 góc máy cắt nhịp mượt mà", "Chèn B-roll và text overlay bổ trợ", "Sửa từng frame hình cho từng học viên"]
          },
          {
            time: "16:15 - 17:30",
            title: "Chiến lược phân phối đa kênh & Xây dựng phễu chuyển đổi",
            desc: "Đóng gói video thành cỗ máy chuyển đổi ra khách hàng và lộ trình duy trì đều đặn sau khóa học.",
            bullets: ["Chiến lược đăng đa nền tảng TikTok/Reels/Shorts", "Khung chuyển đổi từ video sang tin nhắn tư vấn", "Trao chứng nhận & Tham gia nhóm hỗ trợ trọn đời"]
          }
        ]
      }
    ]
  },
  showcase: {
    badge: "KẾT QUẢ TỪ LỚP HỌC",
    headline: "Video Thành Phẩm Học Viên Làm Được Ngay Tại Lớp",
    subheadline: "Từ những người chưa từng biết quay dựng, sau 2 ngày cầm tay chỉ việc đã tự tin sản xuất video chuyên nghiệp.",
    videos: [
      {
        id: "zcaVzUlj37s",
        title: "Video Thành Phẩm Học Viên 01",
        author: "Chị Minh Anh",
        role: "Giảng viên Yoga & Trị liệu",
        desc: "Ứng dụng kỹ thuật 2 góc máy và cắt nhịp gãy gọn, video đạt hơn 85.000 view tự nhiên trong tuần đầu."
      },
      {
        id: "alNkUUuE7fE",
        title: "Video Thành Phẩm Học Viên 02",
        author: "Anh Hoàng Dũng",
        role: "Coach Tài chính cá nhân",
        desc: "Kịch bản One-line đi thẳng vào nỗi đau quản lý dòng tiền, thu hút 35 khách hàng tiềm năng đăng ký tư vấn 1-1."
      },
      {
        id: "eyhfBYZfbPk",
        title: "Video Thành Phẩm Học Viên 03",
        author: "Chị Thanh Hương",
        role: "Chủ thương hiệu Mỹ phẩm thảo mộc",
        desc: "Setup ánh sáng trong trẻo và B-roll cận cảnh chất kem, tỷ lệ chuyển đổi đơn hàng tăng gấp đôi."
      }
    ]
  },
  caseStudies: {
    badge: "CÂU CHUYỆN THÀNH CÔNG",
    headline: "Học Viên Thực Tế Nói Gì Sau Khi Áp Dụng",
    items: [
      {
        name: "Hivi Hiếu Nguyễn",
        role: "Chuyên gia Đào tạo AI & Tự động hóa",
        niche: "Khóa học AI cho doanh nghiệp",
        stats: "> 200 Học viên sau 3 tháng",
        story: "Từ kênh TikTok mới hoàn toàn, nhờ công thức kịch bản và nhịp cắt gãy gọn, kênh đã thu hút hơn 222 học viên tham gia lớp chuyên sâu mà không cần chi tiền quảng cáo lớn.",
        image: "/assets/image_1782111290168-91rX6BTq.png"
      },
      {
        name: "Phương Nguyễn English",
        role: "Giảng viên Tiếng Anh giao tiếp",
        niche: "Khóa học Tiếng Anh cho người đi làm",
        stats: "> 120 Học viên trong 30 ngày đầu",
        story: "Trước đây quay video bị gượng và dài dòng. Sau khi áp dụng 2 góc quay điện thoại và kịch bản One-line, các video chia sẻ tình huống công sở đã chạm đúng tệp người đi làm và nổ inbox đăng ký.",
        image: "/assets/image_1782111083758-D1lt1pEb.png"
      }
    ]
  },
  targetAudience: {
    badge: "BỘ LỌC ĐỐI TƯỢNG",
    headline: "Khóa Học Này Dành Cho Ai?",
    fit: [
      { title: "Giảng viên, Giáo viên, Coach & Mentor", desc: "Muốn đóng gói kiến thức chuyên môn thành video bài giảng, video marketing thu hút học viên tự nhiên." },
      { title: "Chuyên gia, Bác sĩ, Luật sư, Tư vấn viên", desc: "Muốn xây dựng thương hiệu cá nhân uy tín, khẳng định vị thế chuyên gia trong ngành." },
      { title: "Chủ trung tâm đào tạo, Chủ shop dịch vụ", desc: "Muốn tự làm chủ quy trình làm video marketing cho cơ sở kinh doanh mà không phụ thuộc vào agency." },
      { title: "Người làm nội dung giáo dục & đào tạo", desc: "Muốn nâng cấp chất lượng hình ảnh từ nghiệp dư lên chuẩn studio chuyên nghiệp." }
    ],
    notFit: [
      { title: "Người muốn 'ăn xổi', câu view bằng scandal", desc: "Khóa học tập trung vào Video Marketing Chuyên Môn tạo giá trị thật và chuyển đổi bền vững." },
      { title: "Người lười thực hành, chỉ muốn nghe lý thuyết", desc: "Khóa học thiết kế 80% là thực hành trên máy, đòi hỏi bạn phải bắt tay vào làm." },
      { title: "Người không thể sắp xếp tham gia trọn vẹn 2 ngày", desc: "Chương trình liên hoàn từ Ngày 1 sang Ngày 2, cần đi đủ để ra được video thành phẩm." }
    ]
  },
  instructor: {
    badge: "GIẢNG VIÊN ĐỒNG HÀNH",
    name: "Thầy Nguyễn Đức Việt",
    role: "Founder FEDU · Giảng viên FPT Arena Multimedia (15+ năm kinh nghiệm)",
    avatar: "/assets/image_1781192246239-Dsb4zlhm.png",
    bio: [
      "15+ năm trực tiếp giảng dạy và đào tạo thiết kế, mỹ thuật đa phương tiện, lập trình và video marketing tại FPT Arena Multimedia và hệ thống FEDU.",
      "Đã đào tạo hơn 50.000+ học viên từ sinh viên, người đi làm, chủ doanh nghiệp đến các creator xây dựng kênh chuyển đổi triệu view.",
      "Phương pháp đào tạo độc quyền: Dạy từ gốc rễ tư duy ngôn ngữ hình ảnh, biến công nghệ phức tạp thành các thao tác đơn giản, dễ hiểu và áp dụng được ngay trên thiết bị có sẵn."
    ],
    stats: [
      { number: "15+", label: "Năm kinh nghiệm đào tạo" },
      { number: "50.000+", label: "Học viên trên toàn quốc" },
      { number: "100%", label: "Thực hành cầm tay chỉ việc" }
    ],
    quote: "Làm video marketing không đòi hỏi máy ảnh đắt tiền hay kỹ xảo phức tạp. Khi bạn nắm đúng cấu trúc kịch bản và tư duy góc quay, chỉ với 1 chiếc điện thoại bạn cũng có thể tạo ra những video đắt giá."
  },
  faqs: [
    {
      q: "Tôi chưa từng quay dựng video bao giờ thì có học được không?",
      a: "Hoàn toàn học được! Khóa học được thiết kế từ con số 0, Thầy Việt sẽ cầm tay chỉ việc từ cách cầm máy, căn góc, bật phần mềm dựng đến từng thao tác bấm chuột. 100% học viên tham gia đều hoàn thành video của mình ngay tại lớp."
    },
    {
      q: "Tôi cần chuẩn bị thiết bị gì khi đi học?",
      a: "Bạn chỉ cần mang theo 1 chiếc Smartphone (iPhone hoặc Android) và 1 Laptop (Windows hoặc Mac) đã cài sẵn CapCut PC. Toàn bộ đèn studio, micro và chân máy sẽ được ban tổ chức chuẩn bị sẵn tại phòng học."
    },
    {
      q: "Khóa học offline 2 ngày này khác gì so với học online?",
      a: "Khác biệt lớn nhất là sự CẦM TAY CHỈ VIỆC và SỬA LỖI TRỰC TIẾP. Bạn được Thầy Việt sửa từng câu kịch bản, chỉnh từng góc máy, nắn từng nét cắt trên timeline và giải đáp thắc mắc ngay lập tức, tiết kiệm hàng tháng trời tự mày mò."
    },
    {
      q: "Sau 2 ngày học tôi sẽ nhận được những gì?",
      a: "Bạn sẽ có: 1 video thành phẩm hoàn chỉnh do chính bạn quay dựng tại lớp; bộ khung kịch bản One-line cho ngành của bạn; bộ Prompt AI viết kịch bản 30 ngày; kho source âm thanh bản quyền và quyền tham gia nhóm hỗ trợ kèm cặp sau khóa."
    },
    {
      q: "Sĩ số lớp học là bao nhiêu người?",
      a: "Để đảm bảo chất lượng kèm cặp 1-1, mỗi khóa chỉ nhận tối đa 30 học viên. Khi đủ số lượng, cổng đăng ký sẽ tự động đóng lại."
    },
    {
      q: "Địa điểm và thời gian học cụ thể ở đâu?",
      a: "Lớp học diễn ra trong 2 ngày Thứ 7 & Chủ Nhật (08:30 - 17:30) tại phòng Studio tiêu chuẩn của FEDU tại Hà Nội. Địa chỉ chi tiết sẽ được gửi qua Zalo/Email ngay sau khi bạn hoàn tất đăng ký giữ chỗ."
    },
    {
      q: "Sau khi học xong nếu gặp khó khăn thì có được hỗ trợ không?",
      a: "Có! Bạn được tham gia nhóm Zalo học viên kín của Thầy Việt để gửi bài, nhận góp ý và được hỗ trợ giải đáp thắc mắc liên tục trong suốt quá trình xây kênh sau này."
    }
  ]
};
