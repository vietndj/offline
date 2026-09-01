export interface ContentConfig {
  site: {
    title: string;
    description: string;
    keywords: string;
    brand: string;
    domain: string;
    ogImage: string;
  };
  event: {
    name: string;
    badge: string;
    dates: string;
    time: string;
    location: string;
    capacity: string;
    format: string;
  };
  hero: {
    tags: string[];
    headlinePrefix: string;
    headlineHighlight: string;
    subtitle: string;
    ctaButton: string;
    guaranteeNote: string;
  };
  proof: {
    badge: string;
    revenue: string;
    days: string;
    subRevenue: string;
    dailyPeak: string;
    note: string;
  };
  growthComparison: {
    title: string;
    highlight: string;
    subtitle: string;
    points: {
      organic: { label: string; desc: string };
      marketing: { label: string; desc: string };
    };
  };
  painPillars: {
    eyebrow: string;
    title: string;
    problem: string;
    solution: string;
    bullets: string[];
    outcome: string;
  }[];
  curriculum: {
    day1: {
      title: string;
      subtitle: string;
      desc: string;
      items: string[];
      outcome: string;
    };
    day2: {
      title: string;
      subtitle: string;
      desc: string;
      items: string[];
      outcome: string;
    };
  };
  showcase: {
    badge: string;
    title: string;
    subtitle: string;
    cases: {
      name: string;
      niche: string;
      result: string;
      desc: string;
      metrics: { label: string; value: string }[];
    }[];
  };
  targetAudience: {
    badge: string;
    title: string;
    suitable: string[];
    unsuitable: string[];
  };
  instructor: {
    name: string;
    title: string;
    role: string;
    avatar: string;
    bio: string[];
    coreValues: string[];
    quote: string;
  };
  includedGifts: {
    title: string;
    desc: string;
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
}

export const content: ContentConfig = {
  site: {
    title: "Khóa Học Offline Video Marketing 2 Ngày Tại Hà Nội | FEDU",
    description: "Khóa học offline 2 ngày tại Hà Nội do thầy Nguyễn Đức Việt (Founder FEDU) trực tiếp hướng dẫn: Viết kịch bản One-line, setup 2 góc quay điện thoại, edit video chuyên nghiệp và ứng dụng AI tự động hóa.",
    keywords: "video marketing offline fedu, nguyễn đức việt fedu, học quay video hà nội, edit video capcut premiere, video giáo dục chuyển đổi",
    brand: "FEDU OFFLINE",
    domain: "https://offline.fedu.vn",
    ogImage: "/opengraph.jpg"
  },
  event: {
    name: "Khóa Học Offline Video Marketing Thực Chiến 2 Ngày",
    badge: "LỚP HỌC TRỰC TIẾP TẠI HÀ NỘI",
    dates: "Thứ 7 & Chủ Nhật (09:00 – 17:00)",
    time: "09:00 – 17:00 mỗi ngày",
    location: "Hà Nội (Thông báo địa điểm & định vị chi tiết qua Zalo)",
    capacity: "Tối đa 30 học viên",
    format: "Cầm tay chỉ việc 100% — Làm ra video hoàn chỉnh ngay tại lớp"
  },
  hero: {
    tags: ["KỊCH BẢN CHUYỂN ĐỔI", "SETUP 2 GÓC QUAY", "EDIT VIDEO CHUYÊN NGHIỆP", "AI TỰ ĐỘNG HÓA"],
    headlinePrefix: "Biến Chuyên Môn Của Bạn Thành",
    headlineHighlight: "Video Marketing Đắt Giá",
    subtitle: "Khóa học offline 2 ngày giúp chuyên gia, giảng viên, coach và người kinh doanh giáo dục làm chủ toàn bộ quy trình quay dựng và kịch bản video chuyển đổi. Không cần giỏi kỹ thuật, chỉ cần điện thoại hoặc laptop là làm được ngay.",
    ctaButton: "ĐĂNG KÝ GIỮ CHỖ TRỰC TIẾP",
    guaranteeNote: "Giới hạn tối đa 30 học viên để đảm bảo chất lượng hướng dẫn và sửa video trực tiếp."
  },
  proof: {
    badge: "KẾT QUẢ THỰC CHIẾN TỪ HỆ THỐNG",
    revenue: "912.936.999 VNĐ",
    days: "75 ngày",
    subRevenue: "Doanh thu bán khóa học & sản phẩm giáo dục từ các kênh video hoàn toàn mới",
    dailyPeak: ">43.939.000 VNĐ / ngày cao điểm",
    note: "Không cần đội ngũ quay phim cồng kềnh. Tất cả bắt đầu từ đúng công thức kịch bản, 1 chiếc điện thoại và quy trình dựng video chuẩn."
  },
  growthComparison: {
    title: "SỰ KHÁC BIỆT GIỮA LÀM VIDEO TỰ PHÁT & VIDEO MARKETING",
    highlight: "Tăng Trưởng Bền Vững X10 Lần",
    subtitle: "Tại sao nhiều người làm cả trăm video vẫn không có khách, trong khi người hiểu đúng cấu trúc chỉ cần 1-2 video đã kín lịch tư vấn?",
    points: {
      organic: {
        label: "Làm Video Tự Phát / Bản Năng",
        desc: "Bật máy lên nói tùy hứng, nội dung lan man không có hook, video mờ nhạt, view lẹt đẹt và không bao giờ chuyển đổi thành học viên/khách hàng."
      },
      marketing: {
        label: "Video Marketing Chuẩn Chuyển Đổi FEDU",
        desc: "Mở đầu bóp nghẹt 3 giây đầu bằng hook đắt giá, dẫn dắt mạch lạc vào vấn đề thực tế, cài cắm giải pháp tinh tế và chốt bằng lời kêu gọi hành động tự nhiên."
      }
    }
  },
  painPillars: [
    {
      eyebrow: "GỠ NÚT THẮT #1",
      title: "Bật camera lên là đơ, không biết nói gì",
      problem: "Bạn có cả kho kiến thức chuyên môn, nhưng cứ đối diện với ống kính là ngượng ngùng, nói vấp hoặc không biết bắt đầu từ câu nào.",
      solution: "Bộ khung mở đầu Hook 3 giây + Công thức bóc tách ý tưởng từ chính chuyên môn hàng ngày của bạn.",
      bullets: [
        "Biết cách chọn chủ đề người xem đang thực sự tìm kiếm",
        "Mở đầu bằng câu hỏi đúng hoặc góc nhìn đủ cuốn để giữ chân người xem ngay từ 3 giây đầu",
        "Trình bày tự nhiên, có điểm dừng hơi, không bị học vẹt hay nhìn chằm chằm vào giấy",
        "Ứng dụng AI gợi ý 30 góc tiếp cận độc đáo nhưng vẫn giữ nguyên chất giọng riêng của bạn"
      ],
      outcome: "Bật máy lên là tự tin nói mạch lạc, không sợ ngượng miệng, quay 1 đúp là xong phần thô."
    },
    {
      eyebrow: "GỠ NÚT THẮT #2",
      title: "Kịch bản dài dòng, thiếu điểm chốt ra đơn",
      problem: "Nói rất tâm huyết suốt 3-5 phút nhưng người xem lướt qua sau 5 giây, hoặc xem hết video xong cũng không biết phải làm gì tiếp theo.",
      solution: "Công thức Kịch bản One-line + Cấu trúc 5 bước: Hook → Vấn đề → Insight → Giải pháp → CTA.",
      bullets: [
        "Biến một chủ đề phức tạp thành kịch bản video ngắn 45-60s cực kỳ cô đọng",
        "Cắt bỏ toàn bộ từ ngữ thừa, đoạn lan man làm loãng nhịp video",
        "Khung CTA (kêu gọi hành động) khéo léo: Dẫn học viên inbox, comment nhận tài liệu hoặc đăng ký khóa học",
        "Template kịch bản điền-vào-chỗ-trống áp dụng được cho mọi ngành nghề đào tạo"
      ],
      outcome: "Viết kịch bản nhanh trong 10 phút, có cấu trúc chặt chẽ, người xem nghe xong muốn hành động ngay."
    },
    {
      eyebrow: "GỠ NÚT THẮT #3",
      title: "Video nhìn nghiệp dư, sợ hình xấu âm rè",
      problem: "Nghĩ rằng phải đầu tư máy quay chục triệu, đèn studio phức tạp thì video mới đẹp. Quay bằng điện thoại thì mặt tối, background lộn xộn, tiếng vang rè.",
      solution: "Kỹ thuật setup 2 góc quay bằng điện thoại + Tận dụng ánh sáng tự nhiên và micro cài áo giá rẻ.",
      bullets: [
        "Setup góc quay chính diện (Talking Head) và góc quay phụ nghiêng 45 độ tạo cảm giác truyền hình chuyên nghiệp",
        "Bố cục khung hình 1/3, khoảng cách mắt, độ cao ống kính giúp gương mặt sáng và đáng tin cậy",
        "Xử lý lọc tạp âm và âm vang phòng ngủ/phòng làm việc chỉ bằng vài thao tác",
        "Kỹ thuật quay B-roll (thao tác tay, tài liệu, phản hồi học viên) để che khéo các đoạn nói vấp"
      ],
      outcome: "Tự quay video sáng rõ, góc máy chuyên nghiệp, âm thanh trong trẻo ngay tại nhà/văn phòng bằng điện thoại."
    },
    {
      eyebrow: "GỠ NÚT THẮT #4",
      title: "Cả thèm chóng chán, không có quy trình làm đều",
      problem: "Hôm nay hứng lên quay được 1 clip rồi bỏ bê cả tháng vì ngợp khâu edit, không có ai thúc đẩy và thiếu lịch trình bài bản.",
      solution: "Quy trình sản xuất nội dung 5 bước khép kín + Lịch trình theo tuần + AI hỗ trợ tự động.",
      bullets: [
        "Quy trình tuần: 1 buổi viết kịch bản → 1 buổi quay gom 5-7 clip → 1 buổi edit → Hẹn giờ đăng cả tuần",
        "Checklist kiểm tra 8 tiêu chí video chuẩn trước khi bấm đăng",
        "Dùng AI nhân bản 1 video dài thành 5 video ngắn đa nền tảng (TikTok, Reels, Shorts)",
        "Đo lường các chỉ số giữ chân (retention) để biết video nào hiệu quả và nhân bản"
      ],
      outcome: "Có cỗ máy sản xuất video vận hành trơn tru, làm video nhẹ nhàng như thói quen hàng tuần."
    }
  ],
  curriculum: {
    day1: {
      title: "NGÀY 1: LÀM CHỦ CÔNG CỤ EDIT & TƯ DUY THẨM MỸ VIDEO",
      subtitle: "Xóa mù kỹ thuật dựng phim — Dựng video mượt mà, chuyên nghiệp ngay trên máy của bạn",
      desc: "Học trực tiếp trên máy tính/laptop cá nhân. Thầy Việt hướng dẫn từng bước từ giao diện, phím tắt đến các thủ thuật dựng nhanh chuẩn công nghiệp.",
      items: [
        "Làm quen giao diện CapCut PC / Premiere Pro: Bố cục workspace khoa học, phím tắt tăng tốc độ dựng x3",
        "Kỹ thuật import, cắt cúp và sắp xếp timeline để video có nhịp điệu (pacing) cuốn hút, không bị giật cục",
        "Thêm tiêu đề giật tít, phụ đề tự động (auto-caption), highlight từ khóa quan trọng đúng phong cách hiện đại",
        "Xử lý màu sắc, cân bằng sáng và chỉnh mịn da tự nhiên mà không bị bết màu",
        "Phối nhạc nền (BGM) và hiệu ứng âm thanh (SFX) nhấn nhá đúng nhịp cảm xúc",
        "Checklist chuẩn bị xuất file: Bitrate, độ phân giải 1080x1920 60fps nét căng trên mọi nền tảng"
      ],
      outcome: "Hết Ngày 1, bạn tự tin mở phần mềm, import source thô và cắt dựng thành 1 video sạch đẹp, có phụ đề, âm thanh hoàn chỉnh."
    },
    day2: {
      title: "NGÀY 2: KỊCH BẢN · SETUP QUAY 2 CAM · EDIT THÀNH PHẨM TẠI LỚP",
      subtitle: "Từ ý tưởng đến video hoàn chỉnh sẵn sàng đăng — Cầm tay chỉ việc từng học viên",
      desc: "Trực tiếp mang sản phẩm/khóa học của bạn ra thực hành. Viết kịch bản, bật máy lên quay 2 góc và dựng ngay tại lớp với sự sửa lỗi trực tiếp của thầy Việt.",
      items: [
        "Công thức kịch bản One-line: Xác định rõ Vấn đề → Đối tượng mục tiêu → Kết quả cam kết",
        "Viết kịch bản video chuyển đổi 60 giây theo cấu trúc 5 bước chuẩn FEDU",
        "Thực hành setup góc máy: Bố trí đèn/ánh sáng tự nhiên, micro thu âm và vị trí đặt 2 điện thoại",
        "Trực tiếp quay bài tập Talking Head kết hợp góc máy phụ và chèn cảnh B-roll",
        "Ghép 2 góc quay trên timeline: Chuyển cảnh nhịp nhàng che khéo các đoạn nói vấp",
        "Thầy Việt nhận xét, sửa lỗi trực tiếp từng frame hình, câu chữ và âm thanh cho từng học viên"
      ],
      outcome: "Hết Ngày 2, bạn hoàn thành ít nhất 1–2 video thành phẩm chất lượng cao có thể bấm đăng ngay, nắm trọn quy trình 8 bước tự làm tại nhà."
    }
  },
  showcase: {
    badge: "HỌC VIÊN TIÊU BIỂU",
    title: "Kết Quả Thực Tế Sau Khi Áp Dụng Quy Trình FEDU",
    subtitle: "Những chuyên gia, giáo viên bắt đầu từ con số 0 và đã xây dựng kênh thành công.",
    cases: [
      {
        name: "Hivi Hiếu Nguyễn",
        niche: "Khóa Học AI Thực Chiến Cho Doanh Nghiệp",
        result: "Từ kênh mới tinh lên hơn 200 học viên sau vài tháng",
        desc: "Áp dụng cấu trúc kịch bản One-line và quay 2 góc máy đơn giản tại bàn làm việc. Nội dung ngắn gọn, tập trung vào thao tác tay và giải quyết bài toán thật.",
        metrics: [
          { label: "Học viên tuyển mới", value: "200+ học viên" },
          { label: "Thời gian triển khai", value: "Sau 3 tháng" },
          { label: "Thiết bị sử dụng", value: "Điện thoại cá nhân" }
        ]
      },
      {
        name: "Phương Nguyễn English",
        niche: "Tiếng Anh Giao Tiếp Công Sở Cho Người Đi Làm",
        result: "Tuyển sinh hơn 120 học viên chỉ trong 30 ngày đầu",
        desc: "Tập trung vào đúng các tình huống ngượng miệng nơi công sở (nói tiếng Anh sợ sai, phát âm vấp). Kịch bản đánh trúng nỗi đau và kêu gọi hành động tự nhiên.",
        metrics: [
          { label: "Học viên đăng ký", value: "120+ học viên" },
          { label: "Tỷ lệ chuyển đổi", value: "Gấp 3 lần cách cũ" },
          { label: "Kênh triển khai", value: "TikTok & Reels mới" }
        ]
      }
    ]
  },
  targetAudience: {
    badge: "BỘ LỌC HỌC VIÊN",
    title: "Khóa Học Này Dành Cho Ai?",
    suitable: [
      "Giáo viên, giảng viên muốn tự quay và edit video bài giảng, video chia sẻ kiến thức chuyên nghiệp hơn.",
      "Chuyên gia, coach, mentor muốn làm video để xây dựng thương hiệu cá nhân và mở rộng tệp học viên.",
      "Chủ trung tâm đào tạo, chủ học viện muốn tự làm video quảng bá khóa học/workshop mà không phụ thuộc ekip ngoài.",
      "Content creator, freelancer muốn nâng cấp chất lượng hình ảnh, âm thanh và tăng tỷ lệ giữ chân người xem.",
      "Bất kỳ ai có chuyên môn trong tay và muốn biến kiến thức đó thành video marketing thu hút khách hàng."
    ],
    unsuitable: [
      "Người chỉ muốn nghe lý thuyết suông, ngại ngồi vào máy tính để thực hành quay và edit tại lớp.",
      "Người chưa có bất kỳ chuyên môn, sản phẩm hoặc dịch vụ nào để chia sẻ.",
      "Người tìm kiếm công thức ăn xổi, muốn video viral sau 1 đêm mà không chịu rèn luyện kỹ năng.",
      "Người không cam kết sắp xếp thời gian tham gia trọn vẹn 2 ngày học thực chiến."
    ]
  },
  instructor: {
    name: "Nguyễn Đức Việt",
    title: "Founder FEDU – Học Thiết Kế Online",
    role: "Giảng viên FPT Arena Multimedia (15+ năm kinh nghiệm)",
    avatar: "/assets/image_1781192246239-Dsb4zlhm.png",
    bio: [
      "Xin chào, tôi là Nguyễn Đức Việt. Tôi có hơn 15 năm kinh nghiệm trong lĩnh vực thiết kế hình ảnh, lập trình và đào tạo trực tuyến tại Việt Nam.",
      "Hiện tại tôi là Founder của FEDU – nền tảng học thiết kế online với hàng chục ngàn học viên, đồng thời là giảng viên chính thức tại FPT Arena Multimedia.",
      "Trong suốt quá trình làm nghề và đào tạo, tôi luôn theo đuổi một triết lý: Học từ nền tảng gốc, thực hành trên sản phẩm thật, đơn giản hóa công nghệ để người không rành kỹ thuật cũng có thể làm ra sản phẩm đẹp và chuyên nghiệp."
    ],
    coreValues: [
      "Học có lộ trình bài bản: Đi từ tư duy bố cục, ánh sáng → Kịch bản → Dựng video → Tối ưu chuyển đổi.",
      "Cầm tay chỉ việc 1-1 tại lớp: Sửa trực tiếp từng góc máy, từng vết cắt timeline cho từng học viên.",
      "Tập trung vào tính ứng dụng cao: Làm ra video thật ngay trong 2 ngày, không dạy lý thuyết hàn lâm."
    ],
    quote: "Làm video marketing không khó như bạn nghĩ. Cái bạn thiếu không phải là máy ảnh đắt tiền, mà là một quy trình chuẩn và một người đồng hành chỉ rõ cho bạn từng bước thực hiện."
  },
  includedGifts: [
    {
      title: "Bộ Template Kịch Bản Video Ngắn Điền-Vào-Chỗ-Trống",
      desc: "Tổng hợp 15 mẫu kịch bản chuyển đổi cao cho các ngành đào tạo, coaching, dịch vụ chuyên môn."
    },
    {
      title: "Kho Source Footage & Âm Thanh / SFX Bản Quyền",
      desc: "Bộ tài nguyên âm thanh, nhạc nền tạo cảm xúc và hiệu ứng SFX chuyên nghiệp chuẩn bị sẵn để thực hành."
    },
    {
      title: "Bộ Prompt AI Viết Kịch Bản & Lên Lịch Nội Dung 30 Ngày",
      desc: "Các câu lệnh AI tinh chỉnh sẵn giúp bạn gợi ý ý tưởng, bóc tách 3 tầng kịch bản trong 30 giây."
    },
    {
      title: "Nhóm Hỗ Trợ Kèm Cặp Thực Chiến Sau Khóa Học",
      desc: "Được gửi video vào nhóm kín để thầy Việt trực tiếp xem, góp ý và sửa lỗi định kỳ sau khi tốt nghiệp."
    }
  ],
  faqs: [
    {
      q: "Tôi chưa từng quay dựng video bao giờ thì có theo học được không?",
      a: "Hoàn toàn được. Khóa học được thiết kế theo phương pháp 'từ số 0 đến làm được'. Thầy Việt sẽ hướng dẫn chi tiết từng nút bấm trên phần mềm, cách đặt góc máy điện thoại sao cho đẹp và cách ghép nhạc, chạy chữ từng bước một."
    },
    {
      q: "Tôi cần chuẩn bị những thiết bị gì khi đến lớp?",
      a: "Bạn chỉ cần mang theo: 1 Laptop (đã cài sẵn CapCut PC hoặc Premiere), 1 Điện thoại thông minh (iPhone hoặc Android) và quan trọng nhất là ý tưởng về sản phẩm/khóa học mà bạn muốn làm video."
    },
    {
      q: "Sau 2 ngày học tôi sẽ có những gì trong tay?",
      a: "Bạn sẽ có: Ít nhất 1–2 video thành phẩm chất lượng cao hoàn thiện ngay tại lớp; Bộ 30 ý tưởng video cho kênh cá nhân; Quy trình 8 bước tự quay dựng tại nhà; Bộ template kịch bản và kho âm thanh bản quyền; Quyền tham gia nhóm hỗ trợ sau khóa học."
    },
    {
      q: "Học offline khác biệt gì so với việc tự xem video trên mạng?",
      a: "Điểm giá trị lớn nhất của lớp offline là SỬA LỖI TRỰC TIẾP. Khi bạn tự học, bạn không biết mình nói có bị buồn ngủ không, góc quay có bị tối không, nhịp cắt có bị giật không. Tại lớp, thầy Việt sẽ ngồi cạnh chỉnh sửa từng frame hình, từng câu hook cho đến khi video của bạn đạt chuẩn."
    },
    {
      q: "Sĩ số lớp học là bao nhiêu học viên?",
      a: "Lớp học giới hạn tối đa 30 học viên để đảm bảo thầy Việt có thể hỗ trợ và kèm cặp từng người. Khi đủ sĩ số, hệ thống sẽ tự động đóng cổng đăng ký để bảo đảm chất lượng."
    },
    {
      q: "Địa điểm và thời gian cụ thể như thế nào?",
      a: "Khóa học diễn ra trong 2 ngày (Thứ 7 & Chủ Nhật) từ 09:00 đến 17:00 tại Hà Nội. Địa điểm cụ thể cùng bản đồ định vị và tài liệu chuẩn bị trước sẽ được gửi riêng qua Zalo cho học viên đã đăng ký giữ chỗ."
    },
    {
      q: "Tôi đăng ký giữ chỗ như thế nào?",
      a: "Bạn chỉ cần điền đầy đủ thông tin vào Form Đăng Ký bên dưới. Tư vấn viên của FEDU sẽ liên hệ qua điện thoại/Zalo trong thời gian sớm nhất để xác nhận thông tin và hướng dẫn các bước tiếp theo."
    }
  ]
};
