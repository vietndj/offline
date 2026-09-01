import React from 'react';
import { content } from '../content';

export const TargetSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#0d0d0f] text-white border-t border-white/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-amber-400 block mb-2">
            {content.targetAudience.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white max-w-2xl mx-auto leading-tight">
            {content.targetAudience.title}
          </h2>
          <p className="text-xs sm:text-sm text-white/60 mt-3 max-w-xl mx-auto">
            Chúng tôi chọn lọc học viên để đảm bảo 100% người tham gia đều tạo ra kết quả thực tế.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Suitable */}
          <div className="p-6 sm:p-8 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm font-mono uppercase tracking-wider mb-6 pb-3 border-b border-emerald-500/20">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">✓</span>
              RẤT PHÙ HỢP NẾU BẠN LÀ:
            </div>
            <ul className="space-y-4">
              {content.targetAudience.suitable.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-white/80 leading-relaxed">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Unsuitable */}
          <div className="p-6 sm:p-8 rounded-2xl bg-rose-950/20 border border-rose-500/30">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm font-mono uppercase tracking-wider mb-6 pb-3 border-b border-rose-500/20">
              <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-xs">✕</span>
              KHÔNG PHÙ HỢP VỚI:
            </div>
            <ul className="space-y-4">
              {content.targetAudience.unsuitable.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-white/80 leading-relaxed">
                  <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
