// ==============================================================================
// offline.fedu.vn — Single Source of Truth (SSOT) Content Repository
// All copywriting, statistics, video links, media URLs, and FAQs reside here.
// View components in src/sections/ & src/components/ consume this data directly.
// ==============================================================================

export interface ContentData {
  // 1. Site & Brand Information
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

  // 2. SEO & Social Metadata
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

  // 3. Navigation Header
  navbar: {
    brand: {
      title: string;
      subtitle: string;
    };
    links: {
      label: string;
      href: string;
    }[];
    cta: string;
    mobileCta: string;
  };

  // 4. Hero Section
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    tags: string[];
    meta: {
      id?: string;
      label: string;
      value: string;
      desc: string;
    }[];
    cta: string;
    ctaNote: string;
  };

  // 5. Proof Section (Meta Business Suite Audit & Channels)
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
    reportCard: {
      badge: string;
      stats: {
        label: string;
        value: string;
        growth: string;
        variant: 'normal' | 'amber' | 'emerald';
      }[];
      pillars: {
        bold: string;
        text: string;
        highlight?: string;
        textEnd?: string;
      }[];
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
      iconType: 'trending' | 'mouse' | 'phone';
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

  // 6. Definition Section (3-Column Comparison & Instructor Callout)
  definition: {
    badge: string;
    headline: string;
    subheadline: string;
    highlightWord: string;
    columns: {
      id: string;
      variant: 'danger' | 'neutral' | 'highlight';
      badge?: string;
      tag: string;
      title: string;
      desc: string;
      points: {
        bold: string;
        text: string;
      }[];
      result: string;
    }[];
    callout: {
      badge: string;
      quoteParts: {
        text: string;
        highlight?: string;
        textAfter?: string;
      }[];
      author: string;
      cta: string;
    };
  };

  // 7. Growth Retention Chart Section
  chart: {
    badge: string;
    headline: string;
    description: string;
    legends: {
      marketing: string;
      normal: string;
      unit: string;
    };
    source: {
      label: string;
      studyName: string;
      metricNote?: string;
      url: string;
      viewReportText: string;
    };
    insights: {
      tag: string;
      title: string;
      desc: string;
      type: 'pain' | 'cause' | 'solution';
    }[];
    data: {
      month: string;
      marketing: number;
      normal: number;
    }[];
    bullets?: {
      title: string;
      normal: string;
      marketing: string;
    }[];
    takeaway: {
      badge: string;
      headline: string;
      subheadline?: string;
      content: string;
      cards?: {
        tier: string;
        timing: string;
        title: string;
        desc: string;
        stat: string;
        variant: 'danger' | 'warning' | 'success';
      }[];
      solution?: {
        badge: string;
        title: string;
        desc: string;
        metrics: {
          value: string;
          label: string;
        }[];
      };
    };
  };

  // 8. Metaphors Section (4 Formats)
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
      watchYoutubeTitle: string;
      youtubeButtonText?: string;
    };
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
    cta: string;
  };

  // 9. Pain Points Section (4 Bottlenecks & Video Switchers)
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
      media?: string;
      videoId?: string;
      videoTitle?: string;
      videoSubtitle?: string;
      cards: {
        title: string;
        desc: string;
      }[];
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
      moduleBadge: string;
      cadenceBadge: string;
      workflowPills: string[];
      valueTags: string[];
    };
    ui: {
      brollCategory: string;
      scriptCategory: string;
      lightingCategory: string;
      processCategory: string;
      brollBadgePrefix: string;
      scriptBadgePrefix: string;
      lightingBadgePrefix: string;
      processBadgePrefix: string;
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

  // 10. Curriculum Section (2-Day Syllabus & Event Photos)
  curriculum: {
    badge: string;
    headline: string;
    subheadline: string;
    eventPhotos: {
      image: string;
      caption: string;
      alt: string;
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

  // 11. Mid-Page Banner CTA
  bannerCta: {
    badge: string;
    title: string;
    cta: string;
  };

  // 12. Student Showcase Section
  showcase: {
    badge: string;
    headline: string;
    subheadline: string;
    categories: {
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
      category: string;
      categoryLabel: string;
    }[];
    ui: {
      watchVideo: string;
      openVideo: string;
      swipeHint: string;
      prevAriaLabel: string;
      nextAriaLabel: string;
    };
  };

  // 13. Case Studies Section
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

  // 14. Target Audience Section
  targetAudience: {
    badge: string;
    headline: string;
    fitHeader: string;
    notFitHeader: string;
    fit: {
      title: string;
      desc: string;
    }[];
    notFit: {
      title: string;
      desc: string;
    }[];
  };

  // 15. Instructor Section
  instructor: {
    badge: string;
    name: string;
    mainRole: string;
    subRole: string;
    role: string;
    avatar: string;
    bio: string[];
    stats: {
      number: string;
      label: string;
    }[];
    quote: string;
  };

  // 16. In-Page Registration Form Section
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
        occupation: { label: string; placeholder: string; optionalLabel: string; required: boolean };
        reason: { label: string; placeholder: string; optionalLabel: string; required: boolean };
      };
      disclaimerTag: string;
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

  // 17. FAQs Section
  faqSection: {
    badge: string;
    headline: string;
    description: string;
    items: {
      q: string;
      a: string;
    }[];
  };

  // 18. Backwards compatibility FAQs alias
  faqs: {
    q: string;
    a: string;
  }[];

  // 19. Mobile Sticky Floating CTA
  stickyBottomCta: {
    badge: string;
    subtitle: string;
    cta: string;
  };

  // 20. Modal Registration Popup
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

  // 21. Success Page
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

  // 22. Footer Section
  footer: {
    brand: string;
    description: string;
    policyTitle: string;
    policyContent: string;
    copyright: string;
  };
}

export const CONTENT: ContentData = {
  // 1. Site & Brand Information
  site: {
    brandName: "VIDEO MARKETING",
    brandSubtitle: "WORKSHOP OFFLINE 2 NGÀY",
    domain: "offline.fedu.vn",
    url: "https://offline.fedu.vn",
    hotline: "0912345678",
    zaloUrl: "https://zalo.me",
    facebookPageUrl: "https://facebook.com",
    youtubeChannelUrl: "https://youtube.com",
    copyright: "© 2026 VIDEO MARKETING — Khóa Học Video Marketing Thực Chiến Đứng Lớp Trực Tiếp Bởi Nguyễn Đức Việt."
  },

  // 2. SEO & Social Metadata
  seo: {
    title: "Khóa Học Video Marketing Offline 2 Ngày Thực Chiến Hà Nội - Thầy Nguyễn Đức Việt",
    description: "Khóa học offline 2 ngày cầm tay chỉ việc giúp chủ doanh nghiệp, chuyên gia và người làm dịch vụ làm chủ quy trình kịch bản chuyển đổi, setup 2 góc quay và edit video ra đơn bền vững.",
    keywords: [
      "video marketing",
      "khóa học video marketing",
      "nguyễn đức việt",
      "học làm video hà nội",
      "kịch bản video viral",
      "setup 2 góc máy",
      "capcut thực chiến"
    ],
    ogTitle: "Khóa Học Video Marketing Offline 2 Ngày Thực Chiến - Thầy Nguyễn Đức Việt",
    ogDescription: "Biến Chuyên Môn Của Bạn Thành Video Marketing Đắt Giá. Cầm tay chỉ việc 1-1, ra thành phẩm ngay tại lớp.",
    ogImage: "https://offline.fedu.vn/opengraph.jpg?v=20260904",
    ogUrl: "https://offline.fedu.vn",
    twitterCard: "summary_large_image"
  },

  // 3. Navigation Header
  navbar: {
    brand: {
      title: "VIDEO MARKETING",
      subtitle: "WORKSHOP OFFLINE 2 NGÀY"
    },
    links: [
      { label: "Kết Quả", href: "#proof" },
      { label: "4 Định Dạng", href: "#metaphors" },
      { label: "4 Nút Thắt", href: "#pain-points" },
      { label: "Lộ Trình 2 Ngày", href: "#curriculum" },
      { label: "Video Học Viên", href: "#showcase" },
      { label: "Giảng Viên", href: "#instructor" },
      { label: "Hỏi Đáp", href: "#faq" }
    ],
    cta: "GIỮ CHỖ NGAY",
    mobileCta: "ĐĂNG KÝ GIỮ CHỖ NGAY"
  },

  // 4. Hero Section
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
      { id: "time", label: "THỜI GIAN", value: "2 Ngày Thực Chiến", desc: "Thứ 7 & Chủ Nhật (08:30 - 17:30)" },
      { id: "location", label: "ĐỊA ĐIỂM", value: "Hà Nội", desc: "Phòng Studio tiêu chuẩn chuyên nghiệp" },
      { id: "capacity", label: "QUY MÔ", value: "≤ 40 Học Viên", desc: "Kèm cặp 1-1 ra sản phẩm ngay tại lớp" }
    ],
    cta: "ĐĂNG KÝ GIỮ CHỖ NGAY",
    ctaNote: "Chỉ nhận tối đa 40 học viên mỗi đợt để đảm bảo chất lượng cầm tay chỉ việc."
  },

  // 5. Proof Section (Dữ Liệu Đối Soát Meta Suite & Showcase)
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
    },
    reportCard: {
      badge: "BÁO CÁO ĐỐI SOÁT HỘP THƯ & TƯ VẤN",
      stats: [
        { label: "Lượt Xem", value: "6,0 Triệu", growth: "↑ +345,5% Meta", variant: "normal" },
        { label: "Click Link", value: "50,8K", growth: "↑ +475,9% Đổi", variant: "amber" },
        { label: "Số ĐT Thật", value: "428+", growth: "Để lại tư vấn", variant: "emerald" }
      ],
      pillars: [
        {
          bold: "Không cần ê-kíp cồng kềnh:",
          text: " Tự quay bằng điện thoại hoặc máy ảnh cá nhân, tự dựng hoàn chỉnh một mình."
        },
        {
          bold: "Đòn bẩy tuần:",
          text: " Chỉ đăng 1 video/tuần vẫn kéo về ",
          highlight: "146.400 tiếp cận & 108 khách mới",
          textEnd: "."
        },
        {
          bold: "50.800+ lượt click link",
          text: " mua hàng và xin tư vấn thực tế từ luồng video viral."
        }
      ]
    },
    tabs: [
      {
        id: "meta-growth",
        shortLabel: "Tăng Trưởng Meta",
        badgeLabel: "6,0M View · 50,8K Click",
        title: "Báo Cáo Hiệu Quả 6 Tháng Từ Meta Business Suite",
        image: "/assets/meta_suite_6m_growth.png",
        sourceBadge: "business.facebook.com · ID: 839755019212216",
        caption: "Thanh URL trình duyệt thật · Tăng trưởng 6.0M view & 50.8K link click",
        highlightMetric: "+345,5% Lượt Xem · +475,9% Click Link",
        iconType: "trending"
      },
      {
        id: "weekly-leverage",
        shortLabel: "Đòn Bẩy 1 Bài/Tuần",
        badgeLabel: "146,4K Reach · 108 Inbox",
        title: "Báo Cáo Hiệu Suất Tuần: 1 Bài Đăng Kéo 108 Khách Mới",
        image: "/assets/meta_weekly_1post_108inbox.png",
        sourceBadge: "Meta Business Suite · Báo Cáo Tuần 23/8 - 29/8",
        caption: "Đăng đúng 1 bài trong tuần nhưng tiếp cận 146.400 người & 108 inbox mới",
        highlightMetric: "1 Bài Viết = 108 Cuộc Hội Thoại Mới",
        iconType: "mouse"
      },
      {
        id: "leads-audit",
        shortLabel: "Đối Soát 428 Số ĐT",
        badgeLabel: "428 SĐT · 3.642 Leads",
        title: "Đối Soát 428 Số Điện Thoại & Khách Hàng Thật",
        image: "/assets/facebook_real_page_dashboard.png",
        sourceBadge: "Hệ Thống Đối Soát Hộp Thư Tự Động",
        caption: "Trích đoạn danh sách khách hàng để lại số điện thoại xin tư vấn và mua khóa học",
        highlightMetric: "428 Số ĐT · Tỷ Lệ Quan Tâm 20.8%",
        iconType: "phone"
      }
    ],
    channels: {
      headline: "Các Kênh Video Triệu View Được Xây Dựng Từ Con Số 0",
      subheadline: "Hình ảnh thực tế từ các kênh Fanpage, TikTok và số liệu phân tích chuyển đổi",
      updateDate: "(Cập nhật ngày 03/09/2026)",
      items: [
        {
          id: "channel-fanpage",
          title: "Fanpage 38.850+ Follower",
          desc: "Kênh nội dung xây từ số 0 bằng video chia sẻ chuyên môn thực tế",
          image: "/assets/fanpage_nguyenducviet.png",
          updateDate: "(Cập nhật ngày 03/09/2026)"
        },
        {
          id: "channel-tiktok",
          title: "TikTok 181.500+ View",
          desc: "Kênh @nguyenducviet.viral với chuỗi clip ghim triệu view tự nhiên",
          image: "/assets/tiktok_nguyenducviet.png",
          updateDate: "(Cập nhật ngày 03/09/2026)"
        },
        {
          id: "channel-leads",
          title: "3.642 Leads & 428 Số ĐT",
          desc: "Báo cáo chuyển đổi khách hàng tiềm năng thực tế qua tin nhắn Fanpage",
          image: "/assets/facebook_leads_stats.png",
          updateDate: "(Cập nhật ngày 03/09/2026)"
        },
        {
          id: "channel-reels",
          title: "Reels 3.430.000+ View",
          desc: "Dàn video ngắn giữ chân người xem và tạo đơn hàng liên tục mỗi ngày",
          image: "/assets/image_1781281388562-DGSN1Etr.png",
          updateDate: "(Cập nhật ngày 03/09/2026)"
        }
      ]
    },
    ui: {
      zoomButton: "Phóng to HD",
      zoomHint: "Nhấn để soi rõ từng chi tiết",
      closeModal: "Đóng (ESC)"
    }
  },

  // 6. Definition Section (Bản Chất Cốt Lõi: So Sánh 3 Cột)
  definition: {
    badge: "BẢN CHẤT CỐT LÕI · PHÂN BIỆT RÕ RÀNG",
    headline: "Video marketing là gì? Vì sao 90% người làm video đang nhầm sang \"video ads\" hoặc \"câu view rác\"?",
    subheadline: "Quảng cáo tắt tiền là hết khách, câu view giải trí thì không ra tiền. Chỉ có video marketing có cấu trúc chuẩn mới là tài sản tự động mang khách hàng về cho bạn 24/7.",
    highlightWord: "video marketing có cấu trúc chuẩn",
    columns: [
      {
        id: "video-ads",
        variant: "danger",
        tag: "01. VIDEO ADS (CHẠY QUẢNG CÁO)",
        title: "Mua tiếp cận, không mua được lòng tin",
        desc: "Cố gắng tiếp cận thật nhiều người bằng tiền quảng cáo và các bài bán hàng trực diện, giảm giá ép mua.",
        points: [
          { bold: "Không bền vững:", text: " Dừng ngân sách là lập tức mất dòng khách hàng." },
          { bold: "Tâm lý đề phòng:", text: " Khán giả ngày càng cảnh giác và ác cảm với quảng cáo chèo kéo." },
          { bold: "Bào mòn lợi nhuận:", text: " Càng chạy càng đắt đỏ, tiền lãi không bù nổi tiền ads." }
        ],
        result: "Kết quả: Lệ thuộc quảng cáo, càng làm càng đuối"
      },
      {
        id: "video-trend",
        variant: "neutral",
        tag: "02. VIDEO ĐU TREND (CÂU VIEW ĐẠI TRÀ)",
        title: "Lượt xem ảo, bài toán thật",
        desc: "Chạy theo xu hướng nhất thời để đổi lấy những con số tương tác bề nổi từ người lướt mạng giải trí.",
        points: [
          { bold: "Người xem không phải khách:", text: " Triệu view nhưng không ai có nhu cầu hay ý định mua hàng." },
          { bold: "Mất vị thế chuyên môn:", text: " Bị coi là kênh giải trí qua đường thay vì chuyên gia uy tín." },
          { bold: "Không thể nhân bản:", text: " Cạn kiệt ý tưởng đu trend sau vài tuần, không tạo ra hệ thống." }
        ],
        result: "Kết quả: Bận rộn ảo, không tạo ra khách hàng thật"
      },
      {
        id: "video-marketing",
        variant: "highlight",
        badge: "CHUẨN PHƯƠNG PHÁP THỰC CHIẾN",
        tag: "03. VIDEO MARKETING CÓ CẤU TRÚC",
        title: "Tài sản sinh khách 24/7",
        desc: "Video 30–45s giải thích đúng điểm nghẽn chuyên môn bằng trải nghiệm thật. Khách hàng tự tìm đến xin tư vấn và mua hàng.",
        points: [
          { bold: "1 người 1 điện thoại:", text: " Tự quay đơn giản, ngắt câu 5s theo kịch bản chuyển đổi." },
          { bold: "Đúng tệp khách chi tiền:", text: " Khán giả thấy đúng vấn đề của mình nên chủ động nhắn tin." },
          { bold: "Tài sản số vĩnh viễn:", text: " Video đăng lên tiếp tục mang lại khách hàng sau nhiều tháng." }
        ],
        result: "Kết quả: Có khách đều đặn, không tốn tiền ads"
      }
    ],
    callout: {
      badge: "ĐÚC KẾT THỰC CHIẾN TỪ THẦY NGUYỄN ĐỨC VIỆT",
      quoteParts: [
        {
          text: "\"Làm Video Marketing thực ra như anh thợ máy nghe tiếng xe là biết hỏng ở đâu: bạn không cần ăn nói dẻo miệng, chỉ cần nói đúng sự thật và gỡ đúng chỗ khách đang bế tắc."
        },
        {
          text: "Nhưng để người xem chịu dừng lại lắng nghe, ",
          highlight: "nhìn thuận mắt, nghe êm tai và xem một mạch từ đầu đến cuối",
          textAfter: ", bạn cần đóng gói nó trong một khung hình sáng sủa cùng âm thanh rõ nét. Đó chính là quy trình thực chiến bạn sẽ được làm chủ trong khóa học này.\""
        }
      ],
      author: "Nguyễn Đức Việt",
      cta: "HỌC CÁCH LÀM VIDEO MARKETING"
    }
  },

  // 7. Growth Chart Section
  chart: {
    badge: "NGHIÊN CỨU & ĐỐI SOÁT DỮ LIỆU TOÀN CẦU",
    headline: "Vì Sao Video Có Cấu Trúc Giữ Chân Gấp 12 Lần Video Tự Phát?",
    description: "Theo nghiên cứu BrandEffect của Meta & Nielsen trên 173 chiến dịch video: 47% giá trị quảng cáo được quyết định trong 3 giây đầu tiên, và 74% được chốt lại trước mốc 10 giây. Không biết kỹ thuật nén nhịp, video tự phát sẽ rơi rụng tới 81% khán giả ngay ở 10 giây đầu trước khi kịp nói đến phần bán hàng.",
    legends: {
      marketing: "Video Marketing Thực Chiến (Cấu trúc nén nhịp)",
      normal: "Video Tự Phát (Bản năng mở đầu lan man)",
      unit: "Đơn vị: Tỷ lệ khán giả còn ở lại trên timeline (%)"
    },
    source: {
      label: "Meta & Nielsen Research",
      studyName: "Value of Video",
      metricNote: "Khảo sát đường cong giữ chân thực tế (Audience Retention Curve) đo lường trên video ngắn 60s",
      url: "https://www.facebook.com/business/news/value-of-video",
      viewReportText: "Xem báo cáo gốc"
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
    ],
    takeaway: {
      badge: "BÓC TÁCH TÂM LÝ 3 TẦNG",
      headline: "Khán giả không lướt đi vì bạn thiếu máy ảnh xịn — Họ bỏ đi vì 3 giây đầu bạn đang nói thứ bạn muốn khoe, chứ không chạm vào thứ họ đang đau.",
      subheadline: "Giải phẫu 3 tầng cảm xúc quyết định người xem ở lại hay quẹt qua trong tích tắc:",
      content: "Đa số người tự quay thường mở đầu bằng lời chào hỏi lịch sự bề nổi (Tầng 1), khiến 68% người xem lướt qua ngay 3s đầu; đến khi nói mệt nghỉ đến cuối clip thì chẳng còn ai nghe lời chốt đơn (Tầng 2). Sự thật là khán giả chỉ dừng lại khi bạn đâm trúng nỗi bế tắc ngượng miệng mà họ giấu kín (Tầng 3). Khi áp dụng Kịch bản 3 Tầng kết hợp kỹ thuật ngắt nhịp 5 giây: bạn tự tin nói chuyện mộc mạc như tâm sự mà vẫn giữ chân 88% khán giả và chuyển đổi ra đơn gấp 11.6 lần.",
      cards: [
        {
          tier: "TẦNG 1 • NÓI ĐÃI BÔI",
          timing: "3s Đầu",
          title: "Lời chào lịch sự bề nổi",
          desc: "Mở đầu bằng câu chào vòng vo, giới thiệu tên tuổi hoặc phô trương máy móc, bối cảnh sang chảnh.",
          stat: "68% người xem lướt qua ngay lập tức",
          variant: "danger"
        },
        {
          tier: "TẦNG 2 • MỆT MỎI THẬT",
          timing: "Giữa Clip",
          title: "Cố gồng nói đến mệt nghỉ",
          desc: "Nói dồn dập hàng tá kiến thức, gồng mình làm chuyên gia suốt cả video nhưng thiếu điểm neo cảm xúc.",
          stat: "Đến cuối clip không còn ai nghe chốt đơn",
          variant: "warning"
        },
        {
          tier: "TẦNG 3 • SỰ THẬT NGƯỢNG MIỆNG",
          timing: "Điểm nổ",
          title: "Đâm trúng bế tắc giấu kín",
          desc: "Chạm đúng vào nỗi bất an, sự sĩ diện hay những bế tắc khó giãi bày mà người xem đang âm thầm chịu đựng.",
          stat: "Khán giả khựng ngón tay lại vì thấy chính mình",
          variant: "success"
        }
      ],
      solution: {
        badge: "GIẢI PHÁP CHUYỂN ĐỔI",
        title: "Kịch Bản 3 Tầng + Kỹ Thuật Ngắt Nhịp 5 Giây",
        desc: "Tự tin nói chuyện mộc mạc như hai người bạn ngồi đàm đạo chén trà — không cần diễn, không cần gồng, chuyển đổi đến tự nhiên.",
        metrics: [
          {
            value: "88%",
            label: "Giữ chân người xem"
          },
          {
            value: "x11.6",
            label: "Chuyển đổi ra đơn"
          }
        ]
      }
    }
  },

  // 8. Metaphors Section (4 Formats)
  metaphors: {
    badge: "4 ĐỊNH DẠNG VIDEO MARKETING THỰC CHIẾN",
    headline: "Làm Chủ 4 Định Dạng Video Giúp Ra Đơn Bền Vững",
    subheadline: "Không cần kỹ xảo phức tạp hay studio đắt tiền. Bạn chỉ cần chọn đúng 1 trong 4 định dạng phù hợp với tính cách và lĩnh vực của mình để bắt đầu quay ngay.",
    formatPrefix: "ĐỊNH DẠNG 0",
    labels: {
      output: "Output Chuyển Đổi",
      relief: "Gỡ Bỏ Rào Cản",
      application: "Ứng dụng:",
      practiceNote: "Thực hành tại lớp",
      practiceTag: "1 kèm 1",
      watchYoutubeTitle: "Xem trên YouTube",
      youtubeButtonText: "YouTube"
    },
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
    ],
    cta: "LÀM CHỦ 4 ĐỊNH DẠNG VIDEO NÀY TẠI LỚP HỌC"
  },

  // 9. Pain Points Section (4 Bottlenecks)
  painPoints: {
    badge: "BẠN ĐANG GẶP PHẢI ĐIỀU NÀY?",
    headline: "Tháo Gỡ 4 Nút Thắt Khiến Video Của Bạn Không Có Chuyển Đổi",
    subheadline: "Hầu hết mọi người bỏ cuộc không phải vì thiếu chuyên môn, mà vì mắc kẹt ở 4 cạm bẫy kỹ thuật và tư duy làm video sai cách.",
    tabPrefix: "VƯỚNG MẮC 0",
    sectionTag: "VƯỚNG MẮC THỰC TẾ & CÁCH THẦY TRÒ CÙNG LÀM",
    outcomePrefix: "✨ Cách xử lý tại studio:",
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
        outcome: "Phương pháp kịch bản chuyển đổi ngắt nhịp 5s + Kỹ thuật B-roll Bank (chèn cảnh trám 2-3s đè timeline) giúp bạn nói tự nhiên, che 100% lỗi nói vấp và mắt đơ.",
        media: "/assets/formats/voiceover_poster.jpg",
        cards: [
          { title: "Kịch bản chuyển đổi", desc: "Chỉ nhìn 1 từ khóa cốt lõi cho mỗi ý, nói chuyện như đang tâm sự với 1 người bạn thân." },
          { title: "Kho B-Roll Bank Xử Lý", desc: "Băm nhỏ 10-15 cảnh thao tác tay ngắn 2-3s chèn đè lên nhịp nói, che sạch lỗi vấp và mắt đơ khi lên hình." }
        ]
      },
      {
        id: "tab-2",
        title: "Lan Man Khi Viết Kịch Bản",
        subtitle: "Khán giả bỏ đi không phải vì máy ảnh cùi — mà vì 3s đầu bạn mải khoe thứ bạn có, chứ chưa chạm vào thứ họ đang đau",
        points: [
          "Tầng 1 (Chào hỏi bề nổi): 3s đầu mải chào hỏi xã giao và khoe thứ mình có, khiến 68% người xem quẹt qua ngay lập tức.",
          "Tầng 2 (Cố gồng nói mệt nghỉ): Nhồi nhét từ ngữ chuyên môn suốt cả clip, đến lúc kêu gọi hành động thì chẳng còn ai nghe chốt đơn.",
          "Tầng 3 (Sự thật ngượng miệng): Khán giả chỉ dừng lại khi bạn đâm trúng nỗi bế tắc giấu kín mà họ không dám thừa nhận công khai."
        ],
        outcome: "Kịch bản 3 Tầng + Kỹ thuật ngắt nhịp 5 giây: Lọc sạch văn mẫu sáo rỗng, nói chuyện mộc mạc như tâm sự chén trà mà vẫn giữ chân 88% khán giả và chuyển đổi ra đơn gấp 11.6 lần.",
        media: "/assets/showcase/ai_miss_vlog_poster.jpg",
        cards: [
          {
            title: "Kịch bản 3 Tầng chạm đáy tâm lý",
            desc: "Đâm thẳng vào nỗi đau Tầng 3 ngay từ giây thứ 3, giữ chân 88% khán giả xem trọn vẹn clip mà không cần gồng."
          },
          {
            title: "Kỹ thuật ngắt nhịp 5 giây",
            desc: "Bẻ nhỏ câu thoại theo từng nhịp thở tự nhiên, nói chuyện như tâm sự ngoài đời, tăng tỷ lệ chuyển đổi ra đơn gấp 11.6 lần."
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
        outcome: "Kỹ thuật setup 2 góc quay điện thoại (Góc chính diện + Góc cận 45 độ) tạo chiều sâu điện ảnh kết hợp lọc âm trong vắt.",
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
        outcome: "Đóng gói quy trình sản xuất video 1 buổi/tuần: Quay 1 buổi tích lũy kho 50+ tư liệu B-roll dùng cho cả tháng, kết hợp phễu thu thập số điện thoại và data khách tự động.",
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
        shortTitle: "Góc Cận Đè Hình",
        subtitle: "Không cần lộ mặt, thu voice đè lên cảnh quay đời thực",
        youtubeUrl: "https://youtu.be/ZQ1Qfpln29o",
        videoId: "ZQ1Qfpln29o",
        poster: "/assets/formats/voiceover_poster.jpg",
        desc: "Quay sẵn 10-15 cảnh thao tác tay ngắn 2-3s, dựng clip trước rồi thu âm đè lên như đang tâm sự."
      },
      {
        id: "broll-2",
        title: "Talking Head & Kỹ Thuật 2 Cam",
        shortTitle: "Setup 2 Cam",
        subtitle: "Setup một sải tay & Kỹ thuật ngắt nhịp không cần học thuộc lòng",
        youtubeUrl: "https://www.facebook.com/reel/1039457391880112",
        videoId: "1039457391880112",
        videoUrl: "/assets/formats/fb_reel_talkinghead_workflow.mp4",
        fbUrl: "https://www.facebook.com/reel/1039457391880112",
        poster: "/assets/showcase/fb_reel_talkinghead_poster.jpg",
        desc: "Hướng dẫn thực chiến setup đèn dải nhạy sáng cho điện thoại, setup một sải tay và kỹ thuật đọc kịch bản Single-line đếm nhịp 1-2 giúp nói lưu loát tự nhiên trước ống kính."
      }
    ],
    scriptVideos: [
      {
        id: "script-1",
        title: "AI Miss Idea: Lọc Sạch Mùi AI",
        shortTitle: "Lọc Mùi AI",
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
        shortTitle: "Vlog 3 Giây",
        subtitle: "Biến việc làm hàng ngày thành kịch bản quay khả thi, khóa chặt 3s đầu (Hook)",
        youtubeUrl: "https://youtube.com/shorts/ftuv04UxKJA",
        videoId: "ftuv04UxKJA",
        videoUrl: "/assets/formats/shorts_ftuv04UxKJA.mp4",
        poster: "/assets/showcase/shorts_ftuv04UxKJA.jpg",
        desc: "Thực hành quy trình viết kịch bản đời thường: Mở bài bằng một hành động tự nhiên giữ chân 3s đầu, câu thoại ngắt nhịp theo hơi thở như đang tâm sự ngoài đời thực."
      },
      {
        id: "script-3",
        title: "AI Miss Video Ads: Hook + Body + CTA",
        shortTitle: "Video Ads",
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
        shortTitle: "Keylight 45°",
        subtitle: "Đèn thanh Keylight 45° + Đèn ven tóc + Máy ảnh",
        youtubeUrl: "https://youtu.be/Pem27DMrkVE",
        videoId: "Pem27DMrkVE",
        poster: "/assets/lighting/light_talkinghead.jpg",
        desc: "Kỹ thuật đánh sáng 3 điểm tối giản, mặt sáng đều, da nét mịn màng không bóng dầu."
      },
      {
        id: "light-2",
        title: "Setup Ánh Sáng 2 Đèn Spotlight",
        shortTitle: "2 Đèn Spotlight",
        subtitle: "1 đèn thanh + 1 đèn pin rọi phông màu tạo chiều sâu",
        youtubeUrl: "https://youtu.be/vZUmtQA2Ryc",
        videoId: "vZUmtQA2Ryc",
        poster: "/assets/lighting/light_2den_spotlight.jpg",
        desc: "Cách dùng đèn pin spotlight chiếu điểm tạo mảng màu nghệ thuật tách chủ thể khỏi nền."
      }
    ],
    processVideos: [
      {
        id: "proc-1",
        title: "Thực Hành 1-1 Đóng Gói Tại Lớp K2",
        shortTitle: "Đóng Gói Lớp K2",
        subtitle: "Thầy Việt trực tiếp hướng dẫn bấm máy và hoàn thiện video",
        youtubeUrl: "https://youtu.be/WV8rggcgmGA",
        videoId: "WV8rggcgmGA",
        videoUrl: "/assets/formats/lop_k2.mp4",
        poster: "/assets/showcase/lop_k2.jpg",
        desc: "Học viên tự tay bấm máy, dựng và xuất bản video hoàn chỉnh ngay trong 2 ngày học."
      },
      {
        id: "proc-2",
        title: "Bắt Đầu Với Thứ Vớ Vẩn",
        shortTitle: "Vượt Nỗi Sợ",
        subtitle: "Sự chú ý là đồng tiền mạnh nhất • Vượt qua 'thuế thể diện' để làm video",
        youtubeUrl: "https://youtu.be/-1ddyry_Qs0",
        videoId: "-1ddyry_Qs0",
        videoUrl: "/assets/formats/bat_dau_vo_van.mp4",
        poster: "/assets/showcase/bat_dau_vo_van.jpg",
        desc: "Đừng để nỗi sợ nói dở hay giữ thể diện cản trở bạn. Bắt đầu ngay từ những điều mộc mạc nhất để xây dựng niềm tin và chuyển đổi khách hàng."
      }
    ],
    tab4Overlays: {
      moduleBadge: "MODULE 1 • QUY TRÌNH 5 BƯỚC",
      cadenceBadge: "1 BUỔI / TUẦN",
      workflowPills: [
        "💡 Ý Tưởng",
        "📝 Kịch Bản",
        "🎥 Quay",
        "✂️ Edit",
        "🚀 Đăng"
      ],
      valueTags: [
        "✓ Quy Trình Rõ Ràng",
        "✓ Lịch Đều Đặn",
        "✓ AI Hỗ Trợ"
      ]
    },
    ui: {
      brollCategory: "Kho B-Roll Bank Xử Lý",
      scriptCategory: "Trợ Lý AI Viết Kịch Bản Thực Chiến",
      lightingCategory: "Thực Hành Setup Ánh Sáng",
      processCategory: "Quy Trình Sản Xuất 1 Buổi/Tuần",
      brollBadgePrefix: "B-ROLL BANK 0",
      scriptBadgePrefix: "AI VIẾT KỊCH BẢN 0",
      lightingBadgePrefix: "VIDEO THỰC CHIẾN 0",
      processBadgePrefix: "QUY TRÌNH THỰC CHIẾN 0",
      playBrollText: "BẤM ĐỂ XEM B-ROLL BANK",
      playScriptText: "BẤM XEM AI DEMO",
      playLightingText: "BẤM ĐỂ XEM VIDEO",
      playProcessText: "BẤM ĐỂ XEM VIDEO",
      modalQualityBadge: "HD 1080p • Thực hành cùng thầy Việt",
      openFbReelText: "Mở Facebook Reel",
      openYoutubeText: "Mở YouTube",
      aiBadgeText: "Trợ Lý AI Độc Quyền"
    }
  },

  // 10. Curriculum Section (Lộ Trình 2 Ngày)
  curriculum: {
    badge: "LỘ TRÌNH LỚP HỌC 2 NGÀY THỰC CHIẾN",
    headline: "Học Đến Đâu Làm Được Đến Đó • Ra Video Ngay Tại Lớp",
    subheadline: "Lộ trình 4 buổi học được thiết kế xoay quanh 4 câu hỏi sống còn: Từ kịch bản 3 tầng 4 bước, tự tay dựng video đầu tiên, làm chủ 4 định dạng quay đến ứng dụng bộ 3 trợ lý AI tự động hóa.",
    eventPhotos: [
      {
        image: "/assets/events/event_full_class.png",
        caption: "🎓 Tốt nghiệp & trao giáo trình",
        alt: "Toàn cảnh lớp học offline tốt nghiệp và trao giáo trình"
      },
      {
        image: "/assets/events/event_1on1_coaching.webp",
        caption: "📱 Thầy Việt hướng dẫn 1 kèm 1",
        alt: "Thầy Nguyễn Đức Việt hướng dẫn cầm tay chỉ việc 1 kèm 1"
      },
      {
        image: "/assets/events/event_studio_practice.jpg",
        caption: "💻 Thực hành dựng clip tại lớp",
        alt: "Học viên thực hành trực tiếp dựng video trên laptop tại lớp học"
      }
    ],
    dayPrefix: "NGÀY",
    goalLabel: "Mục tiêu ngày học:",
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
          title: "Quay và dựng video đầu tiên thế nào?",
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
        title: "Làm Chủ 4 Định Dạng Quay · Ngoại Cảnh Thiên Nhiên · Bơm Đòn Bẩy AI Xây Kênh Solo",
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
            "Thực địa Ngoại cảnh thiên nhiên tại lớp & Thử thách 'Túi Mù': Bốc thăm đề bài ngẫu nhiên theo nhóm, giải phóng sự ngượng ngùng trước đám đông.",
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
      desc: "Tặng kèm trọn bộ extension AI cài thẳng vào trình duyệt, kho tài nguyên SFX bản quyền và bộ preset CapCut giúp học viên về nhà làm video ngay mà không lo thiếu nguyên liệu.",
      cta: "NHẬN TOÀN BỘ QUÀ TẶNG"
    }
  },

  // 11. Mid-Page Banner CTA
  bannerCta: {
    badge: "PHÒNG STUDIO CHUYÊN NGHIỆP",
    title: "Thực hành cầm tay chỉ việc 1-1 cùng Nguyễn Đức Việt",
    cta: "ĐĂNG KÝ GIỮ CHỖ"
  },

  // 12. Student Showcase Section
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
        title: "Tâm Sự Làm Nghề: Thà Mất Thêm Giờ Còn Hơn Để Khách Hối Hận",
        author: "Vũ Hải Long",
        role: "Sáng Tạo & Dịch Vụ",
        desc: "Chia sẻ trải nghiệm nghề thực tế giúp khách hàng cảm nhận được sự tận tâm và uy tín.",
        poster: "/assets/showcase/vu_hai_long_poster.jpg",
        videoUrl: "/assets/showcase/vu_hai_long.mp4",
        category: "expert_talkinghead",
        categoryLabel: "Bán Hàng / Talking Head"
      },
      {
        id: "tham-tho-spa",
        title: "Kéo Khách Quen Bằng Thước Phim Không Gian Spa",
        author: "Thực Hành Voice-Over",
        role: "Home Spa & Làm Đẹp",
        desc: "Thước phim cận cảnh không gian và tay nghề chăm sóc da, tạo cảm giác an tâm cho khách mới.",
        poster: "/assets/showcase/tham_tho_poster.jpg",
        videoUrl: "/assets/showcase/tham_tho_spa.mp4",
        category: "spa_voiceover",
        categoryLabel: "Spa / Voice-Over"
      },
      {
        id: "broll-25s-k2",
        title: "Quay Cảnh Trám Bàn Làm Việc Bằng Điện Thoại",
        author: "Thực Hành Cảnh Trám",
        role: "B-Roll Minh Họa",
        desc: "Tận dụng ánh sáng tự nhiên nghiêng 45° bên bàn làm việc tạo nên video ngắn 25 giây cuốn hút.",
        poster: "/assets/showcase/disneyland_broll_25s_poster.jpg",
        videoUrl: "/assets/showcase/disneyland_broll_25s.mp4",
        category: "lifestyle_walktalk",
        categoryLabel: "Đời Thường / Walk & Talk"
      },
      {
        id: "cattuong-49s-k2",
        title: "Bắt Trọn Âm Thanh & Bối Cảnh Đời Thường Ngoài Sân",
        author: "Thực Hành Kể Chuyện",
        role: "Storytelling Đời Thường",
        desc: "Dùng âm thanh mộc mạc đời thực để giữ chân người xem mà không cần kỹ xảo cầu kỳ.",
        poster: "/assets/showcase/nhathuoc_cattuong_poster.jpg",
        videoUrl: "/assets/showcase/nhathuoc_cattuong_49s.mp4",
        category: "lifestyle_walktalk",
        categoryLabel: "Đời Thường / Walk & Talk"
      },
      {
        id: "alNkUUuE7fE",
        title: "Tự Quay & Dựng Xong Video Ngay Trong Buổi Học",
        author: "Bạn Vân Anh",
        role: "Video Thực Hành Tại Lớp",
        desc: "Tự tay bấm máy quay B-roll và dựng xong clip tâm sự cảm xúc chỉ sau 1 buổi thực hành.",
        poster: "/assets/showcase/vananh.jpg",
        youtubeUrl: "https://youtu.be/alNkUUuE7fE",
        category: "lifestyle_walktalk",
        categoryLabel: "Đời Thường / Walk & Talk"
      },
      {
        id: "YlRVjLDx1UI",
        title: "Tự Tin Nói Trước Ống Kính Ngay Lần Bấm Máy Đầu",
        author: "Bạn Phương",
        role: "Video Thực Hành Tại Lớp",
        desc: "Xóa sạch cảm giác đơ mặt, tự quay video chia sẻ chuyên môn lưu loát ngay tại phòng học.",
        poster: "/assets/showcase/phuong.jpg",
        youtubeUrl: "https://youtu.be/YlRVjLDx1UI",
        category: "expert_talkinghead",
        categoryLabel: "Bán Hàng / Talking Head"
      },
      {
        id: "WV8rggcgmGA",
        title: "Trải Nghiệm Tự Tay Bấm Máy Thực Chiến Cùng Thầy",
        author: "Lớp Offline K2",
        role: "Thực Hành Tại Studio",
        desc: "Học viên tự thực hành setup đèn, bấm máy quay và dựng video hoàn chỉnh ngay tại lớp.",
        poster: "/assets/showcase/lop_k2.jpg",
        youtubeUrl: "https://youtu.be/WV8rggcgmGA",
        category: "expert_talkinghead",
        categoryLabel: "Bán Hàng / Talking Head"
      },
      {
        id: "GqLHBWSiWDI",
        title: "Biến Không Gian Mở Thành Bối Cảnh Quay Tự Nhiên",
        author: "Định Dạng Walk & Talk",
        role: "Video Đời Thường Xây Kênh",
        desc: "Tận dụng bước chân chuyển động ngoài đời để dẫn dắt câu chuyện mộc mạc, giữ chân người xem.",
        poster: "/assets/showcase/nuong.jpg",
        youtubeUrl: "https://youtu.be/GqLHBWSiWDI",
        category: "lifestyle_walktalk",
        categoryLabel: "Đời Thường / Walk & Talk"
      }
    ],
    ui: {
      watchVideo: "XEM VIDEO",
      openVideo: "Mở video",
      swipeHint: "← Vuốt ngang để xem thêm video →",
      prevAriaLabel: "Cuộn video trước",
      nextAriaLabel: "Cuộn video tiếp theo"
    }
  },

  // 13. Case Studies Section
  caseStudies: {
    badge: "KẾT QUẢ THỰC TẾ HỌC VIÊN",
    headline: "Sản Phẩm Sau Khóa Học: Thực Hành Định Dạng Walk & Talk",
    subheadline: "Ứng dụng định dạng vừa đi vừa nói tại không gian mở đời thực, giúp video tự nhiên, giữ chân người xem gấp 2.4 lần mà không cần học thuộc lòng kịch bản.",
    formatBadge: "Walk & Talk",
    playVideoBadge: "BẤM ĐỂ XEM VIDEO",
    nichePrefix: "Ngách: ",
    breakthroughTitle: "Điểm Đột Phá Thực Chiến:",
    watchButtonText: "Xem Video Thực Hành",
    openYoutubeText: "Mở YouTube",
    modalTitlePrefix: "Video Thực Tế: ",
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

  // 14. Target Audience Section
  targetAudience: {
    badge: "BỘ LỌC ĐỐI TƯỢNG HỌC VIÊN",
    headline: "Khóa Học Này Dành Cho Ai?",
    fitHeader: "RẤT PHÙ HỢP NẾU BẠN LÀ:",
    notFitHeader: "KHÔNG PHÙ HỢP NẾU BẠN:",
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

  // 15. Instructor Section
  instructor: {
    badge: "NGƯỜI TRỰC TIẾP HƯỚNG DẪN BẠN",
    name: "Nguyễn Đức Việt",
    mainRole: "Chuyên Gia Đào Tạo Video Marketing & Sản Xuất Đa Phương Tiện",
    subRole: "15+ Năm Kinh Nghiệm",
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

  // 16. In-Page Registration Form Section
  register: {
    badge: "ĐĂNG KÝ THAM GIA CHƯƠNG TRÌNH OFFLINE",
    headlinePrefix: "Biến kiến thức của bạn thành ",
    headlineHighlight: "Video Marketing & doanh số thật",
    meta: {
      time: { label: "THỜI GIAN", value: "19–20/09/2026", desc: "2 ngày offline thực chiến" },
      location: { label: "ĐỊA ĐIỂM", value: "Hà Nội", desc: "Chi tiết cập nhật trong nhóm Zalo" },
      scale: { label: "QUY MÔ", value: "Tối đa 40 người", desc: "Để đảm bảo chất lượng thực hành" }
    },
    inclusionsTitle: "BAO GỒM:",
    inclusions: [
      "Tài liệu & template thực hành",
      "Source video mẫu để edit tại lớp",
      "Thực hành quay/edit video trực tiếp",
      "Cộng đồng hỗ trợ sau khóa học"
    ],
    form: {
      title: "Điền thông tin để giữ chỗ",
      subtitle: "Team TopExpert sẽ liên hệ xác nhận lịch học, học phí và hướng dẫn chuẩn bị trước khóa qua điện thoại/Zalo.",
      fields: {
        fullName: { label: "Họ và tên", placeholder: "Nguyễn Văn A", required: true },
        phone: { label: "Số điện thoại", placeholder: "09xx xxx xxx", required: true },
        email: { label: "Email", placeholder: "email@example.com", required: true },
        occupation: { label: "Nghề nghiệp / Lĩnh vực", placeholder: "VD: Giảng viên, Coach, Chủ trung tâm...", optionalLabel: "(tuỳ chọn)", required: false },
        reason: { label: "Lý do bạn muốn tham gia?", placeholder: "Bạn đang gặp khó khăn gì trong việc xây nhân hiệu?", optionalLabel: "(tuỳ chọn)", required: false }
      },
      disclaimerTag: "⚠️ [Lưu ý]",
      disclaimer: "Đây không phải chương trình miễn phí. Bạn sẽ được tư vấn học phí trước khi xác nhận chỗ.",
      cta: "ĐĂNG KÝ GIỮ CHỖ",
      ctaSubmitting: "Đang gửi thông tin...",
      securityNote: "Thông tin của bạn được bảo mật tuyệt đối.",
      errors: {
        requiredFields: "Vui lòng nhập đầy đủ Họ tên và Số điện thoại",
        serverError: "Có lỗi xảy ra, vui lòng thử lại sau.",
        networkError: "Lỗi kết nối máy chủ. Vui lòng kiểm tra lại mạng."
      }
    }
  },

  // 17. FAQs Section
  faqSection: {
    badge: "GIẢI ĐÁP THẮC MẮC",
    headline: "Câu hỏi thường gặp",
    description: "Tất cả những thắc mắc phổ biến nhất của học viên trước khi tham gia khóa học offline 2 ngày tại Hà Nội.",
    items: [
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
  },

  // 18. Backwards compatibility alias
  get faqs() {
    return this.faqSection.items;
  },

  // 19. Mobile Sticky Floating CTA
  stickyBottomCta: {
    badge: "OFFLINE HÀ NỘI",
    subtitle: "Giới hạn ≤ 40 Học Viên",
    cta: "GIỮ CHỖ"
  },

  // 20. Modal Registration Popup
  registerModal: {
    badge: "ĐĂNG KÝ GIỮ CHỖ OFFLINE",
    title: "Khóa Học Video Marketing 2 Ngày",
    subtitle: "Gặp mặt trực tiếp tại Hà Nội · Kèm cặp 1-1 bởi Thầy Nguyễn Đức Việt.",
    fields: {
      fullName: { label: "HỌ VÀ TÊN", placeholder: "Ví dụ: Nguyễn Văn Nam" },
      phone: { label: "SỐ ĐIỆN THOẠI / ZALO", placeholder: "0912345678" },
      email: { label: "EMAIL", placeholder: "nam@gmail.com" },
      occupation: { label: "NGHỀ NGHIỆP / LĨNH VỰC", placeholder: "Giảng viên / Bác sĩ / Coach..." },
      reason: { label: "NÚT THẮT BẠN MUỐN GIẢI QUYẾT?", placeholder: "Setup 2 góc quay / Kịch bản chuyển đổi..." }
    },
    cta: "XÁC NHẬN ĐĂNG KÝ",
    ctaSubmitting: "Đang gửi thông tin...",
    errors: {
      requiredFields: "Vui lòng nhập đầy đủ Họ tên và Số điện thoại",
      serverError: "Có lỗi xảy ra, vui lòng thử lại.",
      networkError: "Lỗi kết nối máy chủ. Vui lòng thử lại."
    }
  },

  // 21. Success Page
  successPage: {
    badge: "ĐĂNG KÝ GIỮ CHỖ THÀNH CÔNG",
    headline: "Chào Mừng Bạn Đến Với Khóa Học Video Marketing!",
    description: "Thông tin đăng ký của bạn đã được ghi nhận vào hệ thống. Đội ngũ tổ chức khóa học sẽ liên hệ qua Zalo/Điện thoại trong vòng 24h để gửi tài liệu chuẩn bị và xác nhận lịch học.",
    summary: {
      time: { label: "Thời gian: ", value: "2 Ngày Thứ 7 & Chủ Nhật (08:30 - 17:30)" },
      location: { label: "Địa điểm: ", value: "Studio Chuyên Nghiệp Hà Nội", note: " (Địa chỉ chi tiết gửi qua Zalo)" },
      scale: { label: "Quy mô: ", value: "Sĩ số giới hạn ≤ 40 học viên" }
    },
    backHomeCta: "Quay Về Trang Chủ"
  },

  // 22. Footer Section
  footer: {
    brand: "VIDEO MARKETING",
    description: "Khóa học offline 2 ngày cầm tay chỉ việc giúp chuyên gia, chủ doanh nghiệp và người làm dịch vụ làm chủ quy trình kịch bản, setup 2 góc quay và edit video chuyên nghiệp.",
    policyTitle: "QUY ĐỊNH & CAM KẾT",
    policyContent: "Khóa học giới hạn sĩ số ≤ 40 học viên mỗi khóa để đảm bảo chất lượng hướng dẫn 1-1 và mọi học viên đều có thành phẩm video mang về.",
    copyright: "© 2026 VIDEO MARKETING — Khóa Học Video Marketing Thực Chiến Đứng Lớp Trực Tiếp Bởi Nguyễn Đức Việt."
  }
};

// Aliases for both naming styles
export const content = CONTENT;
export default CONTENT;
