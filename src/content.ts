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
    weeklyImg?: string;
    leadsImg?: string;
    offlineClassImg: string;
    mockups: {
      fanpage: string;
      tiktok: string;
      leadsStats?: string;
      tiktokStats: string;
      fbReels: string;
      tiktokVideo: string;
    };
  };
  chart: {
    badge: string;
    headline: string;
    description: string;
    source?: {
      label: string;
      studyName: string;
      metricNote: string;
      url: string;
    };
    insights?: {
      tag: string;
      title: string;
      desc: string;
      type: 'pain' | 'cause' | 'solution';
    }[];
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
      videoId?: string;
      videoTitle?: string;
      videoSubtitle?: string;
      cards: { title: string; desc: string }[];
    }[];
    brollVideos: {
      id: string;
      title: string;
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
      subtitle: string;
      youtubeUrl: string;
      videoId: string;
      poster: string;
      desc: string;
    }[];
    processVideos: {
      id: string;
      title: string;
      subtitle: string;
      youtubeUrl: string;
      videoId: string;
      poster: string;
      desc: string;
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
      videoUrl: string;
      poster: string;
      youtubeId: string;
      youtubeUrl: string;
      output: string;
      relief: string;
      application: string;
      howTo?: string;
      strength?: string;
    }[];
  };
  curriculum: {
    badge: string;
    headline: string;
    subheadline: string;
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
    };
  };
  showcase: {
    badge: string;
    headline: string;
    subheadline: string;
    categories?: {
      id: string;
      label: string;
    }[];
    videos: {
      id: string;
      title: string;
      author: string;
      role: string;
      desc: string;
      poster: string;
      youtubeUrl?: string;
      videoUrl?: string;
      category?: string;
      categoryLabel?: string;
    }[];
  };
  caseStudies: {
    badge: string;
    headline: string;
    subheadline?: string;
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
    subheadline: "Khóa học offline 2 ngày thực chiến (từ sáng đến chiều), cầm tay chỉ việc giúp chủ doanh nghiệp, người làm chuyên môn, đào tạo và dịch vụ làm chủ toàn bộ quy trình sản xuất video từ A–Z. Không cần rành công nghệ hay giỏi kỹ thuật từ trước.",
    tags: [
      "KỊCH BẢN CHUYỂN ĐỔI",
      "TALKING HEAD CHUYÊN GIA",
      "VOICE OVER AFFILIATE",
      "STORYTELLING CHẠM CẢM XÚC",
      "SETUP 2 GÓC ĐIỆN THOẠI",
      "CHUYỂN CẢNH ĐỘC BẢN",
      "DỰNG CAPCUT CHUẨN ĐIỆN ẢNH",
      "ĐÓNG GÓI QUY TRÌNH",
      "AI TỰ ĐỘNG HÓA"
    ],
    meta: [
      { label: "THỜI GIAN", value: "2 Ngày Thực Chiến", desc: "Thứ 7 & Chủ Nhật (08:30 - 17:30)" },
      { label: "ĐỊA ĐIỂM", value: "Hà Nội", desc: "Phòng Studio tiêu chuẩn chuyên nghiệp" },
      { label: "QUY MÔ", value: "≤ 40 Học Viên", desc: "Kèm cặp 1-1 ra sản phẩm ngay tại lớp" }
    ],
    cta: "ĐĂNG KÝ GIỮ CHỖ NGAY",
    ctaNote: "Chỉ nhận tối đa 40 học viên mỗi đợt để đảm bảo chất lượng cầm tay chỉ việc."
  },
  proof: {
    badge: "DỮ LIỆU ĐỐI SOÁT TỪ META BUSINESS",
    headline: "Chuyển Đổi Thực Tế Từ Fanpage 30 Ngày Học Làm Nội Dung Viral",
    revenue: "6.000.000+ Lượt Xem · 50.800+ Click Link",
    timeline: "3.642 Khách Hàng Nhắn Tin Tư Vấn",
    dailyPeak: "428 Số ĐT Để Lại Mua Khóa Học",
    description: "Toàn bộ số liệu được đối soát trực tiếp từ Meta Business Suite của Fanpage '30 Ngày Học Làm Nội Dung Viral'. Không chạy tool, không mua follow ảo — toàn bộ 6 triệu lượt xem và 50.800 lượt click liên kết đều đến từ các video ngắn có cấu trúc chuyển đổi.",
    dashboardImg: "/assets/meta_suite_6m_growth.png",
    weeklyImg: "/assets/meta_weekly_1post_108inbox.png",
    leadsImg: "/assets/facebook_real_page_dashboard.png",
    offlineClassImg: "/assets/image_1781257789234-CGDyQOer.png",
    mockups: {
      fanpage: "/assets/fanpage_nguyenducviet.png",
      tiktok: "/assets/tiktok_nguyenducviet.png",
      leadsStats: "/assets/facebook_leads_stats.png",
      tiktokStats: "/assets/image_1781281379611-PpKU1pTE.png",
      fbReels: "/assets/image_1781281388562-DGSN1Etr.png",
      tiktokVideo: "/assets/image_1781281916199-DoWUR6eO.png"
    }
  },
  chart: {
    badge: "NGHIÊN CỨU & ĐỐI SOÁT DỮ LIỆU TOÀN CẦU",
    headline: "Vì Sao Video Có Cấu Trúc Giữ Chân Gấp 12 Lần Video Tự Phát?",
    description: "Theo nghiên cứu BrandEffect của Meta & Nielsen trên 173 chiến dịch video: 47% giá trị quảng cáo được quyết định trong 3 giây đầu tiên, và 74% được chốt lại trước mốc 10 giây. Không biết kỹ thuật nén nhịp, video tự phát sẽ rơi rụng tới 81% khán giả ngay ở 10 giây đầu trước khi kịp nói đến phần bán hàng.",
    source: {
      label: "Meta for Business & Nielsen Research",
      studyName: "The Value of Video for Brands (173 BrandEffect Campaigns Analysis)",
      metricNote: "Khảo sát đường cong giữ chân thực tế (Audience Retention Curve) đo lường trên video ngắn 60s",
      url: "https://www.facebook.com/business/news/value-of-video"
    },
    insights: [
      {
        tag: "01. THỰC TRẠNG NHỨC NHỐI",
        title: "Quay cả buổi, bị lướt sau 2 giây?",
        desc: "Không phải do bạn dở ăn nói hay thiếu máy ảnh xịn. Người xem lướt đi vì não bộ họ không nhận được bất kỳ lý do nào để dừng lại trong 2 giây đầu tiên.",
        type: "pain"
      },
      {
        tag: "02. NÚT THẮT CỐT LÕI",
        title: "Ý 3 giây lại nói mất 15 giây",
        desc: "Lười lia máy, thiếu cảnh trám và giữ một góc máy bất động quá lâu là bạn đang vô tình dâng nút lướt cho đối thủ.",
        type: "cause"
      },
      {
        tag: "03. CÔNG THỨC ĐỘT PHÁ",
        title: "Nén chặt từng giây & Đổi góc liên tục",
        desc: "Gọt sạch từ thừa, khóa nhịp cắt 0.8s–2.5s và chèn B-roll đè lên giọng nói: Video sẽ tự động giữ chân người xem đến cuối và kích hoạt chuyển đổi ra đơn.",
        type: "solution"
      }
    ],
    data: [
      { month: "0s (Bắt đầu)", marketing: 100, normal: 100 },
      { month: "3s (Hook)", marketing: 88, normal: 32 },
      { month: "10s (Giá trị Meta)", marketing: 76, normal: 19 },
      { month: "25s (B-Roll trám)", marketing: 68, normal: 14 },
      { month: "45s (Giải pháp)", marketing: 62, normal: 9 },
      { month: "60s (Chốt đơn CTA)", marketing: 58, normal: 5 }
    ],
    bullets: [
      {
        title: "Mốc 3 Giây Đầu (Hook Giữ Chân)",
        normal: "Rơi rụng 68% khán giả do mở đầu lan man, chào hỏi và giới thiệu dài dòng",
        marketing: "Giữ lại 88% khán giả nhờ Hook bóc trần nỗi sợ và kịch bản ngắt dòng 1 nhịp thở"
      },
      {
        title: "Mốc 10 Giây (Ngưỡng Giá Trị Meta & Nielsen)",
        normal: "Chỉ còn 19% người xem — mất trắng 81% cơ hội tiếp cận khách hàng tiềm năng",
        marketing: "Duy trì 76% khán giả — Meta chứng minh 74% tổng giá trị chiến dịch được tạo ra tại đây"
      },
      {
        title: "Mốc 60 Giây (Kêu Gọi Hành Động & Chốt Đơn)",
        normal: "Chỉ còn 5% người xem ở lại — hầu như không có ai nghe được lời kêu gọi mua hàng",
        marketing: "Giữ vững 58% người xem nghe trọn vẹn CTA — tỷ lệ chuyển đổi ra đơn gấp 11.6 lần"
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
        title: "Bí Ý Khi Lên Hình",
        subtitle: "Đứng trước camera bị gượng gạo, mặt đơ, quên sạch lời thoại",
        points: [
          "Càng cố học thuộc lòng kịch bản thì mặt càng đơ, mắt đảo lia lịa đọc chữ.",
          "Nói vấp liên tục, quay đi quay lại cả chục lần vẫn không ưng ý.",
          "Mất hàng giờ đồng hồ chỉ để hoàn thành 1 đoạn video ngắn ngủi 30 giây."
        ],
        outcome: "Giải pháp: Phương pháp kịch bản chuyển đổi ngắt nhịp 5s + Kỹ thuật B-roll Bank (chèn cảnh trám 2-3s đè timeline) giúp bạn nói tự nhiên, che 100% lỗi nói vấp và mắt đơ.",
        media: "/assets/formats/voiceover_poster.jpg",
        cards: [
          { title: "Kịch bản chuyển đổi", desc: "Chỉ nhìn 1 từ khóa cốt lõi cho mỗi ý, nói chuyện như đang tâm sự với 1 người bạn thân." },
          { title: "Kho B-Roll Bank Xử Lý", desc: "Băm nhỏ 10-15 cảnh thao tác tay ngắn 2-3s chèn đè lên nhịp nói, che sạch lỗi vấp và mắt đơ khi lên hình." }
        ]
      },
      {
        id: "tab-2",
        title: "Lan Man Khi Viết Kịch Bản",
        subtitle: "Viết kín đặc trang giấy rồi ngồi học vẹt, thu voice đều đều như trả bài khiến khán giả ngửi thấy mùi diễn và lướt qua sau 3s",
        points: [
          "Viết kín trang giấy đọc lên sượng miệng: Cố nhồi nhét từ ngữ chuyên môn và văn mẫu AI nghe đao to búa lớn, đến lúc đọc lên thì ngượng mồm, mất sạch nhịp thở tự nhiên ngoài đời.",
          "Mắt đảo lia lịa, giọng đều đều như trả bài: Càng cố nhớ kịch bản thì mặt càng đơ; khán giả lướt điện thoại chỉ cần nghe 2 giây đầu là nhận ra giọng đọc vẹt sáo rỗng và lướt đi ngay.",
          "Hình ảnh bị ép khung, cắt vụn theo tiếng: Cố kéo dãn hoặc băm nhỏ video cho vừa khít từng chữ, khiến clip bị giật cục, thiếu những khoảng dừng để người xem kịp ngấm."
        ],
        outcome: "Giải pháp: Trợ lý AI bóc lỗi văn mẫu + Quy trình kịch bản 1 dòng 1 nhịp thở: Dùng bộ 3 trợ lý AI thực chiến (Miss Idea, Miss Vlog, Miss Video Ads) lọc sạch 7 lỗi văn vở sáo rỗng, bẻ nhỏ kịch bản thành từng câu ngắn 5 giây đi kèm hành động B-roll. Thầy trò cùng dựng hình ảnh cuốn hút trước, sau đó nhìn timeline nói mộc mạc như đang tâm sự với bạn thân ngồi trước mặt.",
        media: "/assets/showcase/ai_miss_vlog_poster.jpg",
        cards: [
          {
            title: "Kịch bản 1 dòng 1 nhịp thở",
            desc: "1 câu thoại ngắn đi kèm 1 động tác cụ thể, nhìn từ khóa là nói được ngay, không cần học thuộc lòng một chữ nào."
          },
          {
            title: "Trợ lý AI bóc sạch mùi văn mẫu",
            desc: "Tự động thanh lọc từ ngữ lý thuyết sáo rỗng, giữ trọn sự chân thành và ngôn ngữ đời thường chạm đúng lòng người."
          }
        ]
      },
      {
        id: "tab-3",
        title: "Quay Rồi Nhưng Chưa Chuyên Nghiệp",
        subtitle: "Hình ảnh tối tăm, âm thanh rè, góc quay đơn điệu như camera an ninh",
        points: [
          "Góc máy chính diện đơn điệu như camera an ninh, người xem nhìn 3 giây là chán.",
          "Mặt bị bóng dầu hoặc tối sầm vì không biết cách mượn ánh sáng tự nhiên và đèn cơ bản.",
          "Âm thanh lẫn tạp âm, tiếng vọng phòng làm giảm 80% độ uy tín của chuyên gia."
        ],
        outcome: "Giải pháp: Kỹ thuật setup 2 góc quay điện thoại (Góc chính diện + Góc cận 45 độ) tạo chiều sâu điện ảnh kết hợp lọc âm trong vắt.",
        media: "/assets/lighting/light_talkinghead.jpg",
        cards: [
          { title: "Setup 2 Cam Điện Thoại", desc: "Tận dụng ngay 2 chiếc smartphone có sẵn để tạo hiệu ứng chuyển góc như talkshow truyền hình." },
          { title: "Ánh sáng & Lọc tạp âm", desc: "Kỹ thuật đánh sáng 3 điểm tối giản và lọc âm AI khử 100% tiếng ồn phòng." }
        ]
      },
      {
        id: "tab-4",
        title: "Muốn Làm Đều Nhưng Không Biết Bắt Đầu",
        subtitle: "Không có quy trình sản xuất bền bỉ, mất cả ngày làm 1 clip rồi bỏ bẵng cả tháng",
        points: [
          "Mỗi lần quay là một cực hình: Từ nghĩ ý tưởng, dựng bối cảnh đến cắt ghép mất nguyên cả ngày cuối tuần.",
          "Không có kho tư liệu dự trữ: Cứ có việc bận kinh doanh là kênh bị bỏ hoang hàng tuần, mất sạch tương tác và đề xuất.",
          "Không đo lường chuyển đổi: Làm video theo cảm tính, không biết clip nào kéo khách để nhân bản mô hình."
        ],
        outcome: "Giải pháp: Đóng gói quy trình sản xuất video 1 buổi/tuần: Quay 1 buổi tích lũy kho 50+ tư liệu B-roll dùng cho cả tháng, kết hợp phễu thu thập số điện thoại và data khách tự động.",
        media: "/assets/showcase/multicam.jpg",
        cards: [
          { title: "Kho B-Roll Bank 50+ clip", desc: "Quay sẵn kho cảnh làm việc, tư vấn, đóng gói để ghép video quanh năm không bao giờ cạn ý tưởng." },
          { title: "Tự động hóa phễu ra đơn", desc: "Gắn liên kết phễu tự động thu thập data khách hàng về Google Sheet & Telegram ngay sau khi xem video." }
        ]
      }
    ],
    brollVideos: [
      {
        id: "broll-1",
        title: "Voice Over & B-Roll Đè Hình",
        subtitle: "Không cần lộ mặt, thu voice đè lên cảnh quay đời thực",
        youtubeUrl: "https://youtu.be/ZQ1Qfpln29o",
        videoId: "ZQ1Qfpln29o",
        poster: "/assets/formats/voiceover_poster.jpg",
        desc: "Quay sẵn 10-15 cảnh thao tác tay ngắn 2-3s, dựng clip trước rồi thu âm đè lên như đang tâm sự."
      },
      {
        id: "broll-2",
        title: "Talking Head & Kỹ Thuật 2 Cam",
        subtitle: "Setup một sải tay & Kỹ thuật ngắt nhịp không cần học thuộc lòng",
        youtubeUrl: "https://www.facebook.com/reel/1039457391880112",
        videoId: "1039457391880112",
        videoUrl: "/assets/formats/fb_reel_talkinghead_workflow.mp4",
        fbUrl: "https://www.facebook.com/reel/1039457391880112",
        poster: "/assets/showcase/fb_reel_talkinghead_poster.jpg",
        desc: "Hướng dẫn thực chiến setup đèn dải nhạy sáng cho điện thoại, setup một sải tay và kỹ thuật đọc kịch bản Single-line đếm nhịp 1-2 giúp nói lưu loát tự nhiên trước ống kính."
      },
      {
        id: "broll-3",
        title: "B-Roll Lifestyle Điện Ảnh",
        subtitle: "Quay dôi dư 3s, dựng phim câm trước khi thu tiếng",
        youtubeUrl: "https://youtu.be/alNkUUuE7fE",
        videoId: "alNkUUuE7fE",
        poster: "/assets/showcase/vananh.jpg",
        desc: "Tận dụng ánh sáng tự nhiên và bối cảnh đời thường tạo cảm xúc chân thật chạm người xem."
      }
    ],
    scriptVideos: [
      {
        id: "script-1",
        title: "AI Miss Idea: Lọc Sạch Mùi AI",
        subtitle: "Bóc 7 lỗi văn mẫu AI, tạo kịch bản mộc mạc đánh trúng nỗi sợ khách hàng",
        youtubeUrl: "",
        videoId: "ai_miss_idea_loc_van_mau",
        videoUrl: "/assets/formats/ai_miss_idea_loc_van_mau.mp4",
        poster: "/assets/showcase/ai_miss_idea_poster.jpg",
        desc: "Trợ lý AI độc quyền phân tích tâm lý khách hàng, bóc sạch 7 lỗi văn mẫu sáo rỗng thường gặp của ChatGPT/Claude và tự động viết lại kịch bản ngắn gọn, mộc mạc theo giọng nói đời thường."
      },
      {
        id: "script-2",
        title: "AI Miss Vlog: Ngắt Nhịp 3s Đời Thường",
        subtitle: "Biến việc làm hàng ngày thành kịch bản quay khả thi, khóa chặt 3s đầu (Hook)",
        youtubeUrl: "",
        videoId: "ai_miss_vlog_ngat_nhip",
        videoUrl: "/assets/formats/ai_miss_vlog_ngat_nhip.mp4",
        poster: "/assets/showcase/ai_miss_vlog_poster.jpg",
        desc: "Chỉ cần mô tả công việc hoặc tình huống thực tế, AI tự động băm nhỏ thành 3 hướng kịch bản kể chuyện đời thường. Câu ngắn ngắt dòng, tập trung tối đa vào 3 giây đầu tiên giữ chân người xem."
      },
      {
        id: "script-3",
        title: "AI Miss Video Ads: Hook + Body + CTA",
        subtitle: "Kịch bản quảng cáo 1 dòng 1 nhịp thở, bẻ khóa chuyển đổi ra đơn",
        youtubeUrl: "",
        videoId: "ai_miss_video_ads_3phan",
        videoUrl: "/assets/formats/ai_miss_video_ads_3phan.mp4",
        poster: "/assets/showcase/ai_miss_video_ads_poster.jpg",
        desc: "Quy trình AI viết kịch bản quảng cáo chuẩn 3 phần: Hook theo trend giữ chân, Body 1 câu thoại đi kèm 1 thao tác B-roll (đọc đến đâu cắt đến đó) và CTA hành động thúc đẩy khách nhắn tin chốt đơn."
      }
    ],
    lightingVideos: [
      {
        id: "light-1",
        title: "Setup Ánh Sáng Talking Head",
        subtitle: "Đèn thanh Keylight 45° + Đèn ven tóc + Máy ảnh",
        youtubeUrl: "https://youtu.be/Pem27DMrkVE",
        videoId: "Pem27DMrkVE",
        poster: "/assets/lighting/light_talkinghead.jpg",
        desc: "Kỹ thuật đánh sáng 3 điểm tối giản, mặt sáng đều, da nét mịn màng không bóng dầu."
      },
      {
        id: "light-2",
        title: "Setup Ánh Sáng 2 Đèn Spotlight",
        subtitle: "1 đèn thanh + 1 đèn pin rọi phông màu tạo chiều sâu",
        youtubeUrl: "https://youtu.be/vZUmtQA2Ryc",
        videoId: "vZUmtQA2Ryc",
        poster: "/assets/lighting/light_2den_spotlight.jpg",
        desc: "Cách dùng đèn pin spotlight chiếu điểm tạo mảng màu nghệ thuật tách chủ thể khỏi nền."
      },
      {
        id: "light-3",
        title: "Setup Ánh Sáng Phỏng Vấn Podcast",
        subtitle: "Lấy sáng chuẩn phỏng vấn talkshow truyền hình",
        youtubeUrl: "https://youtu.be/Zw4Lav1FO1g",
        videoId: "Zw4Lav1FO1g",
        poster: "/assets/lighting/light_podcast_dt.jpg",
        desc: "Cân bằng ánh sáng môi trường và đèn phụ trợ để khung hình có chiều sâu điện ảnh."
      },
      {
        id: "light-4",
        title: "Setup Đèn Mini Ulanzi & Smartphone",
        subtitle: "Tối ưu cho quay di động, vlog thực chiến",
        youtubeUrl: "https://youtu.be/jO0v5kDLnk4",
        videoId: "jO0v5kDLnk4",
        poster: "/assets/lighting/light_ulanzi_aida.jpg",
        desc: "Dùng đèn LED bỏ túi kẹp trực tiếp vào smartphone để quay video sắc nét mọi lúc mọi nơi."
      }
    ],
    processVideos: [
      {
        id: "proc-1",
        title: "Quy Trình 5 Bước Sản Xuất 1 Buổi/Tuần",
        subtitle: "Ý tưởng → Kịch bản → Bấm máy → Edit CapCut → Xuất bản đều đặn",
        youtubeUrl: "https://youtu.be/-1ddyry_Qs0",
        videoId: "-1ddyry_Qs0",
        poster: "/assets/showcase/multicam.jpg",
        desc: "Quy trình tinh gọn giúp bạn sản xuất 1 buổi có sẵn 15-20 video cho cả tháng mà không bị quá tải."
      },
      {
        id: "proc-2",
        title: "Edit Timeline CapCut Siêu Tốc",
        subtitle: "Khóa nhịp cắt 0.8s-2.5s, chèn text động và âm thanh SFX",
        youtubeUrl: "https://youtu.be/AqeJxr6W6Ws",
        videoId: "AqeJxr6W6Ws",
        poster: "/assets/lighting/light_talkinghead.jpg",
        desc: "Thao tác cắt ghép trực tiếp trên màn hình, tối ưu thời gian dựng dưới 15 phút mỗi clip."
      },
      {
        id: "proc-3",
        title: "Thực Hành 1-1 Đóng Gói Tại Lớp K2",
        subtitle: "Thầy Việt trực tiếp hướng dẫn bấm máy và hoàn thiện video",
        youtubeUrl: "https://youtu.be/WV8rggcgmGA",
        videoId: "WV8rggcgmGA",
        poster: "/assets/showcase/lop_k2.jpg",
        desc: "Học viên tự tay bấm máy, dựng và xuất bản video hoàn chỉnh ngay trong 2 ngày học."
      }
    ]
  },
  metaphors: {
    badge: "4 ĐỊNH DẠNG VIDEO MARKETING THỰC CHIẾN",
    headline: "Làm Chủ 4 Định Dạng Video Giúp Ra Đơn Bền Vững",
    subheadline: "Không cần kỹ xảo phức tạp hay studio đắt tiền. Bạn chỉ cần chọn đúng 1 trong 4 định dạng phù hợp với tính cách và lĩnh vực của mình để bắt đầu quay ngay.",
    items: [
      {
        id: "format-1",
        icon: "🎙️",
        title: "Voice Over",
        subtitle: "Định dạng \"hái ra tiền\" Affiliate & TikTok Shop",
        videoUrl: "/assets/formats/voiceover.mp4",
        poster: "/assets/formats/voiceover_poster.jpg",
        youtubeId: "tjetAj9A-Ps",
        youtubeUrl: "https://youtube.com/shorts/tjetAj9A-Ps",
        output: "Định dạng phổ biến & dễ ăn đề xuất nhất trên TikTok/Shopee. Giữ chân người xem >68% nhờ nhịp cắt 1.5s, tỷ lệ click vào giỏ hàng/affiliate tăng 250%.",
        relief: "Không cần lộ mặt, không cần nói hay trước cam. Chỉ cần quay cận cảnh thao tác tay/sản phẩm rồi thu voice tâm sự hoặc ghép giọng đọc đè lên.",
        application: "Video review sản phẩm, Affiliate TikTok Shop/Shopee, unbox quà tặng, quy trình làm việc."
      },
      {
        id: "format-2",
        icon: "🚶‍♂️",
        title: "Walk and Talk",
        subtitle: "Vừa đi vừa nói tự nhiên",
        videoUrl: "/assets/formats/walktalk.mp4",
        poster: "/assets/formats/walktalk_poster.jpg",
        youtubeId: "VCLHRm_3d-k",
        youtubeUrl: "https://www.youtube.com/watch?v=VCLHRm_3d-k",
        output: "45 giây đi dạo là xong 1 clip. Khung cảnh chuyển động kéo thời lượng xem tăng 240%, tăng 300% lượt comment tranh luận.",
        relief: "Không cần studio hay kịch bản chi tiết. Cầm điện thoại đi dạo nói 1 góc nhìn ngắn như đang nói chuyện với bạn thân.",
        application: "Bàn luận chủ đề nóng, góc nhìn kinh doanh, chia sẻ trải nghiệm, gỡ rối cho khách."
      },
      {
        id: "format-3",
        icon: "🎯",
        title: "Talking Head",
        subtitle: "Chia sẻ chuyên môn (2 góc máy)",
        videoUrl: "/assets/formats/talkinghead.mp4",
        poster: "/assets/formats/talkinghead_poster.jpg",
        youtubeId: "bHzSw0csp3g",
        youtubeUrl: "https://www.youtube.com/watch?v=bHzSw0csp3g",
        output: "Tăng 400% uy tín chuyên gia từ 3s đầu. Khách hàng tin tưởng chủ động chốt các gói dịch vụ giá trị cao từ 10tr – 50tr+.",
        relief: "Không cần học thuộc lòng, nói từng câu 5s theo kịch bản chuyển đổi. Nói vấp chỉ cần đổi góc máy là che 100% lỗi.",
        application: "Bác sĩ, chủ doanh nghiệp, tư vấn tài chính, BĐS, khóa học & dịch vụ chuyên gia."
      },
      {
        id: "format-4",
        icon: "📖",
        title: "Storytelling",
        subtitle: "Kể chuyện chuyển đổi cảm xúc",
        videoUrl: "/assets/formats/storytelling.mp4",
        poster: "/assets/formats/storytelling_poster.jpg",
        youtubeId: "hkumWP1gLmo",
        youtubeUrl: "https://www.youtube.com/watch?v=hkumWP1gLmo",
        output: "Dễ dàng cán mốc 100K – 500K views hữu cơ. Tỷ lệ chuyển đổi người xem thành khách hàng thực tế đạt 15% – 20%.",
        relief: "Khách hàng tự nhìn thấy nỗi đau của chính mình trong câu chuyện và tự tìm đến mua, bạn không phải nài ép hay chào mời.",
        application: "Tâm sự khởi nghiệp, case study khách hàng trước & sau, bán sản phẩm giá trị cao."
      }
    ]
  },
  curriculum: {
    badge: "LỘ TRÌNH LỚP HỌC 2 NGÀY THỰC CHIẾN",
    headline: "Học Đến Đâu Làm Được Đến Đó • Ra Video Ngay Tại Lớp",
    subheadline: "Lộ trình 4 buổi học được thiết kế xoay quanh 4 câu hỏi sống còn: Từ kịch bản 3 tầng 4 bước, tự tay dựng video đầu tiên, làm chủ 4 định dạng quay đến ứng dụng bộ 3 trợ lý AI tự động hóa.",
    days: [
      {
        dayNumber: "01",
        timeRange: "08:30 – 17:30",
        title: "Bẻ Khóa Kịch Bản 3 Tầng 4 Bước · Dựng Phim Câm · Xuất Xưởng Video Đầu Tay",
        badgeCount: "12 Module Thực Hành Cầm Tay Chỉ Việc",
        goal: "Mục tiêu Ngày 1 là phá tan hoàn toàn nỗi sợ viết kịch bản và sợ công nghệ. Buổi sáng làm chủ tư duy 3 Tầng & kịch bản 4 Bước để tự viết kịch bản 60s không học vẹt; buổi chiều tự tay quay B-roll và dùng CapCut dựng xong 01 video Voice-over hoàn chỉnh mang về máy.",
        morning: {
          sessionName: "Ca sáng",
          time: "08:30 – 12:00",
          title: "Kịch bản thế nào để video marketing đánh trúng tim can người xem?",
          items: [
            "Phân định video giáo dục vs. video giải trí: Vì sao 90% video chuyên gia bị lướt qua sau 3s? Hiểu đúng luật chơi video marketing tạo ra tiền.",
            "Kỹ năng 3 Tầng (SAFE - REAL - RAW): Bóc trần sự thật từ lời nói đãi bôi bề nổi (Safe), cảm giác mệt mỏi có thật (Real) đến sự thật ngượng miệng (Raw) khiến khách hàng thấy đúng tim can.",
            "Bộ khung kịch bản 4 Bước chuyển đổi: Xây cầu đồng cảm → Minh oan 'Đó không phải lỗi của bạn' → Gom bế tắc về 1 nút thắt duy nhất → Đưa ra chiếc chìa khóa độc quyền.",
            "Kịch bản 1 dòng 1 nhịp thở: Bẻ nhỏ kịch bản thành từng câu ngắn 5–7 chữ, nhìn từ khóa là nói được ngay, xóa sạch 100% tình trạng học vẹt hay sượng miệng.",
            "Cấu trúc Hook 3s & CTA chuyển đổi: Cách mở đầu khiến ngón tay người xem dừng lướt và cách đặt lời kêu gọi dẫn khách nhắn tin/để lại số điện thoại.",
            "Thực hành nhóm 2–3 người: Cùng thầy Việt mổ xẻ và viết hoàn chỉnh kịch bản 60s thực chiến cho chính sản phẩm/dịch vụ của từng học viên."
          ]
        },
        afternoon: {
          sessionName: "Ca chiều",
          time: "13:30 – 17:30",
          title: "Cầm điện thoại bấm nút gì, dựng video đầu tiên thế nào để có sản phẩm mang về?",
          items: [
            "Quy trình 'Dựng phim câm trước khi thu voice': Cắt gọt hình ảnh B-roll đạt độ cuốn hút trước, sau đó nhìn timeline thu tiếng để giữ trọn nhịp thở tự nhiên.",
            "Khai thác B-Roll Bank tại lớp: Kỹ thuật quay 10–15 cảnh thao tác tay cận cảnh (Macro shots) trong 10 phút để che 100% lỗi nói vấp và mắt đơ.",
            "Làm chủ CapCut Mobile từ số 0: Thao tác cắt gọt khoảng lặng (Dead Air), chỉnh tốc độ, ghép lớp phủ (Overlay) mượt mà không giật cục.",
            "Kỹ thuật nối động tác (Cut-on-Action): Bí quyết chuyển từ cảnh toàn sang cảnh cận liền mạch như phim tài liệu truyền hình.",
            "Chèn phụ đề tự động (Auto-Captions): Chuẩn hóa typography, chọn font chữ Việt hóa sắc nét, phối màu nổi bật và tạo điểm nhấn từ khóa.",
            "Thu âm Voice-over trong vắt & Xuất video: Cắm mic cài áo thu tiếng trực tiếp trên CapCut, xuất video chuẩn Full HD 1080p về máy điện thoại."
          ]
        }
      },
      {
        dayNumber: "02",
        timeRange: "08:30 – 17:30",
        title: "Làm Chủ 4 Định Dạng Quay · Ngoại Cảnh Ecopark · Bơm Đòn Bẩy AI Xây Kênh Solo",
        badgeCount: "12 Module Thực Chiến Nâng Cao",
        goal: "Mục tiêu Ngày 2 là giúp học viên làm chủ trọn vẹn 4 định dạng quay video chuyển đổi, tự tin đứng trước máy quay trong studio và ngoài trời, đồng thời cài đặt bộ 3 trợ lý AI độc quyền để một mình tự vận hành kênh đều đặn mỗi ngày.",
        morning: {
          sessionName: "Ca sáng",
          time: "08:30 – 12:00",
          title: "Có những cách quay video nào hiệu quả, giúp mình tự nhiên không bị đơ?",
          items: [
            "Bản đồ 4 Định dạng Video cốt lõi: Voice-over thao tác tay, Walk & Talk ngoại cảnh, Talking Head 2 cam chuyên gia và Storytelling chuỗi hành động.",
            "Setup 2 Góc máy Smartphone chuẩn truyền hình: Máy chính diện ngang tầm mắt kết hợp máy phụ nghiêng 45 độ xóa phông, tạo chiều sâu như talkshow.",
            "Kỹ thuật đánh sáng 3 điểm tối giản: Đèn thanh Keylight 45° + Đèn ven tóc + Tận dụng ánh sáng tự nhiên giúp mặt sáng đều, mịn màng không bóng dầu.",
            "Thực địa Ngoại cảnh Ecopark & Thử thách 'Túi Mù': Bốc thăm đề bài ngẫu nhiên theo nhóm, giải phóng sự ngượng ngùng trước đám đông.",
            "Level 1 - Quay chuyển cảnh theo nhịp nhạc: Bắt góc lia máy mượt mà (Pan, Tilt, Push-in) ăn khớp với từng phách tiết tấu âm thanh.",
            "Level 2 - Thực hành định dạng Walk & Talk: Cầm mic không dây vừa đi dạo vừa nói chuyện trôi chảy, giữ chân người xem gấp 2.4 lần."
          ]
        },
        afternoon: {
          sessionName: "Ca chiều",
          time: "13:30 – 17:30",
          title: "Biết edit rồi, làm thế nào để video xem cuốn hút và dùng AI làm hộ mỗi ngày?",
          items: [
            "Nghệ thuật nén nhịp 0.8s–2.5s: Bí quyết cứ mỗi 2-3s đổi góc máy hoặc đổi cỡ cảnh một lần, giữ người xem không thể rời mắt đến giây cuối.",
            "Thiết kế âm thanh cảm xúc (Sound Design): Cách phối nhạc nền theo sóng cảm xúc, chèn tiếng gõ, tiếng click, tiếng thở đúng điểm rơi tâm lý.",
            "Cài đặt Bộ 3 Trợ Lý AI của thầy Việt: Nạp trực tiếp Miss Idea (lên 30 ý tưởng), Miss Vlog (lọc sạch 7 lỗi văn mẫu) và Miss Video Ads (kịch bản chuyển đổi).",
            "Quy trình AI viết kịch bản 5 phút: Nhập bối cảnh công việc thực tế, AI tự động phân cảnh và ngắt dòng kịch bản 1 câu 1 nhịp thở.",
            "Phòng khám Video trực tiếp (Hot Seat 1-1): Thầy Việt chiếu bài của từng học viên lên màn hình lớn, chỉ rõ từng giây thừa và nén nhịp tại chỗ.",
            "Bàn giao Quy trình Vận hành Solo 30 ngày: Lộ trình đóng gói để 1 người tự sản xuất 1 video chất lượng cao mỗi ngày chỉ trong 30–45 phút."
          ]
        }
      }
    ],
    bonus: {
      tag: "BỘ CÔNG CỤ ĐẶC QUYỀN",
      title: "Bộ 3 Trợ Lý AI Extension + Kho 500+ Âm Thanh & B-Roll Mẫu",
      desc: "Tặng kèm trọn bộ extension AI cài thẳng vào trình duyệt, kho tài nguyên SFX bản quyền và bộ preset CapCut giúp học viên về nhà làm video ngay mà không lo thiếu nguyên liệu."
    }
  },
  showcase: {
    badge: "THÀNH PHẨM THỰC TẾ HỌC VIÊN",
    headline: "Xem Video Do Chính Học Viên Sản Xuất Sau Khóa Học",
    subheadline: "Từ những người chưa từng biết cầm máy hay edit, đây là những video thành phẩm được quay và dựng hoàn chỉnh 100%.",
    categories: [
      { id: "all", label: "Tất Cả Thành Phẩm" },
      { id: "spa_voiceover", label: "Spa & Làm Đẹp / Voice-Over" },
      { id: "lifestyle_walktalk", label: "Đời Thường Xây Kênh / Walk & Talk" },
      { id: "expert_talkinghead", label: "Bán Hàng / Talking Head" }
    ],
    videos: [
      {
        id: "vu-hai-long",
        title: "Tâm Sự Làm Nghề: Thà Mất Thêm Thời Gian Tư Vấn Còn Hơn Để Khách Hối Hận",
        author: "Vũ Hải Long",
        role: "Học Viên Offline · Sáng Tạo & Dịch Vụ",
        desc: "Sản phẩm thực hành trực tiếp từ lớp học quay dựng offline. Tận dụng setup ánh sáng và góc máy chuẩn chỉ, phong thái chia sẻ chân thành, chạm đúng tâm lý khách hàng để tạo niềm tin tuyệt đối.",
        poster: "/assets/showcase/vu_hai_long_poster.jpg",
        videoUrl: "/assets/showcase/vu_hai_long.mp4",
        category: "expert_talkinghead",
        categoryLabel: "Bán Hàng / Talking Head"
      },
      {
        id: "tham-tho-spa",
        title: "Home Spa Ấm Cúng: Sự Riêng Tư & Chăm Chút Khách Hàng",
        author: "Thực Hành Voice-Over",
        role: "Home Spa & Thẩm Mỹ · Lớp Offline K2",
        desc: "Ứng dụng kỹ thuật lồng tiếng Voice-over truyền cảm trên nền B-roll cận cảnh thao tác tay đắp mặt nạ, chăm sóc da và điêu khắc chân mày. Xóa sạch cảm giác quảng cáo chèo kéo, truyền tải chân thật sự tinh tế và cái tâm làm nghề của một Home Spa phục vụ khách quen.",
        poster: "/assets/showcase/tham_tho_poster.jpg",
        videoUrl: "/assets/showcase/tham_tho_spa.mp4",
        category: "spa_voiceover",
        categoryLabel: "Spa / Voice-Over"
      },
      {
        id: "broll-25s-k2",
        title: "Nhịp Cắt 3 Giây Giúp Video Không Buồn Ngủ",
        author: "Thực Hành Cảnh Trám",
        role: "B-Roll Minh Họa · Lớp Offline",
        desc: "Thực hành quay cảnh trám (B-roll) lồng ghép vào video ngắn. Tận dụng 1 chiếc điện thoại trên chân đế bàn làm việc, đón ánh sáng tự nhiên nghiêng 45° làm nổi khối nhạc cụ. Nhịp cắt 3 giây nối động tác (Cut-on-Action) liền mạch, giấu 100% vết cắt và che sạch lỗi nói vấp mà không cần học thuộc lòng.",
        poster: "/assets/showcase/disneyland_broll_25s_poster.jpg",
        videoUrl: "/assets/showcase/disneyland_broll_25s.mp4",
        category: "lifestyle_walktalk",
        categoryLabel: "Đời Thường / Walk & Talk"
      },
      {
        id: "cattuong-49s-k2",
        title: "Kể Chuyện Tuổi Thơ: Đố Mọi Người Đoán Được Vật Liệu Này?",
        author: "Thực Hành Kể Chuyện",
        role: "Storytelling · Lớp Offline K2",
        desc: "Ứng dụng định dạng kể chuyện (Storytelling) kết hợp câu hỏi tương tác gợi nhớ tuổi thơ. Cầm máy theo chân hành trình nổ bỏng ngô, góc máy đa dạng từ toàn cảnh sân nhà đến cận cảnh máy nổ bỏng nghi ngút khói. Kích thích người xem bình luận chia sẻ kỷ niệm, kéo thời lượng xem hết video đạt trên 70%.",
        poster: "/assets/showcase/nhathuoc_cattuong_poster.jpg",
        videoUrl: "/assets/showcase/nhathuoc_cattuong_49s.mp4",
        category: "lifestyle_walktalk",
        categoryLabel: "Đời Thường / Walk & Talk"
      },

      {
        id: "alNkUUuE7fE",
        title: "Thước Phim Voice-Over Giàu Cảm Xúc & B-Roll Điện Ảnh",
        author: "Bạn Vân Anh",
        role: "Học Viên K2 · Sáng Tạo Nội Dung",
        desc: "Tận dụng không gian ánh sáng tự nhiên và kỹ thuật quay B-roll dôi dư 3 giây. Dựng phim câm trước rồi thu voice trực tiếp trên timeline CapCut, tạo nên video tâm sự chân thật, chạm sâu vào cảm xúc người xem.",
        poster: "/assets/showcase/vananh.jpg",
        youtubeUrl: "https://youtu.be/alNkUUuE7fE",
        category: "lifestyle_walktalk",
        categoryLabel: "Đời Thường / Walk & Talk"
      },
      {
        id: "zcaVzUlj37s",
        title: "Tự Tin Nói Trước Camera 1 Chạm · Không Sợ Nói Vấp",
        author: "Bạn Phương",
        role: "Học Viên K2 · Bán Hàng & Đào Tạo",
        desc: "Ứng dụng kịch bản chuyển đổi và kỹ thuật ngắt nhịp 5 giây. Từ một người ngại lên hình, chỉ sau 2 ngày Phương đã tự tin quay video Talking Head chia sẻ chuyên môn cực kỳ tự nhiên, giữ chân người xem từ đầu đến cuối.",
        poster: "/assets/showcase/phuong.jpg",
        youtubeUrl: "https://youtu.be/zcaVzUlj37s",
        category: "expert_talkinghead",
        categoryLabel: "Bán Hàng / Talking Head"
      },

      {
        id: "WV8rggcgmGA",
        title: "Cầm Tay Chỉ Việc 1-1 · Bấm Máy & Chỉnh Sửa Từng Cử Chỉ",
        author: "Lớp Offline K2",
        role: "Thực Hành Trực Tiếp Tại Studio",
        desc: "Không khí thực hành sôi nổi tại studio tiêu chuẩn. Giảng viên trực tiếp chỉnh góc máy, đo sáng, hướng dẫn khẩu hình và sửa lỗi trực tiếp trên máy tính từng học viên.",
        poster: "/assets/showcase/lop_k2.jpg",
        youtubeUrl: "https://youtu.be/WV8rggcgmGA",
        category: "expert_talkinghead",
        categoryLabel: "Bán Hàng / Talking Head"
      },
      {
        id: "GqLHBWSiWDI",
        title: "Định Dạng Walk & Talk: Tự Nhiên, Giữ Chân Khách Gấp 2.4 Lần",
        author: "Học Viên Online",
        role: "Học Online · Đào Tạo & Giảng Dạy",
        desc: "Thực hành sau khóa học online: Cầm mic không dây vừa đi dạo qua hiệu sách vừa chia sẻ góc nhìn thực tế. Khung cảnh chuyển động liên tục cuốn hút mắt nhìn, loại bỏ hoàn toàn cảm giác gượng gạo trước ống kính.",
        poster: "/assets/showcase/nuong.jpg",
        youtubeUrl: "https://youtu.be/GqLHBWSiWDI",
        category: "lifestyle_walktalk",
        categoryLabel: "Đời Thường / Walk & Talk"
      }
    ]
  },
  caseStudies: {
    badge: "KẾT QUẢ THỰC TẾ HỌC VIÊN",
    headline: "Sản Phẩm Sau Khóa Học: Thực Hành Định Dạng Walk & Talk",
    subheadline: "Ứng dụng định dạng vừa đi vừa nói tại không gian mở đời thực, giúp video tự nhiên, giữ chân người xem gấp 2.4 lần mà không cần học thuộc lòng kịch bản.",
    items: [
      {
        name: "Sản Phẩm Sau Khóa Học",
        role: "Thực Hành Định Dạng Walk & Talk (Vừa Đi Vừa Nói)",
        niche: "ĐÀO TẠO & GIẢNG DẠY THỰC CHIẾN",
        stats: "Giữ chân người xem gấp 2.4 lần",
        videoId: "GqLHBWSiWDI",
        youtubeUrl: "https://youtu.be/GqLHBWSiWDI",
        poster: "/assets/showcase/nuong.jpg",
        story: "Thực hành định dạng Walk & Talk sau khóa học: Cầm mic không dây vừa đi dạo qua hiệu sách và không gian mở vừa chia sẻ góc nhìn thực tế. Khung cảnh chuyển động liên tục cuốn hút mắt nhìn, loại bỏ hoàn toàn cảm giác gượng gạo trước ống kính.",
        highlights: [
          "Áp dụng chuẩn định dạng Walk & Talk: Vừa đi vừa nói giữ chân người xem",
          "Cầm mic thu âm ngoại cảnh rõ tiếng, tận dụng không gian mở tự nhiên",
          "Cắt gọt CapCut chèn chữ động, chuyển cảnh theo nhịp bước chân",
          "Tự quay 1 mình bằng điện thoại — Video tự nhiên, không diễn gượng"
        ]
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
    name: "Nguyễn Đức Việt",
    role: "Chuyên Gia Đào Tạo Video Marketing & Sản Xuất Đa Phương Tiện (15+ Năm Kinh Nghiệm)",
    avatar: "/assets/image_1781192246239-Dsb4zlhm.png",
    bio: [
      "15+ năm trực tiếp giảng dạy và đào tạo thiết kế, mỹ thuật đa phương tiện, lập trình và video marketing tại FPT Arena Multimedia và các hệ thống giáo dục hàng đầu.",
      "Người sáng lập Fanpage '30 Ngày Học Làm Nội Dung Viral' sở hữu hơn 38.850+ người theo dõi và chuỗi video Reels chạm mốc hơn 3,4 triệu lượt xem hoàn toàn tự nhiên, mang về hơn 3.600 khách hàng nhắn tin chuyển đổi.",
      "Trực tiếp đồng hành và kèm cặp học viên từ người chưa từng biết cầm máy đến khi tự tay sản xuất video marketing sắc nét, có cấu trúc và thu hút khách hàng đều đặn mỗi ngày."
    ],
    stats: [
      { number: "15+", label: "Năm Đào Tạo Multimedia" },
      { number: "38.850+", label: "Follower Kênh Tự Nhiên" },
      { number: "3,4 Triệu+", label: "Lượt Xem Video Reels" },
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
      a: "Đây chính là vấn đề 90% học viên gặp phải. Với phương pháp kịch bản chuyển đổi và kỹ thuật quay ngắt câu 5 giây, bạn sẽ thấy việc đứng trước ống kính nhẹ nhàng như đang nói chuyện với một người bạn."
    },
    {
      q: "Học phí và chính sách hoàn tiền như thế nào?",
      a: "Khóa học cam kết: Nếu sau ngày học đầu tiên bạn cảm thấy nội dung không thực tế hoặc không thể áp dụng được, ban tổ chức sẽ hoàn lại 100% học phí mà không hỏi thêm bất kỳ câu hỏi nào."
    },
    {
      q: "Sĩ số lớp là bao nhiêu học viên?",
      a: "Để đảm bảo chất lượng cầm tay chỉ việc và mọi học viên đều có sản phẩm video mang về, mỗi lớp được giới hạn nghiêm ngặt tối đa không quá 40 học viên."
    }
  ]
};
