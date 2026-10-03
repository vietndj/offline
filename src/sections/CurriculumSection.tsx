import React, { useState, useRef } from 'react';
import { CONTENT } from '../content';
import { Sparkles, Sun, Moon, Target, Gift, ArrowRight, Volume2, VolumeX, ChevronDown } from 'lucide-react';

interface CurriculumSectionProps {
  onOpenRegister?: () => void;
}

const EventMedia: React.FC<{ photo: { image: string; caption: string; alt: string; video?: string } }> = ({ photo }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  if (photo.video) {
    return (
      <div className="relative w-full h-full bg-black">
        <video
          ref={videoRef}
          src={photo.video}
          poster={photo.image}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Badge Live / Auto run */}
        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono font-bold text-white flex items-center gap-1.5 shadow-sm pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
          <span>VIDEO THỰC HÀNH</span>
        </div>

        {/* Nút bật/tắt tiếng */}
        <button
          type="button"
          onClick={toggleSound}
          className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 shadow-md"
          title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-zinc-300" /> : <Volume2 className="w-4 h-4 text-orange-400" />}
        </button>
      </div>
    );
  }

  return (
    <img
      src={photo.image}
      alt={photo.alt || photo.caption}
      className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500"
      loading="lazy"
    />
  );
};

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({ onOpenRegister }) => {
  const { curriculum } = CONTENT;
  const [activeDay, setActiveDay] = useState(0);
  // Trạng thái gấp/mở danh sách module chi tiết — riêng cho từng ngày (mặc định đóng)
  const [openModules, setOpenModules] = useState<Record<number, boolean>>({});
  const toggleModules = (idx: number) =>
    setOpenModules((prev) => ({ ...prev, [idx]: !prev[idx] }));

  return (
    <section id="curriculum" className="py-12 md:py-20 px-4 bg-white text-zinc-900 border-y border-zinc-200/80 relative">
      <div className="max-w-6xl mx-auto px-0 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-8 md:mb-12 reveal reveal-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-orange-200 bg-orange-50 text-orange-800 text-xs sm:text-sm font-mono font-bold uppercase tracking-widest mb-3 sm:mb-4 shadow-xs">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>{curriculum.badge}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#09090b] mb-3 sm:mb-4 leading-[1.18] [text-wrap:balance]">
            {curriculum.headline}
          </h2>
          <p className="font-sans text-base sm:text-xl text-zinc-700 leading-relaxed max-w-3xl mx-auto [text-wrap:balance] mb-5 sm:mb-8">
            {curriculum.subheadline}
          </p>

          {/* 3 Real Class Event Items (Photos + Auto run Video) — mobile: hàng vuốt ngang */}
          <div className="-mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible text-left reveal reveal-scale delay-150 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {curriculum.eventPhotos.map((photo, idx) => (
              <div key={idx} className="w-[70%] shrink-0 snap-start md:w-auto flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-sm group">
                <div className="h-40 md:h-64 overflow-hidden bg-zinc-100 shrink-0 relative">
                  <EventMedia photo={photo} />
                </div>
                <div className="p-2.5 sm:p-3.5 bg-white text-xs sm:text-base font-sans font-bold text-zinc-900 text-center border-t border-zinc-100 flex-1 flex items-center justify-center leading-snug">
                  {photo.caption}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Day Selector Tabs */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 max-w-2xl mx-auto mb-5 sm:mb-10 reveal reveal-up delay-100">
          {curriculum.days.map((day, idx) => {
            const isActive = idx === activeDay;
            return (
              <button
                key={idx}
                onClick={() => setActiveDay(idx)}
                className={`p-3 sm:p-5 rounded-2xl text-left border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 cursor-pointer ${
                  isActive
                    ? 'border-blue-600 bg-blue-50 text-blue-950 shadow-md ring-2 ring-blue-500/20'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900'
                }`}
              >
                <div>
                  <div className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-blue-700">
                    {curriculum.dayPrefix} {parseInt(day.dayNumber)}
                  </div>
                  <div className="font-serif text-base sm:text-xl font-bold text-[#09090b] leading-snug">
                    {day.title}
                  </div>
                </div>
                <div className="text-[11px] sm:text-sm font-mono font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 w-fit">
                  {day.timeRange}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Day Modules & Schedule */}
        {curriculum.days.map((day, idx) => {
          if (idx !== activeDay) return null;
          const isModulesOpen = !!openModules[idx];
          const moduleCount = day.morning.items.length + day.afternoon.items.length;
          return (
            <div
              key={day.dayNumber}
              className="rounded-3xl border-2 border-blue-200/80 bg-[#f8fafc] p-4 sm:p-10 shadow-xl relative overflow-hidden reveal reveal-up delay-150"
            >
              {/* Day Header Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-8 border-b border-zinc-200 mb-4 sm:mb-8">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-2xl bg-blue-600 text-white font-mono font-black text-xl sm:text-3xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                    {day.dayNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                      <h3 className="font-serif text-xl sm:text-3xl font-bold text-[#09090b]">
                        {curriculum.dayPrefix} {parseInt(day.dayNumber)}
                      </h3>
                      <span className="text-zinc-400 font-sans">•</span>
                      <span className="text-xs sm:text-base font-mono font-bold text-blue-700 bg-blue-100/80 px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full border border-blue-300">
                        {day.timeRange}
                      </span>
                    </div>
                    <p className="font-sans text-base sm:text-xl font-bold text-zinc-950 mt-1 sm:mt-2 leading-snug">
                      {day.title}
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-600 text-white text-[11px] sm:text-sm font-mono font-bold w-fit shrink-0 shadow-sm">
                  <span>📋</span>
                  <span>{day.badgeCount}</span>
                </div>
              </div>

              {/* Goal Box */}
              <div className="bg-blue-50/90 rounded-2xl p-3.5 sm:p-6 border border-blue-200 mb-4 sm:mb-8 flex items-start gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-600 mt-0.5">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="text-sm sm:text-lg text-zinc-900 leading-relaxed font-sans">
                  <strong className="font-bold text-blue-900 block mb-1">{curriculum.goalLabel}</strong>
                  <span className="line-clamp-3 lg:line-clamp-none">{day.goal}</span>
                </div>
              </div>

              {/* Tóm tắt 2 ca + nút mở danh sách module (chỉ mobile/tablet) */}
              <div className="lg:hidden space-y-2 mb-3">
                <div className="flex items-start gap-2.5 text-sm font-sans text-zinc-900">
                  <Sun className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    <strong className="font-bold text-amber-800">{day.morning.sessionName}:</strong> {day.morning.title}
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-sm font-sans text-zinc-900">
                  <Moon className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    <strong className="font-bold text-indigo-800">{day.afternoon.sessionName}:</strong> {day.afternoon.title}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleModules(idx)}
                aria-expanded={isModulesOpen}
                className="lg:hidden w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-blue-300 bg-white text-blue-700 text-sm font-sans font-bold hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <span>{isModulesOpen ? 'Thu gọn module' : `Xem ${moduleCount} module chi tiết`}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isModulesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Morning & Afternoon Sessions (2 Columns) — mobile: gấp lại, bấm mới mở */}
              <div className={`${isModulesOpen ? 'grid mt-4' : 'hidden'} lg:grid lg:mt-0 grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6`}>
                {/* Morning Session */}
                <div className="bg-white rounded-2xl p-4 sm:p-7 border border-blue-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-4 border-b border-zinc-100 mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center shrink-0">
                          <Sun className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-mono text-xs sm:text-sm font-bold text-amber-800 uppercase tracking-wider block">
                            {day.morning.sessionName} • {day.morning.time}
                          </span>
                          <h4 className="font-sans text-lg sm:text-xl font-bold text-zinc-950 mt-0.5">
                            {day.morning.title}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      {day.morning.items.map((item, idx) => {
                        const colonIdx = item.indexOf(':');
                        const boldLead = colonIdx !== -1 ? item.substring(0, colonIdx) : '';
                        const restText = colonIdx !== -1 ? item.substring(colonIdx + 1) : item;
                        return (
                          <div key={idx} className="flex items-start gap-3 text-sm sm:text-lg text-zinc-900 font-sans">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <span className="leading-relaxed font-normal text-zinc-800">
                              {boldLead ? (
                                <>
                                  <strong className="font-bold text-zinc-950">{boldLead}:</strong>
                                  {restText}
                                </>
                              ) : (
                                item.replace(/^\d+\.\s*/, '')
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Afternoon Session */}
                <div className="bg-white rounded-2xl p-4 sm:p-7 border border-blue-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-4 border-b border-zinc-100 mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 flex items-center justify-center shrink-0">
                          <Moon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-mono text-xs sm:text-sm font-bold text-indigo-800 uppercase tracking-wider block">
                            {day.afternoon.sessionName} • {day.afternoon.time}
                          </span>
                          <h4 className="font-sans text-lg sm:text-xl font-bold text-zinc-950 mt-0.5">
                            {day.afternoon.title}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      {day.afternoon.items.map((item, idx) => {
                        const colonIdx = item.indexOf(':');
                        const boldLead = colonIdx !== -1 ? item.substring(0, colonIdx) : '';
                        const restText = colonIdx !== -1 ? item.substring(colonIdx + 1) : item;
                        return (
                          <div key={idx} className="flex items-start gap-3 text-sm sm:text-lg text-zinc-900 font-sans">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <span className="leading-relaxed font-normal text-zinc-800">
                              {boldLead ? (
                                <>
                                  <strong className="font-bold text-zinc-950">{boldLead}:</strong>
                                  {restText}
                                </>
                              ) : (
                                item.replace(/^\d+\.\s*/, '')
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Bonus Section Box */}
        <div className="mt-5 sm:mt-8 p-4 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-6">
          <div className="flex items-start sm:items-center gap-3 sm:gap-5">
            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 items-center justify-center shrink-0 shadow-lg text-amber-300">
              <Gift className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-400 text-zinc-950 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 sm:mb-2">
                <span>🎁</span>
                <span>{curriculum.bonus.tag}</span>
              </div>
              <h3 className="text-base sm:text-2xl font-bold leading-snug">
                {curriculum.bonus.title}
              </h3>
              <p className="text-blue-50 text-sm sm:text-lg mt-1 leading-relaxed max-w-2xl font-sans line-clamp-2 md:line-clamp-none">
                {curriculum.bonus.desc}
              </p>
            </div>
          </div>
          {onOpenRegister && (
            <button
              onClick={onOpenRegister}
              className="px-5 py-2.5 sm:px-8 sm:py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm sm:text-lg transition-all shrink-0 shadow-lg shadow-black/20 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{curriculum.bonus.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
