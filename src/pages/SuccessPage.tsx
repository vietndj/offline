import React, { useEffect, useState } from 'react';
import { content } from '../content';

export const SuccessPage: React.FC = () => {
  const [lead, setLead] = useState<{ fullName?: string; phone?: string }>({});

  useEffect(() => {
    const raw = sessionStorage.getItem('offline_lead');
    if (raw) {
      try {
        setLead(JSON.parse(raw));
      } catch {}
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-between font-sans">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-xs font-bold text-white/70 hover:text-white font-mono flex items-center gap-1">
          ← Quay lại trang chủ
        </a>
        <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest">
          {content.site.brand}
        </span>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-6 text-2xl text-emerald-400 animate-bounce">
          ✓
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold font-mono uppercase tracking-widest mb-3">
          ĐĂNG KÝ THÀNH CÔNG!
        </span>

        <h1 className="text-2xl sm:text-4xl font-bold font-serif mb-4 text-white">
          Cảm ơn bạn, {lead.fullName || 'Học viên'}!
        </h1>

        <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-8">
          Hệ thống FEDU đã ghi nhận thông tin đăng ký giữ chỗ khóa học <strong className="text-white">{content.event.name}</strong> của bạn.
        </p>

        <div className="p-6 rounded-2xl bg-[#111113] border border-amber-400/30 text-left space-y-3 mb-8 shadow-xl">
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-amber-400">
            CÁC BƯỚC TIẾP THEO:
          </h4>
          <p className="text-xs text-white/80 leading-relaxed">
            1. Tư vấn viên của FEDU sẽ gọi điện trực tiếp tới số <strong className="text-amber-300 font-mono">{lead.phone || 'của bạn'}</strong> trong thời gian sớm nhất để xác nhận thông tin.
          </p>
          <p className="text-xs text-white/80 leading-relaxed">
            2. Chúng tôi sẽ thêm bạn vào nhóm Zalo lớp học để gửi định vị địa điểm cụ thể tại Hà Nội và tài liệu chuẩn bị trước buổi học.
          </p>
          <p className="text-xs text-white/80 leading-relaxed">
            3. Hãy chuẩn bị sẵn 1 chiếc laptop và điện thoại cá nhân để thực hành làm video ngay tại lớp!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://zalo.me/0934688632"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20"
          >
            Nhắn Zalo Thầy Việt (0934.688.632)
          </a>
          <a
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider font-mono transition-colors"
          >
            Về Trang Chủ
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-white/40 font-mono">
        © {new Date().getFullYear()} FEDU.vn — Hotline: 0934.688.632
      </footer>
    </div>
  );
};
