import React, { useState, useEffect } from 'react';
import { content } from '../content';
import { ShieldCheck, Flame, PhoneCall, CheckCircle2, TrendingUp, MousePointerClick, Maximize2, X } from 'lucide-react';

export const ProofSection: React.FC = () => {
  const { proof } = content;
  const [activeTab, setActiveTab] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const proofTabs = [
    {
      id: 'meta-growth',
      shortLabel: 'Tăng Trưởng Meta',
      badgeLabel: '6,0M View · 50,8K Click',
      title: 'Báo Cáo Hiệu Quả 6 Tháng Từ Meta Business Suite',
      image: proof.dashboardImg || '/assets/meta_suite_6m_growth.png',
      sourceBadge: 'business.facebook.com · ID: 839755019212216',
      caption: 'Thanh URL trình duyệt thật · Tăng trưởng 6.0M view & 50.8K link click',
      highlightMetric: '+345,5% Lượt Xem · +475,9% Click Link',
      icon: TrendingUp,
    },
    {
      id: 'weekly-leverage',
      shortLabel: 'Đòn Bẩy 1 Bài/Tuần',
      badgeLabel: '146,4K Reach · 108 Inbox',
      title: 'Báo Cáo Hiệu Suất Tuần: 1 Bài Đăng Kéo 108 Khách Mới',
      image: proof.weeklyImg || '/assets/meta_weekly_1post_108inbox.png',
      sourceBadge: 'Meta Business Suite · Báo Cáo Tuần 23/8 - 29/8',
      caption: 'Đăng đúng 1 bài trong tuần nhưng tiếp cận 146.400 người & 108 inbox mới',
      highlightMetric: '1 Bài Viết = 108 Cuộc Hội Thoại Mới',
      icon: MousePointerClick,
    },
    {
      id: 'leads-audit',
      shortLabel: 'Đối Soát 428 Số ĐT',
      badgeLabel: '428 SĐT · 3.642 Leads',
      title: 'Đối Soát 428 Số Điện Thoại & Khách Hàng Thật',
      image: proof.leadsImg || '/assets/facebook_real_page_dashboard.png',
      sourceBadge: 'Hệ Thống Đối Soát Hộp Thư Tự Động',
      caption: 'Trích đoạn danh sách khách hàng để lại số điện thoại xin tư vấn và mua khóa học',
      highlightMetric: '428 Số ĐT · Tỷ Lệ Quan Tâm 20.8%',
      icon: PhoneCall,
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsZoomOpen(false);
    };
    if (isZoomOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isZoomOpen]);

  return (
    <section id="proof" className="py-24 px-4 bg-white text-zinc-900 relative border-y border-zinc-200/80">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase mb-4 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>{proof.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#09090b] mb-6 tracking-tight leading-[1.18] [text-wrap:balance]">
            {proof.headline}
          </h2>
          <p className="text-zinc-700 text-lg sm:text-xl leading-relaxed [text-wrap:balance] max-w-3xl mx-auto font-sans">
            {proof.description}
          </p>
        </div>

        {/* Real Meta Business Proof Highlight Card */}
        <div className="bg-[#f8fafc] rounded-3xl p-6 sm:p-8 md:p-10 border border-zinc-200 mb-16 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Real Metrics (6 Cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 text-xs font-mono font-bold">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>BÁO CÁO ĐỐI SOÁT HỘP THƯ & TƯ VẤN</span>
              </div>

              {/* 3 Core Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs text-center">
                  <div className="text-[11px] sm:text-xs font-mono text-zinc-600 font-bold uppercase tracking-wider">Lượt Xem</div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-mono text-[#09090b] mt-1">6,0 Triệu</div>
                  <div className="text-[11px] sm:text-xs text-emerald-600 mt-0.5 font-bold">↑ +345,5% Meta</div>
                </div>
                <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs text-center">
                  <div className="text-[11px] sm:text-xs font-mono text-amber-900 font-bold uppercase tracking-wider">Click Link</div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-mono text-amber-800 mt-1">50,8K</div>
                  <div className="text-[11px] sm:text-xs text-amber-900/80 mt-0.5 font-bold">↑ +475,9% Đổi</div>
                </div>
                <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs text-center">
                  <div className="text-[11px] sm:text-xs font-mono text-emerald-900 font-bold uppercase tracking-wider">Số ĐT Thật</div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-mono text-emerald-800 mt-1">428+</div>
                  <div className="text-[11px] sm:text-xs text-emerald-900/80 mt-0.5 font-semibold">Để lại tư vấn</div>
                </div>
              </div>

              {/* 3 Action Pillars */}
              <div className="space-y-3.5 pt-2 text-base sm:text-lg font-sans">
                <div className="flex items-start gap-3 text-zinc-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                  <span><strong>100% quay bằng 1 điện thoại iPhone</strong>, không dùng ekip quay dựng cồng kềnh.</span>
                </div>
                <div className="flex items-start gap-3 text-zinc-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                  <span><strong>Đòn bẩy tuần:</strong> Chỉ đăng 1 video/tuần vẫn kéo về <strong>146.400 tiếp cận & 108 khách mới</strong>.</span>
                </div>
                <div className="flex items-start gap-3 text-zinc-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                  <span><strong>50.800+ lượt click link</strong> mua hàng và xin tư vấn thực tế từ luồng video viral.</span>
                </div>
              </div>
            </div>

            {/* Right Col: Interactive Proof Showcase (6 Cols) */}
            <div className="lg:col-span-6 space-y-3">
              {/* 3 Tabs Selection */}
              <div className="flex p-1 bg-zinc-200/90 rounded-2xl gap-1">
                {proofTabs.map((tab, idx) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === idx;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(idx)}
                      className={`flex-1 py-2 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all text-center flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/80'
                          : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/40'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-600' : 'text-zinc-500'}`} />
                      <span className="truncate">{tab.shortLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* Main Display Frame */}
              <div className="relative rounded-2xl overflow-hidden border border-zinc-300 shadow-xl bg-zinc-950 group">
                {/* Meta Verified Top Bar */}
                <div className="bg-zinc-900/95 backdrop-blur px-3.5 py-2 border-b border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-zinc-300 font-mono text-[11px] truncate">
                      {proofTabs[activeTab].sourceBadge}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsZoomOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-[11px] font-medium transition-colors cursor-pointer shrink-0 ml-2"
                    title="Mở ảnh lớn độ phân giải gốc"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Phóng to HD</span>
                  </button>
                </div>

                {/* Clickable Image to Zoom */}
                <div
                  className="relative cursor-pointer overflow-hidden bg-zinc-950 flex items-center justify-center min-h-[250px] sm:min-h-[310px]"
                  onClick={() => setIsZoomOpen(true)}
                >
                  <img
                    src={proofTabs[activeTab].image}
                    alt={proofTabs[activeTab].title}
                    className="w-full h-auto object-contain max-h-[370px] transform group-hover:scale-[1.01] transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-full bg-zinc-900/90 text-white text-xs font-medium backdrop-blur flex items-center gap-1.5 shadow-xl border border-zinc-700">
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                      Nhấn để soi rõ từng chi tiết
                    </span>
                  </div>
                </div>

                {/* Bottom Caption */}
                <div className="bg-zinc-900 px-3.5 py-2.5 border-t border-zinc-800 flex items-center justify-between text-[11px] sm:text-xs text-zinc-400">
                  <span className="truncate pr-2">{proofTabs[activeTab].caption}</span>
                  <span className="text-amber-400 font-mono shrink-0 font-semibold">{proofTabs[activeTab].highlightMetric}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fullscreen Lightbox Modal */}
        {isZoomOpen && (
          <div
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-fadeIn"
            onClick={() => setIsZoomOpen(false)}
          >
            <div className="w-full max-w-5xl flex items-center justify-between text-white pb-3 px-2">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="font-mono text-xs sm:text-sm text-zinc-200 truncate">
                  {proofTabs[activeTab].sourceBadge}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0 ml-3"
                title="Đóng (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="relative max-w-5xl max-h-[85vh] overflow-auto rounded-2xl border border-zinc-700 bg-zinc-950 shadow-2xl p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={proofTabs[activeTab].image}
                alt={proofTabs[activeTab].title}
                className="w-full h-auto object-contain rounded-xl"
              />
              <div className="p-3 text-center text-xs text-zinc-400 bg-zinc-900/90 rounded-b-xl border-t border-zinc-800 mt-2 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span>{proofTabs[activeTab].caption}</span>
                <span className="font-mono font-bold text-amber-400">{proofTabs[activeTab].highlightMetric}</span>
              </div>
            </div>
          </div>
        )}

        {/* Gallery 4 Mockups */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-[#09090b] mb-3">
              Các Kênh Video Triệu View Được Xây Dựng Từ Con Số 0
            </h3>
            <p className="text-zinc-700 text-base sm:text-lg font-sans">
              Hình ảnh thực tế từ các kênh Fanpage, TikTok và số liệu phân tích chuyển đổi
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Card 1: Fanpage */}
            <div className="rounded-2xl overflow-hidden border border-zinc-200 bg-white p-3 sm:p-4 shadow-sm group hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="rounded-xl overflow-hidden bg-zinc-100 mb-3">
                <img src={proof.mockups.fanpage} alt="Fanpage 38.850+ Người Theo Dõi" className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-300" />
              </div>
              <div className="text-center">
                <h4 className="text-sm sm:text-base font-sans font-bold text-[#09090b]">
                  Fanpage 38.850+ Follower
                </h4>
                <p className="text-xs sm:text-sm text-zinc-700 font-sans leading-relaxed mt-1.5 font-medium">
                  Kênh nội dung xây từ số 0 bằng video chia sẻ chuyên môn thực tế
                </p>
                <div className="text-[11px] text-zinc-400 font-mono mt-2">
                  (Cập nhật ngày 03/09/2026)
                </div>
              </div>
            </div>

            {/* Card 2: TikTok */}
            <div className="rounded-2xl overflow-hidden border border-zinc-200 bg-white p-3 sm:p-4 shadow-sm group hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="rounded-xl overflow-hidden bg-zinc-100 mb-3">
                <img src={proof.mockups.tiktok} alt="Kênh TikTok 181K View" className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-300" />
              </div>
              <div className="text-center">
                <h4 className="text-sm sm:text-base font-sans font-bold text-[#09090b]">
                  TikTok 181.500+ View
                </h4>
                <p className="text-xs sm:text-sm text-zinc-700 font-sans leading-relaxed mt-1.5 font-medium">
                  Kênh @nguyenducviet.viral với chuỗi clip ghim triệu view tự nhiên
                </p>
                <div className="text-[11px] text-zinc-400 font-mono mt-2">
                  (Cập nhật ngày 03/09/2026)
                </div>
              </div>
            </div>

            {/* Card 3: Leads Stats */}
            <div className="rounded-2xl overflow-hidden border border-zinc-200 bg-white p-3 sm:p-4 shadow-sm group hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="rounded-xl overflow-hidden bg-zinc-100 mb-3">
                <img src={proof.mockups.leadsStats} alt="Báo Cáo 3.642 Leads" className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-300" />
              </div>
              <div className="text-center">
                <h4 className="text-sm sm:text-base font-sans font-bold text-[#09090b]">
                  3.642 Leads & 428 Số ĐT
                </h4>
                <p className="text-xs sm:text-sm text-zinc-700 font-sans leading-relaxed mt-1.5 font-medium">
                  Báo cáo chuyển đổi khách hàng tiềm năng thực tế qua tin nhắn Fanpage
                </p>
                <div className="text-[11px] text-zinc-400 font-mono mt-2">
                  (Cập nhật ngày 03/09/2026)
                </div>
              </div>
            </div>

            {/* Card 4: FB Reels */}
            <div className="rounded-2xl overflow-hidden border border-zinc-200 bg-white p-3 sm:p-4 shadow-sm group hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="rounded-xl overflow-hidden bg-zinc-100 mb-3">
                <img src={proof.mockups.fbReels} alt="Facebook Reels 3.4M+ View" className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-300" />
              </div>
              <div className="text-center">
                <h4 className="text-sm sm:text-base font-sans font-bold text-[#09090b]">
                  Reels 3.430.000+ View
                </h4>
                <p className="text-xs sm:text-sm text-zinc-700 font-sans leading-relaxed mt-1.5 font-medium">
                  Dàn video ngắn giữ chân người xem và tạo đơn hàng liên tục mỗi ngày
                </p>
                <div className="text-[11px] text-zinc-400 font-mono mt-2">
                  (Cập nhật ngày 03/09/2026)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
