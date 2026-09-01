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
  metaphors: {
    badge: string;
    headline: string;
    subheadline: string;
    items: {
      id: string;
      icon: string;
      title: string;
      subtitle: string;
      metaphor: string;
      coreTruth: string;
      secret: string;
      pricing: string;
      youtubeDemo: string;
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
    subheadline: "Khóa học offline 2 ngày cầm tay chỉ việc giúp chủ doanh nghiệp, chuyên gia, bác sĩ, giảng viên và người làm dịch vụ làm chủ toàn bộ quy trình: Viết kịch bản One-line, setup 2 góc quay điện thoại, edit video chuyên nghiệp và ứng dụng AI tự động hóa. Không cần giỏi kỹ thuật từ trước.",
    tags: [
      "KỊCH BẢN CHUYỂN ĐỔI",
      "SETUP 2 GÓC QUAY",
      "QUAY 2 CAM ĐIỆN THOẠI",
      "EDIT CHUYÊN NGHIỆP",
      "AI TỰ ĐỘNG HÓA"
    ],
    meta: [
      { label: "THỜI GIAN", value: "2 Ngày Thực Chiến", desc: "Thứ 7 & Chủ Nhật (08:30 - 17:30)" },
      { label: "ĐỊA ĐIỂM", value: "Hà Nội", desc: "Phòng Studio tiêu chuẩn chuyên nghiệp" },
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
        title: "Tỷ lệ chuyển đổi ra đơn (Conversion Rate)",
        normal: "Nhiều lượt xem ảo nhưng không ai inbox mua hàng hay đăng ký",
        marketing: "Điều hướng tự nhiên về phễu bán hàng, biến người xem thành khách hàng thực"
      },
      {
        title: "Sự bền bỉ và tính nhất quán (Consistency)",
        normal: "Làm vài video rồi cạn ý tưởng, nản lòng vì không có kết quả",
        marketing: "Quy trình đóng gói kịch bản và kho tư liệu B-roll quay 1 lần dùng cả tháng"
      }
    ]
  },
  painPoints: {
    badge: "BẠN ĐANG GẶP PHẢI ĐIỀU NÀY?",
    headline: "Tháo Gỡ 4 Nút Thắt Khiến Video Của Bạn Không Có Chuyển Đổi",
    subheadline: "Hầu hết mọi người bỏ cuộc không phải vì thiếu chuyên môn, mà vì mắc kẹt ở 4 cạm bẫy kỹ thuật và tư duy làm video sai cách.",
    tabs: [
      {
        id: "tab-1",
        title: "Bật máy lên là đơ",
        subtitle: "Đứng trước ống kính bị gượng gạo, quên sạch lời thoại",
        points: [
          "Càng cố học thuộc lòng kịch bản thì mặt càng đơ, mắt đảo lia lịa đọc chữ.",
          "Nói vấp liên tục, quay đi quay lại cả chục lần vẫn không ưng ý.",
          "Mất hàng giờ đồng hồ chỉ để hoàn thành 1 đoạn video ngắn ngủi 30 giây."
        ],
        outcome: "Giải pháp: Phương pháp kịch bản One-line 3 cột + kỹ thuật quay ngắt câu 5 giây giúp bạn nói tự nhiên, không bao giờ phải học thuộc lòng.",
        media: "/assets/gif2_opt-CAxvnZZj.webp",
        cards: [
          { title: "Kịch bản One-line", desc: "Chỉ nhìn 1 từ khóa cốt lõi cho mỗi ý, nói chuyện như đang tâm sự với 1 người bạn thân." },
          { title: "Ngắt nhịp 5 giây", desc: "Quay từng câu ngắn độc lập, ghép lại mượt mà bằng kỹ thuật cắt nhịp Jump-cut chuyên nghiệp." }
        ]
      },
      {
        id: "tab-2",
        title: "Cạm bẫy đọc văn mẫu Voice-over",
        subtitle: "Thu voice trước khiến não bật chế độ 'phát thanh viên đọc bài', giọng đều đều mất chất đời",
        points: [
          "Bật mic lên đọc kịch bản giấy: Giọng đọc đều đều như trả bài, mất hoàn toàn nhịp thở và cảm xúc chân thật.",
          "Hình ảnh bị ép khung: Phải kéo dãn hoặc cắt vụn clip cho vừa khớp câu chữ, video bị giật cục và giả tạo.",
          "Khán giả nghe 2 giây là nhận ra giọng đọc bài sáo rỗng và lướt qua ngay."
        ],
        outcome: "Giải pháp: Quy trình 3 giai đoạn độc quyền: Quay B-roll dôi dư 3s (Shotlist 3 cột) → Dựng phim câm rough-cut khóa nhịp 0.8s-2.5s → Thu âm trực tiếp trên timeline CapCut để giữ trọn chất đời.",
        media: "/assets/gif3_opt-BENmiLaC.webp",
        cards: [
          { title: "Dựng phim câm trước", desc: "Cắt gọt hình ảnh đạt độ cuốn hút tuyệt đối trước khi thu tiếng, hình ảnh dẫn dắt cảm xúc." },
          { title: "Thu voice trên timeline", desc: "Nhìn chuyển động hình ảnh và nói trực tiếp, tạo ra nhịp thở và biểu cảm tự nhiên 100%." }
        ]
      },
      {
        id: "tab-3",
        title: "Video nhìn nghiệp dư",
        subtitle: "Hình ảnh tối tăm, âm thanh rè, góc quay đơn điệu",
        points: [
          "Góc máy chính diện đơn điệu như camera an ninh, người xem nhìn 3 giây là chán.",
          "Mặt bị bóng dầu hoặc tối sầm vì không biết cách mượn ánh sáng tự nhiên và đèn cơ bản.",
          "Âm thanh lẫn tạp âm, tiếng vọng phòng làm giảm 80% độ uy tín của chuyên gia."
        ],
        outcome: "Giải pháp: Kỹ thuật setup 2 góc quay điện thoại (Góc chính diện + Góc cận 45 độ) tạo chiều sâu điện ảnh kết hợp lọc âm trong vắt.",
        media: "/assets/gif4_opt-CoJcWNzO.webp",
        cards: [
          { title: "Setup 2 Cam Điện Thoại", desc: "Tận dụng ngay 2 chiếc smartphone có sẵn để tạo hiệu ứng chuyển góc như talkshow truyền hình." },
          { title: "Ánh sáng & Lọc tạp âm", desc: "Kỹ thuật đánh sáng 3 điểm tối giản và lọc âm AI khử 100% tiếng ồn phòng." }
        ]
      },
      {
        id: "tab-4",
        title: "Cả thèm chóng chán",
        subtitle: "Không có quy trình sản xuất bền bỉ, làm được 3 hôm là nản",
        points: [
          "Mỗi lần làm video là một cực hình: Từ nghĩ ý tưởng, dựng bối cảnh đến cắt ghép mất cả ngày.",
          "Không có lịch trình rõ ràng, bận việc kinh doanh là bỏ bẵng kênh hàng tuần.",
          "Không đo lường được hiệu quả, không biết video nào ra tiền để nhân bản."
        ],
        outcome: "Giải pháp: Đóng gói quy trình sản xuất video 1 buổi/tuần, xuất bản đều đặn cả tháng kết hợp phễu tự động hóa chuyển đổi.",
        media: "/assets/image_1782189176146-dnh32Fxr.png",
        cards: [
          { title: "Kho tư liệu B-roll", desc: "Quay 1 buổi tích lũy kho 50+ tư liệu hình ảnh, dùng để ghép video cho cả tháng." },
          { title: "Tự động hóa chuyển đổi", desc: "Gắn liên kết phễu thu thập thông tin khách hàng tiềm năng tự động vào Google Sheet & Telegram." }
        ]
      }
    ]
  },
  metaphors: {
    badge: "TRIẾT LÝ & VŨ KHÍ NỘI DUNG ĐỘC QUYỀN",
    headline: "Bộ 3 Ẩn Dụ Điện Ảnh Thực Chiến",
    subheadline: "Không dạy lý thuyết sáo rỗng. Khóa học trao cho bạn 3 vũ khí định dạng video sắc bén đã được chứng minh hiệu quả qua hàng trăm chiến dịch thực tế.",
    items: [
      {
        id: "metaphor-1",
        icon: "🎭",
        title: "Nghệ Sĩ Rối Bóng",
        subtitle: "Voice-over / Lồng tiếng chạm đáy cảm xúc",
        metaphor: "Khán giả chỉ thấy bóng chuyển động trên vách vải (B-roll); người nghệ sĩ phía sau phải khua chân múa tay, toát mồ hôi để thổi sinh khí vào từng hơi thở giọng nói.",
        coreTruth: "Nhường sân khấu cho trí tưởng tượng của khán giả. Giọng nói chân thật như tâm sự đời thực kết hợp B-roll tinh tế tạo ra sự đồng cảm sâu sắc.",
        secret: "Quy tắc quay B-roll dôi dư 3 giây + Dựng phim câm rough-cut trước + Thu âm trực tiếp trên timeline CapCut.",
        pricing: "Ứng dụng: Video tâm sự, chia sẻ bài học đời thực, trải nghiệm khách hàng, vlog chữa lành.",
        youtubeDemo: "https://youtu.be/7NWSEFRdOHE"
      },
      {
        id: "metaphor-2",
        icon: "🏃‍♂️",
        title: "Dắt Tay Chạy Dạo Phố",
        subtitle: "Dynamic Cut / Thoại đổi cảnh giữ chân triệu view",
        metaphor: "Giống như đứa bạn thừa năng lượng vừa kéo bạn chạy xềnh xệch vừa giục: 'Nhanh lên, qua góc này xem cái này hay lắm!'. Não bộ người xem bị cuốn theo nhịp điệu không thể rời mắt.",
        coreTruth: "Trị dứt điểm căn bệnh dễ chán của não bộ. Khán giả không bao giờ kịp bấm lướt vì liên tục được kích thích thị giác.",
        secret: "Nhịp cắt gọt 0.8s - 2.5s, đổi góc toàn - trung - cận linh hoạt, kết hợp âm thanh Sound Design tinh gọn.",
        pricing: "Ứng dụng: Video chia sẻ mẹo nhanh, review sản phẩm, bóc trần sự thật, video viral đa nền tảng.",
        youtubeDemo: "https://youtube.com/shorts/gp7pWmgV380"
      },
      {
        id: "metaphor-3",
        icon: "👨‍⚕️",
        title: "Bác Sĩ Cầm Phim X-Quang",
        subtitle: "Talking Head / Video chuyên gia tạo đòn bẩy niềm tin",
        metaphor: "Bạn ngồi đối diện vị bác sĩ có ánh mắt đàng hoàng, điềm tĩnh. Khi giải thích bệnh lý phức tạp, bác sĩ lấy ngón tay chỉ thẳng vào tấm phim X-Quang (bằng chứng & visual aid).",
        coreTruth: "Sự điềm tĩnh tạo ra đòn bẩy niềm tin tuyệt đối. Khách hàng tin tưởng và sẵn sàng chi trả cho các sản phẩm/dịch vụ giá trị cao.",
        secret: "Setup 2 góc quay điện thoại tạo chiều sâu + Đưa dẫn chứng thực tế (Dashboard, hình ảnh thực hành, case study) ngay trên màn hình.",
        pricing: "Ứng dụng: Video tư vấn dịch vụ y tế/thẩm mỹ, khóa học chuyên gia, tư vấn tài chính/bất động sản, chuyển đổi đơn hàng cao cấp.",
        youtubeDemo: "https://youtu.be/e3LVnxv7WEA"
      }
    ]
  },
  curriculum: {
    badge: "LỘ TRÌNH ĐÀO TẠO 2 NGÀY THỰC CHIẾN",
    headline: "Cầm Tay Chỉ Việc Từ Con Số 0 Đến Video Hoàn Chỉnh",
    subheadline: "Không lý thuyết hàn lâm. 100% thời lượng là bài tập thực hành bấm máy, cắt ghép và tối ưu trực tiếp trên điện thoại/máy tính của bạn.",
    days: [
      {
        day: "NGÀY 01",
        date: "Thứ Bảy · 08:30 - 17:30",
        theme: "Kỹ Thuật Dựng Video Chuyên Nghiệp & Khóa Nhịp Cắt",
        summary: "Làm chủ công cụ CapCut/Premiere, tư duy cắt nhịp điện ảnh, xử lý âm thanh, chỉnh màu da sáng mịn và xuất bản video chất lượng cao.",
        modules: [
          {
            time: "08:30 - 10:30",
            title: "Module 1: Tư Duy Cắt Gọt Video & Khóa Nhịp Giữ Chân Khán Giả",
            desc: "Nắm vững tâm lý thị giác người xem và kỹ thuật loại bỏ 100% khoảng chết trên timeline.",
            bullets: [
              "Giải phẫu cấu trúc 1 video triệu view: Hook (3s) → Body (nhịp 1.5s) → Call To Action.",
              "Kỹ thuật Jump-cut và L-Cut/J-Cut giúp câu thoại liền mạch, không còn tiếng ậm ừ.",
              "Thực hành cắt gọt thô (Rough Cut) trên footage mẫu ngay tại lớp."
            ]
          },
          {
            time: "10:45 - 12:00",
            title: "Module 2: Làm Chủ Kỹ Thuật Voice-over 'Nghệ Sĩ Rối Bóng'",
            desc: "Tuyệt chiêu thu âm trực tiếp trên timeline giúp giọng nói tự nhiên, chấm dứt hoàn toàn lỗi đọc văn mẫu gượng gạo.",
            bullets: [
              "Quy tắc quay B-roll dôi dư 3s và bảng Shotlist 3 cột (Hook - Visual - Keypoint).",
              "Dựng phim câm trước, khóa nhịp thị giác 0.8s - 2.5s rồi mới lồng tiếng.",
              "Thu âm trực tiếp trên timeline CapCut để giữ nguyên hơi thở và cảm xúc chân thật."
            ]
          },
          {
            time: "13:30 - 15:30",
            title: "Module 3: Phù Phép Hình Ảnh — Chỉnh Màu Mịn Da & Sound Design",
            desc: "Biến video quay bằng điện thoại thường thành thước phim chuẩn studio có màu sắc sang trọng.",
            bullets: [
              "Công thức chỉnh màu da sáng khỏe, tự nhiên, không bị bết màu hay giả tạo.",
              "Hệ thống Sound Design: Nhạc nền nền tảng (BGM), tiếng động Foley và hiệu ứng âm thanh SFX kích thích thính giác.",
              "Tự động tạo phụ đề Auto-caption chuẩn font chữ thương hiệu, bắt mắt."
            ]
          },
          {
            time: "15:45 - 17:30",
            title: "Module 4: Đóng Gói Thành Phẩm & Chuẩn Hóa Xuất File HD/4K",
            desc: "Thiết lập thông số xuất file tối ưu cho TikTok, Facebook Reels và YouTube Shorts không bị mờ nhòe.",
            bullets: [
              "Thông số Bitrate, Resolution và Color Space chuẩn từng nền tảng.",
              "Checklist 7 bước kiểm duyệt video trước khi bấm nút đăng bài.",
              "Thực hành chấm điểm và sửa bài 1-1 từng học viên tại lớp."
            ]
          }
        ]
      },
      {
        day: "NGÀY 02",
        date: "Chủ Nhật · 08:30 - 17:30",
        theme: "Kịch Bản One-Line, Setup 2 Góc Quay & Phễu Chuyển Đổi",
        summary: "Bẻ khóa kịch bản bán hàng, bấm máy thực tế với 2 góc quay điện thoại tại phòng studio và kết nối hệ thống phễu thu thập khách hàng tự động.",
        modules: [
          {
            time: "08:30 - 10:30",
            title: "Module 5: Công Thức Kịch Bản One-Line Đánh Trúng Nỗi Đau Khách Hàng",
            desc: "Cách viết kịch bản chỉ mất 10 phút, nói trôi chảy không cần học thuộc lòng.",
            bullets: [
              "Bộ khung kịch bản 3 tầng: Sự thật ngượng miệng → Góc tiếp cận → Giải pháp đổi đời.",
              "Cách đặt Hook 3 giây đầu tiên khiến người xem phải dừng ngón tay lại.",
              "Viết trực tiếp 3 kịch bản thực tế cho chính ngành nghề kinh doanh của bạn."
            ]
          },
          {
            time: "10:45 - 12:30",
            title: "Module 6: Thực Hành Setup 2 Góc Quay Điện Thoại Tại Studio",
            desc: "Trực tiếp đứng trước 2 máy quay, làm chủ thần thái và ngôn ngữ cơ thể của một chuyên gia.",
            bullets: [
              "Setup góc máy chính diện và góc cận 45 độ bằng 2 điện thoại thông minh.",
              "Kỹ thuật lấy nét, cân bằng sáng và đánh đèn 3 điểm xóa phông chuyên nghiệp.",
              "Thực hành quay video thành phẩm trực tiếp có thầy bấm máy và chỉnh sửa từng cử chỉ."
            ]
          },
          {
            time: "13:30 - 15:30",
            title: "Module 7: Kỹ Thuật Dựng Video 2 Cam & Ứng Dụng AI Siêu Tốc",
            desc: "Ghép nối 2 góc quay mượt mà như talkshow truyền hình và dùng AI tăng tốc sản xuất X5 lần.",
            bullets: [
              "Kỹ thuật đồng bộ âm thanh đa góc máy (Multi-cam Sync) chỉ với 1 click.",
              "Chuyển góc đúng nhịp cảm xúc: Khi nào dùng góc toàn, khi nào chuyển sang góc cận.",
              "Ứng dụng AI tạo ảnh bìa thumbnail hút click và viết mô tả chuẩn SEO."
            ]
          },
          {
            time: "15:45 - 17:30",
            title: "Module 8: Xây Dựng Cỗ Máy Thu Hút Lead & Nghiệm Thu Video",
            desc: "Kết nối video với trang web thu thập thông tin khách hàng tự động để chuyển đổi thành doanh thu thực tế.",
            bullets: [
              "Chiến lược điều hướng từ video về Zalo/Form đăng ký không vi phạm chính sách.",
              "Hệ thống thông báo tức thì về Telegram và lưu trữ tự động vào Google Sheet.",
              "Công chiếu và nghiệm thu video thành phẩm của toàn bộ học viên trong lớp."
            ]
          }
        ]
      }
    ]
  },
  showcase: {
    badge: "THÀNH PHẨM THỰC TẾ HỌC VIÊN",
    headline: "Xem Video Do Chính Học Viên Sản Xuất Sau Khóa Học",
    subheadline: "Từ những người chưa từng biết cầm máy hay edit, đây là những video thành phẩm được quay và dựng hoàn chỉnh 100%.",
    videos: [
      {
        id: "zcaVzUlj37s",
        title: "Video Chia Sẻ Chuyên Môn Chăm Sóc Sức Khỏe & Yoga",
        author: "Chị Minh Anh",
        role: "Huấn luyện viên Yoga & Trị liệu",
        desc: "Ứng dụng kịch bản One-line và kỹ thuật lồng tiếng Voice-over trực tiếp trên timeline. Video đạt hơn 180.000 lượt xem và mang về 45 học viên mới."
      },
      {
        id: "alNkUUuE7fE",
        title: "Video Tư Vấn Quản Trị Tài Chính Cá Nhân Cho Gia Đình",
        author: "Anh Hoàng Dũng",
        role: "Chuyên gia Tư vấn Tài chính",
        desc: "Sử dụng định dạng Bác Sĩ Cầm Phim X-Quang với setup 2 góc quay điện thoại tạo sự điềm tĩnh và uy tín tuyệt đối, chuyển đổi hơn 30 hợp đồng tư vấn VIP."
      },
      {
        id: "eyhfBYZfbPk",
        title: "Video Review Trải Nghiệm Sản Phẩm & Routine Chăm Sóc Da",
        author: "Chị Thanh Hương",
        role: "Chủ Chuỗi Mỹ Phẩm & Spa",
        desc: "Ứng dụng kỹ thuật thoại đổi cảnh Dynamic Cut với nhịp cắt nhanh 1.5s, kho B-roll bắt mắt giúp tăng gấp 4 lần lượng khách hàng nhắn tin hỏi mua routine."
      }
    ]
  },
  caseStudies: {
    badge: "KẾT QUẢ ĐA NGÀNH NGHỀ",
    headline: "Học Viên Từ Mọi Lĩnh Vực Đều Đạt Kết Quả",
    items: [
      {
        name: "Anh Phạm Hữu Công",
        role: "Đại Diện Bệnh Viện Thẩm Mỹ",
        niche: "Thẩm Mỹ & Chăm Sóc Sắc Đẹp",
        stats: "Đạt >150 inbox tư vấn liệu trình sau 2 tuần",
        story: "Trước đây rất ngại quay mặt và không biết giải thích các thủ thuật y khoa sao cho dễ hiểu. Sau khóa học, áp dụng định dạng Bác sĩ cầm phim X-quang với dẫn chứng trực quan, video tạo niềm tin tuyệt đối cho khách hàng làm đẹp.",
        image: "/assets/image_1782111290168-91rX6BTq.png"
      },
      {
        name: "Anh Tuấn Vũ & Chị Nguyệt",
        role: "Chủ Cửa Hàng Thiết Bị Công Nghệ",
        niche: "Bán Lẻ Điện Thoại & Đồ Công Nghệ",
        stats: "Doanh số bán lẻ tăng 250% nhờ video review cận cảnh",
        story: "Làm chủ kỹ thuật quay cận cảnh 2 góc máy và cắt nhịp Dynamic Cut, các video đập hộp, test máy và hướng dẫn tính năng thu hút lượng lớn khách hàng từ TikTok và Reels đổ về cửa hàng.",
        image: "/assets/image_1782111083758-D1lt1pEb.png"
      },
      {
        name: "Hivi Hiếu Nguyễn",
        role: "Chuyên Gia Đào Tạo AI Cho Doanh Nghiệp",
        niche: "Giáo Dục & Khóa Học Công Nghệ",
        stats: "Thu hút >200 học viên trả phí chỉ sau 45 ngày",
        story: "Từ một người chuyên về kỹ thuật ngại xuất hiện trước ống kính, Hiếu đã xây dựng kênh video marketing có cấu trúc kịch bản chuyển đổi rõ ràng, biến chuyên môn phức tạp thành các bài học ngắn cuốn hút.",
        image: "/assets/image_1782111018042-BY1jDPGq.png"
      },
      {
        name: "Phương Nguyễn English",
        role: "Giảng Viên Tiếng Anh Doanh Nghiệp",
        niche: "Đào Tạo Ngoại Ngữ",
        stats: "Tuyển sinh >120 học viên trong 30 ngày",
        story: "Thay vì làm các video ngữ pháp khô khan, Phương áp dụng công thức kịch bản 3 tầng bóc đúng nỗi đau phát âm ngượng ngùng của dân công sở, video đạt tỷ lệ chuyển đổi cực cao.",
        image: "/assets/image_1782111055199-CBeeJp36.png"
      }
    ]
  },
  targetAudience: {
    badge: "BỘ LỌC ĐỐI TƯỢNG HỌC VIÊN",
    headline: "Khóa Học Này Dành Cho Ai?",
    fit: [
      {
        title: "Chủ Doanh Nghiệp, Chủ Cơ Sở Dịch Vụ, Spa, Thẩm Mỹ, Bán Lẻ",
        desc: "Muốn tự xây dựng kênh video marketing mang lại khách hàng bền vững mà không phụ thuộc hoàn toàn vào chạy quảng cáo đắt đỏ."
      },
      {
        title: "Chuyên Gia, Bác Sĩ, Coach, Giảng Viên, Người Làm Giáo Dục",
        desc: "Đã có sẵn kiến thức và chuyên môn sâu, muốn đóng gói thành các video giá trị cao để xây dựng nhân hiệu và bán khóa học/dịch vụ tư vấn."
      },
      {
        title: "Người Đang Kinh Doanh Tự Do Muốn Đột Phá Doanh Thu",
        desc: "Đã thử tự quay video nhưng lúng túng, hình ảnh xấu, nói vấp và video không có người xem hay tương tác mua hàng."
      },
      {
        title: "Người Muốn Làm Chủ Kỹ Năng Video Chuyên Nghiệp Trong 2 Ngày",
        desc: "Cần lộ trình thực chiến cầm tay chỉ việc, được thực hành bấm máy và sửa bài 1-1 tại phòng studio thay vì tự mò mẫm hàng tháng trời."
      }
    ],
    notFit: [
      {
        title: "Người Tìm Kiếm Chiêu Trò Câu View Rác",
        desc: "Khóa học tập trung vào video marketing có cấu trúc tạo ra chuyển đổi và thương hiệu bền vững, không dạy chiêu trò giật gân rẻ tiền."
      },
      {
        title: "Người Không Muốn Trực Tiếp Bấm Máy Thực Hành",
        desc: "100% thời lượng khóa học là bài tập thực hành. Nếu bạn chỉ muốn nghe lý thuyết suông mà không chịu làm bài tập, khóa học này không phù hợp."
      },
      {
        title: "Người Kỳ Vọng 'Làm Giàu Sau 1 Đêm'",
        desc: "Video marketing là tài sản tích lũy dài hạn. Nó đòi hỏi bạn áp dụng đúng quy trình và sự kiên trì trong ít nhất 30 - 60 ngày."
      }
    ]
  },
  instructor: {
    badge: "NGƯỜI TRỰC TIẾP HƯỚNG DẪN BẠN",
    name: "Thầy Nguyễn Đức Việt",
    role: "Giảng viên Multimedia & Chuyên gia Đào tạo Video Marketing (15+ năm kinh nghiệm)",
    avatar: "/assets/image_1781192246239-Dsb4zlhm.png",
    bio: [
      "15+ năm trực tiếp giảng dạy và đào tạo thiết kế, mỹ thuật đa phương tiện, lập trình và video marketing tại FPT Arena Multimedia và các hệ thống giáo dục hàng đầu.",
      "Tác giả & Mentor trang '30 Ngày Học Làm Nội Dung Viral' (23.000+ thành viên), sở hữu các kênh video chuyên môn thu hút hàng chục nghìn lượt theo dõi thực chất.",
      "Đã trực tiếp đào tạo và đồng hành cùng hơn 50.000+ học viên từ người mới bắt đầu đến khi làm chủ kỹ năng quay dựng và xây dựng kênh kinh doanh tự động hóa."
    ],
    stats: [
      { number: "15+", label: "Năm Giảng Dạy" },
      { number: "50.000+", label: "Học Viên Đã Đào Tạo" },
      { number: "23.000+", label: "Cộng Đồng Viral Content" },
      { number: "100%", label: "Cầm Tay Chỉ Việc 1-1" }
    ],
    quote: "Làm video marketing không phải là phô diễn kỹ xảo đắt tiền, mà là dùng hình ảnh và âm thanh chân thật để bóc đúng nỗi đau khách hàng và trao giải pháp tốt nhất."
  },
  faqs: [
    {
      q: "Tôi chưa từng biết quay dựng video hay dùng CapCut bao giờ, có học được không?",
      a: "Hoàn toàn học được. Khóa học được thiết kế từ con số 0 dành riêng cho người không chuyên. Thầy và đội ngũ trợ giảng sẽ kèm cặp 1-1 từng thao tác bấm máy, cắt ghép ngay trên chính chiếc điện thoại của bạn."
    },
    {
      q: "Tôi có cần phải mua máy ảnh xịn hay máy tính cấu hình khủng không?",
      a: "Không cần. Bạn chỉ cần mang theo 1-2 chiếc điện thoại thông minh (iPhone hoặc Android) và laptop cá nhân. Khóa học hướng dẫn bạn tận dụng tối đa thiết bị sẵn có để tạo ra chất lượng hình ảnh tốt nhất."
    },
    {
      q: "Lớp học tổ chức ở đâu và vào thời gian nào?",
      a: "Lớp học diễn ra trong 2 ngày Thứ 7 & Chủ Nhật (08:30 - 17:30) tại phòng Studio tiêu chuẩn chuyên nghiệp tại Hà Nội. Địa chỉ chi tiết sẽ được gửi qua Zalo/Email ngay sau khi bạn hoàn tất đăng ký giữ chỗ."
    },
    {
      q: "Sau 2 ngày học offline, tôi có được hỗ trợ tiếp không?",
      a: "Có. Bạn sẽ được tham gia nhóm Zalo kèm cặp riêng của lớp, được thầy sửa bài tập thực tế trong 30 ngày tiếp theo và nhận trọn bộ tài liệu, slide bài giảng, preset màu và kho âm thanh bản quyền."
    },
    {
      q: "Tôi rất ngại nói trước ống kính, khóa học có giúp tôi tự tin hơn không?",
      a: "Đây chính là vấn đề 90% học viên gặp phải. Với phương pháp kịch bản One-line 3 cột và kỹ thuật quay ngắt câu 5 giây, bạn sẽ thấy việc đứng trước ống kính nhẹ nhàng như đang nói chuyện với một người bạn."
    },
    {
      q: "Học phí và chính sách hoàn tiền như thế nào?",
      a: "Khóa học cam kết: Nếu sau ngày học đầu tiên bạn cảm thấy nội dung không thực tế hoặc không thể áp dụng được, ban tổ chức sẽ hoàn lại 100% học phí mà không hỏi thêm bất kỳ câu hỏi nào."
    },
    {
      q: "Sĩ số lớp là bao nhiêu học viên?",
      a: "Để đảm bảo chất lượng cầm tay chỉ việc và mọi học viên đều có sản phẩm video mang về, mỗi lớp được giới hạn nghiêm ngặt tối đa không quá 30 người."
    }
  ]
};
