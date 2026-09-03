import React, { useState } from 'react';
import { content } from '../content';
import { Sparkles, Sun, Moon, Target, Gift, CheckCircle2, ArrowRight } from 'lucide-react';

interface CurriculumSectionProps {
  onOpenRegister?: () => void;
}

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({ onOpenRegister }) => {
  const { curriculum } = content;
  const [activeDay, setActiveDay] = useState(0);

  return (
    <section id="curriculum" className="py-24 px-4 bg-white text-zinc-900 border-y border-zinc-200/80 relative">
      <div className="max-w-6xl mx-auto px-2 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200 bg-orange-50 text-orange-800 text-xs sm:text-sm font-mono font-bold uppercase tracking-widest mb-4 shadow-xs">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>{curriculum.badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#09090b] mb-4 leading-[1.18] [text-wrap:balance]">
            {curriculum.headline}
          </h2>
          <p className="font-sans text-lg sm:text-xl text-zinc-700 leading-relaxed max-w-3xl mx-auto [text-wrap:balance] mb-8">
            {curriculum.subheadline}
          </p>

          {/* 3 Real Class Event Photos (No Duplicates) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-sm group">
              <div className="h-56 sm:h-64 overflow-hidden bg-zinc-100 shrink-0">
                <img
                  src="/assets/events/event_full_class.png"
                  alt="Toàn cảnh lớp học offline"
                  className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-3.5 bg-white text-sm sm:text-base font-sans font-bold text-zinc-900 text-center border-t border-zinc-100 flex-1 flex items-center justify-center leading-snug">
                🎓 Tốt nghiệp & trao giáo trình
              </div>
            </div>
            <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-sm group">
              <div className="h-56 sm:h-64 overflow-hidden bg-zinc-100 shrink-0">
                <img
                  src="/assets/events/event_1on1_coaching.webp"
                  alt="Hướng dẫn cầm tay chỉ việc 1-1"
                  className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-3.5 bg-white text-sm sm:text-base font-sans font-bold text-zinc-900 text-center border-t border-zinc-100 flex-1 flex items-center justify-center leading-snug">
                📱 Thầy Việt hướng dẫn 1 kèm 1
              </div>
            </div>
            <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-sm group">
              <div className="h-56 sm:h-64 overflow-hidden bg-zinc-100 shrink-0">
                <img
                  src="/assets/events/event_studio_practice.jpg"
                  alt="Thực hành trực tiếp trên laptop"
                  className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-3.5 bg-white text-sm sm:text-base font-sans font-bold text-zinc-900 text-center border-t border-zinc-100 flex-1 flex items-center justify-center leading-snug">
                💻 Thực hành dựng clip tại lớp
              </div>
            </div>
          </div>
        </div>

        {/* Day Selector Tabs */}
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
          {curriculum.days.map((day, idx) => {
            const isActive = idx === activeDay;
            return (
              <button
                key={idx}
                onClick={() => setActiveDay(idx)}
                className={`p-5 rounded-2xl border text-center transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-blue-50/90 border-blue-600 text-blue-950 shadow-md ring-2 ring-blue-500/30'
                    : 'bg-[#f8fafc] border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:text-zinc-950'
                }`}
              >
                <div className={`font-mono text-xl sm:text-2xl font-black ${isActive ? 'text-blue-600' : 'text-zinc-800'}`}>
                  NGÀY {day.dayNumber}
                </div>
                <div className="text-sm sm:text-base text-zinc-700 font-sans font-semibold mt-1">{day.timeRange}</div>
              </button>
            );
          })}
        </div>

        {/* Active Day Card */}
        {curriculum.days.map((day, dIdx) => {
          if (dIdx !== activeDay) return null;
          return (
            <div
              key={day.dayNumber}
              className="rounded-3xl border-2 border-blue-200/80 bg-[#f8fafc] p-6 sm:p-10 shadow-xl relative overflow-hidden"
            >
              {/* Day Header Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-zinc-200 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-600 text-white font-mono font-black text-2xl sm:text-3xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                    {day.dayNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#09090b]">
                        Ngày {parseInt(day.dayNumber)}
                      </h3>
                      <span className="text-zinc-400 font-sans">•</span>
                      <span className="text-sm sm:text-base font-mono font-bold text-blue-700 bg-blue-100/80 px-3.5 py-1 rounded-full border border-blue-300">
                        {day.timeRange}
                      </span>
                    </div>
                    <p className="font-sans text-lg sm:text-xl font-bold text-zinc-950 mt-2 leading-snug">
                      {day.title}
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-xs sm:text-sm font-mono font-bold w-fit shrink-0 shadow-sm">
                  <span>📋</span>
                  <span>{day.badgeCount}</span>
                </div>
              </div>

              {/* Goal Box */}
              <div className="bg-blue-50/90 rounded-2xl p-5 sm:p-6 border border-blue-200 mb-8 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-600 mt-0.5">
                  <Target className="w-6 h-6" />
                </div>
                <div className="text-base sm:text-lg text-zinc-900 leading-relaxed font-sans">
                  <strong className="font-bold text-blue-900 block mb-1">Mục tiêu ngày học:</strong>
                  {day.goal}
                </div>
              </div>

              {/* Morning & Afternoon Sessions (2 Columns) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Morning Session */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-blue-100 shadow-sm flex flex-col justify-between">
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
                          <div key={idx} className="flex items-start gap-3 text-base sm:text-lg text-zinc-900 font-sans">
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
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-blue-100 shadow-sm flex flex-col justify-between">
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
                          <div key={idx} className="flex items-start gap-3 text-base sm:text-lg text-zinc-900 font-sans">
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
        <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 shadow-lg text-amber-300">
              <Gift className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                <span>🎁</span>
                <span>{curriculum.bonus.tag}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold leading-snug">
                {curriculum.bonus.title}
              </h3>
              <p className="text-blue-50 text-base sm:text-lg mt-1 leading-relaxed max-w-2xl font-sans">
                {curriculum.bonus.desc}
              </p>
            </div>
          </div>
          {onOpenRegister && (
            <button
              onClick={onOpenRegister}
              className="px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-base sm:text-lg transition-all shrink-0 shadow-lg shadow-black/20 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>NHẬN TOÀN BỘ QUÀ TẶNG</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

