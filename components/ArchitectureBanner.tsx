'use client';

import React from 'react';
import Image from 'next/image';
import { Layers, Database, Cpu, ShieldCheck, Zap } from 'lucide-react';

export default function ArchitectureBanner() {
  return (
    <section className="mb-14 rounded-xl border border-[#1E2538] surface-card overflow-hidden shadow-2xl relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
        {/* Left Column: Technical Narrative */}
        <div className="p-6 sm:p-8 lg:col-span-7 z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded text-xs font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Production Strategy
            </span>
            <span className="text-xs text-[#94A3B8]">Unit Economics Framework</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-tight">
            How High-Scale Engineering Teams Reduce LLM Spend by 70%
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-2.5 leading-relaxed max-w-xl">
            Production systems avoid routing every prompt directly to flagship models. They apply multi-tier request routing, prompt caching, and batch endpoints to control costs.
          </p>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <div className="p-3.5 rounded-lg bg-[#090B10] border border-[#1E2538]">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                <Database className="w-3.5 h-3.5" /> 1. KV-Cache Prefix Reuse
              </div>
              <p className="text-xs text-[#94A3B8] leading-normal">
                Persist static system instructions and RAG documents in cache. Lowers input costs by 75% to 90% on Anthropic and DeepSeek.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#090B10] border border-[#1E2538]">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
                <Layers className="w-3.5 h-3.5" /> 2. Model Tier Cascading
              </div>
              <p className="text-xs text-[#94A3B8] leading-normal">
                Route classification and extraction tasks to DeepSeek V3 ($0.14/1M) or Gemini 2.0 Flash ($0.10/1M). Escalate complex reasoning as needed.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#090B10] border border-[#1E2538]">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 3. Asynchronous Batch APIs
              </div>
              <p className="text-xs text-[#94A3B8] leading-normal">
                Use 24-hour batch processing queues for non-realtime background evaluation runs to get standard 50% discounts.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#090B10] border border-[#1E2538]">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold mb-1">
                <Cpu className="w-3.5 h-3.5" /> 4. Dedicated GPU Breakeven
              </div>
              <p className="text-xs text-[#94A3B8] leading-normal">
                Deploy open weights (Llama 3.3 70B, DeepSeek R1) on rented GPU clusters once monthly volume exceeds the 350M token threshold.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Render */}
        <div className="lg:col-span-5 relative h-72 sm:h-80 lg:h-full min-h-[340px] bg-[#090B10] border-t lg:border-t-0 lg:border-l border-[#1E2538] flex items-center justify-center overflow-hidden group">
          <Image
            src="/images/hero-architecture.png"
            alt="AI LLM Gateway Architecture Visualization"
            fill
            className="object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111520] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#111520] lg:via-transparent lg:to-transparent pointer-events-none" />

          {/* Badge */}
          <div className="absolute bottom-4 right-4 bg-[#090B10]/95 border border-[#1E2538] rounded-lg px-3 py-1.5 shadow-xl text-xs text-[#CBD5E1] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Gateway Routing Topology</span>
          </div>
        </div>
      </div>
    </section>
  );
}
