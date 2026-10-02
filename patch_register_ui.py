import sys

with open('src/sections/RegisterSection.tsx', 'r') as f:
    content = f.read()

target = """            {/* Metadata (Thời gian, Địa điểm, Quy mô) */}
            <div className="space-y-5 mb-8">
              <div className="flex items-start gap-3.5">
                <div className="w-5 h-5 text-red-400 shrink-0 mt-0.5 font-mono">📅</div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono font-bold">
                    {register.meta.time.label}
                  </div>
                  <div className="text-base font-bold text-white">{register.meta.time.value}</div>
                  <div className="text-xs text-zinc-400">{register.meta.time.desc}</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-5 h-5 text-red-400 shrink-0 mt-0.5 font-mono">📍</div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono font-bold">
                    {register.meta.location.label}
                  </div>
                  <div className="text-base font-bold text-white">{register.meta.location.value}</div>
                  <div className="text-xs text-zinc-400">{register.meta.location.desc}</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-5 h-5 text-red-400 shrink-0 mt-0.5 font-mono">👥</div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono font-bold">
                    {register.meta.scale.label}
                  </div>
                  <div className="text-base font-bold text-white">{register.meta.scale.value}</div>
                  <div className="text-xs text-zinc-400">{register.meta.scale.desc}</div>
                </div>
              </div>
            </div>"""

replacement = """            {/* Pricing Packages */}
            <div className="space-y-3 mb-6">
              {/* Standard Price */}
              <div className="p-4 sm:p-5 rounded-2xl border border-orange-500/30 bg-orange-950/10 flex justify-between items-center">
                <div>
                  <div className="text-[11px] font-bold text-orange-500 tracking-wider mb-1 uppercase">{register.pricing.standard.label}</div>
                  <div className="text-3xl sm:text-4xl font-black text-orange-500">{register.pricing.standard.value}</div>
                </div>
                <div className="text-right text-zinc-400 text-xs sm:text-sm flex flex-col items-end">
                  <span>VNĐ</span>
                  <span>{register.pricing.standard.note}</span>
                </div>
              </div>

              {/* Early Bird */}
              <div className="p-4 sm:p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                <div>
                  <div className="text-sm sm:text-base font-bold text-white mb-0.5">{register.pricing.earlyBird.label}</div>
                  <div className="text-xs text-zinc-400">{register.pricing.earlyBird.note}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg sm:text-xl font-bold text-orange-500">{register.pricing.earlyBird.value}</div>
                </div>
              </div>

              {/* Group 2 */}
              <div className="p-4 sm:p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                <div>
                  <div className="text-sm sm:text-base font-bold text-white mb-0.5">{register.pricing.group2.label}</div>
                  <div className="text-xs text-zinc-400">{register.pricing.group2.note}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg sm:text-xl font-bold text-orange-500">{register.pricing.group2.value}</div>
                </div>
              </div>

              {/* Group 3 */}
              <div className="p-4 sm:p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                <div>
                  <div className="text-sm sm:text-base font-bold text-white mb-0.5">{register.pricing.group3.label}</div>
                  <div className="text-xs text-zinc-400">{register.pricing.group3.note}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg sm:text-xl font-bold text-orange-500">{register.pricing.group3.value}</div>
                </div>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/30">
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-500 font-mono font-bold mb-1">
                  {register.meta.time.label}
                </div>
                <div className="text-sm font-bold text-white">{register.meta.time.value}</div>
                {register.meta.time.desc && <div className="text-xs text-zinc-400 mt-0.5">{register.meta.time.desc}</div>}
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/30">
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-500 font-mono font-bold mb-1">
                  {register.meta.location.label}
                </div>
                <div className="text-sm font-bold text-white">{register.meta.location.value}</div>
                {register.meta.location.desc && <div className="text-xs text-zinc-400 mt-0.5">{register.meta.location.desc}</div>}
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/30">
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-500 font-mono font-bold mb-1">
                  {register.meta.duration.label}
                </div>
                <div className="text-sm font-bold text-white">{register.meta.duration.value}</div>
                {register.meta.duration.desc && <div className="text-xs text-zinc-400 mt-0.5">{register.meta.duration.desc}</div>}
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/30">
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-500 font-mono font-bold mb-1">
                  {register.meta.scale.label}
                </div>
                <div className="text-sm font-bold text-orange-500">{register.meta.scale.value}</div>
                {register.meta.scale.desc && <div className="text-xs text-zinc-400 mt-0.5">{register.meta.scale.desc}</div>}
              </div>
            </div>

            {/* Quote Block */}
            <div className="mb-8 p-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 text-center">
              <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                Mỗi ngày bạn chờ, là một ngày <span className="text-orange-500">người khác đang kiếm tiền</span> từ những thứ giống bạn.
              </p>
            </div>"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/sections/RegisterSection.tsx', 'w') as f:
        f.write(content)
    print("Patched UI successfully")
else:
    print("Target not found in UI file")
