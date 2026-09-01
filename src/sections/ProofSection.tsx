import React from 'react';
import { content } from '../content';

export const ProofSection: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-black text-white border-t border-white/10 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Badge */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-white/80 text-xs font-bold font-mono tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            {content.proof.badge}
          </span>
        </div>

        {/* Big Numbers */}
        <div className="text-center mb-10">
          <div className="text-3xl sm:text-5xl md:text-6xl font-black font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 mb-2">
            {content.proof.revenue}
          </div>
          <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto">
            Chỉ sau <span className="text-amber-400 font-bold font-mono">{content.proof.days}</span> vừa hoàn thiện nội dung và vừa triển khai bán khóa học trên các kênh hoàn toàn mới.
          </p>
          <p className="text-xs sm:text-sm text-orange-400 font-mono font-bold mt-2">
            Đạt đỉnh doanh số {content.proof.dailyPeak}
          </p>
        </div>

        {/* Grid Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 rounded-2xl bg-[#111113] border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-amber-400 text-xs font-bold font-mono uppercase tracking-wider block mb-2">
                01. KỊCH BẢN CHUYỂN ĐỔI
              </span>
              <h4 className="text-base font-bold text-white mb-2">Nói Trúng Nỗi Đau Khách Hàng</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Không dạy nói vu vơ. Kịch bản được thiết kế theo phễu tâm lý: Chạm đúng ngượng miệng → Gỡ thắt mắc → Kêu gọi hành động.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-amber-300/80 font-mono">
              ✓ Hook 3 giây giữ người xem
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#111113] border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-orange-400 text-xs font-bold font-mono uppercase tracking-wider block mb-2">
                02. SETUP 2 GÓC MÁY
              </span>
              <h4 className="text-base font-bold text-white mb-2">Góc Nhìn Chuyên Nghiệp</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Tận dụng 2 điện thoại cá nhân, bố trí góc chính diện và góc nghiêng 45 độ. Video nhìn như talkshow đắt tiền mà không tốn chi phí thuê studio.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-orange-300/80 font-mono">
              ✓ Cắt nhịp mượt, che lỗi nói vấp
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#111113] border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-rose-400 text-xs font-bold font-mono uppercase tracking-wider block mb-2">
                03. DỰNG VIDEO THỰC CHIẾN
              </span>
              <h4 className="text-base font-bold text-white mb-2">Làm Ra Video Ngay Tại Lớp</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Thầy Việt ngồi cạnh sửa trực tiếp từng nhịp cắt, chèn sub động, hiệu ứng âm thanh và xuất video chuẩn HD trước khi về nhà.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-rose-300/80 font-mono">
              ✓ Xuất video hoàn chỉnh mang về
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-white/60 max-w-2xl mx-auto">
          {content.proof.note}
        </div>
      </div>
    </section>
  );
};
