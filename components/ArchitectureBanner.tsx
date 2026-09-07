'use client';

import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Cpu, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ArchitectureBanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);

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

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="w-full max-w-7xl px-4 sm:px-6 my-10">
      <div className="surface-card rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              <span>Multi-Tier Neural Routing Architecture</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Slash Inference OPEX by Up to <span className="text-indigo-600">82%</span> with Cascading Model Fallbacks
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              Production systems do not route every user request to expensive frontier models. High-efficiency architectures use deterministic classifiers to handle 70% of routine queries on sub-cent models like DeepSeek V3 or Gemini 1.5 Flash, escalating only high-complexity reasoning steps to Claude 3.5 Sonnet or o1.
            </p>

            {/* Architecture Highlights Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Prompt KV-Caching</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Cut TTFT by 40% and save up to 90% on repeated system prompts.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Batch Inference</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Offload asynchronous background tasks with guaranteed 50% discount.
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#pareto"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all hover:-translate-y-0.5"
              >
                <span>Explore Pareto Frontier Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Video Showcase Column */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg relative group">
              {/* HTML5 Native Looping Video */}
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto aspect-video object-cover"
              >
                <source src="/videos/neural-routing-light.webm" type="video/webm" />
                <source src="/videos/neural-routing-light.mp4" type="video/mp4" />
                Your browser does not support HTML5 video streaming.
              </video>

              {/* Video Floating Action Bar */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 text-xs shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-[11px] font-semibold text-slate-700">
                    Live Circuit Simulation (720p 30fps)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
