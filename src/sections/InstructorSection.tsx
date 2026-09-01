import React from 'react';
import { content } from '../content';

export const InstructorSection: React.FC = () => {
  return (
    <section id="giang-vien" className="py-16 md:py-24 bg-[#09090b] text-white border-t border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-amber-400 block mb-2">
            NGƯỜI ĐỒNG HÀNH TRỰC TIẾP
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white">
            Giảng Viên: Thầy Nguyễn Đức Việt
          </h2>
          <p className="text-xs sm:text-sm text-white/60 mt-2 font-mono">
            {content.instructor.title} · {content.instructor.role}
          </p>
        </div>

        {/* Instructor Card */}
        <div className="p-6 sm:p-10 rounded-2xl bg-[#111113] border border-white/15 shadow-2xl">
          <div className="space-y-4 text-xs sm:text-sm text-white/80 leading-relaxed mb-8">
            {content.instructor.bio.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Core values */}
          <div className="mb-8">
            <span className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider block mb-3">
              Kinh Nghiệm Thực Chiến Đúc Kết Được:
            </span>
            <ul className="space-y-2.5">
              {content.instructor.coreValues.map((v, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/85">
                  <span className="text-amber-400 font-bold shrink-0 mt-0.5 font-mono">▶</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quote */}
          <div className="p-4 sm:p-5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs sm:text-sm text-amber-300 italic leading-relaxed">
            "{content.instructor.quote}"
          </div>
        </div>
      </div>
    </section>
  );
};
