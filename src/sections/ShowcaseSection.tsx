import React from 'react';
import { content } from '../content';
import { Play, Sparkles } from 'lucide-react';

export const ShowcaseSection: React.FC = () => {
  const { showcase } = content;

  return (
    <section id="video-hoc-vien" className="py-20 md:py-28 bg-[#0c0d10] border-t border-zinc-800/80 text-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{showcase.badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-4 leading-[1.2]">
            {showcase.headline}
          </h2>
          <p className="font-sans text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl mx-auto">
            {showcase.subheadline}
          </p>
        </div>

        {/* 3 YouTube Responsive Video Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {showcase.videos.map((vid, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow-xl flex flex-col justify-between hover:border-zinc-700 transition-colors"
            >
              {/* Responsive Iframe Container (16:9 / 9:16) */}
              <div className="w-full aspect-video rounded-xl overflow-hidden bg-black mb-4 border border-zinc-800 relative">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${vid.id}`}
                  title={vid.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-sans font-semibold text-white text-sm">
                    {vid.author}
                  </span>
                  <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 truncate">
                    {vid.role}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {vid.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
