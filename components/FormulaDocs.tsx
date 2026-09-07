'use client';

import React from 'react';
import { BookOpen, Check, Layers, Cpu, Database } from 'lucide-react';

export default function FormulaDocs() {
  return (
    <section id="methodology" className="w-full py-12 border-t border-white/10 bg-[#08090a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Technical Methodology</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
            Unit Economics Calculation Specifications
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Mathematical formulations and edge-case handling rules implemented across all calculators on APICostHub.
          </p>
        </div>

        {/* 2-Column Documentation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Formula 1: Basic API Cost */}
          <div className="surface-card rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>1. Standard API Request Invoicing</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Standard inference pricing is calculated per million tokens across input and output streams.
            </p>
            <div className="p-3.5 bg-[#08090a] rounded-xl border border-white/10 text-xs font-mono text-indigo-400 overflow-x-auto">
              Total = (N * [T_in * P_in + T_out * P_out]) / 1,000,000
            </div>
            <div className="mt-3 text-xs text-slate-400 space-y-1">
              <div><strong className="text-slate-200">N</strong>: Total monthly request volume</div>
              <div><strong className="text-slate-200">T_in / T_out</strong>: Average input and output token counts per call</div>
              <div><strong className="text-slate-200">P_in / P_out</strong>: Published provider rates per 1,000,000 tokens</div>
            </div>
          </div>

          {/* Formula 2: Prompt Caching */}
          <div className="surface-card rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
              <Database className="w-4 h-4 text-indigo-400" />
              <span>2. KV-Cache Discounted Cost Model</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              When prompt caching is active, the input volume splits into cached prefix hits and uncached delta tokens.
            </p>
            <div className="p-3.5 bg-[#08090a] rounded-xl border border-white/10 text-xs font-mono text-indigo-400 overflow-x-auto">
              Cost_in = (N * T_in * [R_cache * P_cache + (1 - R_cache) * P_in]) / 1,000,000
            </div>
            <div className="mt-3 text-xs text-slate-400 space-y-1">
              <div><strong className="text-slate-200">R_cache</strong>: Cached prefix hit ratio (0.0 to 1.0)</div>
              <div><strong className="text-slate-200">P_cache</strong>: Discounted cached input rate per 1M tokens</div>
            </div>
          </div>

          {/* Formula 3: Asynchronous Batch Discount */}
          <div className="surface-card rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>3. Asynchronous Batch Queue Model</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              OpenAI, Anthropic, and Google offer a flat 50% discount for requests submitted to non-realtime batch queues with 24h turnaround.
            </p>
            <div className="p-3.5 bg-[#08090a] rounded-xl border border-white/10 text-xs font-mono text-indigo-400 overflow-x-auto">
              Cost_batch = (Cost_in + Cost_out) * 0.50
            </div>
            <div className="mt-3 text-xs text-slate-400">
              Applies to background indexing, bulk synthetic data creation, and dataset evaluations.
            </div>
          </div>

          {/* Formula 4: GPU Breakeven */}
          <div className="surface-card rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
              <Check className="w-4 h-4 text-indigo-400" />
              <span>4. Hardware Breakeven Formulation</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Breakeven token throughput indicates the monthly point where renting bare-metal or cloud GPU instances matches API spend.
            </p>
            <div className="p-3.5 bg-[#08090a] rounded-xl border border-white/10 text-xs font-mono text-indigo-400 overflow-x-auto">
              Breakeven_Tokens = (HourlyRate * 730) / BlendedCostPerToken
            </div>
            <div className="mt-3 text-xs text-slate-400">
              Assumes 70/30 input/output token ratio with 730 running hours per calendar month.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
