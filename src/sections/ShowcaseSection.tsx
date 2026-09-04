import React, { useState, useRef, useEffect } from 'react';
import { CONTENT } from '../content';
import { Sparkles, Play, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

export const ShowcaseSection: React.FC = () => {
  const { showcase } = CONTENT;
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
            aria-label={showcase.ui.prevAriaLabel}
            className="hidden sm:flex absolute -left-3 lg:-left-5 top-[38%] -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-zinc-900/95 border border-zinc-700/90 text-zinc-300 hover:text-emerald-300 hover:border-emerald-500 shadow-2xl items-center justify-center transition-all cursor-pointer backdrop-blur-md hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button (Right Arrow) */}
          <button
            onClick={scrollNext}
            aria-label={showcase.ui.nextAriaLabel}
            className="hidden sm:flex absolute -right-3 lg:-right-5 top-[38%] -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-zinc-900/95 border border-zinc-700/90 text-zinc-300 hover:text-emerald-300 hover:border-emerald-500 shadow-2xl items-center justify-center transition-all cursor-pointer backdrop-blur-md hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Cards Track */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-4 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredVideos.map((vid) => (
              <div
                key={vid.id}
                className="w-[280px] sm:w-[320px] md:w-[340px] shrink-0 snap-start bg-[#121216] rounded-3xl p-5 border border-zinc-800 hover:border-emerald-500/50 shadow-xl transition-all duration-300 flex flex-col justify-between group/card"
              >
                <div>
                  {/* Poster Thumbnail with Play Trigger */}
                  <div
                    onClick={() => setActiveVideoId(vid.id)}
                    className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-black mb-4 border border-zinc-800 shadow-inner group/thumb cursor-pointer"
                  >
                    <img
                      src={vid.poster}
                      alt={vid.title}
                      className="w-full h-full object-cover transform group-hover/thumb:scale-103 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Red YouTube-style Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-10 sm:w-16 sm:h-11 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-red-600/40 group-hover/thumb:scale-110 group-hover/thumb:bg-red-500 transition-all duration-200">
                        <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Category Label Pill */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-md bg-zinc-900/90 text-emerald-400 text-[10px] sm:text-xs font-mono font-bold backdrop-blur-md border border-zinc-700 shadow-sm">
                        {vid.categoryLabel}
                      </span>
                    </div>

                    {/* Author & Role Overlay at Bottom */}
                    <div className="absolute bottom-3 inset-x-3 text-left">
                      <div className="text-white font-sans font-bold text-sm leading-tight drop-shadow-md">
                        {vid.author}
                      </div>
                      <div className="text-zinc-300 font-sans text-xs drop-shadow-md">
                        {vid.role}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-base sm:text-lg text-white leading-snug line-clamp-2 group-hover/card:text-emerald-400 transition-colors">
                    {vid.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
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
                    <span>{showcase.ui.watchVideo}</span>
                  </button>
                  {vid.youtubeUrl && (
                    <a
                      href={vid.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      <span>{showcase.ui.openVideo}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Indicators */}
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
                aria-label={`Video ${i + 1}`}
              />
            ))}
          </div>

          {/* Mobile swipe hint */}
          <div className="flex sm:hidden items-center justify-center gap-1.5 text-xs font-mono text-zinc-400 mt-3">
            <span>{showcase.ui.swipeHint}</span>
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
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
              <div className="min-w-0 pr-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                  {selectedVideo.categoryLabel}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white truncate">
                  {selectedVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideoId(null)}
                className="w-9 h-9 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-inner mb-3">
              {selectedVideo.videoUrl ? (
                <video
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : selectedVideo.youtubeUrl ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${selectedVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : null}
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono pt-1">
              <span>{selectedVideo.author} • {selectedVideo.role}</span>
              {selectedVideo.youtubeUrl && (
                <a
                  href={selectedVideo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>{showcase.ui.openVideo}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
