import React from 'react';
import { content } from '../content';
import { CheckCircle2, XCircle, Users } from 'lucide-react';

export const TargetSection: React.FC = () => {
  const { targetAudience } = content;

  return (
    <section className="py-20 md:py-28 bg-[#0c0d10] border-t border-zinc-800/80 text-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>{targetAudience.badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-4">
            {targetAudience.headline}
          </h2>
        </div>

        {/* 2 Columns: Fit vs Not Fit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fit Column (Green Callout) */}
          <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 shadow-lg">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-emerald-500/20 text-emerald-400 font-mono text-sm font-bold">
              <CheckCircle2 className="w-5 h-5" />
              <span>RẤT PHÙ HỢP NẾU BẠN LÀ:</span>
            </div>
            <div className="space-y-4">
              {targetAudience.fit.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-sans">{item.title}:</strong>{' '}
                    <span className="text-zinc-300 leading-relaxed">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Not Fit Column (Red Callout) */}
          <div className="p-6 rounded-2xl border border-red-500/30 bg-red-950/10 shadow-lg">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-red-500/20 text-red-400 font-mono text-sm font-bold">
              <XCircle className="w-5 h-5" />
              <span>KHÔNG PHÙ HỢP NẾU BẠN:</span>
            </div>
            <div className="space-y-4">
              {targetAudience.notFit.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-sans">{item.title}:</strong>{' '}
                    <span className="text-zinc-300 leading-relaxed">{item.desc}</span>
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
