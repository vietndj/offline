import React from 'react';
import { content } from '../content';

interface NavbarProps {
  onOpenRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRegister }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/90 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-black text-black text-sm tracking-wider shadow-md">
            F
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-widest uppercase text-white group-hover:text-amber-400 transition-colors font-mono">
              {content.site.brand}
            </span>
            <span className="text-[10px] text-white/50 tracking-wider font-mono">
              VIDEO MARKETING OFFLINE
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-wider font-mono text-white/70">
          <a href="#loi-ich" className="hover:text-white transition-colors">4 Nút Thắt</a>
          <a href="#lo-trinh" className="hover:text-white transition-colors">Lộ Trình 2 Ngày</a>
          <a href="#giang-vien" className="hover:text-white transition-colors">Giảng Viên</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenRegister}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-xs sm:text-sm tracking-wide uppercase shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Đăng Ký Giữ Chỗ
          </button>
        </div>
      </div>
    </header>
  );
};
