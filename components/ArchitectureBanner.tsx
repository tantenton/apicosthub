'use client';

import React, { useRef, useState } from 'react';
import { Layers, Database, Cpu, ShieldCheck, Zap, Play, Pause, Volume2, VolumeX, Eye } from 'lucide-react';

export default function ArchitectureBanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section className="mb-14 rounded-2xl border border-white/10 surface-card overflow-hidden shadow-2xl relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
        {/* Left Column: Technical Narrative */}
        <div className="p-6 sm:p-8 lg:col-span-7 z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Production Strategy
            </span>
            <span className="text-xs text-slate-400">Unit Economics Framework</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-tight">
            How High-Scale Engineering Teams Reduce LLM Spend by 70%
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed max-w-xl">
            Production systems avoid routing every prompt directly to flagship models. They apply multi-tier request routing, prompt caching, and batch endpoints to control costs.
          </p>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
                <Database className="w-3.5 h-3.5" /> 1. KV-Cache Prefix Reuse
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Persist static system instructions and RAG documents in cache. Lowers input costs by 75% to 90% on Anthropic and DeepSeek.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
                <Layers className="w-3.5 h-3.5" /> 2. Model Tier Cascading
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Route classification and extraction tasks to DeepSeek V3 ($0.14/1M) or Gemini 2.0 Flash ($0.10/1M). Escalate complex reasoning as needed.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 3. Asynchronous Batch APIs
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Use 24-hour batch processing queues for non-realtime background evaluation runs to get standard 50% discounts.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold mb-1">
                <Cpu className="w-3.5 h-3.5" /> 4. Dedicated GPU Breakeven
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Deploy open weights (Llama 3.3 70B, DeepSeek R1) on rented GPU clusters once monthly volume exceeds the 350M token threshold.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: HTML5 Video Visual Render */}
        <div className="lg:col-span-5 relative h-72 sm:h-80 lg:h-full min-h-[360px] bg-[#08090a] border-t lg:border-t-0 lg:border-l border-white/10 flex items-center justify-center overflow-hidden group">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
            poster="/images/hero-architecture.png"
          >
            <source src="/videos/neural-routing.webm" type="video/webm" />
            <source src="/videos/neural-routing.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-gradient-to-t from-[#08090a] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#08090a] lg:via-transparent lg:to-transparent pointer-events-none" />

          {/* Floating Video Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
            <div className="bg-[#08090a]/90 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 shadow-xl text-xs text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span>HTML5 Neural Routing Loop</span>
            </div>

            <button
              onClick={togglePlay}
              className="bg-[#08090a]/90 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-lg p-2 text-slate-300 hover:text-white transition-colors"
              title={isPlaying ? 'Pause Video' : 'Play Video'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
