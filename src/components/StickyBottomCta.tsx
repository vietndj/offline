import React from 'react';
import { content } from '../content';

interface StickyBottomCtaProps {
  onOpenRegister: () => void;
}

export const StickyBottomCta: React.FC<StickyBottomCtaProps> = ({ onOpenRegister }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#09090b]/95 backdrop-blur-lg border-t border-white/10 p-3 shadow-2xl">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
            {content.event.capacity}
          </span>
          <span className="text-xs font-medium text-white/80">
            {content.event.dates.split('(')[0]}
          </span>
        </div>
        <button
          onClick={onOpenRegister}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-xs uppercase tracking-wide shadow-lg shadow-orange-500/25 active:scale-95 transition-transform"
        >
          {content.hero.ctaButton}
        </button>
      </div>
    </div>
  );
};
