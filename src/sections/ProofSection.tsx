import React from 'react';
import { content } from '../content';
import { TrendingUp, ArrowDown, Sparkles } from 'lucide-react';

export const ProofSection: React.FC = () => {
  const { proof } = content;

  return (
    <section id="ket-qua" className="py-20 md:py-28 bg-[#0c0d10] border-t border-zinc-800/80 text-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{proof.badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-4">
            {proof.headline}
          </h2>
          <div className="inline-block px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent border border-emerald-500/30 mb-4">
            <span className="font-mono text-2xl sm:text-4xl font-bold text-emerald-400 tracking-tight">
              {proof.revenue}
            </span>
          </div>
          <p className="text-sm sm:text-base font-mono text-zinc-400 mb-2">
            🔥 {proof.timeline} · <span className="text-amber-400 font-semibold">{proof.dailyPeak}</span>
          </p>
          <p className="font-sans text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            {proof.description}
          </p>
        </div>

        {/* 1:1 Gallery Layout - Exact Match to Original Landing Page */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-12">
          {/* Left Column: Revenue Dashboard connected to Offline Class Photo */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* 1. Revenue Dashboard Card */}
            <div className="p-3.5 rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow-xl overflow-hidden group">
              <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 mb-3">
                <span className="text-xs font-mono text-zinc-400 font-medium flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Báo cáo doanh thu thực tế (75 ngày)
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  +912.936.999đ
                </span>
              </div>
              <div className="rounded-xl overflow-hidden bg-black/40 border border-zinc-800/60">
                <img
                  src={proof.dashboardImg}
                  alt="Dashboard doanh thu 912 triệu"
                  className="w-full h-auto object-cover transform group-hover:scale-[1.01] transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Connecting Arrow Icon */}
            <div className="flex justify-center -my-2 relative z-10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-b from-amber-500 to-orange-500 text-zinc-950 flex items-center justify-center shadow-md">
                <ArrowDown className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            {/* 2. Offline Class Photo */}
            <div className="p-3.5 rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow-xl overflow-hidden group">
              <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 mb-3">
                <span className="text-xs font-mono text-zinc-400 font-medium">
                  Lớp học viên Offline thực hành cầm tay chỉ việc
                </span>
                <span className="text-[11px] font-mono text-amber-400 font-semibold">
                  Studio FEDU Hà Nội
                </span>
              </div>
              <div className="rounded-xl overflow-hidden bg-black/40 border border-zinc-800/60">
                <img
                  src={proof.offlineClassImg}
                  alt="Lớp học viên thực tế"
                  className="w-full h-auto object-cover transform group-hover:scale-[1.01] transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right Column: 2 Mobile Mockups (Fanpage + TikTok Channel) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="p-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow-xl flex flex-col justify-between">
              <div className="text-[11px] font-mono text-zinc-400 font-medium mb-2 truncate">
                📱 Fanpage Tăng Trưởng
              </div>
              <div className="rounded-xl overflow-hidden bg-black/50 border border-zinc-800/70">
                <img
                  src={proof.mockups.fanpage}
                  alt="Mockup Fanpage"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="p-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow-xl flex flex-col justify-between">
              <div className="text-[11px] font-mono text-zinc-400 font-medium mb-2 truncate">
                📱 Kênh TikTok Xây Mới
              </div>
              <div className="rounded-xl overflow-hidden bg-black/50 border border-zinc-800/70">
                <img
                  src={proof.mockups.tiktok}
                  alt="Mockup TikTok"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3 Bottom Mobile Mockups Row (TikTok Stats, Facebook Reels, Viral TikTok Video) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-md">
            <div className="text-[11px] font-mono text-zinc-400 font-medium mb-2">
              📊 Phân tích số liệu TikTok
            </div>
            <div className="rounded-xl overflow-hidden bg-black/40 border border-zinc-800/60">
              <img
                src={proof.mockups.tiktokStats}
                alt="Phân tích số liệu TikTok"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-md">
            <div className="text-[11px] font-mono text-zinc-400 font-medium mb-2">
              🎬 Facebook Reels Chuyển Đổi
            </div>
            <div className="rounded-xl overflow-hidden bg-black/40 border border-zinc-800/60">
              <img
                src={proof.mockups.fbReels}
                alt="Facebook Reels"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-md">
            <div className="text-[11px] font-mono text-zinc-400 font-medium mb-2">
              🔥 Video TikTok Triệu View
            </div>
            <div className="rounded-xl overflow-hidden bg-black/40 border border-zinc-800/60">
              <img
                src={proof.mockups.tiktokVideo}
                alt="Video TikTok Viral"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
