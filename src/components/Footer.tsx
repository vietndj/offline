import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-[#08080a] border-t border-zinc-800/80 text-zinc-400 text-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left mb-8">
          <div>
            <div className="font-sans font-bold text-base text-white mb-1">
              FEDU · Học Thiết Kế & Video Marketing Online / Offline
            </div>
            <p className="text-zinc-400 leading-normal">
              Đồng hành cùng chuyên gia, giảng viên và người làm giáo dục xây kênh chuyển đổi bền vững.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-mono">
            <span>Hotline / Zalo: <strong className="text-amber-400">0934.688.632</strong></span>
            <span>Email: <strong className="text-zinc-300">vietndj@gmail.com</strong></span>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400 font-mono">
          <div>
            © {new Date().getFullYear()} FEDU.VN — Đứng lớp trực tiếp bởi Thầy Nguyễn Đức Việt.
          </div>
          <div className="flex gap-4">
            <a href="#hero" className="hover:text-zinc-300 transition">Về đầu trang</a>
            <a href="#dang-ky" className="hover:text-zinc-300 transition">Đăng ký giữ chỗ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
