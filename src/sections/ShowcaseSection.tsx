import React from 'react';
import { content } from '../content';

export const ShowcaseSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#09090b] text-white border-t border-white/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-amber-400 block mb-2">
            {content.showcase.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white max-w-2xl mx-auto leading-tight">
            {content.showcase.title}
          </h2>
          <p className="text-xs sm:text-sm text-white/60 mt-3 max-w-xl mx-auto">
            {content.showcase.subtitle}
          </p>
        </div>

        {/* Case Studies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.showcase.cases.map((c, idx) => (
            <div key={idx} className="p-6 sm:p-8 rounded-2xl bg-[#111113] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-amber-400 text-xs font-bold font-mono uppercase tracking-wider block mb-1">
                  CASE STUDY #{idx + 1}
                </span>
                <h3 className="text-xl font-bold text-white mb-1">
                  {c.name}
                </h3>
                <p className="text-xs text-orange-400 font-mono mb-4">
                  {c.niche}
                </p>
                <div className="p-3.5 mb-4 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs font-bold text-amber-300 font-mono">
                  ★ Kết quả: {c.result}
                </div>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-6">
                  {c.desc}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-center">
                {c.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="p-2 rounded bg-white/5">
                    <span className="text-[10px] text-white/50 block font-mono uppercase">{m.label}</span>
                    <span className="text-xs font-bold text-white font-mono mt-0.5 block">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
