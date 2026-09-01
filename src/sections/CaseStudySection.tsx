import React from 'react';
import { content } from '../content';
import { Award, Users } from 'lucide-react';

export const CaseStudySection: React.FC = () => {
  const { caseStudies } = content;

  return (
    <section className="py-20 md:py-28 bg-[#09090b] text-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>{caseStudies.badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-4 leading-[1.2]">
            {caseStudies.headline}
          </h2>
        </div>

        {/* 2 Case Studies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.items.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-sans text-lg font-bold text-white">{item.name}</h3>
                    <p className="text-xs text-zinc-400 font-mono">{item.role}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    {item.stats}
                  </span>
                </div>

                {item.image && (
                  <div className="rounded-xl overflow-hidden bg-black/40 border border-zinc-800 mb-4">
                    <img src={item.image} alt={item.name} className="w-full h-auto object-cover max-h-[220px]" loading="lazy" />
                  </div>
                )}

                <div className="text-xs font-mono text-amber-300 mb-2">
                  Ngách đào tạo: <strong>{item.niche}</strong>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  "{item.story}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
