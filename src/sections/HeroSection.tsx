import React from 'react';
import { content } from '../content';

interface HeroSectionProps {
  onOpenRegister: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenRegister }) => {
  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-[#09090b] text-white">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-orange-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Tags Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {content.hero.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-300 text-[11px] font-bold font-mono tracking-wider uppercase"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Location & Format Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold font-mono tracking-widest uppercase mb-6">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
          {content.event.badge} · {content.event.location.split('(')[0].trim()}
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6 font-serif max-w-4xl mx-auto">
          <span>{content.hero.headlinePrefix}</span>
          <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500">
            {' '}{content.hero.headlineHighlight}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-white/75 leading-relaxed max-w-2xl mx-auto mb-10">
          {content.hero.subtitle}
        </p>

        {/* Meta Grid (3 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto mb-10 text-left">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono mb-0.5">
              Thời Gian
            </span>
            <span className="text-sm font-bold text-white block">
              2 Ngày Thực Chiến
            </span>
            <span className="text-xs text-white/50">
              {content.event.time}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono mb-0.5">
              Địa Điểm
            </span>
            <span className="text-sm font-bold text-white block">
              Hà Nội (Trực Tiếp)
            </span>
            <span className="text-xs text-white/50">
              Gửi định vị qua Zalo
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono mb-0.5">
              Quy Mô Sĩ Số
            </span>
            <span className="text-sm font-bold text-white block">
              {content.event.capacity}
            </span>
            <span className="text-xs text-white/50">
              Cầm tay chỉ việc 100%
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={onOpenRegister}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-black font-black text-sm uppercase tracking-wider shadow-xl shadow-orange-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            {content.hero.ctaButton}
          </button>
        </div>
        <p className="text-xs text-white/50 mt-3 font-mono">
          ⚡ {content.hero.guaranteeNote}
        </p>
      </div>
    </section>
  );
};
