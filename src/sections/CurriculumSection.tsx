import React, { useState } from 'react';
import { content } from '../content';
import { Calendar, Clock, CheckCircle2, Sparkles } from 'lucide-react';

export const CurriculumSection: React.FC = () => {
  const { curriculum } = content;
  const [activeDay, setActiveDay] = useState(0);

  const currentDay = curriculum.days[activeDay];

  return (
    <section id="lo-trinh" className="py-20 md:py-28 bg-[#09090b] text-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{curriculum.badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-4 leading-[1.2]">
            {curriculum.headline}
          </h2>
          <p className="font-sans text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl mx-auto">
            {curriculum.subheadline}
          </p>
        </div>

        {/* Day Selector Tabs */}
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
          {curriculum.days.map((day, idx) => {
            const isActive = idx === activeDay;
            return (
              <button
                key={idx}
                onClick={() => setActiveDay(idx)}
                className={`p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/60 text-white shadow-lg'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className={`font-mono text-sm font-bold ${isActive ? 'text-amber-400' : 'text-zinc-400'}`}>
                  {day.day}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">{day.date}</div>
              </button>
            );
          })}
        </div>

        {/* Active Day Detail Card */}
        <div className="p-6 sm:p-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow-xl">
          {/* Day Theme Header */}
          <div className="pb-6 border-b border-zinc-800 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 font-semibold mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>CHỦ ĐỀ NGÀY HỌC</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-white">
                {currentDay.theme}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-300 max-w-md">
              💡 {currentDay.summary}
            </div>
          </div>

          {/* Module List (Timeline) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentDay.modules.map((mod, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-950/50 hover:border-zinc-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 font-semibold mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{mod.time}</span>
                  </div>
                  <h4 className="font-sans text-base font-semibold text-white mb-2 leading-snug">
                    {mod.title}
                  </h4>
                  <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-zinc-900">
                  {mod.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2 text-xs text-zinc-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
