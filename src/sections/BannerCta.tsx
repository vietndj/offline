import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface BannerProps {
  onOpenRegister: () => void;
  title?: string;
  badge?: string;
}

export const BannerCta: React.FC<BannerProps> = ({ 
  onOpenRegister, 
  title = "Làm chủ kỹ năng video marketing 2 ngày thực chiến cùng thầy Việt",
  badge = "SĨ SỐ GIỚI HẠN ≤ 40 HỌC VIÊN" 
}) => {
  return (
    <section className="py-12 bg-gradient-to-r from-amber-500/10 via-orange-500/15 to-amber-500/10 border-y border-amber-500/20 text-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center md:text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{badge}</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-white tracking-tight [text-wrap:balance]">
            {title}
          </h3>
        </div>
        <button
          onClick={onOpenRegister}
          className="shrink-0 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-sans font-bold text-sm sm:text-base shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
        >
          <span>ĐĂNG KÝ GIỮ CHỖ</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
