import React from 'react';
import { Video, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-zinc-800 text-zinc-400 py-16 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-black font-bold">
              <Video className="w-4 h-4 fill-black text-black" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">VIDEO MARKETING</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed mb-6">
            Khóa học offline 2 ngày cầm tay chỉ việc giúp chuyên gia, chủ doanh nghiệp và người làm dịch vụ làm chủ quy trình kịch bản, setup 2 góc quay và edit video chuyên nghiệp.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>Cam kết hoàn 100% học phí sau ngày 1 nếu không hài lòng</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold mb-4">
            THÔNG TIN LIÊN HỆ
          </h4>
          <ul className="space-y-3 text-xs">
            <li className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Phòng Studio Chuyên Nghiệp · Hà Nội</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Hotline / Zalo: 0934.688.632 (Thầy Nguyễn Đức Việt)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-orange-400 shrink-0" />
              <span>vietndj@gmail.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold mb-4">
            QUY ĐỊNH & CAM KẾT
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Khóa học giới hạn sĩ số ≤ 30 học viên mỗi khóa để đảm bảo chất lượng hướng dẫn 1-1 và mọi học viên đều có thành phẩm video mang về.
          </p>
          <p className="text-[11px] text-zinc-400">
            Hỗ trợ sửa bài thực hành và tư vấn kênh 30 ngày liên tục sau khóa học qua nhóm Zalo riêng.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-zinc-900 text-center text-xs text-zinc-400 font-mono">
        © {new Date().getFullYear()} VIDEO MARKETING — Khóa Học Video Marketing Thực Chiến Đứng Lớp Trực Tiếp Bởi Thầy Nguyễn Đức Việt.
      </div>
    </footer>
  );
};
