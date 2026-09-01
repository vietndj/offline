import React, { useState } from 'react';
import { content } from '../content';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const PainSection: React.FC = () => {
  const { painPoints } = content;
  const [activeTab, setActiveTab] = useState(painPoints.tabs[0].id);

  const currentTab = painPoints.tabs.find(t => t.id === activeTab) || painPoints.tabs[0];

  return (
    <section id="nut-that" className="py-20 md:py-28 bg-[#0c0d10] border-t border-zinc-800/80 text-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{painPoints.badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-4 leading-[1.2]">
            {painPoints.headline}
          </h2>
          <p className="font-sans text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl mx-auto">
            {painPoints.subheadline}
          </p>
        </div>

        {/* 4 Tabs Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
          {painPoints.tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-3.5 rounded-xl text-left transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-md'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                }`}
              >
                <div className={`text-xs font-mono font-semibold truncate ${isActive ? 'text-amber-400' : 'text-zinc-400'}`}>
                  {tab.title}
                </div>
                <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {tab.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Detail Content */}
        <div className="p-6 sm:p-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-400 uppercase tracking-wide mb-2">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Điểm Nghẽn & Giải Pháp Thực Chiến</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-2">
                  {currentTab.title}: {currentTab.subtitle}
                </h3>

                {/* Points List */}
                <div className="space-y-2.5 my-6">
                  {currentTab.points.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-normal">{point}</span>
                    </div>
                  ))}
                </div>

                {/* Outcome Box */}
                <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 text-xs sm:text-sm font-sans mb-6">
                  ✨ <strong>Kết quả sau 2 ngày:</strong> {currentTab.outcome}
                </div>
              </div>

              {/* 3 Sub-Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 border-t border-zinc-800">
                {currentTab.cards.map((c, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-zinc-800/80 bg-zinc-950/50">
                    <div className="font-mono text-xs font-semibold text-amber-300 mb-1">{c.title}</div>
                    <div className="text-[11px] text-zinc-400 leading-snug">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Media Preview (WebP Animation or Image) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[340px] rounded-2xl overflow-hidden border border-zinc-800 bg-black/60 shadow-2xl p-2">
                <div className="rounded-xl overflow-hidden bg-zinc-950">
                  <img
                    src={currentTab.media}
                    alt={currentTab.title}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
