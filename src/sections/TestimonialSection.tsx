import React, { useState } from 'react';

// Testimonial thật — lời bóc từ video review của chị Tâng Xinh (học viên Offline K3).
// Đặt ngay sau Hero để trả lời phản đối lớn nhất với giá 4–6tr: "sao không học online cho rẻ?"
export function TestimonialSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative py-12 md:py-20 bg-[#09090b]">
      <div className="max-w-5xl mx-auto px-5">
        <div className="flex justify-center md:justify-start mb-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-bold tracking-wider uppercase">
            ⭐ Học viên nói gì
          </span>
        </div>

        <div className="grid md:grid-cols-[300px_1fr] gap-6 md:gap-10 items-center">
          {/* Video dọc 9:16 */}
          <div className="relative w-full max-w-[220px] md:max-w-[300px] mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/10 border border-zinc-800">
            <div className="aspect-[9/16] bg-zinc-900 relative">
              {isPlaying ? (
                <iframe
                  src="https://www.youtube.com/embed/QoFYOVrBl48?autoplay=1&rel=0&playsinline=1"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  title="Review của chị Tâng Xinh"
                />
              ) : (
                <>
                  <img
                    src="/assets/testimonial/tang-xinh-poster.jpg"
                    alt="Review của chị Tâng Xinh"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 hover:bg-black/25 transition-all group cursor-pointer"
                    aria-label="Phát video review của chị Tâng Xinh"
                  >
                    <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                      <svg className="w-7 h-7 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="mt-3 text-white/90 text-xs font-medium">Xem review 2 phút</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Lời nói thật */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4">
              "Mua khóa online rồi vẫn loay hoay. Học offline mới vỡ ra."
            </h2>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed italic mb-4">
              "Trước đây video 1–2 phút của mình chỉ là 1 shot quay, không biết kể chuyện thế nào. Sau khóa học mình làm video như hơi thở — ở đâu, lúc nào cũng làm được. Lượt xem tốt hơn, chuyển đổi trong kinh doanh cũng tốt hơn."
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1 text-xs">
              <span className="font-bold text-white text-sm">Tâng Xinh</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">15 năm làm cộng đồng · Thực phẩm chức năng</span>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-400 font-medium">✅ Học viên Offline K3</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
