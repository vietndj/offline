import React, { useEffect } from 'react';
import { CheckCircle, Calendar, MapPin, Users, ArrowLeft } from 'lucide-react';
import { CONTENT } from '../content';
import { trackPurchase } from '../utils/pixel';

interface SuccessPageProps {
  onBackHome: () => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ onBackHome }) => {
  const { successPage } = CONTENT;

  useEffect(() => {
    trackPurchase();
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-zinc-900/90 rounded-3xl p-8 md:p-12 border border-zinc-800 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-400 shadow-lg shadow-emerald-500/10">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-widest uppercase mb-4">
          {successPage.badge}
        </div>

        <h1 className="text-2xl md:text-4xl font-serif font-medium text-white mb-4 tracking-tight">
          {successPage.headline}
        </h1>

        <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-8">
          {successPage.description}
        </p>

        <div className="bg-black/60 rounded-2xl p-6 border border-zinc-800/80 text-left space-y-4 mb-8 text-xs md:text-sm">
          <div className="flex items-center gap-3 text-zinc-300">
            <Calendar className="w-4 h-4 text-orange-400 shrink-0" />
            <span>
              {successPage.summary.time.label}
              <strong>{successPage.summary.time.value}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3 text-zinc-300">
            <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
            <span>
              {successPage.summary.location.label}
              <strong>{successPage.summary.location.value}</strong>
              {successPage.summary.location.note}
            </span>
          </div>
          <div className="flex items-center gap-3 text-zinc-300">
            <Users className="w-4 h-4 text-orange-400 shrink-0" />
            <span>
              {successPage.summary.scale.label}
              <strong>{successPage.summary.scale.value}</strong>
            </span>
          </div>
        </div>

        <button
          onClick={onBackHome}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs border border-zinc-700 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{successPage.backHomeCta}</span>
        </button>
      </div>
    </div>
  );
};
