import React from 'react';
import { content } from '../content';

export const PainSection: React.FC = () => {
  return (
    <section id="loi-ich" className="py-16 md:py-24 bg-[#09090b] text-white border-t border-white/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-amber-400 block mb-2">
            GIẢI QUYẾT TẬN GỐC NỖI ĐAU
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white max-w-2xl mx-auto leading-tight">
            Tháo Gỡ 4 Nút Thắt Lớn Nhất Khi Làm Video Chuyên Gia
          </h2>
          <p className="text-xs sm:text-sm text-white/60 mt-3 max-w-xl mx-auto">
            Thầy Việt sẽ cùng bạn tháo gỡ từng nút thắt này ngay tại lớp qua các bài tập thực hành cụ thể.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.painPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-[#111113] border border-white/10 hover:border-amber-400/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold font-mono text-amber-400 uppercase tracking-widest">
                    {pillar.eyebrow}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-mono font-bold text-white/60">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-rose-300/90 mb-3 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                  <strong className="text-rose-400">Nỗi đau:</strong> {pillar.problem}
                </p>
                <p className="text-xs sm:text-sm text-emerald-300 mb-4 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                  <strong className="text-emerald-400">Giải pháp:</strong> {pillar.solution}
                </p>

                <ul className="space-y-2 mb-6">
                  {pillar.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 text-xs text-white/75">
                      <span className="text-amber-400 shrink-0 font-mono">▶</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-white/10">
                <span className="text-[11px] font-bold text-amber-300 font-mono uppercase tracking-wider block mb-1">
                  KẾT QUẢ ĐẠT ĐƯỢC:
                </span>
                <p className="text-xs text-white/90 font-medium">
                  {pillar.outcome}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
