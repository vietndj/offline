import React, { useState } from 'react';
import { CONTENT } from '../content';
import { Sparkles, Play, ArrowRight } from 'lucide-react';

interface MetaphorsSectionProps {
  onOpenRegister: () => void;
}

export const MetaphorsSection: React.FC<MetaphorsSectionProps> = ({ onOpenRegister }) => {
  const { metaphors } = CONTENT;
  const [activeYoutubeModal, setActiveYoutubeModal] = useState<string | null>(null);
  // Card đang phát video inline (bấm poster mới tải video → nhẹ hơn trên mobile)
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <section id="metaphors" className="py-12 md:py-20 px-4 bg-[#f8fafc] text-zinc-900 border-y border-zinc-200/80 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-8 md:mb-12 reveal reveal-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase mb-3 sm:mb-4 shadow-xs">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>{metaphors.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-medium text-[#09090b] mb-3 sm:mb-6 tracking-tight leading-[1.18] [text-wrap:balance]">
            {metaphors.headline}
          </h2>
          <p className="text-zinc-700 text-base sm:text-xl leading-relaxed [text-wrap:balance] max-w-3xl mx-auto font-sans">
            {metaphors.subheadline}
          </p>
        </div>

        {/* 4 Format Cards — mobile: hàng vuốt ngang; desktop: grid */}
        <div className="-mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {metaphors.items.map((item, idx) => (
            <div
              key={item.id}
              className="w-[70%] shrink-0 snap-start md:w-auto bg-white rounded-3xl p-3 sm:p-6 border border-zinc-200 hover:border-orange-500/50 transition-all duration-300 flex flex-col justify-between group shadow-md hover:shadow-xl reveal reveal-up"
              style={{ transitionDelay: `${idx * 120}ms` }}
            >
              <div>
                {/* Poster + Play (bấm mới phát video) */}
                <div className="relative aspect-[4/5] md:aspect-[9/16] w-full rounded-2xl overflow-hidden bg-black mb-3 sm:mb-5 border border-zinc-200/80 shadow-inner group/vid">
                  {playingId === item.id ? (
                    <video
                      src={item.videoUrl}
                      poster={item.poster}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPlayingId(item.id)}
                      aria-label={item.title}
                      className="absolute inset-0 w-full h-full cursor-pointer"
                    >
                      <img
                        src={item.poster}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-14 h-14 rounded-full bg-orange-500/90 text-white flex items-center justify-center shadow-xl ring-4 ring-white/30 group-hover/vid:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        </span>
                      </span>
                    </button>
                  )}
                  {/* Overlay Action Bar */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover/vid:opacity-100 transition-opacity">
                    <button
                      onClick={() => setActiveYoutubeModal(item.youtubeId)}
                      title={metaphors.labels.watchYoutubeTitle}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 hover:bg-red-600 text-white text-[11px] font-mono font-semibold backdrop-blur-md border border-white/20 transition-colors shadow-sm cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>YouTube</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="text-xl sm:text-2xl p-1.5 sm:p-2 bg-zinc-50 rounded-xl border border-zinc-200 shadow-xs">
                    {item.icon}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-orange-600 font-bold bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200/80">
                    {metaphors.formatPrefix}0{idx + 1}
                  </span>
                </div>

                <h3 className="text-lg sm:text-2xl font-serif font-bold text-[#09090b] mb-1 group-hover:text-orange-600 transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-orange-600 text-sm sm:text-base font-bold mb-2 sm:mb-4 font-sans">
                  {item.subtitle}
                </p>

                {/* Application — 1 dòng gọn trên mobile */}
                <p className="md:hidden text-xs text-zinc-700 font-sans leading-snug line-clamp-2">
                  <strong className="text-zinc-950 font-bold">{metaphors.labels.application}</strong> {item.application}
                </p>

                {/* 1. Output Box (Direct Response & Numbers) — ẩn trên mobile */}
                <div className="hidden md:block bg-emerald-50 rounded-2xl p-4 border border-emerald-200/90 mb-4 shadow-xs">
                  <p className="text-xs sm:text-sm font-mono uppercase tracking-wider text-emerald-950 mb-1.5 font-bold flex items-center gap-1.5">
                    <span>🎯</span>
                    <span>{metaphors.labels.output}</span>
                  </p>
                  <p className="text-emerald-950 text-sm sm:text-[15px] leading-relaxed font-sans font-semibold">
                    {item.output}
                  </p>
                </div>

                {/* 2. Guilt Relief Box (Xóa Bỏ Áp Lực) — ẩn trên mobile */}
                <div className="hidden md:block bg-amber-50/90 rounded-2xl p-4 border border-amber-200/80 mb-4 shadow-xs">
                  <p className="text-xs sm:text-sm font-mono uppercase tracking-wider text-amber-950 mb-1.5 font-bold flex items-center gap-1.5">
                    <span>✨</span>
                    <span>{metaphors.labels.relief}</span>
                  </p>
                  <p className="text-zinc-900 text-sm sm:text-[15px] leading-relaxed font-sans font-medium">
                    {item.relief}
                  </p>
                </div>

                {/* 3. Application (desktop) */}
                <div className="hidden md:flex mb-6 text-sm sm:text-[15px] text-zinc-800 font-sans items-start gap-2.5 bg-zinc-50 p-3.5 rounded-xl border border-zinc-200/80">
                  <Sparkles className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    <strong className="text-zinc-950 font-bold">{metaphors.labels.application}</strong> {item.application}
                  </span>
                </div>
              </div>

              <div className="hidden md:flex pt-4 border-t border-zinc-200 items-center justify-between text-xs sm:text-sm font-mono text-zinc-700">
                <span>{metaphors.labels.practiceNote}</span>
                <span className="font-bold text-orange-600">{metaphors.labels.practiceTag}</span>
              </div>
            </div>
          ))}
        </div>

        {/* YouTube Modal */}
        {activeYoutubeModal && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveYoutubeModal(null)}
          >
            <div
              className="bg-zinc-900 border border-zinc-700 rounded-3xl p-4 max-w-sm w-full relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveYoutubeModal(null)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-zinc-800 border border-zinc-600 text-white flex items-center justify-center font-bold text-sm hover:bg-red-600 transition-colors shadow-lg cursor-pointer"
              >
                ✕
              </button>
              <div className="aspect-[9/16] w-full rounded-2xl overflow-hidden bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${activeYoutubeModal}?autoplay=1&rel=0`}
                  title="YouTube video player"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 md:mt-12 text-center">
          <button
            onClick={onOpenRegister}
            className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 py-3 sm:px-10 sm:py-5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 font-bold text-base sm:text-xl hover:from-orange-400 hover:to-amber-400 transition-all shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>{metaphors.cta}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
