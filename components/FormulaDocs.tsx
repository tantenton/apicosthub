'use client';

import React from 'react';
import { BookOpen, Check, Layers, Cpu, Database } from 'lucide-react';

export default function FormulaDocs() {
  return (
    <section id="methodology" className="w-full py-12 border-t border-[#1E2538] bg-[#090B10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-8 pb-4 border-b border-[#1E2538]">
          <div className="flex items-center gap-2 text-xs text-[#94A3B8] font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Technical Methodology</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Unit Economics Calculation Specifications
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl">
            Mathematical formulations and edge-case handling rules implemented across all calculators on APICostHub.
          </p>
        </div>

        {/* 2-Column Documentation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Formula 1: Basic API Cost */}
          <div className="surface-card rounded-xl p-5">
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>1. Standard API Request Invoicing</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed mb-3">
              Standard inference pricing is calculated per million tokens across input and output streams.
            </p>
            <div className="p-3 bg-[#090B10] rounded-lg border border-[#1E2538] text-xs font-mono text-emerald-400 overflow-x-auto">
              Total = (N * [T_in * P_in + T_out * P_out]) / 1,000,000
            </div>
            <div className="mt-3 text-xs text-[#94A3B8] space-y-1">
              <div><strong className="text-[#CBD5E1]">N</strong>: Total monthly request volume</div>
              <div><strong className="text-[#CBD5E1]">T_in / T_out</strong>: Average input and output token counts per call</div>
              <div><strong className="text-[#CBD5E1]">P_in / P_out</strong>: Published provider rates per 1,000,000 tokens</div>
            </div>
          </div>

          {/* Formula 2: Prompt Caching */}
          <div className="surface-card rounded-xl p-5">
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>2. KV-Cache Discounted Cost Model</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed mb-3">
              When prompt caching is active, the input volume splits into cached prefix hits and uncached delta tokens.
            </p>
            <div className="p-3 bg-[#090B10] rounded-lg border border-[#1E2538] text-xs font-mono text-emerald-400 overflow-x-auto">
              Cost_in = (N * T_in * [R_cache * P_cache + (1 - R_cache) * P_in]) / 1,000,000
            </div>
            <div className="mt-3 text-xs text-[#94A3B8] space-y-1">
              <div><strong className="text-[#CBD5E1]">R_cache</strong>: Cached prefix hit ratio (0.0 to 1.0)</div>
              <div><strong className="text-[#CBD5E1]">P_cache</strong>: Provider cache read price ($0.30 for Claude 3.5 Sonnet, $0.014 for DeepSeek V3)</div>
            </div>
          </div>

          {/* Formula 3: Batch Invoicing */}
          <div className="surface-card rounded-xl p-5">
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>3. Batch Queue Processing Discount</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed mb-3">
              OpenAI, Anthropic, and Google offer 50% flat discounts on asynchronous 24-hour turnaround queues.
            </p>
            <div className="p-3 bg-[#090B10] rounded-lg border border-[#1E2538] text-xs font-mono text-emerald-400 overflow-x-auto">
              Cost_batch = (Cost_in + Cost_out) * 0.50
            </div>
            <div className="mt-3 text-xs text-[#94A3B8]">
              Applies to non-realtime offline evals, document parsing, and batch embedding workloads.
            </div>
          </div>

          {/* Formula 4: GPU Breakeven */}
          <div className="surface-card rounded-xl p-5">
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>4. GPU Breakeven Threshold Formulation</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed mb-3">
              Identifies the exact token volume threshold where self-hosted hardware becomes cheaper than cloud APIs.
            </p>
            <div className="p-3 bg-[#090B10] rounded-lg border border-[#1E2538] text-xs font-mono text-emerald-400 overflow-x-auto">
              Breakeven_Tokens = (Hourly_Rate * 730 * Node_Count) / Blended_API_Rate
            </div>
            <div className="mt-3 text-xs text-[#94A3B8]">
              Where Blended_API_Rate assumes a standard 70% input to 30% output distribution.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
