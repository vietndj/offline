import React from 'react';
import { content } from '../content';

export const GrowthChartSection: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-[#0d0d0f] text-white border-t border-white/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-amber-400 block mb-2">
            {content.growthComparison.title}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white">
            {content.growthComparison.highlight}
          </h2>
          <p className="text-xs sm:text-sm text-white/60 max-w-xl mx-auto mt-2">
            {content.growthComparison.subtitle}
          </p>
        </div>

        {/* 2 Column Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Organic / Self-made */}
          <div className="p-6 sm:p-8 rounded-2xl bg-rose-950/20 border border-rose-500/20">
            <div className="inline-block px-3 py-1 rounded-md bg-rose-500/20 text-rose-300 font-bold text-xs uppercase font-mono mb-4">
              ✕ CÁCH CŨ: LÀM VIDEO BẢN NĂNG
            </div>
            <h3 className="text-lg font-bold text-white mb-3">
              {content.growthComparison.points.organic.label}
            </h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-6">
              {content.growthComparison.points.organic.desc}
            </p>
            <ul className="space-y-2.5 text-xs text-rose-300/80">
              <li className="flex items-center gap-2">
                <span className="text-rose-400 font-bold">✕</span> Lượt xem lẹt đẹt, người xem thoát sau 3 giây
              </li>
              <li className="flex items-center gap-2">
                <span className="text-rose-400 font-bold">✕</span> Làm mất cả ngày nhưng không ai hỏi mua khóa học
              </li>
              <li className="flex items-center gap-2">
                <span className="text-rose-400 font-bold">✕</span> Càng làm càng nản, bỏ cuộc sau vài tuần
              </li>
            </ul>
          </div>

          {/* Marketing Method */}
          <div className="p-6 sm:p-8 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 relative">
            <div className="inline-block px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase font-mono mb-4">
              ✓ CÁCH MỚI: VIDEO MARKETING FEDU
            </div>
            <h3 className="text-lg font-bold text-white mb-3">
              {content.growthComparison.points.marketing.label}
            </h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-6">
              {content.growthComparison.points.marketing.desc}
            </p>
            <ul className="space-y-2.5 text-xs text-emerald-300">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Hook 3s giữ chân người xem ngay lập tức
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Kịch bản dẫn dắt tự nhiên vào giải pháp
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Tạo ra đơn hàng và học viên đều đặn mỗi tuần
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
