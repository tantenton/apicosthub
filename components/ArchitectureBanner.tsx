'use client';

import React from 'react';
import Image from 'next/image';
import { Layers, Database, Cpu, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function ArchitectureBanner() {
  return (
    <section className="mb-14 rounded-xl border border-[#1E2638] bg-[#0E121B] overflow-hidden shadow-2xl relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
        {/* Left Column: Technical Narrative */}
        <div className="p-6 sm:p-8 lg:col-span-7 z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Production Architecture
            </span>
            <span className="text-xs text-[#64748B] font-mono">End-to-End Pipeline</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-tight">
            How Top AI Teams Cut 70%+ of LLM Cloud Invoices
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-2.5 leading-relaxed max-w-xl">
            Modern high-scale applications rarely send raw prompts directly to flagship frontier models. They implement a multi-tier token routing topology to preserve margin without degrading response quality.
          </p>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <div className="p-3 rounded-lg bg-[#080A0F]/80 border border-[#1E2638]">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold mb-1">
                <Database className="w-3.5 h-3.5" /> 1. KV-Cache Prefix Reuse
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-normal">
                Persist system prompts and RAG documentation chunks. Reduces input cost by 75% to 90% on Anthropic and DeepSeek.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#080A0F]/80 border border-[#1E2638]">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold mb-1">
                <Layers className="w-3.5 h-3.5" /> 2. Model Tier Cascading
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-normal">
                Route 80% classification and extraction traffic to DeepSeek V3 ($0.14/1M) or Gemini 2.0 Flash ($0.10/1M). Escalate only edge cases.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#080A0F]/80 border border-[#1E2638]">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 3. Asynchronous Batch APIs
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-normal">
                Utilize 24-hour batch endpoints for background evaluations and embeddings to instantly unlock flat 50% pricing discounts.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#080A0F]/80 border border-[#1E2638]">
              <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-semibold mb-1">
                <Cpu className="w-3.5 h-3.5" /> 4. Dedicated GPU Breakeven
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-normal">
                Self-host open-weights (Llama 3.3 70B, DeepSeek R1) on rented RunPod H100 clusters once monthly volume exceeds ~350M tokens.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Visual Render from 9Router */}
        <div className="lg:col-span-5 relative h-72 sm:h-80 lg:h-full min-h-[340px] bg-[#080A0F] border-t lg:border-t-0 lg:border-l border-[#1E2638] flex items-center justify-center overflow-hidden group">
          <Image
            src="/images/hero-architecture.png"
            alt="AI LLM Gateway Architecture Visualization"
            fill
            className="object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E121B] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#0E121B] lg:via-transparent lg:to-transparent pointer-events-none" />

          {/* Floating Badge on Graphic */}
          <div className="absolute bottom-4 right-4 bg-[#080A0F]/90 backdrop-blur-md border border-emerald-500/40 rounded-lg px-3 py-1.5 shadow-xl font-mono text-[10px] text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Gateway Topology
          </div>
        </div>
      </div>
    </section>
  );
}
