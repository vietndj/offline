import React, { useState } from 'react';
import { CONTENT } from '../content';
import { ChevronDown, HelpCircle, MessageCircle, ArrowRight } from 'lucide-react';

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
          {/* Left Column: Title & Support Callout (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-8 reveal reveal-left">
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

            {/* Zalo Support Action below FAQs */}
            <div className="pt-2">
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-300/80 flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm">
                <div className="flex items-center gap-3.5 text-left w-full md:w-auto">
                  <div className="w-12 h-12 rounded-2xl bg-[#0068ff] flex items-center justify-center text-white shrink-0 shadow-md ring-2 ring-[#0068ff]/20">
                    <span className="font-sans font-black text-xs tracking-tighter">zalo</span>
                  </div>
                  <div>
                    <div className="font-sans font-bold text-zinc-950 text-base sm:text-lg leading-snug">
                      {support.title}
                    </div>
                    <div className="text-xs sm:text-sm text-zinc-600 font-sans mt-0.5 leading-relaxed">
                      {support.subtitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between sm:justify-end">
                  {/* Small QR Code Box for scanning with phone camera */}
                  {support.qrCodeUrl && (
                    <a
                      href={support.zaloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Mở Camera quét mã QR vào chat Zalo"
                      className="flex flex-col items-center group/qr shrink-0"
                    >
                      <div className="p-1.5 bg-white rounded-xl border border-amber-300/90 shadow-sm group-hover/qr:border-[#0068ff] group-hover/qr:shadow-md transition-all duration-200">
                        <img
                          src={support.qrCodeUrl}
                          alt="Mã QR Zalo 0934688632"
                          className="w-16 h-16 sm:w-18 sm:h-18 object-contain rounded-lg"
                        />
                      </div>
                      <span className="text-[10px] font-sans font-semibold text-zinc-500 group-hover/qr:text-[#0068ff] mt-1 tracking-tight transition-colors">
                        {support.qrNote || "Mở Camera quét"}
                      </span>
                    </a>
                  )}

                  {/* Direct Button */}
                  <a
                    href={support.zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0068ff] hover:bg-[#0052cc] text-white font-sans font-bold text-sm shadow-md hover:shadow-lg hover:shadow-[#0068ff]/25 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>{support.buttonText}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
