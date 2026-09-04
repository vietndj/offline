import React from 'react';
import { Video } from 'lucide-react';
import { CONTENT } from '../content';

export const Footer: React.FC = () => {
  const { footer } = CONTENT;

  return (
    <footer className="bg-black border-t border-zinc-800 text-zinc-300 py-16 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-black font-bold">
              <Video className="w-5 h-5 fill-black text-black" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">{footer.brand}</span>
          </div>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
            {footer.description}
          </p>
        </div>

        <div>
          <h4 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-white font-bold mb-4">
            {footer.policyTitle}
          </h4>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
            {footer.policyContent}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-zinc-900 text-center text-xs sm:text-sm text-zinc-400 font-mono">
        {footer.copyright}
      </div>
    </footer>
  );
};
