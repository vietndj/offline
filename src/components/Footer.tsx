import React from 'react';
import { Video, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-zinc-800 text-zinc-300 py-16 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-black font-bold">
              <Video className="w-5 h-5 fill-black text-black" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">VIDEO MARKETING</span>
          </div>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
            Khóa học offline 2 ngày cầm tay chỉ việc giúp chuyên gia, chủ doanh nghiệp và người làm dịch vụ làm chủ quy trình kịch bản, setup 2 góc quay và edit video chuyên nghiệp.
          </p>
        </div>

        <div>
          <h4 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-white font-bold mb-4">
            QUY ĐỊNH & CAM KẾT
          </h4>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
            Khóa học giới hạn sĩ số ≤ 40 học viên mỗi khóa để đảm bảo chất lượng hướng dẫn 1-1 và mọi học viên đều có thành phẩm video mang về.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-zinc-900 text-center text-xs sm:text-sm text-zinc-400 font-mono">
        © {new Date().getFullYear()} VIDEO MARKETING — Khóa Học Video Marketing Thực Chiến Đứng Lớp Trực Tiếp Bởi Nguyễn Đức Việt.
      </div>
    </footer>
  );
};
