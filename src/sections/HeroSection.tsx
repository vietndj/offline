import React from 'react';
import { CONTENT } from '../content';
import { Calendar, MapPin, Users, Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  onOpenRegister: () => void;
}

export const HeroSection: React.FC<HeroProps> = ({ onOpenRegister }) => {
  const { hero } = CONTENT;

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#09090b] text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] md:w-[900px] h-[350px] bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase mb-8 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{hero.badge}</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white leading-[1.15] mb-6 [text-wrap:balance]">
          {hero.headline}
        </h1>

        {/* Subheadline */}
        <p className="font-sans text-lg sm:text-xl md:text-2xl text-zinc-200 leading-relaxed max-w-4xl mx-auto mb-10 [text-wrap:balance]">
          {hero.subheadline}
        </p>

        {/* Feature Tags */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 mb-12 max-w-3xl mx-auto">
          {hero.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3.5 py-2 rounded-lg border border-zinc-700 bg-zinc-800/80 text-zinc-200 text-xs sm:text-sm font-mono font-semibold tracking-wide shadow-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex flex-col items-center gap-3.5 mb-14">
          <button
            onClick={onOpenRegister}
            className="w-full sm:w-auto px-10 py-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-sans font-bold text-lg sm:text-xl shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>{hero.cta}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-sm text-zinc-400 font-mono tracking-tight">
            ⚡ {hero.ctaNote}
          </p>
        </div>

        {/* 3 Meta Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-8 border-t border-zinc-800/80">
          {hero.meta.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xs text-left flex flex-col justify-between hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                {idx === 0 && <Calendar className="w-4 h-4 text-amber-400" />}
                {idx === 1 && <MapPin className="w-4 h-4 text-orange-400" />}
                {idx === 2 && <Users className="w-4 h-4 text-amber-400" />}
                <span className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">
                  {item.label}
                </span>
              </div>
              <div className="font-sans font-bold text-white text-lg sm:text-xl mb-1">
                {item.value}
              </div>
              <div className="text-sm text-zinc-300 leading-normal">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
