import React, { useState, useRef } from 'react';

export function TestimonialSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section className="relative py-20 md:py-28 bg-[#09090b]">
      <div className="max-w-5xl mx-auto px-5">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-bold tracking-wider uppercase">
            ⭐ HỌc viên nói gì
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl md:text-4xl font-black text-center text-white mb-3">
          "2 ngày học rất đã — em tự tin cầm máy rồi"
        </h2>
        <p className="text-center text-zinc-400 text-base md:text-lg max-w-2xl mx-auto mb-10">
          Review thật từ chị Tâng Xinh — ngành Thực phẩm chức năng — học viên Khóa Offline Thực Chiến K3
        </p>

        {/* Video Container */}
        <div className="relative max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/10 border border-zinc-800">
          <div className="aspect-video bg-zinc-900 relative">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              poster="/assets/testimonial/tang-xinh-poster.jpg"
              controls={isPlaying}
              playsInline
              preload="metadata"
            >
              <source src="/assets/testimonial/tang-xinh-review.mp4" type="video/mp4" />
            </video>

            {/* Play Button Overlay */}
            {!isPlaying && (
              <button
                onClick={handlePlay}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 hover:bg-black/30 transition-all group cursor-pointer"
                aria-label="Phát video"
              >
                <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="mt-4 text-white/80 text-sm font-medium">Xem review 2 phút</span>
              </button>
            )}
          </div>
        </div>

        {/* Testimonial Quote Card */}
        <div className="max-w-3xl mx-auto mt-8 bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xl font-bold">
              T
            </div>
            <div>
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed italic">
                "Nhiều kiến thức hay, cần thiết. Thầy giáo nhiệt huyết. Cần phân loại học viên và làm rõ cấu trúc Why-What-How trước mỗi phần để người học dễ theo."
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="font-bold text-white text-sm">Tâng Xinh</span>
                <span className="text-zinc-500 text-xs">•</span>
                <span className="text-zinc-400 text-xs">Thực phẩm chức năng</span>
                <span className="text-zinc-500 text-xs">•</span>
                <span className="text-emerald-400 text-xs font-medium">✅ Học viên K3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
