import React from 'react';
import { content } from '../content';
import { Sparkles, Quote } from 'lucide-react';

export const InstructorSection: React.FC = () => {
  const { instructor } = content;

  return (
    <section id="giang-vien" className="py-24 px-4 bg-[#f8fafc] text-zinc-900 border-y border-zinc-200/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-200 bg-amber-50 text-amber-800 text-xs sm:text-sm font-mono font-bold uppercase tracking-widest mb-4 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{instructor.badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#09090b] mb-2 [text-wrap:balance]">
            {instructor.name}
          </h2>
          <p className="font-mono text-base sm:text-lg text-orange-600 font-bold">
            {instructor.role}
          </p>
        </div>

        {/* Instructor Card */}
        <div className="p-8 sm:p-12 rounded-3xl border border-zinc-200 bg-white shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Avatar Photo */}
            <div className="md:col-span-4 flex justify-center">
              <div className="w-52 sm:w-64 rounded-3xl overflow-hidden border-2 border-orange-500/40 p-2 bg-gradient-to-tr from-amber-500 to-orange-500 shadow-xl">
                <img
                  src={instructor.avatar}
                  alt={instructor.name}
                  className="w-full h-full object-cover rounded-2xl"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Bio Content */}
            <div className="md:col-span-8 flex flex-col justify-between">
              <div className="space-y-4 text-base sm:text-lg text-zinc-900 leading-relaxed mb-6 font-sans">
                {instructor.bio.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Quote Box */}
              <div className="p-5 sm:p-6 rounded-2xl border border-amber-200 bg-amber-50 relative mb-6">
                <Quote className="w-8 h-8 text-amber-400 absolute top-3 right-4 pointer-events-none opacity-50" />
                <p className="text-lg sm:text-xl text-amber-950 italic font-serif leading-relaxed font-medium">
                  "{instructor.quote}"
                </p>
              </div>

              {/* Stats Numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-zinc-200 text-center">
                {instructor.stats.map((st, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#f8fafc] border border-zinc-200 shadow-xs">
                    <div className="font-mono text-xl sm:text-2xl font-black text-orange-600">{st.number}</div>
                    <div className="text-xs sm:text-sm text-zinc-900 font-sans font-bold mt-1">{st.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
