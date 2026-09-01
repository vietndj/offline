import React from 'react';
import { content } from '../content';
import { Sparkles, Quote } from 'lucide-react';

export const InstructorSection: React.FC = () => {
  const { instructor } = content;

  return (
    <section id="giang-vien" className="py-20 md:py-28 bg-[#09090b] text-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{instructor.badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-2">
            {instructor.name}
          </h2>
          <p className="font-mono text-sm text-amber-400">
            {instructor.role}
          </p>
        </div>

        {/* Instructor Card */}
        <div className="p-6 sm:p-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Avatar Photo */}
            <div className="md:col-span-4 flex justify-center">
              <div className="w-48 sm:w-56 rounded-2xl overflow-hidden border-2 border-amber-500/40 p-1.5 bg-gradient-to-tr from-amber-500 to-orange-500 shadow-xl">
                <img
                  src={instructor.avatar}
                  alt={instructor.name}
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Bio Content */}
            <div className="md:col-span-8 flex flex-col justify-between">
              <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                {instructor.bio.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Quote Box */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 relative mb-6">
                <Quote className="w-6 h-6 text-amber-500/30 absolute top-2 right-3 pointer-events-none" />
                <p className="text-xs text-amber-200/90 italic font-serif leading-relaxed">
                  "{instructor.quote}"
                </p>
              </div>

              {/* 3 Stats Numbers */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-800 text-center">
                {instructor.stats.map((st, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-zinc-950/40 border border-zinc-800/60">
                    <div className="font-mono text-lg sm:text-xl font-bold text-amber-400">{st.number}</div>
                    <div className="text-[10px] sm:text-[11px] text-zinc-400 font-sans mt-0.5">{st.label}</div>
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
