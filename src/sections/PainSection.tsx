import React, { useState } from 'react';
import { CONTENT } from '../content';
import { Sparkles, CheckCircle2, AlertCircle, Play, X, ExternalLink, Video } from 'lucide-react';

export const PainSection: React.FC = () => {
  const { painPoints } = CONTENT;
  const [activeTab, setActiveTab] = useState(painPoints.tabs?.[0]?.id || '');
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
    youtubeUrl?: string;
  } | null>(null);

  const currentTab = painPoints.tabs.find(t => t.id === activeTab) || painPoints.tabs?.[0] || {
    id: '',
    title: '',
    subtitle: '',
    points: [],
    outcome: '',
    media: '',
    cards: []
  };
  const activeBrollVideo = painPoints.brollVideos[selectedBrollIndex] || painPoints.brollVideos?.[0] || {
    id: '',
    title: '',
    subtitle: '',
    shortTitle: '',
    poster: '',
    desc: ''
  };
  const activeScriptVideo = painPoints.scriptVideos[selectedScriptIndex] || painPoints.scriptVideos?.[0] || {
    id: '',
    title: '',
    subtitle: '',
    shortTitle: '',
    poster: '',
    videoId: '',
    youtubeUrl: ''
  };
  const activeLightVideo = painPoints.lightingVideos[selectedLightIndex] || painPoints.lightingVideos?.[0] || {
    id: '',
    title: '',
    subtitle: '',
    shortTitle: '',
    poster: '',
    videoId: '',
    youtubeUrl: ''
  };
  const activeProcessVideo = painPoints.processVideos[selectedProcessIndex] || painPoints.processVideos?.[0] || {
    id: '',
    title: '',
    subtitle: '',
    shortTitle: '',
    poster: '',
    videoId: '',
    youtubeUrl: ''
  };

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
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`p-5 sm:p-6 rounded-2xl text-left cursor-pointer border-2 flex flex-col justify-between outline-none focus:outline-none focus-visible:outline-none transition-colors duration-150 select-none ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-500 text-white shadow-xl shadow-amber-500/10'
                    : 'bg-zinc-900/90 border-zinc-700/80 text-zinc-300 hover:border-zinc-500 hover:text-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`w-8 h-8 rounded-full text-sm font-mono font-black flex items-center justify-center shrink-0 border transition-colors duration-150 ${
                      isActive
                        ? 'bg-amber-400 text-zinc-950 border-amber-400 shadow-md'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                    }`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-xs font-mono font-bold uppercase tracking-wider transition-colors duration-150 ${isActive ? 'text-amber-300' : 'text-zinc-400'}`}>
                      {painPoints.tabPrefix}0{idx + 1}
                    </span>
                  </div>
                  <div className={`text-lg sm:text-xl font-sans font-bold leading-snug transition-colors duration-150 ${isActive ? 'text-white' : 'text-zinc-100'}`}>
                    {tab.title}
                  </div>
                </div>
                <div className={`text-sm sm:text-base font-sans leading-snug mt-3 pt-3 border-t transition-colors duration-150 ${
                  isActive ? 'border-amber-500/30 text-amber-200' : 'border-zinc-800 text-zinc-400'
                }`}>
                  {tab.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Detail Content */}
        <div className="p-6 sm:p-10 rounded-3xl border border-zinc-700/80 bg-[#121216] shadow-2xl min-h-[560px]">
          <div key={activeTab} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-amber-400 uppercase tracking-wider mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <span>{painPoints.sectionTag}</span>
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
                  {painPoints.outcomePrefix} <strong>{currentTab?.outcome || ''}</strong>
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
                      category: painPoints.ui.brollCategory,
                      videoUrl: activeBrollVideo.videoUrl,
                      fbUrl: activeBrollVideo.fbUrl,
                      youtubeUrl: activeBrollVideo.youtubeUrl,
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
                        {painPoints.ui.playBrollText}
                      </span>
                    </div>

                    {/* Video Info Bottom */}
                    <div className="absolute bottom-0 inset-x-0 p-4 text-left">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 text-zinc-950 font-mono text-[11px] font-bold uppercase mb-1.5 shadow-sm">
                        <Video className="w-3.5 h-3.5" />
                        <span>{painPoints.ui.brollBadgePrefix}{selectedBrollIndex + 1}</span>
                      </div>
                      <h4 className="font-sans font-bold text-base text-white leading-snug line-clamp-1">
                        {activeBrollVideo.title}
                      </h4>
                      <p className="font-sans text-xs text-zinc-300 line-clamp-2 mt-1">
                        {activeBrollVideo.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* 2 B-Roll Videos Switcher */}
                  <div className="grid grid-cols-2 gap-2">
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
                            {bv.shortTitle}
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
                      category: painPoints.ui.scriptCategory,
                      videoUrl: activeScriptVideo.videoUrl,
                      youtubeUrl: activeScriptVideo.youtubeUrl,
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
                        {painPoints.ui.playScriptText}
                      </span>
                    </div>

                    {/* Video Info Bottom */}
                    <div className="absolute bottom-0 inset-x-0 p-4 text-left">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 text-zinc-950 font-mono text-[11px] font-bold uppercase mb-1.5 shadow-sm">
                        <Video className="w-3.5 h-3.5" />
                        <span>{painPoints.ui.scriptBadgePrefix}{selectedScriptIndex + 1}</span>
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
                            {sv.shortTitle}
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
                    onClick={() => setModalVideo({
                      id: activeLightVideo.videoId,
                      title: activeLightVideo.title,
                      category: painPoints.ui.lightingCategory,
                      youtubeUrl: activeLightVideo.youtubeUrl,
                    })}
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
                        {painPoints.ui.playLightingText}
                      </span>
                    </div>

                    {/* Video Info Bottom */}
                    <div className="absolute bottom-0 inset-x-0 p-4 text-left">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 text-zinc-950 font-mono text-[11px] font-bold uppercase mb-1.5 shadow-sm">
                        <Video className="w-3.5 h-3.5" />
                        <span>{painPoints.ui.lightingBadgePrefix}{selectedLightIndex + 1}</span>
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
                              {lv.shortTitle}
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
                    onClick={() => setModalVideo({
                      id: activeProcessVideo.videoId,
                      title: activeProcessVideo.title,
                      category: painPoints.ui.processCategory,
                      videoUrl: activeProcessVideo.videoUrl,
                      youtubeUrl: activeProcessVideo.youtubeUrl,
                    })}
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
                          {painPoints.tab4Overlays.moduleBadge}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/20 font-mono text-[10px] text-amber-300 font-bold">
                          {painPoints.tab4Overlays.cadenceBadge}
                        </span>
                      </div>
                      
                      {/* 5-Step Workflow Pills */}
                      <div className="flex items-center justify-between gap-1 px-2 py-1 rounded-xl bg-black/85 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-zinc-200 shadow-lg">
                        {painPoints.tab4Overlays.workflowPills.map((pill, pIdx) => (
                          <React.Fragment key={pIdx}>
                            <span className={pIdx === painPoints.tab4Overlays.workflowPills.length - 1 ? 'text-emerald-400' : 'text-amber-300'}>
                              {pill}
                            </span>
                            {pIdx < painPoints.tab4Overlays.workflowPills.length - 1 && (
                              <span className="text-zinc-500">→</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Red YouTube Play Button */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
                      <div className="w-16 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300 ring-4 ring-white/20">
                        <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                      </div>
                      <span className="mt-3 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-amber-300 tracking-wider shadow-lg">
                        {painPoints.ui.playProcessText}
                      </span>
                    </div>

                    {/* Video Info Bottom */}
                    <div className="absolute bottom-0 inset-x-0 p-4 text-left">
                      {/* 3 Core Value Tags */}
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        {painPoints.tab4Overlays.valueTags.map((vTag, vtIdx) => (
                          <span
                            key={vtIdx}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                              vtIdx === 0
                                ? 'bg-amber-500/25 border-amber-500/50 text-amber-300'
                                : vtIdx === 1
                                ? 'bg-emerald-500/25 border-emerald-500/50 text-emerald-300'
                                : 'bg-purple-500/25 border-purple-500/50 text-purple-300'
                            }`}
                          >
                            {vTag}
                          </span>
                        ))}
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 text-zinc-950 font-mono text-[11px] font-bold uppercase mb-1.5 shadow-sm">
                        <Video className="w-3.5 h-3.5" />
                        <span>{painPoints.ui.processBadgePrefix}{selectedProcessIndex + 1}</span>
                      </div>
                      <h4 className="font-sans font-bold text-base text-white leading-snug line-clamp-1">
                        {activeProcessVideo.title}
                      </h4>
                      <p className="font-sans text-xs text-zinc-300 line-clamp-2 mt-1">
                        {activeProcessVideo.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* 2 Process Videos Switcher */}
                  <div className="grid grid-cols-2 gap-2">
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
                            {pv.shortTitle}
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
                  {modalVideo.category || painPoints.ui.brollCategory}
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
              <span>{painPoints.ui.modalQualityBadge}</span>
              {modalVideo.fbUrl ? (
                <a
                  href={modalVideo.fbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-400 hover:underline"
                >
                  <span>{painPoints.ui.openFbReelText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : modalVideo.youtubeUrl ? (
                <a
                  href={modalVideo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-400 hover:underline"
                >
                  <span>{painPoints.ui.openYoutubeText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : modalVideo.id && !modalVideo.videoUrl ? (
                <a
                  href={`https://youtu.be/${modalVideo.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-400 hover:underline"
                >
                  <span>{painPoints.ui.openYoutubeText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-amber-400/90 font-medium">{painPoints.ui.aiBadgeText}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
