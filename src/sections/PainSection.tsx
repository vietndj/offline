import React, { useState } from 'react';
import { content } from '../content';
import { Sparkles, CheckCircle2, AlertCircle, Play, X, ExternalLink, Video } from 'lucide-react';

export const PainSection: React.FC = () => {
  const { painPoints } = content;
  const [activeTab, setActiveTab] = useState(painPoints.tabs[0].id);
  const [selectedBrollIndex, setSelectedBrollIndex] = useState(0);
  const [selectedScriptIndex, setSelectedScriptIndex] = useState(0);
  const [selectedLightIndex, setSelectedLightIndex] = useState(0);
  const [selectedProcessIndex, setSelectedProcessIndex] = useState(0);
  const [modalVideo, setModalVideo] = useState<{
    id?: string;
    title: string;
    category?: string;
    videoUrl?: string;
    fbUrl?: string;
  } | null>(null);

  const currentTab = painPoints.tabs.find(t => t.id === activeTab) || painPoints.tabs[0];
  const activeBrollVideo = painPoints.brollVideos[selectedBrollIndex] || painPoints.brollVideos[0];
  const activeScriptVideo = painPoints.scriptVideos[selectedScriptIndex] || painPoints.scriptVideos[0];
  const activeLightVideo = painPoints.lightingVideos[selectedLightIndex] || painPoints.lightingVideos[0];
  const activeProcessVideo = painPoints.processVideos[selectedProcessIndex] || painPoints.processVideos[0];

  return (
    <section id="pain-points" className="py-24 px-4 bg-[#09090b] border-y border-zinc-800/80 text-white relative">
      <div className="max-w-6xl mx-auto px-2 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs sm:text-sm font-mono font-bold uppercase tracking-widest mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{painPoints.badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-4 leading-[1.18] [text-wrap:balance]">
            {painPoints.headline}
          </h2>
          <p className="font-sans text-lg sm:text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto [text-wrap:balance]">
            {painPoints.subheadline}
          </p>
        </div>

        {/* 4 Tabs Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {painPoints.tabs.map((tab, idx) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-5 sm:p-6 rounded-2xl text-left transition-all duration-200 cursor-pointer border flex flex-col justify-between ${
                  isActive
                    ? 'bg-amber-500/20 border-2 border-amber-500 text-white shadow-2xl ring-2 ring-amber-500/40'
                    : 'bg-zinc-900/90 border-zinc-700/80 text-zinc-300 hover:border-zinc-500 hover:text-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`w-8 h-8 rounded-full text-sm font-mono font-black flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-amber-400 text-zinc-950 shadow-md' : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    }`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isActive ? 'text-amber-300' : 'text-zinc-400'}`}>
                      VƯỚNG MẮC 0{idx + 1}
                    </span>
                  </div>
                  <div className={`text-lg sm:text-xl font-sans font-bold leading-snug ${isActive ? 'text-white' : 'text-zinc-100'}`}>
                    {tab.title}
                  </div>
                </div>
                <div className={`text-sm sm:text-base font-sans leading-snug mt-3 pt-3 border-t ${
                  isActive ? 'border-amber-500/30 text-amber-200 font-medium' : 'border-zinc-800 text-zinc-400'
                }`}>
                  {tab.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Detail Content */}
        <div className="p-6 sm:p-10 rounded-3xl border border-zinc-700/80 bg-[#121216] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-amber-400 uppercase tracking-wider mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <span>VƯỚNG MẮC THỰC TẾ & CÁCH THẦY TRÒ CÙNG LÀM</span>
                </div>
                
                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-snug">
                  {currentTab.title}
                </h3>
                
                {/* Empathy Callout Lead Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border-l-4 border-amber-400 text-amber-100 text-base sm:text-lg font-sans font-medium leading-relaxed mb-6">
                  {currentTab.subtitle}
                </div>

                {/* Points List */}
                <div className="space-y-4 my-6">
                  {currentTab.points.map((point, idx) => {
                    const colonIndex = point.indexOf(':');
                    const boldPrefix = colonIndex !== -1 ? point.substring(0, colonIndex + 1) : '';
                    const restText = colonIndex !== -1 ? point.substring(colonIndex + 1) : point;
                    return (
                      <div key={idx} className="flex items-start gap-3.5 text-base sm:text-lg text-zinc-100 font-sans">
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed font-normal">
                          {boldPrefix && <strong className="text-white font-bold">{boldPrefix}</strong>}
                          {restText}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Outcome Box */}
                <div className="p-5 sm:p-6 rounded-2xl border-2 border-emerald-500/40 bg-emerald-950/40 text-emerald-100 text-base sm:text-lg font-sans mb-6 leading-relaxed shadow-lg">
                  ✨ <strong>Cách xử lý tại studio:</strong> {currentTab.outcome.replace(/^Giải pháp:\s*/, '')}
                </div>
              </div>

              {/* 2 Sub-Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-zinc-800">
                {currentTab.cards.map((c, idx) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-2xl border border-zinc-700 bg-zinc-900/90">
                    <div className="font-mono text-base sm:text-lg font-bold text-amber-300 mb-1.5">{c.title}</div>
                    <div className="text-sm sm:text-base text-zinc-200 leading-relaxed font-sans">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Media Preview (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              {activeTab === 'tab-1' ? (
                /* Tab 1: Interactive B-Roll Bank Showcase */
                <div className="w-full max-w-[380px] space-y-4">
                  {/* Active B-Roll Video Card */}
                  <div
                    onClick={() => setModalVideo({
                      id: activeBrollVideo.videoId,
                      title: activeBrollVideo.title,
                      category: 'Kho B-Roll Bank Xử Lý',
                      videoUrl: activeBrollVideo.videoUrl,
                      fbUrl: activeBrollVideo.fbUrl,
                    })}
                    className="relative rounded-3xl overflow-hidden border-2 border-amber-500 bg-zinc-950 shadow-2xl group cursor-pointer aspect-[9/16] flex items-center justify-center ring-2 ring-amber-500/30"
                  >
                    <img
                      src={activeBrollVideo.poster}
                      alt={activeBrollVideo.title}
                      className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 group-hover:from-black/95 transition-all" />

                    {/* Red YouTube Play Button */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-16 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300 ring-4 ring-white/20">
                        <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                      </div>
                      <span className="mt-3 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-amber-300 tracking-wider shadow-lg">
                        BẤM ĐỂ XEM B-ROLL BANK
                      </span>
                    </div>

                    {/* Video Info Bottom */}
                    <div className="absolute bottom-0 inset-x-0 p-4 text-left">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 text-zinc-950 font-mono text-[11px] font-bold uppercase mb-1.5 shadow-sm">
                        <Video className="w-3.5 h-3.5" />
                        <span>B-ROLL BANK 0{selectedBrollIndex + 1}</span>
                      </div>
                      <h4 className="font-sans font-bold text-base text-white leading-snug line-clamp-1">
                        {activeBrollVideo.title}
                      </h4>
                      <p className="font-sans text-xs text-zinc-300 line-clamp-2 mt-1">
                        {activeBrollVideo.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* 3 B-Roll Videos Switcher */}
                  <div className="grid grid-cols-3 gap-2">
                    {painPoints.brollVideos.map((bv, idx) => {
                      const isSelected = idx === selectedBrollIndex;
                      return (
                        <button
                          key={bv.id}
                          onClick={() => setSelectedBrollIndex(idx)}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 text-white ring-1 ring-amber-500/40'
                              : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                          }`}
                        >
                          <div className="w-full h-12 rounded-lg overflow-hidden shrink-0 border border-zinc-700/80 relative">
                            <img src={bv.poster} alt={bv.title} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                                <Play className="w-3 h-3 text-white fill-white" />
                              </div>
                            )}
                          </div>
                          <div className="font-mono text-[10px] font-bold text-amber-300">0{idx + 1}</div>
                          <div className="text-[11px] font-sans font-bold text-zinc-200 truncate w-full leading-tight">
                            {bv.title.replace(' & B-Roll Đè Hình', '').replace('B-Roll ', '').replace('Talking Head & ', '')}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : activeTab === 'tab-2' ? (
                /* Tab 2: Interactive Script & Voice-Over Showcase */
                <div className="w-full max-w-[380px] space-y-4">
                  {/* Active Script Video Card */}
                  <div
                    onClick={() => setModalVideo({
                      id: activeScriptVideo.videoId,
                      title: activeScriptVideo.title,
                      category: 'Trợ Lý AI Viết Kịch Bản Thực Chiến',
                      videoUrl: activeScriptVideo.videoUrl,
                    })}
                    className="relative rounded-3xl overflow-hidden border-2 border-amber-500 bg-zinc-950 shadow-2xl group cursor-pointer aspect-[9/16] flex items-center justify-center ring-2 ring-amber-500/30"
                  >
                    <img
                      src={activeScriptVideo.poster}
                      alt={activeScriptVideo.title}
                      className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 group-hover:from-black/95 transition-all" />

                    {/* Red Play Button */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-16 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300 ring-4 ring-white/20">
                        <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                      </div>
                      <span className="mt-3 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-amber-300 tracking-wider shadow-lg">
                        BẤM XEM AI DEMO
                      </span>
                    </div>

                    {/* Video Info Bottom */}
                    <div className="absolute bottom-0 inset-x-0 p-4 text-left">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 text-zinc-950 font-mono text-[11px] font-bold uppercase mb-1.5 shadow-sm">
                        <Video className="w-3.5 h-3.5" />
                        <span>AI VIẾT KỊCH BẢN 0{selectedScriptIndex + 1}</span>
                      </div>
                      <h4 className="font-sans font-bold text-base text-white leading-snug line-clamp-1">
                        {activeScriptVideo.title}
                      </h4>
                      <p className="font-sans text-xs text-zinc-300 line-clamp-2 mt-1">
                        {activeScriptVideo.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* 3 Script Videos Switcher */}
                  <div className="grid grid-cols-3 gap-2">
                    {painPoints.scriptVideos.map((sv, idx) => {
                      const isSelected = idx === selectedScriptIndex;
                      return (
                        <button
                          key={sv.id}
                          onClick={() => setSelectedScriptIndex(idx)}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 text-white ring-1 ring-amber-500/40'
                              : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                          }`}
                        >
                          <div className="w-full h-12 rounded-lg overflow-hidden shrink-0 border border-zinc-700/80 relative">
                            <img src={sv.poster} alt={sv.title} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                                <Play className="w-3 h-3 text-white fill-white" />
                              </div>
                            )}
                          </div>
                          <div className="font-mono text-[10px] font-bold text-amber-300">0{idx + 1}</div>
                          <div className="text-[11px] font-sans font-bold text-zinc-200 truncate w-full leading-tight">
                            {sv.title.replace('AI Miss ', '').replace(': Lọc Sạch Mùi AI', ' (Lọc Mùi)').replace(': Ngắt Nhịp 3s Đời Thường', ' (Vlog 3s)').replace(': Hook + Body + CTA', ' (Video Ads)')}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : activeTab === 'tab-3' ? (
                /* Tab 3: Interactive 4 Lighting Videos Showcase */
                <div className="w-full max-w-[380px] space-y-4">
                  {/* Active Video Card */}
                  <div
                    onClick={() => setModalVideo({ id: activeLightVideo.videoId, title: activeLightVideo.title, category: 'Thực Hành Setup Ánh Sáng' })}
                    className="relative rounded-3xl overflow-hidden border-2 border-amber-500 bg-zinc-950 shadow-2xl group cursor-pointer aspect-[9/16] flex items-center justify-center ring-2 ring-amber-500/30"
                  >
                    <img
                      src={activeLightVideo.poster}
                      alt={activeLightVideo.title}
                      className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 group-hover:from-black/95 transition-all" />

                    {/* Red YouTube Play Button */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-16 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300 ring-4 ring-white/20">
                        <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                      </div>
                      <span className="mt-3 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-amber-300 tracking-wider shadow-lg">
                        BẤM ĐỂ XEM VIDEO
                      </span>
                    </div>

                    {/* Video Info Bottom */}
                    <div className="absolute bottom-0 inset-x-0 p-4 text-left">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 text-zinc-950 font-mono text-[11px] font-bold uppercase mb-1.5 shadow-sm">
                        <Video className="w-3.5 h-3.5" />
                        <span>VIDEO THỰC CHIẾN 0{selectedLightIndex + 1}</span>
                      </div>
                      <h4 className="font-sans font-bold text-base text-white leading-snug line-clamp-1">
                        {activeLightVideo.title}
                      </h4>
                      <p className="font-sans text-xs text-zinc-300 line-clamp-2 mt-1">
                        {activeLightVideo.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* 4 Lighting Videos Selector Switcher */}
                  <div className="grid grid-cols-2 gap-2">
                    {painPoints.lightingVideos.map((lv, idx) => {
                      const isSelected = idx === selectedLightIndex;
                      return (
                        <button
                          key={lv.id}
                          onClick={() => setSelectedLightIndex(idx)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 text-white ring-1 ring-amber-500/40'
                              : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                          }`}
                        >
                          <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0 border border-zinc-700/80 relative">
                            <img src={lv.poster} alt={lv.title} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                                <Play className="w-3.5 h-3.5 text-white fill-white" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-mono text-[11px] font-bold text-amber-300">0{idx + 1}</div>
                            <div className="text-xs font-sans font-bold text-zinc-200 truncate leading-snug">
                              {lv.title.replace('Setup Ánh Sáng ', '')}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Tab 4: Interactive Process & 2-Cam Showcase */
                <div className="w-full max-w-[380px] space-y-4">
                  {/* Active Process Video Card */}
                  <div
                    onClick={() => setModalVideo({ id: activeProcessVideo.videoId, title: activeProcessVideo.title, category: 'Quy Trình Sản Xuất 1 Buổi/Tuần' })}
                    className="relative rounded-3xl overflow-hidden border-2 border-amber-500 bg-zinc-950 shadow-2xl group cursor-pointer aspect-[9/16] flex items-center justify-center ring-2 ring-amber-500/30"
                  >
                    <img
                      src={activeProcessVideo.poster}
                      alt={activeProcessVideo.title}
                      className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/60 group-hover:from-black/95 transition-all" />

                    {/* Top 5-Step Workflow Overlay */}
                    <div className="absolute top-3 inset-x-3 z-10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md bg-amber-500 text-zinc-950 font-mono text-[11px] font-black tracking-wider uppercase shadow-md">
                          MODULE 1 • QUY TRÌNH 5 BƯỚC
                        </span>
                        <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/20 font-mono text-[10px] text-amber-300 font-bold">
                          1 BUỔI / TUẦN
                        </span>
                      </div>
                      
                      {/* 5-Step Workflow Pills */}
                      <div className="flex items-center justify-between gap-1 px-2 py-1 rounded-xl bg-black/85 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-zinc-200 shadow-lg">
                        <span className="text-amber-300">💡 Ý Tưởng</span>
                        <span className="text-zinc-500">→</span>
                        <span className="text-amber-300">📝 Kịch Bản</span>
                        <span className="text-zinc-500">→</span>
                        <span className="text-amber-300">🎥 Quay</span>
                        <span className="text-zinc-500">→</span>
                        <span className="text-amber-300">✂️ Edit</span>
                        <span className="text-zinc-500">→</span>
                        <span className="text-emerald-400">🚀 Đăng</span>
                      </div>
                    </div>

                    {/* Red YouTube Play Button */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
                      <div className="w-16 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300 ring-4 ring-white/20">
                        <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                      </div>
                      <span className="mt-3 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-amber-300 tracking-wider shadow-lg">
                        BẤM ĐỂ XEM VIDEO
                      </span>
                    </div>

                    {/* Video Info Bottom */}
                    <div className="absolute bottom-0 inset-x-0 p-4 text-left">
                      {/* 3 Core Value Tags */}
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-amber-500/25 border border-amber-500/50 text-[10px] font-mono font-bold text-amber-300">
                          ✓ Quy Trình Rõ Ràng
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/25 border border-emerald-500/50 text-[10px] font-mono font-bold text-emerald-300">
                          ✓ Lịch Đều Đặn
                        </span>
                        <span className="px-2 py-0.5 rounded bg-purple-500/25 border border-purple-500/50 text-[10px] font-mono font-bold text-purple-300">
                          ✓ AI Hỗ Trợ
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 text-zinc-950 font-mono text-[11px] font-bold uppercase mb-1.5 shadow-sm">
                        <Video className="w-3.5 h-3.5" />
                        <span>QUY TRÌNH THỰC CHIẾN 0{selectedProcessIndex + 1}</span>
                      </div>
                      <h4 className="font-sans font-bold text-base text-white leading-snug line-clamp-1">
                        {activeProcessVideo.title}
                      </h4>
                      <p className="font-sans text-xs text-zinc-300 line-clamp-2 mt-1">
                        {activeProcessVideo.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* 3 Process Videos Switcher */}
                  <div className="grid grid-cols-3 gap-2">
                    {painPoints.processVideos.map((pv, idx) => {
                      const isSelected = idx === selectedProcessIndex;
                      return (
                        <button
                          key={pv.id}
                          onClick={() => setSelectedProcessIndex(idx)}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 text-white ring-1 ring-amber-500/40'
                              : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                          }`}
                        >
                          <div className="w-full h-12 rounded-lg overflow-hidden shrink-0 border border-zinc-700/80 relative">
                            <img src={pv.poster} alt={pv.title} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                                <Play className="w-3 h-3 text-white fill-white" />
                              </div>
                            )}
                          </div>
                          <div className="font-mono text-[10px] font-bold text-amber-300">0{idx + 1}</div>
                          <div className="text-[11px] font-sans font-bold text-zinc-200 truncate w-full leading-tight">
                            {pv.title.replace('Quy Trình ', '').replace('Sản Xuất ', '')}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {modalVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setModalVideo(null)}
        >
          <div
            className="relative w-full max-w-sm sm:max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
              <div className="min-w-0 pr-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  {modalVideo.category || 'Thực Hành Video Marketing'}
                </span>
                <h4 className="text-sm font-sans font-bold text-white truncate">
                  {modalVideo.title}
                </h4>
              </div>
              <button
                onClick={() => setModalVideo(null)}
                className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Responsive Video Player */}
            <div className="relative aspect-[9/16] sm:aspect-video w-full bg-black flex items-center justify-center">
              {modalVideo.videoUrl ? (
                <video
                  src={modalVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${modalVideo.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title={modalVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>HD 1080p • Thực hành cùng thầy Việt</span>
              {modalVideo.fbUrl ? (
                <a
                  href={modalVideo.fbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-400 hover:underline"
                >
                  <span>Mở Facebook Reel</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : modalVideo.id && !modalVideo.videoUrl ? (
                <a
                  href={`https://youtu.be/${modalVideo.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-400 hover:underline"
                >
                  <span>Mở YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-amber-400/90 font-medium">Trợ Lý AI Độc Quyền</span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
