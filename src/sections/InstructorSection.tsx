import React from 'react';
import { CONTENT } from '../content';
import { Sparkles, Quote } from 'lucide-react';

export const InstructorSection: React.FC = () => {
  const { instructor } = CONTENT;

  const mainRole = instructor.mainRole || instructor.role;
  const subRole = instructor.subRole;

  return (
    <section id="instructor" className="py-24 px-4 bg-[#f8fafc] text-zinc-900 border-y border-zinc-200/80 relative scroll-mt-20">
      <span id="giang-vien" className="absolute -top-24 pointer-events-none" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
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
        <div className="p-6 sm:p-10 md:p-12 rounded-3xl border border-zinc-200/90 bg-white shadow-xl">
          {/* Top Row: Avatar + Bio + Quote */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Avatar Photo */}
            <div className="md:col-span-5 lg:col-span-4 flex justify-center">
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
            <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center">
              <div className="space-y-3.5 text-base sm:text-lg text-zinc-800 leading-relaxed mb-6 font-sans">
                {instructor.bio.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
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
        </div>
      </div>
    </section>
  );
};
