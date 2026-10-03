import React, { useState } from 'react';
import { CONTENT } from '../content';
import { Sparkles, Quote, ChevronDown, ShieldCheck } from 'lucide-react';

export const InstructorSection: React.FC = () => {
  const { instructor, proof } = CONTENT;
  const [bioExpanded, setBioExpanded] = useState(false);
  const [proofOpen, setProofOpen] = useState(false);

  const mainRole = instructor.mainRole || instructor.role;
  const subRole = instructor.subRole;

  // Màu chữ số theo variant của reportCard (gộp từ ProofSection)
  const statColor = (variant: 'normal' | 'amber' | 'emerald') =>
    variant === 'amber' ? 'text-amber-600' : variant === 'emerald' ? 'text-emerald-600' : 'text-zinc-900';

  return (
    <section id="instructor" className="py-24 px-4 bg-[#f8fafc] text-zinc-900 border-y border-zinc-200/80 relative scroll-mt-20">
      <span id="giang-vien" className="absolute -top-24 pointer-events-none" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 reveal reveal-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-300/80 bg-amber-100/60 text-amber-900 text-xs sm:text-sm font-mono font-bold uppercase tracking-widest mb-4 shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{instructor.badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#09090b] mb-3 [text-wrap:balance]">
            {instructor.name}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-2xl mx-auto">
            <span className="font-sans text-base sm:text-lg md:text-xl text-orange-600 font-semibold leading-snug text-center [text-wrap:balance]">
              {mainRole}
            </span>
            {subRole && (
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs sm:text-sm font-bold bg-orange-100 text-orange-800 border border-orange-200/80 whitespace-nowrap shadow-2xs">
                {subRole}
              </span>
            )}
          </div>
        </div>

        {/* Instructor Card */}
        <div className="p-6 sm:p-10 md:p-12 rounded-3xl border border-zinc-200/90 bg-white shadow-xl reveal reveal-scale delay-100">
          {/* Top Row: Avatar + Bio + Quote */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Avatar Photo */}
            <div className="md:col-span-5 lg:col-span-4 flex justify-center reveal reveal-left delay-150">
              <div className="w-56 sm:w-64 md:w-full max-w-[280px] aspect-square rounded-3xl overflow-hidden border-2 border-orange-500/40 p-2 bg-gradient-to-tr from-amber-500 to-orange-500 shadow-xl">
                <img
                  src={instructor.avatar}
                  alt={instructor.name}
                  className="w-full h-full object-cover rounded-2xl"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Bio Content & Quote */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center reveal reveal-right delay-200">
              <div className="space-y-3.5 text-base sm:text-lg text-zinc-800 leading-relaxed mb-6 font-sans">
                {instructor.bio.map((p, idx) => (
                  <p key={idx} className={idx > 0 && !bioExpanded ? 'hidden md:block' : ''}>
                    {p}
                  </p>
                ))}
                {instructor.bio.length > 1 && !bioExpanded && (
                  <button
                    type="button"
                    onClick={() => setBioExpanded(true)}
                    className="md:hidden inline-flex items-center gap-1 text-sm font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                  >
                    Đọc thêm
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quote Box */}
              <div className="p-5 sm:p-6 rounded-2xl border border-amber-200/90 bg-amber-50/70 relative">
                <Quote className="w-8 h-8 text-amber-500/30 absolute top-3 right-4 pointer-events-none" />
                <p className="text-base sm:text-lg text-amber-950 italic font-serif leading-relaxed font-medium">
                  "{instructor.quote}"
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Row: 4 Stats Numbers - Full Width Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-8 border-t border-zinc-200 text-center">
            {instructor.stats.map((st, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-[#f8fafc] border border-zinc-200/90 shadow-2xs flex flex-col items-center justify-center hover:border-orange-300 hover:bg-orange-50/30 hover:shadow-sm transition-all duration-200"
              >
                <div className="font-sans text-2xl sm:text-3xl lg:text-4xl font-black text-orange-600 whitespace-nowrap tracking-tight">
                  {st.number}
                </div>
                <div className="text-xs sm:text-sm text-zinc-700 font-sans font-bold mt-1.5 leading-snug [text-wrap:balance]">
                  {st.label}
                </div>
              </div>
            ))}
          </div>

          {/* Proof Block (gộp từ ProofSection): Số liệu đối soát từ Meta Business Suite */}
          <div className="mt-8 pt-8 border-t border-zinc-200">
            <div className="flex items-center justify-center gap-2 mb-4 text-center">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
              <h3 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-zinc-700">
                Số liệu đối soát từ Meta Business Suite
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              {proof.reportCard.stats.map((st, idx) => (
                <div
                  key={idx}
                  className="px-1.5 py-3 sm:p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col items-center justify-center"
                >
                  <div className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    {st.label}
                  </div>
                  <div className={`font-sans text-lg sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight sm:whitespace-nowrap ${statColor(st.variant)}`}>
                    {st.value}
                  </div>
                  <div className="text-[10px] sm:text-xs font-sans font-semibold text-emerald-700 mt-1 leading-snug">
                    {st.growth}
                  </div>
                </div>
              ))}
            </div>

            {/* Toggle ảnh đối soát */}
            {proof.tabs.length > 0 && (
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={() => setProofOpen((v) => !v)}
                  aria-expanded={proofOpen}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-zinc-300 bg-white hover:border-orange-400 hover:text-orange-700 text-sm font-bold text-zinc-700 transition-colors cursor-pointer"
                >
                  <span>{proofOpen ? 'Thu gọn ảnh đối soát' : 'Xem ảnh đối soát'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${proofOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}

            {proofOpen && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                {proof.tabs.map((tab) => (
                  <figure
                    key={tab.id}
                    className="rounded-2xl overflow-hidden border border-zinc-200/90 bg-white shadow-2xs flex flex-col"
                  >
                    <a href={tab.image} target="_blank" rel="noopener noreferrer" className="block bg-zinc-100">
                      <img
                        src={tab.image}
                        alt={tab.title}
                        loading="lazy"
                        className="w-full h-auto object-contain"
                      />
                    </a>
                    <figcaption className="p-3.5">
                      <div className="text-sm font-bold text-zinc-900 leading-snug mb-1">{tab.title}</div>
                      <div className="text-xs text-zinc-600 leading-relaxed">{tab.caption}</div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
