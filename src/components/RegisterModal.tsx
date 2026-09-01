import React, { useState } from 'react';
import { content } from '../content';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    occupation: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
          source: 'offline.fedu.vn (Modal)'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#111113] border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-8 text-white max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white text-xl p-1 font-mono"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[11px] font-bold uppercase tracking-widest font-mono mb-2">
            GIỮ CHỖ LỚP OFFLINE HÀ NỘI
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
            Đăng Ký Khóa Học Video Marketing
          </h3>
          <p className="text-xs text-white/60 mt-1">
            Số lượng giới hạn tối đa 30 học viên. Tư vấn viên FEDU sẽ gọi điện xác nhận.
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase font-mono mb-1">
              Họ Và Tên <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Nguyễn Văn Nam"
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase font-mono mb-1">
              Số Điện Thoại / Zalo <span className="text-rose-400">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="VD: 0987654321"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase font-mono mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="VD: namnguyen@gmail.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase font-mono mb-1">
              Lĩnh vực / Nghề nghiệp
            </label>
            <input
              type="text"
              placeholder="VD: Giảng viên, Coach, Chủ trung tâm tiếng Anh..."
              value={formData.occupation}
              onChange={e => setFormData({ ...formData, occupation: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase font-mono mb-1">
              Nút thắt lớn nhất khi làm video
            </label>
            <textarea
              rows={2}
              placeholder="VD: Ngại nói trước ống kính, kịch bản lan man, dựng video mất thời gian..."
              value={formData.reason}
              onChange={e => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/25 hover:opacity-95 active:scale-98 transition-all cursor-pointer"
          >
            {loading ? 'Đang gửi thông tin...' : 'XÁC NHẬN ĐĂNG KÝ GIỮ CHỖ'}
          </button>
        </form>
      </div>
    </div>
  );
};
