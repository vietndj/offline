import React from 'react';
import { HelpCircle, XCircle, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { CONTENT } from '../content';

interface DefinitionSectionProps {
  onOpenRegister?: () => void;
}

export const DefinitionSection: React.FC<DefinitionSectionProps> = ({ onOpenRegister }) => {
  const { definition } = CONTENT;

  return (
    <section id="dinh-nghia" className="py-24 px-4 bg-[#0c0d12] text-white relative border-b border-zinc-800">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase mb-4 shadow-sm">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>{definition.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-white mb-6 tracking-tight leading-[1.18] [text-wrap:balance]">
            {definition.headline}
          </h2>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed [text-wrap:balance] max-w-3xl mx-auto font-sans">
            {definition.highlightWord && definition.subheadline.includes(definition.highlightWord) ? (
              <>
                {definition.subheadline.split(definition.highlightWord)[0]}
                <strong className="text-amber-400">{definition.highlightWord}</strong>
                {definition.subheadline.split(definition.highlightWord)[1]}
              </>
            ) : (
              definition.subheadline
            )}
          </p>
        </div>

        {/* 3-Column Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {definition.columns.map((col) => {
            if (col.variant === 'danger') {
              return (
                <div
                  key={col.id}
                  className="rounded-3xl border border-red-500/20 bg-red-950/10 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-500/20 text-red-400 text-xs font-mono font-bold uppercase">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{col.tag}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                      {col.title}
                    </h3>
                    <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
                      {col.desc}
                    </p>

                    <div className="space-y-3 pt-4 border-t border-red-500/20 text-sm sm:text-base font-sans">
                      {col.points.map((pt, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2.5 text-zinc-200">
                          <span className="text-red-400 font-bold shrink-0 text-base">✕</span>
                          <span>
                            <strong>{pt.bold}</strong>{pt.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-red-500/20 text-center">
                    <span className="text-sm font-mono text-red-400 font-bold">
                      {col.result}
                    </span>
                  </div>
                </div>
              );
            }

            if (col.variant === 'neutral') {
              return (
                <div
                  key={col.id}
                  className="rounded-3xl border border-zinc-700 bg-zinc-900/80 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-800 text-zinc-200 text-xs sm:text-sm font-mono font-bold uppercase">
                      <XCircle className="w-4 h-4" />
                      <span>{col.tag}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                      {col.title}
                    </h3>
                    <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
                      {col.desc}
                    </p>

                    <div className="space-y-3 pt-4 border-t border-zinc-800 text-sm sm:text-base font-sans">
                      {col.points.map((pt, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2.5 text-zinc-200">
                          <span className="text-zinc-500 font-bold shrink-0 text-base">✕</span>
                          <span>
                            <strong>{pt.bold}</strong>{pt.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
                    <span className="text-sm font-mono text-zinc-300 font-bold">
                      {col.result}
                    </span>
                  </div>
                </div>
              );
            }

            // Highlight Variant (Video Marketing)
            return (
              <div
                key={col.id}
                className="rounded-3xl border-2 border-amber-500 bg-gradient-to-b from-amber-500/15 via-zinc-900 to-zinc-950 p-6 sm:p-8 flex flex-col justify-between relative shadow-2xl shadow-amber-500/15 ring-2 ring-amber-500/30"
              >
                {col.badge && (
                  <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl bg-amber-500 text-zinc-950 text-xs sm:text-sm font-mono font-black uppercase tracking-wider">
                    {col.badge}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs sm:text-sm font-mono font-bold uppercase">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>{col.tag}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                    {col.title}
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-200 font-sans leading-relaxed">
                    {col.desc}
                  </p>

                  <div className="space-y-3 pt-4 border-t border-amber-500/30 text-base sm:text-lg font-sans">
                    {col.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-3 text-zinc-100">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>{pt.bold}</strong>{pt.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-amber-500/30 text-center">
                  <span className="text-sm sm:text-base font-mono text-amber-300 font-black">
                    {col.result}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Insight Callout Box */}
        <div className="p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-zinc-900/80 to-zinc-950 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>{definition.callout.badge}</span>
            </div>
            <div className="space-y-2 text-sm sm:text-base text-zinc-200 font-sans leading-relaxed">
              {definition.callout.quoteParts.map((qp, qIdx) => (
                <p key={qIdx} className={qIdx === 1 ? 'text-zinc-300' : ''}>
                  {qp.text}
                  {qp.highlight && (
                    <strong className="text-white font-medium">{qp.highlight}</strong>
                  )}
                  {qp.textAfter && qp.textAfter}
                </p>
              ))}
            </div>
          </div>

          <a
            href="#dang-ky"
            onClick={(e) => {
              if (onOpenRegister) {
                e.preventDefault();
                onOpenRegister();
              }
            }}
            className="shrink-0 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-sm sm:text-base transition-all shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <span>{definition.callout.cta}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
