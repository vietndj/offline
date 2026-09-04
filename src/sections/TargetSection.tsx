import React from 'react';
import { CONTENT } from '../content';
import { CheckCircle2, XCircle, Users } from 'lucide-react';

export const TargetSection: React.FC = () => {
  const { targetAudience } = CONTENT;

  return (
    <section id="target" className="py-24 px-4 bg-[#09090b] border-y border-zinc-800/80 text-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs sm:text-sm font-mono font-bold uppercase tracking-widest mb-4 shadow-sm">
            <Users className="w-4 h-4 text-amber-400" />
            <span>{targetAudience.badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-4 leading-[1.18] [text-wrap:balance]">
            {targetAudience.headline}
          </h2>
        </div>

        {/* 2 Columns: Fit vs Not Fit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Fit Column (Green Callout) */}
          <div className="p-8 rounded-3xl border border-emerald-500/30 bg-emerald-950/15 shadow-xl">
            <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-emerald-500/20 text-emerald-400 font-mono text-base sm:text-lg font-bold">
              <CheckCircle2 className="w-6 h-6" />
              <span>{targetAudience.fitHeader}</span>
            </div>
            <div className="space-y-5">
              {targetAudience.fit.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5 text-base sm:text-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <strong className="text-white font-sans">{item.title}:</strong>{' '}
                    <span className="text-zinc-200 leading-relaxed font-sans">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Not Fit Column (Red Callout) */}
          <div className="p-8 rounded-3xl border border-red-500/30 bg-red-950/15 shadow-xl">
            <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-red-500/20 text-red-400 font-mono text-base sm:text-lg font-bold">
              <XCircle className="w-6 h-6" />
              <span>{targetAudience.notFitHeader}</span>
            </div>
            <div className="space-y-5">
              {targetAudience.notFit.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5 text-base sm:text-lg">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-1" />
                  <div>
                    <strong className="text-white font-sans">{item.title}:</strong>{' '}
                    <span className="text-zinc-200 leading-relaxed font-sans">{item.desc}</span>
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
