import React, { useState } from 'react';
import { content } from '../content';
import { Award, Sparkles, Play, CheckCircle2, ExternalLink, X, Quote } from 'lucide-react';

export const CaseStudySection: React.FC = () => {
  const { caseStudies } = content;
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const item = caseStudies.items[0];

  return (
    <section className="py-24 px-4 bg-white text-zinc-900 border-y border-zinc-200/80 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-200 bg-amber-50 text-amber-800 text-xs sm:text-sm font-mono font-bold uppercase tracking-widest mb-4 shadow-xs">
            <Award className="w-4 h-4 text-amber-600" />
            <span>{caseStudies.badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#09090b] mb-4 leading-[1.18] [text-wrap:balance]">
            {caseStudies.headline}
          </h2>
          {caseStudies.subheadline && (
            <p className="font-sans text-lg sm:text-xl text-zinc-700 leading-relaxed max-w-3xl mx-auto [text-wrap:balance]">
              {caseStudies.subheadline}
            </p>
          )}
        </div>

        {/* Featured Case Study Card */}
        {item && (
          <div className="p-6 sm:p-10 rounded-3xl border-2 border-amber-200/90 bg-[#f8fafc] shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: 9:16 Video Poster (5 Cols) */}
              <div className="lg:col-span-5">
                <div
                  onClick={() => setActiveVideo(item.videoId || null)}
                  className="w-full max-w-[320px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-950 border-2 border-zinc-200 relative cursor-pointer group shadow-xl hover:scale-[1.01] transition-all"
                >
                  <img
                    src={item.poster}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                  {/* Red Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-12 sm:w-18 sm:h-13 rounded-2xl bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-600/50 transition-all duration-200 group-hover:scale-110">
                      <Play className="w-7 h-7 fill-current ml-1" />
                    </div>
                  </div>

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-mono font-bold text-white z-10">
                    <span className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                      {item.name}
                    </span>
                    <span className="bg-emerald-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                      Walk & Talk
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-zinc-900 font-mono text-xs font-bold shadow-lg">
                      <Play className="w-3.5 h-3.5 fill-current text-red-600" />
                      <span>BẤM ĐỂ XEM VIDEO</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Case Details & Story (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#09090b]">
                        {item.name}
                      </h3>
                      <p className="text-base sm:text-lg text-zinc-700 font-sans font-semibold mt-0.5">
                        {item.role}
                      </p>
                    </div>
                    <span className="text-xs sm:text-sm font-mono font-bold text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-300 shadow-xs">
                      {item.stats}
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm font-mono text-amber-800 font-bold uppercase tracking-wider bg-amber-100/80 border border-amber-300 px-3 py-1 rounded-lg w-fit mb-4">
                    Ngách: {item.niche}
                  </div>

                  {/* Story Quote */}
                  <div className="p-6 rounded-2xl bg-white border border-zinc-200 text-base sm:text-lg text-zinc-900 font-sans leading-relaxed mb-6 shadow-xs relative">
                    <Quote className="w-6 h-6 text-amber-400 absolute -top-3 -left-2 bg-white rounded-full" />
                    <p className="italic">"{item.story}"</p>
                  </div>

                  {/* Highlights Bullet List */}
                  {item.highlights && (
                    <div className="space-y-3 mb-6">
                      <strong className="text-xs sm:text-sm font-mono font-bold text-zinc-900 uppercase tracking-wider block mb-2">
                        Điểm Đột Phá Thực Chiến:
                      </strong>
                      {item.highlights.map((hl, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-3 text-base sm:text-lg text-zinc-900 font-sans">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                          <span className="leading-snug">{hl}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Direct Action Link */}
                <div className="pt-4 border-t border-zinc-200 flex items-center justify-between">
                  <button
                    onClick={() => setActiveVideo(item.videoId || null)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-sm cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Xem Video Thực Hành</span>
                  </button>
                  {item.youtubeUrl && (
                    <a
                      href={item.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                      <span>Mở YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Modal Popup */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-sm sm:max-w-md bg-zinc-900 border border-zinc-700 rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  {item?.niche}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  Video Thực Tế: {item?.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="w-9 h-9 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-inner mb-3">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1`}
                title={item?.name}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

