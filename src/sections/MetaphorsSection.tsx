import React from 'react';
import { content } from '../content';
import { Sparkles, Play, ShieldCheck } from 'lucide-react';

interface MetaphorsSectionProps {
  onOpenRegister: () => void;
}

export const MetaphorsSection: React.FC<MetaphorsSectionProps> = ({ onOpenRegister }) => {
  const { metaphors } = content;

  return (
    <section id="metaphors" className="py-24 px-4 bg-[#09090b] border-t border-zinc-800/80 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {metaphors.badge}
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-medium text-white mb-6 tracking-tight leading-tight">
            {metaphors.headline}
          </h2>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
            {metaphors.subheadline}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {metaphors.items.map((item, idx) => (
            <div
              key={item.id}
              className="bg-zinc-900/90 rounded-2xl p-8 border border-zinc-800 hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl hover:shadow-orange-500/5"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl p-3 bg-zinc-800/80 rounded-2xl border border-zinc-700/50">
                    {item.icon}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-semibold">
                    VŨ KHÍ 0{idx + 1}
                  </span>
                </div>

                <h3 className="text-2xl font-serif font-medium text-white mb-2 group-hover:text-orange-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-orange-400/90 text-sm font-medium mb-6">
                  {item.subtitle}
                </p>

                <div className="bg-black/50 rounded-xl p-4 border border-zinc-800 mb-6">
                  <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 font-bold">
                    🎭 Ẩn Dụ Thực Chiến
                  </p>
                  <p className="text-zinc-300 text-sm leading-relaxed italic">
                    "{item.metaphor}"
                  </p>
                </div>

                <div className="space-y-3 mb-6 text-sm text-zinc-300">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Bản chất:</strong> {item.coreTruth}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Bí quyết:</strong> {item.secret}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-800/80">
                <p className="text-xs text-zinc-400 mb-4">
                  {item.pricing}
                </p>
                {item.youtubeDemo && (
                  <a
                    href={item.youtubeDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium border border-zinc-700 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                    Xem Video Demo Minh Họa
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onOpenRegister}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-base hover:from-orange-400 hover:to-amber-400 transition-all shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            LÀM CHỦ 3 VŨ KHÍ VIDEO NÀY TẠI LỚP HỌC
          </button>
        </div>
      </div>
    </section>
  );
};
