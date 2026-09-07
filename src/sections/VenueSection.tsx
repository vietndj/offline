import React, { useRef } from 'react';
import { 
  MapPin, 
  Coffee, 
  Utensils, 
  Flame, 
  Bed, 
  Baby, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { CONTENT } from '../content';

interface VenueSectionProps {
  onOpenRegister?: () => void;
}

export const VenueSection: React.FC<VenueSectionProps> = () => {
  const { venue } = CONTENT;
  const perksScrollRef = useRef<HTMLDivElement>(null);
  const galleryScrollRef = useRef<HTMLDivElement>(null);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const renderPerkIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-amber-400" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-emerald-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'Bed':
        return <Bed className="w-5 h-5 text-sky-400" />;
      case 'Baby':
        return <Baby className="w-5 h-5 text-rose-400" />;
      default:
        return <MapPin className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <section id="dia-diem" className="py-20 px-4 bg-[#09090b] text-white border-y border-zinc-800/80 relative scroll-mt-20 overflow-hidden">
      {/* Nền ánh sáng nhẹ */}
      <div className="absolute top-1/3 -left-48 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-48 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-2 sm:px-4 relative z-10">
        
        {/* Header ngắn gọn, đi thẳng vào việc (Đã LỌC theo phong cách anh Việt) */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-mono font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{venue.badge}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-[42px] font-medium tracking-tight text-white mb-3 leading-[1.25]">
            {venue.headline}
          </h2>

          <p className="font-sans text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto mb-4">
            {venue.description}
          </p>

          <p className="text-sm sm:text-base text-zinc-400 italic">
            ({venue.note})
          </p>
        </div>

        {/* Cụm 1: Các Thẻ Tiện Ích Hàng Ngang Có Scroll (Mỗi thẻ có 1 ảnh đắt giá, ghép khách sạn vào thẻ) */}
        <div className="mb-16">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
              <h3 className="font-sans text-lg sm:text-xl font-bold text-white tracking-tight">
                Tiện ích phục vụ suốt 2 ngày học
              </h3>
            </div>
            
            {/* Nút điều hướng cuộn ngang */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollContainer(perksScrollRef, 'left')}
                className="w-9 h-9 rounded-full bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/80 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
                aria-label="Cuộn sang trái"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollContainer(perksScrollRef, 'right')}
                className="w-9 h-9 rounded-full bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/80 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
                aria-label="Cuộn sang phải"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dải trượt ngang 5 thẻ tiện ích */}
          <div
            ref={perksScrollRef}
            className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'thin' }}
          >
            {venue.perks.map((perk) => {
              const isHotel = perk.id === 'hotel-stay';
              const isBbq = perk.id === 'dinner-bbq';

              return (
                <div
                  key={perk.id}
                  className={`min-w-[300px] sm:min-w-[340px] md:min-w-[360px] max-w-[360px] flex-shrink-0 snap-start rounded-3xl border transition-all duration-300 flex flex-col overflow-hidden bg-zinc-900/90 ${
                    isHotel 
                      ? 'border-sky-500/40 shadow-lg shadow-sky-950/20' 
                      : isBbq
                      ? 'border-orange-500/40 shadow-lg shadow-orange-950/20'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {/* Ảnh đắt giá của từng thẻ */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
                    <img
                      src={perk.image}
                      alt={perk.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Tag góc trên ảnh */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-black/80 backdrop-blur-md border border-white/10 text-white shadow-sm">
                        {renderPerkIcon(perk.icon)}
                        <span>{perk.tag}</span>
                      </span>
                    </div>

                    {/* Badge phụ hoặc Giá phòng nổi bật */}
                    {perk.priceBadge && (
                      <div className="absolute bottom-3 right-3">
                        <span className="px-3 py-1 rounded-xl text-xs sm:text-sm font-bold font-mono bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 backdrop-blur-md shadow-md">
                          {perk.priceBadge}
                        </span>
                      </div>
                    )}
                    {perk.highlight && (
                      <div className="absolute bottom-3 right-3">
                        <span className="px-2.5 py-1 rounded-xl text-xs font-bold font-mono bg-orange-950/90 border border-orange-500/50 text-orange-300 backdrop-blur-md shadow-md">
                          {perk.highlight}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Nội dung text: Font >= 16px, BỐ CỤC ngắt dòng thoáng */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-sans text-xl font-bold text-white mb-3 leading-snug">
                        {perk.title}
                      </h4>
                      <p className="font-sans text-base sm:text-[17px] text-zinc-200 leading-relaxed">
                        {perk.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cụm 2: Góc Ảnh Thực Tế Không Gian Khóa Học (Hàng ngang có cuộn chuột) */}
        <div>
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="font-sans text-lg sm:text-xl font-bold text-white tracking-tight">
                {venue.galleryTitle}
              </h3>
              <p className="text-sm sm:text-base text-zinc-400 font-sans mt-0.5">
                {venue.gallerySubtitle}
              </p>
            </div>

            {/* Nút điều hướng cuộn ngang */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollContainer(galleryScrollRef, 'left')}
                className="w-9 h-9 rounded-full bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/80 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
                aria-label="Cuộn ảnh sang trái"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollContainer(galleryScrollRef, 'right')}
                className="w-9 h-9 rounded-full bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/80 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
                aria-label="Cuộn ảnh sang phải"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dải trượt ngang Gallery ảnh thực tế */}
          <div
            ref={galleryScrollRef}
            className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'thin' }}
          >
            {venue.gallery.map((item, idx) => (
              <div
                key={idx}
                className="min-w-[280px] sm:min-w-[320px] md:min-w-[340px] max-w-[340px] flex-shrink-0 snap-start rounded-3xl border border-zinc-800 bg-zinc-900/80 overflow-hidden flex flex-col hover:border-zinc-700 transition-all group"
              >
                {/* Khung ảnh */}
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-zinc-950">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-black/80 backdrop-blur-md border border-white/10 text-zinc-200">
                      {item.tag}
                    </span>
                  </div>
                </div>

                {/* Chú thích ảnh: Font >= 16px */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <h4 className="font-sans text-base sm:text-lg font-bold text-white mb-1.5 leading-snug">
                    {item.title}
                  </h4>
                  <p className="font-sans text-sm sm:text-base text-zinc-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
