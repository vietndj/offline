import React, { useState } from 'react';
import { content } from '../content';

export const RegisterSection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    occupation: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setError('Vui lòng nhập họ và tên đầy đủ.');
      return;
    }
    if (!formData.phone.trim() || !/^0[3-9][0-9]{8}$/.test(formData.phone.trim())) {
      setError('Vui lòng nhập số điện thoại hợp lệ (10 số, bắt đầu bằng số 0).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          occupation: formData.occupation.trim(),
          reason: formData.reason.trim(),
          source: 'offline.fedu.vn (Direct Form)'
        })
      });

      if (!res.ok) {
        throw new Error('Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.');
      }

      sessionStorage.setItem('offline_lead', JSON.stringify({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim()
      }));

      window.location.href = '/success';
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối máy chủ.');
      setLoading(false);
    }
  };

  return (
    <section id="dang-ky" className="py-16 md:py-24 bg-[#09090b] text-white border-t border-white/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[11px] font-bold font-mono uppercase tracking-widest mb-3">
                ĐĂNG KÝ THAM GIA KHÓA HỌC
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white leading-tight">
                Giữ Chỗ Lớp Offline Hà Nội
              </h2>
              <p className="text-xs sm:text-sm text-white/60 mt-3 leading-relaxed">
                Sau khi điền form, tư vấn viên của FEDU sẽ gọi điện xác nhận thông tin và gửi hướng dẫn chi tiết qua Zalo.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-amber-400 block mb-0.5">
                  Thời Gian
                </span>
                <span className="text-sm font-bold text-white block">2 Ngày (Thứ 7 & Chủ Nhật)</span>
                <span className="text-xs text-white/50">{content.event.time}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-amber-400 block mb-0.5">
                  Địa Điểm
                </span>
                <span className="text-sm font-bold text-white block">Hà Nội (Trực Tiếp)</span>
                <span className="text-xs text-white/50">Thông báo định vị cụ thể qua Zalo</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-amber-400 block mb-0.5">
                  Quy Mô
                </span>
                <span className="text-sm font-bold text-white block">{content.event.capacity}</span>
                <span className="text-xs text-white/50">Cầm tay chỉ việc 100% tại lớp</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold font-mono text-white/80 uppercase tracking-wider block mb-2">
                Bao Gồm Trong Khóa Học:
              </span>
              <ul className="space-y-2 text-xs text-white/70">
                {content.includedGifts.map((g, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0 font-mono">✓</span>
                    <span><strong>{g.title}</strong>: {g.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#111113] border border-white/15 shadow-2xl">
            <h3 className="text-xl font-bold font-serif text-white mb-2">
              Form Đăng Ký Giữ Chỗ
            </h3>
            <p className="text-xs text-white/50 mb-6">
              Điền chính xác số điện thoại để FEDU gửi thông tin lớp học.
            </p>

            {error && (
              <div className="p-3 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 uppercase font-mono mb-1">
                  Họ Và Tên <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Đức Việt"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 uppercase font-mono mb-1">
                  Số Điện Thoại / Zalo <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="VD: 0934688632"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 uppercase font-mono mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="VD: vietndj@gmail.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 uppercase font-mono mb-1">
                  Lĩnh vực / Nghề nghiệp
                </label>
                <input
                  type="text"
                  placeholder="VD: Giảng viên, Coach, Chủ doanh nghiệp..."
                  value={formData.occupation}
                  onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 uppercase font-mono mb-1">
                  Nút thắt lớn nhất khi làm video
                </label>
                <textarea
                  rows={2}
                  placeholder="VD: Ngại nói trước máy, kịch bản lan man, edit chậm..."
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-black font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/25 hover:opacity-95 active:scale-98 transition-all cursor-pointer mt-2"
              >
                {loading ? 'ĐANG GỬI THÔNG TIN...' : 'XÁC NHẬN ĐĂNG KÝ GIỮ CHỖ'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
