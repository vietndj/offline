import React, { useState } from 'react';
import { content } from '../content';
import { TrendingUp, CheckCircle2, XCircle } from 'lucide-react';

export const GrowthChartSection: React.FC = () => {
  const { chart } = content;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Chart coordinates mapping (Width: 600, Height: 260)
  const maxVal = 100;
  const pointsMarketing = chart.data.map((d, i) => ({
    x: 50 + (i * 100),
    y: 220 - ((d.marketing / maxVal) * 180),
    val: d.marketing,
    month: d.month
  }));

  const pointsNormal = chart.data.map((d, i) => ({
    x: 50 + (i * 100),
    y: 220 - ((d.normal / maxVal) * 180),
    val: d.normal,
    month: d.month
  }));

  const pathMarketing = `M ${pointsMarketing.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const pathNormal = `M ${pointsNormal.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const areaMarketing = `M ${pointsMarketing[0].x},220 L ${pointsMarketing.map(p => `${p.x},${p.y}`).join(' L ')} L ${pointsMarketing[pointsMarketing.length - 1].x},220 Z`;

  return (
    <section className="py-20 md:py-28 bg-[#09090b] text-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{chart.badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-5 leading-[1.2]">
            {chart.headline}
          </h2>
          <p className="font-sans text-sm sm:text-base text-zinc-300 leading-relaxed">
            {chart.description}
          </p>
        </div>

        {/* SVG Interactive Area Chart */}
        <div className="p-5 sm:p-7 rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-xl mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800 mb-6">
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400/50" />
                <span className="font-semibold">Video Marketing FEDU (Tăng trưởng X10)</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-500">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm shadow-amber-500/50" />
                <span>Video tự phát thông thường</span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">Đơn vị: Chỉ số chuyển đổi & Doanh thu</span>
          </div>

          {/* SVG Chart Container */}
          <div className="w-full overflow-x-auto">
            <svg viewBox="0 0 600 250" className="w-full h-auto min-w-[500px]">
              <defs>
                <linearGradient id="marketingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[40, 100, 160, 220].map((y, idx) => (
                <line key={idx} x1="40" y1={y} x2="560" y2={y} stroke="#27272a" strokeDasharray="3 3" />
              ))}

              {/* Marketing Fill Area */}
              <path d={areaMarketing} fill="url(#marketingGrad)" />

              {/* Lines */}
              <path d={pathNormal} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 4" />
              <path d={pathMarketing} fill="none" stroke="#10b981" strokeWidth="3" />

              {/* Points */}
              {pointsNormal.map((p, idx) => (
                <circle key={`norm-${idx}`} cx={p.x} cy={p.y} r="4" fill="#f59e0b" />
              ))}
              {pointsMarketing.map((p, idx) => (
                <g key={`mkt-${idx}`} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)}>
                  <circle cx={p.x} cy={p.y} r={hoveredIdx === idx ? "7" : "5"} fill="#10b981" stroke="#09090b" strokeWidth="2" />
                  <text x={p.x} y={p.y - 12} textAnchor="middle" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    {p.val}
                  </text>
                </g>
              ))}

              {/* X Axis Labels */}
              {chart.data.map((d, idx) => (
                <text key={`lbl-${idx}`} x={50 + (idx * 100)} y="240" textAnchor="middle" fill="#a1a1aa" fontSize="11" fontFamily="monospace">
                  {d.month}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* 2-Column Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {chart.bullets.map((b, idx) => (
            <div key={idx} className="p-4.5 rounded-xl border border-zinc-800 bg-zinc-900/50 flex flex-col justify-between">
              <h4 className="font-sans font-semibold text-white text-sm mb-3.5 border-b border-zinc-800 pb-2">
                {b.title}
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2 text-zinc-400 bg-red-500/5 p-2.5 rounded-lg border border-red-500/10">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span><strong>Tự phát:</strong> {b.normal}</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-200 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>FEDU:</strong> {b.marketing}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
