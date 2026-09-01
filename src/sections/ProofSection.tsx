import React from 'react';
import { content } from '../content';
import { DollarSign, Flame, Clock } from 'lucide-react';

export const ProofSection: React.FC = () => {
  const { proof } = content;

  return (
    <section id="proof" className="py-24 px-4 bg-[#09090b] relative border-t border-zinc-800/80">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-widest uppercase mb-4">
            <DollarSign className="w-3.5 h-3.5" />
            {proof.badge}
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-medium text-white mb-6 tracking-tight leading-tight">
            {proof.headline}
          </h2>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
            {proof.description}
          </p>
        </div>

        {/* Revenue Highlight Card */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-black rounded-3xl p-8 md:p-12 border border-zinc-800 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-mono">
                <Flame className="w-3.5 h-3.5" />
                DOANH THU THỰC TẾ ĐO LƯỜNG QUA CỔNG THANH TOÁN
              </div>
              <div className="text-4xl md:text-6xl font-bold font-mono text-emerald-400 tracking-tight">
                {proof.revenue}
              </div>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  <span>{proof.timeline}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700">
                  <Flame className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{proof.dailyPeak}</span>
                </div>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Toàn bộ doanh thu được tạo ra trực tiếp từ các video ngắn có cấu trúc chuyển đổi, không cần đội ngũ quay dựng cồng kềnh, chỉ với 1 điện thoại và quy trình kịch bản tinh gọn.
              </p>
            </div>

            <div className="lg:col-span-5 relative group">
              <div className="relative rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl bg-black">
                <img
                  src={proof.dashboardImg}
                  alt="Dashboard Doanh Thu"
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gallery 5 Mockups */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-serif font-medium text-white mb-2">
              Các Kênh Video Triệu View Được Xây Dựng Từ Con Số 0
            </h3>
            <p className="text-zinc-400 text-xs md:text-sm font-mono">
              Hình ảnh thực tế từ các kênh Fanpage, TikTok và lớp học offline tại Hà Nội
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 p-2 group hover:border-orange-500/40 transition-colors">
              <img src={proof.mockups.fanpage} alt="Fanpage Mockup" className="w-full h-auto rounded-xl object-cover transform group-hover:scale-102 transition-transform" />
              <p className="text-[11px] text-center text-zinc-400 font-mono mt-2">Fanpage Bán Hàng</p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 p-2 group hover:border-orange-500/40 transition-colors">
              <img src={proof.mockups.tiktok} alt="TikTok Mockup" className="w-full h-auto rounded-xl object-cover transform group-hover:scale-102 transition-transform" />
              <p className="text-[11px] text-center text-zinc-400 font-mono mt-2">Kênh TikTok Tăng Trưởng</p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 p-2 group hover:border-orange-500/40 transition-colors">
              <img src={proof.mockups.tiktokStats} alt="TikTok Stats" className="w-full h-auto rounded-xl object-cover transform group-hover:scale-102 transition-transform" />
              <p className="text-[11px] text-center text-zinc-400 font-mono mt-2">Phân Tích Số Liệu Video</p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 p-2 group hover:border-orange-500/40 transition-colors">
              <img src={proof.mockups.fbReels} alt="Facebook Reels" className="w-full h-auto rounded-xl object-cover transform group-hover:scale-102 transition-transform" />
              <p className="text-[11px] text-center text-zinc-400 font-mono mt-2">Facebook Reels Chuyển Đổi</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
