import React, { useState, useEffect } from 'react';
import { Video, Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRegister }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Kết Quả', href: '#proof' },
    { label: '4 Định Dạng', href: '#metaphors' },
    { label: '4 Nút Thắt', href: '#pain-points' },
    { label: 'Lộ Trình 2 Ngày', href: '#curriculum' },
    { label: 'Video Học Viên', href: '#showcase' },
    { label: 'Giảng Viên', href: '#instructor' },
    { label: 'Hỏi Đáp', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800/80 py-3.5 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-black font-extrabold shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Video className="w-5 h-5 fill-black text-black" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white block leading-none">
              VIDEO MARKETING
            </span>
            <span className="text-[10px] font-mono tracking-widest text-orange-400 block mt-1 uppercase font-semibold">
              WORKSHOP OFFLINE 2 NGÀY
            </span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-medium uppercase tracking-wider text-zinc-300 hover:text-orange-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenRegister}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all active:scale-95 shadow-md"
          >
            <span>GIỮ CHỖ NGAY</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#09090b]/98 border-b border-zinc-800 px-4 py-6 space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium py-2 border-b border-zinc-800/50 text-zinc-300 hover:text-orange-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenRegister();
            }}
            className="w-full py-3 rounded-xl bg-orange-500 text-black font-bold text-sm text-center shadow-lg shadow-orange-500/20"
          >
            ĐĂNG KÝ GIỮ CHỖ NGAY
          </button>
        </div>
      )}
    </header>
  );
};
