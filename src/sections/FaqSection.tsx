import React, { useState } from 'react';
import { CONTENT } from '../content';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { faqSection, site } = CONTENT;
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  const support = faqSection.supportBox || {
    title: "Bạn vẫn còn câu hỏi khác?",
    subtitle: "Nhắn tin Zalo trực tiếp cho Thầy Việt để được hỗ trợ 1-1 ngay.",
    buttonText: "Nhắn Zalo: 0934.688.632",
    zaloUrl: site?.zaloUrl || "https://zalo.me/0934688632"
  };

  return (
    <section id="faq" className="py-24 px-4 bg-white text-zinc-900 border-y border-zinc-200/80 relative">
      <div className="max-w-6xl mx-auto px-2 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Title & Subtle Support (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6 reveal reveal-left">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-300 bg-amber-50 text-amber-900 text-xs sm:text-sm font-mono font-bold uppercase tracking-widest mb-4 shadow-xs">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>{faqSection.badge}</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#09090b] mb-4 leading-[1.18] [text-wrap:balance]">
                {faqSection.headline}
              </h2>
              <p className="font-sans text-base sm:text-lg text-zinc-700 leading-relaxed [text-wrap:balance]">
                {faqSection.description}
              </p>
            </div>

            {/* Compact Subtle Grey Zalo Card */}
            <div className="pt-1">
              <div className="inline-flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-zinc-100/90 border border-zinc-200/80 shadow-2xs max-w-sm">
                <img
                  src={support.avatarUrl || "/assets/viet_avatar.png"}
                  alt="Thầy Việt"
                  className="w-10 h-10 rounded-full object-cover border border-zinc-300 shadow-2xs shrink-0"
                />
                <div className="text-left min-w-0 pr-1">
                  <div className="text-[12px] font-sans font-medium text-zinc-700 leading-tight">
                    {support.title || "Bạn có thắc mắc riêng?"}
                  </div>
                  <a
                    href={support.zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-sans text-zinc-500 hover:text-zinc-900 transition-colors inline-flex items-center gap-1 mt-0.5"
                  >
                    <span>Nhắn Zalo: <span className="font-semibold text-zinc-700">{support.phone || "0934.688.632"}</span></span>
                    <ArrowRight className="w-3 h-3 text-zinc-400" />
                  </a>
                </div>

                {/* Small QR Code to scan with camera/photo */}
                {support.qrCodeUrl && (
                  <div className="flex items-center pl-2.5 border-l border-zinc-200 shrink-0">
                    <a
                      href={support.zaloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Mở camera quét mã QR vào chat Zalo"
                      className="flex items-center gap-1.5 group cursor-pointer"
                    >
                      <img
                        src={support.qrCodeUrl}
                        alt="Mã QR Zalo 0934688632"
                        className="w-8 h-8 rounded-md border border-zinc-200 bg-white p-0.5 object-contain"
                      />
                      <span className="text-[9px] text-zinc-600 font-sans leading-tight hidden xs:inline">
                        Quét ảnh<br />vào chat
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Numbered Accordion List (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 reveal reveal-right delay-100">
            {faqSection.items.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-amber-500/90 bg-amber-50/50 shadow-md ring-1 ring-amber-500/30'
                      : 'border-zinc-200 bg-[#f8fafc] hover:border-zinc-300 hover:bg-white'
                  }`}
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-start gap-3.5">
                      <span
                        className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isOpen
                            ? 'bg-amber-500 text-zinc-950 font-black'
                            : 'bg-zinc-200 text-zinc-700 font-bold'
                        }`}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="font-sans font-bold text-[#09090b] text-base sm:text-lg md:text-xl leading-snug">
                        {faq.q}
                      </span>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isOpen
                          ? 'bg-amber-500 text-zinc-950 rotate-180'
                          : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-base sm:text-lg text-zinc-900 leading-relaxed border-t border-amber-200 font-sans pl-[58px]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
