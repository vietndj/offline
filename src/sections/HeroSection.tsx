import React from 'react';
import { content } from '../content';
import { Calendar, MapPin, Users, Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  onOpenRegister: () => void;
}

export const HeroSection: React.FC<HeroProps> = ({ onOpenRegister }) => {
  const { hero } = content;

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#09090b] text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] md:w-[900px] h-[350px] bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono font-semibold tracking-wider uppercase mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{hero.badge}</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white leading-[1.18] mb-6">
          {hero.headline}
        </h1>

        {/* Subheadline */}
        <p className="font-sans text-base sm:text-lg md:text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto mb-10">
          {hero.subheadline}
        </p>

        {/* 5 Feature Tags */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 mb-10 max-w-2xl mx-auto">
          {hero.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-lg border border-zinc-700/60 bg-zinc-800/60 text-zinc-300 text-xs font-mono font-medium tracking-wide shadow-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex flex-col items-center gap-3 mb-12">
          <button
            onClick={onOpenRegister}
            className="w-full sm:w-auto px-8 py-4.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-sans font-bold text-base sm:text-lg shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>{hero.cta}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-zinc-400 font-mono tracking-tight">
            ⚡ {hero.ctaNote}
          </p>
        </div>

        {/* 3 Meta Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl mx-auto pt-6 border-t border-zinc-800/80">
          {hero.meta.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-zinc-800/70 bg-zinc-900/50 backdrop-blur-xs text-left flex flex-col justify-between hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5">
                {idx === 0 && <Calendar className="w-4 h-4 text-amber-400" />}
                {idx === 1 && <MapPin className="w-4 h-4 text-orange-400" />}
                {idx === 2 && <Users className="w-4 h-4 text-amber-400" />}
                <span className="text-[11px] font-mono font-semibold tracking-wider text-zinc-400 uppercase">
                  {item.label}
                </span>
              </div>
              <div className="font-sans font-semibold text-white text-base mb-0.5">
                {item.value}
              </div>
              <div className="text-xs text-zinc-400 leading-normal">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
