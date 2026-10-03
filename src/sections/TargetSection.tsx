import React from 'react';
import { CONTENT } from '../content';
import { CheckCircle2, XCircle, Users } from 'lucide-react';

export const TargetSection: React.FC = () => {
  const { targetAudience } = CONTENT;

  return (
    <section id="target" className="py-12 md:py-20 px-4 bg-[#09090b] border-y border-zinc-800/80 text-white relative">
      <div className="max-w-4xl mx-auto px-0 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-12 reveal reveal-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs sm:text-sm font-mono font-bold uppercase tracking-widest mb-3 sm:mb-4 shadow-sm">
            <Users className="w-4 h-4 text-amber-400" />
            <span>{targetAudience.badge}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-0 sm:mb-4 leading-[1.18] [text-wrap:balance]">
            {targetAudience.headline}
          </h2>
        </div>

        {/* 2 Columns: Fit vs Not Fit — list gọn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-8">
          {/* Fit Column (Green Callout) */}
          <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-emerald-500/30 bg-emerald-950/15 shadow-xl reveal reveal-left delay-100">
            <div className="flex items-center gap-2 mb-3 sm:mb-6 pb-2.5 sm:pb-4 border-b border-emerald-500/20 text-emerald-400 font-mono text-sm sm:text-lg font-bold">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>{targetAudience.fitHeader}</span>
            </div>
            <div className="space-y-2.5 sm:space-y-5">
              {targetAudience.fit.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 sm:gap-3.5 text-sm sm:text-lg">
                  <span className="text-emerald-400 font-bold shrink-0 leading-snug sm:hidden" aria-hidden="true">✓</span>
                  <CheckCircle2 className="hidden sm:block w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                  <div className="leading-snug sm:leading-relaxed min-w-0">
                    <strong className="text-white font-sans block">{item.title}</strong>
                    <span className="text-zinc-400 sm:text-zinc-200 font-sans text-xs sm:text-lg line-clamp-2 sm:line-clamp-none mt-0.5 sm:mt-1">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Not Fit Column (Red Callout) */}
          <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-red-500/30 bg-red-950/15 shadow-xl reveal reveal-right delay-150">
            <div className="flex items-center gap-2 mb-3 sm:mb-6 pb-2.5 sm:pb-4 border-b border-red-500/20 text-red-400 font-mono text-sm sm:text-lg font-bold">
              <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>{targetAudience.notFitHeader}</span>
            </div>
            <div className="space-y-2.5 sm:space-y-5">
              {targetAudience.notFit.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 sm:gap-3.5 text-sm sm:text-lg">
                  <span className="text-red-400 font-bold shrink-0 leading-snug sm:hidden" aria-hidden="true">✕</span>
                  <XCircle className="hidden sm:block w-5 h-5 text-red-400 shrink-0 mt-1" />
                  <div className="leading-snug sm:leading-relaxed min-w-0">
                    <strong className="text-white font-sans block">{item.title}</strong>
                    <span className="text-zinc-400 sm:text-zinc-200 font-sans text-xs sm:text-lg line-clamp-2 sm:line-clamp-none mt-0.5 sm:mt-1">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
