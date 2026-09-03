import React from 'react';
import { HelpCircle, XCircle, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

interface DefinitionSectionProps {
  onOpenRegister?: () => void;
}

export const DefinitionSection: React.FC<DefinitionSectionProps> = ({ onOpenRegister }) => {
  return (
    <section id="dinh-nghia" className="py-24 px-4 bg-[#0c0d12] text-white relative border-b border-zinc-800">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase mb-4 shadow-sm">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>BẢN CHẤT CỐT LÕI · PHÂN BIỆT RÕ RÀNG</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-white mb-6 tracking-tight leading-[1.18] [text-wrap:balance]">
            Video marketing là gì? Vì sao 90% người làm video đang nhầm sang "video ads" hoặc "câu view rác"?
          </h2>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed [text-wrap:balance] max-w-3xl mx-auto font-sans">
            Quảng cáo tắt tiền là hết khách, câu view giải trí thì không ra tiền. Chỉ có <strong className="text-amber-400">video marketing có cấu trúc chuẩn</strong> mới là tài sản tự động mang khách hàng về cho bạn 24/7.
          </p>
        </div>

        {/* 3-Column Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Column 1: Video Ads */}
          <div className="rounded-3xl border border-red-500/20 bg-red-950/10 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-500/20 text-red-400 text-xs font-mono font-bold uppercase">
                <XCircle className="w-3.5 h-3.5" />
                <span>01. VIDEO ADS (CHẠY QUẢNG CÁO)</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Mua tiếp cận, không mua được lòng tin
              </h3>
              <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
                Cố gắng tiếp cận thật nhiều người bằng tiền quảng cáo và các bài bán hàng trực diện, giảm giá ép mua.
              </p>

              <div className="space-y-3 pt-4 border-t border-red-500/20 text-sm sm:text-base font-sans">
                <div className="flex items-start gap-2.5 text-zinc-200">
                  <span className="text-red-400 font-bold shrink-0 text-base">✕</span>
                  <span><strong>Không bền vững:</strong> Dừng ngân sách là lập tức mất dòng khách hàng.</span>
                </div>
                <div className="flex items-start gap-2.5 text-zinc-200">
                  <span className="text-red-400 font-bold shrink-0 text-base">✕</span>
                  <span><strong>Tâm lý đề phòng:</strong> Khán giả ngày càng cảnh giác và ác cảm với quảng cáo chèo kéo.</span>
                </div>
                <div className="flex items-start gap-2.5 text-zinc-200">
                  <span className="text-red-400 font-bold shrink-0 text-base">✕</span>
                  <span><strong>Bào mòn lợi nhuận:</strong> Càng chạy càng đắt đỏ, tiền lãi không bù nổi tiền ads.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-red-500/20 text-center">
              <span className="text-sm font-mono text-red-400 font-bold">Kết quả: Lệ thuộc quảng cáo, càng làm càng đuối</span>
            </div>
          </div>

          {/* Column 2: Video Đu Trend */}
          <div className="rounded-3xl border border-zinc-700 bg-zinc-900/80 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-800 text-zinc-200 text-xs sm:text-sm font-mono font-bold uppercase">
                <XCircle className="w-4 h-4" />
                <span>02. VIDEO ĐU TREND (CÂU VIEW ĐẠI TRÀ)</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Lượt xem ảo, bài toán thật
              </h3>
              <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
                Chạy theo xu hướng nhất thời để đổi lấy những con số tương tác bề nổi từ người lướt mạng giải trí.
              </p>

              <div className="space-y-3 pt-4 border-t border-zinc-800 text-sm sm:text-base font-sans">
                <div className="flex items-start gap-2.5 text-zinc-200">
                  <span className="text-zinc-500 font-bold shrink-0 text-base">✕</span>
                  <span><strong>Người xem không phải khách:</strong> Triệu view nhưng không ai có nhu cầu hay ý định mua hàng.</span>
                </div>
                <div className="flex items-start gap-2.5 text-zinc-200">
                  <span className="text-zinc-500 font-bold shrink-0 text-base">✕</span>
                  <span><strong>Mất vị thế chuyên môn:</strong> Bị coi là kênh giải trí qua đường thay vì chuyên gia uy tín.</span>
                </div>
                <div className="flex items-start gap-2.5 text-zinc-200">
                  <span className="text-zinc-500 font-bold shrink-0 text-base">✕</span>
                  <span><strong>Không thể nhân bản:</strong> Cạn kiệt ý tưởng đu trend sau vài tuần, không tạo ra hệ thống.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
              <span className="text-sm font-mono text-zinc-300 font-bold">Kết quả: Bận rộn ảo, không tạo ra khách hàng thật</span>
            </div>
          </div>

          {/* Column 3: Video Marketing Có Cấu Trúc (HIGHLIGHT) */}
          <div className="rounded-3xl border-2 border-amber-500 bg-gradient-to-b from-amber-500/15 via-zinc-900 to-zinc-950 p-6 sm:p-8 flex flex-col justify-between relative shadow-2xl shadow-amber-500/15 ring-2 ring-amber-500/30">
            <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl bg-amber-500 text-zinc-950 text-xs sm:text-sm font-mono font-black uppercase tracking-wider">
              CHUẨN PHƯƠNG PHÁP THỰC CHIẾN
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs sm:text-sm font-mono font-bold uppercase">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>03. VIDEO MARKETING CÓ CẤU TRÚC</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Tài sản sinh khách 24/7
              </h3>
              <p className="text-sm sm:text-base text-zinc-200 font-sans leading-relaxed">
                Video 30–45s giải thích đúng điểm nghẽn chuyên môn bằng trải nghiệm thật. Khách hàng tự tìm đến xin tư vấn và mua hàng.
              </p>

              <div className="space-y-3 pt-4 border-t border-amber-500/30 text-base sm:text-lg font-sans">
                <div className="flex items-start gap-3 text-zinc-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>1 người 1 điện thoại:</strong> Tự quay đơn giản, ngắt câu 5s theo kịch bản chuyển đổi.</span>
                </div>
                <div className="flex items-start gap-3 text-zinc-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Đúng tệp khách chi tiền:</strong> Khán giả thấy đúng vấn đề của mình nên chủ động nhắn tin.</span>
                </div>
                <div className="flex items-start gap-3 text-zinc-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Tài sản số vĩnh viễn:</strong> Video đăng lên tiếp tục mang lại khách hàng sau nhiều tháng.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-amber-500/30 text-center">
              <span className="text-sm sm:text-base font-mono text-amber-300 font-black">Kết quả: Có khách đều đặn, không tốn tiền ads</span>
            </div>
          </div>
        </div>

        {/* Insight Callout Box */}
        <div className="p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-zinc-900/80 to-zinc-950 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>ĐÚC KẾT THỰC CHIẾN TỪ THẦY NGUYỄN ĐỨC VIỆT</span>
            </div>
            <div className="space-y-2 text-sm sm:text-base text-zinc-200 font-sans leading-relaxed">
              <p>
                "Làm Video Marketing thực ra như anh thợ máy nghe tiếng xe là biết hỏng ở đâu: bạn không cần ăn nói dẻo miệng, chỉ cần nói đúng sự thật và gỡ đúng chỗ khách đang bế tắc.
              </p>
              <p className="text-zinc-300">
                Nhưng để người xem chịu dừng lại lắng nghe, <strong className="text-white font-medium">nhìn thuận mắt, nghe êm tai và xem một mạch từ đầu đến cuối</strong>, bạn cần đóng gói nó trong một khung hình sáng sủa cùng âm thanh rõ nét. Đó chính là quy trình thực chiến bạn sẽ được làm chủ trong khóa học này."
              </p>
            </div>
          </div>

          <a
            href="#dang-ky"
            onClick={(e) => {
              if (onOpenRegister) {
                e.preventDefault();
                onOpenRegister();
              }
            }}
            className="shrink-0 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-sm sm:text-base transition-all shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <span>HỌC CÁCH LÀM VIDEO MARKETING</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
