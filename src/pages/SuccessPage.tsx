import React from 'react';
import { CheckCircle2, ArrowLeft, Calendar, MapPin, Users, PhoneCall } from 'lucide-react';

export const SuccessPage: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name') || 'Anh/Chị';
  const phone = urlParams.get('phone') || '';

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-3">
          Đăng Ký Giữ Chỗ Thành Công!
        </h1>
        <p className="font-sans text-sm text-zinc-300 leading-relaxed mb-8">
          Chúc mừng <strong className="text-amber-400">{name}</strong> đã hoàn tất đăng ký khóa học <strong>Video Marketing Offline 2 Ngày Tại Hà Nội</strong> cùng Thầy Nguyễn Đức Việt.
        </p>

        {/* Info Box */}
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 text-left text-xs space-y-2.5 mb-8">
          <div className="flex items-center gap-2 text-zinc-300">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Thời gian: <strong>2 Ngày Thứ 7 & Chủ Nhật (08:30 - 17:30)</strong></span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <MapPin className="w-4 h-4 text-orange-400" />
            <span>Địa điểm: <strong>Studio FEDU Hà Nội</strong> (Địa chỉ chi tiết gửi qua Zalo)</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Số điện thoại xác nhận: <strong>{phone || 'Đã lưu trên hệ thống'}</strong></span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 mb-8 leading-relaxed">
          Ban tổ chức FEDU sẽ liên hệ qua Zalo/Điện thoại trong vòng 24h để gửi tài liệu chuẩn bị và xác nhận lịch học.
        </p>

        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-sans text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang chủ</span>
        </a>
      </div>
    </div>
  );
};
