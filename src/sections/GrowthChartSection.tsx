import React from 'react';
import { content } from '../content';
import { TrendingUp, CheckCircle, XCircle, AlertCircle, Clock, Sparkles, ExternalLink } from 'lucide-react';

export const GrowthChartSection: React.FC = () => {
  const { chart } = content;

  // Custom SVG Audience Retention Curve Data Points (Meta & Nielsen Benchmark)
  const width = 800;
  const height = 320;
  const padding = 50;

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
    <section id="growth" className="py-24 px-4 bg-[#0c0d10] border-y border-zinc-800/80 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-5xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-widest uppercase mb-4 shadow-xs">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{chart.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-white mb-4 tracking-tight leading-[1.18] [text-wrap:balance]">
            {chart.headline}
          </h2>
          <p className="text-zinc-300 text-base md:text-lg leading-relaxed [text-wrap:balance] max-w-3xl mx-auto mb-8">
            {chart.description}
          </p>

          {/* 3 Tách khối trực quan UX: Nỗi đau -> Nút thắt -> Giải pháp */}
          {chart.insights && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mt-8">
              {chart.insights.map((item, idx) => {
                const isPain = item.type === 'pain';
                const isCause = item.type === 'cause';
                return (
                  <div
                    key={idx}
                    className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                      isPain
                        ? 'bg-rose-950/20 border-rose-800/40 hover:border-rose-700/60 shadow-lg shadow-rose-950/20'
                        : isCause
                        ? 'bg-amber-950/20 border-amber-800/40 hover:border-amber-700/60 shadow-lg shadow-amber-950/20'
                        : 'bg-emerald-950/20 border-emerald-800/40 hover:border-emerald-700/60 shadow-lg shadow-emerald-950/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                          isPain
                            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                            : isCause
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        }`}
                      >
                        {item.tag}
                      </span>
                      {isPain ? (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      ) : isCause ? (
                        <Clock className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Interactive Chart Container */}
        <div className="bg-zinc-900/90 rounded-3xl p-6 md:p-10 border border-zinc-800 mb-16 shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-6 text-xs sm:text-sm font-mono">
              <div className="flex items-center gap-2 text-emerald-400">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50" />
                <span className="font-bold">Video Marketing Thực Chiến (Cấu trúc nén nhịp)</span>
              </div>
              <div className="flex items-center gap-2 text-orange-400">
                <div className="w-3 h-3 rounded-full bg-orange-500/80" />
                <span className="font-semibold">Video Tự Phát (Bản năng mở đầu lan man)</span>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-zinc-400 font-mono">
              Đơn vị: Tỷ lệ khán giả còn ở lại trên timeline (%)
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
                      <text x={padding - 10} y={y + 4} fill="#a1a1aa" fontSize="12" textAnchor="end" fontFamily="monospace">
                        {level}%
                      </text>
                    </g>
                  );
                })}

                {/* Vertical milestone indicator lines */}
                <line x1={pointsMarketing[1].x} y1={padding} x2={pointsMarketing[1].x} y2={height - padding} stroke="#10b981" strokeOpacity="0.25" strokeDasharray="3 3" />
                <line x1={pointsMarketing[2].x} y1={padding} x2={pointsMarketing[2].x} y2={height - padding} stroke="#10b981" strokeOpacity="0.25" strokeDasharray="3 3" />

                {/* Area under Marketing curve */}
                <path d={areaMarketing} fill="url(#marketingGradient)" />

                {/* Lines */}
                <path d={pathNormal} fill="none" stroke="#f97316" strokeWidth="2.5" strokeDasharray="4 4" />
                <path d={pathMarketing} fill="none" stroke="#10b981" strokeWidth="3.5" />

                {/* Normal Points */}
                {pointsNormal.map((p, i) => (
                  <g key={`n-${i}`} className="group">
                    <circle cx={p.x} cy={p.y} r="4.5" fill="#f97316" stroke="#09090b" strokeWidth="2" />
                    {i > 0 && (
                      <text x={p.x} y={p.y + 16} fill="#fb923c" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        {p.val}%
                      </text>
                    )}
                  </g>
                ))}

                {/* Marketing Points */}
                {pointsMarketing.map((p, i) => (
                  <g key={`m-${i}`} className="group">
                    <circle cx={p.x} cy={p.y} r="5.5" fill="#10b981" stroke="#09090b" strokeWidth="2" className="transition-all group-hover:r-7" />
                    <text x={p.x} y={p.y - 12} fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {p.val}%
                    </text>
                    <text x={p.x} y={height - padding + 22} fill="#e4e4e7" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {p.month}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Verified Research Citation Banner */}
          {chart.source && (
            <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm font-mono">
              <div className="flex items-center gap-2.5 text-zinc-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse shrink-0" />
                <span>Nguồn kiểm chứng: <strong className="text-white">{chart.source.label}</strong> • <em>{chart.source.studyName}</em></span>
              </div>
              <a
                href={chart.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold hover:underline transition-all px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 shadow-sm hover:bg-emerald-500/20 shrink-0"
              >
                <span>Xem báo cáo gốc trên Meta</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* 3 Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {chart.bullets.map((b, idx) => (
            <div key={idx} className="bg-zinc-900/80 rounded-2xl p-6 sm:p-7 border border-zinc-700/80 flex flex-col justify-between">
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-white mb-4">
                  {b.title}
                </h4>
                <div className="space-y-3.5 text-sm sm:text-base mb-4 font-sans">
                  <div className="flex items-start gap-2.5 text-rose-200 bg-rose-950/40 p-3.5 rounded-xl border border-rose-900/40">
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <span><strong>Tự làm:</strong> {b.normal}</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-emerald-200 bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-900/40">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
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

