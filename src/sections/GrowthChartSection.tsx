import React from 'react';
import { content } from '../content';
import { TrendingUp, CheckCircle, XCircle } from 'lucide-react';

export const GrowthChartSection: React.FC = () => {
  const { chart } = content;

  // Custom SVG Area Chart Data Points
  // Data: normal: [18, 20, 30, 35, 48, 52], marketing: [20, 28, 64, 56, 75, 90]
  const width = 800;
  const height = 300;
  const padding = 40;

  const pointsNormal = chart.data.map((d, i) => {
    const x = padding + (i * (width - 2 * padding)) / (chart.data.length - 1);
    const y = height - padding - (d.normal / 100) * (height - 2 * padding);
    return { x, y, val: d.normal, month: d.month };
  });

  const pointsMarketing = chart.data.map((d, i) => {
    const x = padding + (i * (width - 2 * padding)) / (chart.data.length - 1);
    const y = height - padding - (d.marketing / 100) * (height - 2 * padding);
    return { x, y, val: d.marketing, month: d.month };
  });

  const pathNormal = pointsNormal.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const pathMarketing = pointsMarketing.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

  const areaMarketing = `${pathMarketing} L ${pointsMarketing[pointsMarketing.length - 1].x} ${height - padding} L ${pointsMarketing[0].x} ${height - padding} Z`;

  return (
    <section id="growth" className="py-24 px-4 bg-[#09090b] border-t border-zinc-800/80 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-widest uppercase mb-4">
            <TrendingUp className="w-3.5 h-3.5" />
            {chart.badge}
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-medium text-white mb-6 tracking-tight leading-tight">
            {chart.headline}
          </h2>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
            {chart.description}
          </p>
        </div>

        {/* Interactive Chart Container */}
        <div className="bg-zinc-900/90 rounded-3xl p-6 md:p-10 border border-zinc-800 mb-16 shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-6 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-400">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50" />
                <span className="font-semibold">Video Marketing Thực Chiến (Tăng trưởng X10)</span>
              </div>
              <div className="flex items-center gap-2 text-orange-400">
                <div className="w-3 h-3 rounded-full bg-orange-500/80" />
                <span>Video Tự Phát (Bản Năng)</span>
              </div>
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              Đơn vị: Chỉ số hiệu quả tổng hợp (%)
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[650px]">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                <defs>
                  <linearGradient id="marketingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid horizontal lines */}
                {[0, 25, 50, 75, 100].map((level) => {
                  const y = height - padding - (level / 100) * (height - 2 * padding);
                  return (
                    <g key={level}>
                      <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#27272a" strokeDasharray="3 3" />
                      <text x={padding - 10} y={y + 4} fill="#71717a" fontSize="10" textAnchor="end" fontFamily="monospace">
                        {level}%
                      </text>
                    </g>
                  );
                })}

                {/* Area under Marketing curve */}
                <path d={areaMarketing} fill="url(#marketingGradient)" />

                {/* Lines */}
                <path d={pathNormal} fill="none" stroke="#f97316" strokeWidth="2.5" strokeDasharray="4 4" />
                <path d={pathMarketing} fill="none" stroke="#10b981" strokeWidth="3.5" />

                {/* Marketing Points */}
                {pointsMarketing.map((p, i) => (
                  <g key={`m-${i}`} className="group">
                    <circle cx={p.x} cy={p.y} r="5" fill="#10b981" stroke="#09090b" strokeWidth="2" className="transition-all group-hover:r-7" />
                    <text x={p.x} y={p.y - 12} fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {p.val}%
                    </text>
                    <text x={p.x} y={height - padding + 20} fill="#a1a1aa" fontSize="11" textAnchor="middle" fontFamily="monospace">
                      {p.month}
                    </text>
                  </g>
                ))}

                {/* Normal Points */}
                {pointsNormal.map((p, i) => (
                  <circle key={`n-${i}`} cx={p.x} cy={p.y} r="4" fill="#f97316" stroke="#09090b" strokeWidth="2" />
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* 3 Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {chart.bullets.map((b, idx) => (
            <div key={idx} className="bg-zinc-900/60 rounded-2xl p-6 border border-zinc-800/80 flex flex-col justify-between">
              <div>
                <h4 className="text-base font-semibold text-white mb-4">
                  {b.title}
                </h4>
                <div className="space-y-3 text-xs mb-4">
                  <div className="flex items-start gap-2 text-rose-300 bg-rose-950/30 p-3 rounded-xl border border-rose-900/30">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span><strong>Tự làm:</strong> {b.normal}</span>
                  </div>
                  <div className="flex items-start gap-2 text-emerald-300 bg-emerald-950/30 p-3 rounded-xl border border-emerald-900/30">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Có cấu trúc:</strong> {b.marketing}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
