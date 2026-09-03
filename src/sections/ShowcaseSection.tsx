import React, { useState, useRef, useEffect } from 'react';
import { content } from '../content';
import { Sparkles, Play, CheckCircle2, X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

export const ShowcaseSection: React.FC = () => {
  const { showcase } = content;
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedVideo = showcase.videos.find((v) => v.id === activeVideoId);

  const filteredVideos = selectedCategory === 'all'
    ? showcase.videos
    : showcase.videos.filter((v) => v.category === selectedCategory);

  const scrollNext = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardEl = container.querySelector<HTMLElement>(':scope > div');
    const cardWidth = cardEl ? cardEl.offsetWidth : 340;
    const gap = 24;
    const scrollAmount = cardWidth + gap;

    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 15) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollPrev = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardEl = container.querySelector<HTMLElement>(':scope > div');
    const cardWidth = cardEl ? cardEl.offsetWidth : 340;
    const gap = 24;
    const scrollAmount = cardWidth + gap;

    if (container.scrollLeft <= 15) {
      container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isPaused || activeVideoId !== null) return;

    const timer = setInterval(() => {
      scrollNext();
    }, 3800);

    return () => clearInterval(timer);
  }, [isPaused, activeVideoId, filteredVideos.length]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardEl = container.querySelector<HTMLElement>(':scope > div');
    const step = (cardEl ? cardEl.offsetWidth : 340) + 24;
    const idx = Math.round(container.scrollLeft / step);
    setCurrentIndex(Math.min(Math.max(0, idx), filteredVideos.length - 1));
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentIndex(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id="showcase" className="py-24 px-4 bg-[#09090b] border-y border-zinc-800/80 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs sm:text-sm font-mono font-bold uppercase tracking-widest mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{showcase.badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-4 leading-[1.18] [text-wrap:balance]">
            {showcase.headline}
          </h2>
          <p className="font-sans text-lg sm:text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto [text-wrap:balance]">
            {showcase.subheadline}
          </p>
        </div>

        {/* Category Filter Tabs */}
        {showcase.categories && showcase.categories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
            {showcase.categories.map((cat) => {
              const count = cat.id === 'all'
                ? showcase.videos.length
                : showcase.videos.filter((v) => v.category === cat.id).length;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-950/40'
                      : 'bg-zinc-900/80 text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      isActive ? 'bg-emerald-500/30 text-emerald-200' : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Horizontal Auto-scrolling Carousel Container */}
        <div
          className="relative group/carousel px-1"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Previous Button (Left Arrow) */}
          <button
            onClick={scrollPrev}
            aria-label="Cuộn video trước"
            className="hidden sm:flex absolute -left-3 lg:-left-5 top-[38%] -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-zinc-900/95 border border-zinc-700/90 text-zinc-300 hover:text-emerald-300 hover:border-emerald-500 shadow-2xl items-center justify-center transition-all cursor-pointer backdrop-blur-md hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button (Right Arrow) */}
          <button
            onClick={scrollNext}
            aria-label="Cuộn video tiếp theo"
            className="hidden sm:flex absolute -right-3 lg:-right-5 top-[38%] -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-zinc-900/95 border border-zinc-700/90 text-zinc-300 hover:text-emerald-300 hover:border-emerald-500 shadow-2xl items-center justify-center transition-all cursor-pointer backdrop-blur-md hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto pb-5 pt-2 px-2 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {filteredVideos.map((vid, idx) => (
              <div
                key={idx}
                className="w-[290px] sm:w-[320px] md:w-[350px] shrink-0 snap-start p-5 rounded-3xl border border-zinc-800 bg-zinc-900/90 shadow-2xl flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-emerald-950/30 transition-all duration-300 group"
              >
                <div>
                  {/* 9:16 Vertical Video Poster & Play Button Container */}
                  <div
                    onClick={() => setActiveVideoId(vid.id)}
                    className="w-full aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-950 mb-5 border border-zinc-800 relative cursor-pointer group-hover:scale-[1.01] transition-transform duration-300 shadow-inner"
                  >
                    <img
                      src={vid.poster}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                      loading="lazy"
                    />
                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Red Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-2xl bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-600/50 transition-all duration-200 group-hover:scale-110">
                        <Play className="w-7 h-7 fill-current ml-1" />
                      </div>
                    </div>

                    {/* Top Badge: Author */}
                    <div className="absolute top-3 left-3 flex items-center text-xs font-mono font-bold text-white z-10">
                      <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                        {vid.author}
                      </span>
                    </div>
                  </div>

                  {/* Category Label Pill */}
                  {vid.categoryLabel && (
                    <div className="mb-2.5">
                      <span className="inline-block text-[11px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                        {vid.categoryLabel}
                      </span>
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                      <span className="font-sans font-bold text-white text-base sm:text-lg">
                        {vid.author}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-mono font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-lg border border-amber-500/30 truncate">
                      {vid.role}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-sans font-bold text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
                    {vid.title}
                  </h3>

                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans mt-1.5">
                    {vid.desc}
                  </p>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
                  <button
                    onClick={() => setActiveVideoId(vid.id)}
                    className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>XEM VIDEO</span>
                  </button>
                  {vid.youtubeUrl && (
                    <a
                      href={vid.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      <span>Mở video</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Indicators & Quick Navigation Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {filteredVideos.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!scrollRef.current) return;
                  const container = scrollRef.current;
                  const cardEl = container.querySelector<HTMLElement>(':scope > div');
                  const step = (cardEl ? cardEl.offsetWidth : 340) + 24;
                  container.scrollTo({ left: i * step, behavior: 'smooth' });
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === i ? 'w-8 bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'w-2.5 bg-zinc-700 hover:bg-zinc-500'
                }`}
                aria-label={`Chuyển tới video ${i + 1}`}
              />
            ))}
          </div>

          {/* Mobile swipe hint */}
          <div className="flex sm:hidden items-center justify-center gap-1.5 text-xs font-mono text-zinc-400 mt-3">
            <span>← Vuốt ngang để xem thêm video →</span>
          </div>
        </div>
      </div>

      {/* Video Modal Popup */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveVideoId(null)}
        >
          <div
            className="relative w-full max-w-sm sm:max-w-md bg-zinc-900 border border-zinc-700 rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                  {selectedVideo.role}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug mt-0.5">
                  {selectedVideo.author}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideoId(null)}
                className="w-9 h-9 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-inner mb-4">
              {selectedVideo.videoUrl ? (
                <video
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${selectedVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            {/* Video Description */}
            <p className="text-sm text-zinc-300 font-sans leading-relaxed">
              {selectedVideo.desc}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};


