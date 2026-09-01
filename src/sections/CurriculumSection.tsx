import React from 'react';
import { content } from '../content';

interface CurriculumSectionProps {
  onOpenRegister: () => void;
}

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({ onOpenRegister }) => {
  return (
    <section id="lo-trinh" className="py-16 md:py-24 bg-[#0d0d0f] text-white border-t border-white/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-amber-400 block mb-2">
            LỘ TRÌNH ĐÀO TẠO 2 NGÀY
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white max-w-2xl mx-auto leading-tight">
            Cầm Tay Chỉ Việc — Làm Ra Video Ngay Tại Lớp
          </h2>
          <p className="text-xs sm:text-sm text-white/60 mt-3 max-w-xl mx-auto">
            Không học lý thuyết suông. Học đến đâu thực hành ngay trên máy tính và điện thoại của bạn đến đó.
          </p>
        </div>

        {/* Day 1 & Day 2 Cards */}
        <div className="space-y-8 mb-12">
          {/* Day 1 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#111113] border border-white/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3.5 py-1 rounded-full bg-amber-400 text-black font-black text-xs uppercase font-mono">
                NGÀY 1
              </span>
              <span className="text-xs text-amber-400/80 font-mono tracking-wider">
                09:00 – 17:00 (Thứ 7)
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 font-serif">
              {content.curriculum.day1.title}
            </h3>
            <p className="text-xs sm:text-sm text-amber-300/90 font-medium mb-3">
              {content.curriculum.day1.subtitle}
            </p>
            <p className="text-xs text-white/60 mb-6 leading-relaxed">
              {content.curriculum.day1.desc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {content.curriculum.day1.items.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold text-xs font-mono shrink-0 mt-0.5">0{idx + 1}.</span>
                  <span className="text-xs text-white/80 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-300 leading-relaxed font-medium">
              🎯 <strong>Đầu ra Ngày 1:</strong> {content.curriculum.day1.outcome}
            </div>
          </div>

          {/* Day 2 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#111113] border border-white/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3.5 py-1 rounded-full bg-orange-500 text-black font-black text-xs uppercase font-mono">
                NGÀY 2
              </span>
              <span className="text-xs text-orange-400/80 font-mono tracking-wider">
                09:00 – 17:00 (Chủ Nhật)
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 font-serif">
              {content.curriculum.day2.title}
            </h3>
            <p className="text-xs sm:text-sm text-orange-300/90 font-medium mb-3">
              {content.curriculum.day2.subtitle}
            </p>
            <p className="text-xs text-white/60 mb-6 leading-relaxed">
              {content.curriculum.day2.desc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {content.curriculum.day2.items.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5">
                  <span className="text-orange-400 font-bold text-xs font-mono shrink-0 mt-0.5">0{idx + 1}.</span>
                  <span className="text-xs text-white/80 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300 leading-relaxed font-medium">
              🎯 <strong>Đầu ra Ngày 2:</strong> {content.curriculum.day2.outcome}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={onOpenRegister}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            ĐĂNG KÝ THAM GIA LỚP HỌC NGAY
          </button>
        </div>
      </div>
    </section>
  );
};
