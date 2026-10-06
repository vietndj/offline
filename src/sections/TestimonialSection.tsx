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

        <div className="grid md:grid-cols-[340px_1fr] lg:grid-cols-[380px_1fr] gap-8 md:gap-12 items-center">
          {/* Video dọc 9:16 */}
          <div className="relative w-full max-w-[280px] md:max-w-full mx-auto rounded-3xl overflow-hidden shadow-[0_0_40px_-10px_rgba(245,158,11,0.2)] border border-zinc-800/60 ring-1 ring-white/10 bg-black">
            <div className="aspect-[9/16] relative">
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
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                  />
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 hover:bg-black/20 transition-all group cursor-pointer"
                    aria-label="Phát video review của chị Tâng Xinh"
                  >
                    <div className="w-16 h-16 rounded-full bg-amber-500/90 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)] group-hover:scale-110 group-hover:bg-amber-400 transition-all">
                      <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="mt-4 text-white/95 text-sm font-semibold tracking-wide drop-shadow-md">Xem review 2 phút</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Lời nói thật */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-6">
              "Mua khóa online rồi vẫn loay hoay. Học offline mới vỡ ra."
            </h2>
            <p className="text-zinc-300 text-base md:text-lg leading-relaxed italic mb-8 border-l-4 border-amber-500/30 pl-4 md:pl-6">
              "Trước đây video 1–2 phút của mình chỉ là 1 shot quay, không biết kể chuyện thế nào. Sau khóa học mình làm video như hơi thở — ở đâu, lúc nào cũng làm được. Lượt xem tốt hơn, chuyển đổi trong kinh doanh cũng tốt hơn."
            </p>
            <a 
              href="https://www.tiktok.com/search?q=t%C3%A2ng%20xinh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-2 text-sm group hover:bg-white/5 p-2 -ml-2 rounded-lg transition-colors cursor-pointer"
            >
              <span className="font-bold text-white group-hover:text-amber-400 transition-colors underline decoration-amber-500/40 underline-offset-4">
                Tảng Xinh
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">15 năm làm cộng đồng · Thực phẩm chức năng</span>
              <span className="text-zinc-600 hidden sm:inline">•</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                Học viên Offline K3
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
