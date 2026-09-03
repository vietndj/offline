import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface StickyProps {
  onOpenRegister: () => void;
}

export const StickyBottomCta: React.FC<StickyProps> = ({ onOpenRegister }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#09090b]/95 backdrop-blur-md border-t border-zinc-800 p-3 sm:hidden shadow-2xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] font-mono text-amber-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            OFFLINE HÀ NỘI
          </span>
          <span className="text-xs font-sans font-bold text-white">
            Giới hạn ≤ 40 Học Viên
          </span>
        </div>
        <button
          onClick={onOpenRegister}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-sans font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>GIỮ CHỖ</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
