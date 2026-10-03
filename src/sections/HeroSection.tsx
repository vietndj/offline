import React, { useState } from 'react';
import { CONTENT } from '../content';
import { Calendar, MapPin, Users, Sparkles, ArrowRight, Play } from 'lucide-react';

interface HeroProps {
  onOpenRegister: () => void;
}

export const HeroSection: React.FC<HeroProps> = ({ onOpenRegister }) => {
  const { hero } = CONTENT;
  const [isPlaying, setIsPlaying] = useState(false);

  const priceStrip = hero.priceStrip;
  const video = hero.video;
  const hasPriceStrip = !!priceStrip && priceStrip.length > 0;
  const hasVideo = !!video;
  const youtubeId = video?.youtubeId?.trim() ?? '';

  // Ô HỌC PHÍ được làm nổi bật màu amber
  const isFeeItem = (label: string) => label.normalize('NFC').toLowerCase().includes('học phí');

  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-40 md:pb-28 overflow-hidden bg-[#09090b] text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] md:w-[900px] h-[350px] bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className={`${hasVideo ? 'max-w-6xl' : 'max-w-5xl'} mx-auto px-4 sm:px-6 relative z-10 text-center`}>
        <div
          className={
            hasVideo
              ? 'grid grid-cols-1 lg:grid-cols-12 gap-x-12 items-center'
              : ''
          }
        >
          {/* Top text block: Badge + Headline + Subheadline + Price Strip */}
          <div className={hasVideo ? 'lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:text-left lg:self-end' : ''}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase mb-6 md:mb-8 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{hero.badge}</span>
            </div>

            {/* Headline */}
            <h1
              className={`font-serif text-3xl sm:text-5xl md:text-6xl ${hasVideo ? 'lg:text-6xl' : 'lg:text-7xl'} font-medium tracking-tight text-white leading-[1.15] mb-5 md:mb-6 [text-wrap:balance]`}
            >
              {hero.headline}
            </h1>

            {/* Subheadline */}
            <p
              className={`font-sans text-lg sm:text-xl md:text-2xl text-zinc-200 leading-relaxed max-w-4xl mx-auto ${hasVideo ? 'lg:mx-0' : ''} ${hasPriceStrip ? 'mb-6 md:mb-8' : 'mb-10'} [text-wrap:balance]`}
            >
              {hero.subheadline}
            </p>

            {/* Price Strip — 3 ô nằm ngang */}
            {hasPriceStrip && (
              <div className={`grid grid-cols-3 gap-2 sm:gap-3 max-w-2xl mx-auto ${hasVideo ? 'lg:mx-0' : ''} mb-8`}>
                {priceStrip?.map((item, idx) => {
                  const highlight = isFeeItem(item.label);
                  return (
                    <div
                      key={idx}
                      className={`px-2 py-2.5 sm:px-4 sm:py-3.5 rounded-xl border text-center ${hasVideo ? 'lg:text-left' : ''} ${
                        highlight
                          ? 'border-amber-500/60 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                          : 'border-zinc-800 bg-zinc-900/60'
                      }`}
                    >
                      <div className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase mb-1 leading-tight">
                        {item.label}
                      </div>
                      <div
                        className={`font-sans font-bold text-sm sm:text-lg md:text-xl leading-tight ${
                          highlight ? 'text-amber-400' : 'text-white'
                        }`}
                      >
                        {item.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Video — mobile: giữa priceStrip và CTA; desktop: cột phải */}
          {hasVideo && video && (
            <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-2 mb-8 lg:mb-0 flex flex-col items-center">
              <div className="relative w-full max-w-[240px] lg:max-w-[320px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl shadow-amber-500/10">
                {isPlaying ? (
                  youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                      title={video.label}
                      className="absolute inset-0 w-full h-full"
                      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={video.src}
                      poster={video.poster}
                      controls
                      autoPlay
                      playsInline
                      preload="none"
                      className="absolute inset-0 w-full h-full object-cover bg-black"
                    />
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    aria-label={video.label}
                    className="group absolute inset-0 w-full h-full cursor-pointer"
                  >
                    <img
                      src={video.poster}
                      alt={video.label}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500 group-hover:bg-amber-400 text-zinc-950 flex items-center justify-center shadow-xl shadow-amber-500/40 transition-transform duration-200 group-hover:scale-105">
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1 fill-current" />
                    </span>
                    <span className="absolute bottom-3 left-3 right-3 text-xs sm:text-sm font-sans font-semibold text-white text-center leading-snug">
                      {video.label}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Bottom text block: Tags + CTA */}
          <div className={hasVideo ? 'lg:col-span-7 lg:col-start-1 lg:row-start-2 lg:text-left lg:self-start' : ''}>
            {/* Feature Tags — chỉ hiện trên desktop để hero gọn trên mobile */}
            <div
              className={`hidden md:flex flex-wrap justify-center ${hasVideo ? 'lg:justify-start' : ''} gap-2.5 sm:gap-3 mb-12 max-w-3xl mx-auto ${hasVideo ? 'lg:mx-0 lg:mb-10' : ''}`}
            >
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
            <div className={`flex flex-col items-center ${hasVideo ? 'lg:items-start' : ''} gap-3.5 ${hasPriceStrip ? 'mb-0' : 'mb-14'}`}>
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
          </div>
        </div>

        {/* 3 Meta Cards — ẩn khi đã có priceStrip (tránh trùng thông tin) */}
        {!hasPriceStrip && (
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
        )}
      </div>
    </section>
  );
};
