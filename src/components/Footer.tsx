import React from 'react';
import { content } from '../content';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#09090b] text-white border-t border-white/10 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2.5 mb-2">
            <div className="w-6 h-6 rounded bg-amber-400 flex items-center justify-center text-black font-black text-xs">
              F
            </div>
            <span className="font-bold text-sm tracking-wider uppercase font-mono">
              {content.site.brand} — {content.event.name}
            </span>
          </div>
          <p className="text-xs text-white/50 max-w-md">
            Đào tạo kỹ năng thực chiến bởi thầy Nguyễn Đức Việt. Bản quyền thuộc hệ sinh thái FEDU.vn
          </p>
        </div>

        <div className="flex flex-col md:items-end gap-1 text-xs text-white/70 font-mono">
          <p>Hotline / Zalo: <span className="text-amber-400 font-bold">0934.688.632</span></p>
          <p>Email: <span className="text-white/90">vietndj@gmail.com</span></p>
          <p>Địa điểm đào tạo: <span className="text-white/90">Hà Nội</span></p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-white/5 text-center text-[11px] text-white/40 font-mono">
        © {new Date().getFullYear()} FEDU.vn — All rights reserved. Khóa học thực chiến không cam kết ảo.
      </div>
    </footer>
  );
};
