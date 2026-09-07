'use client';

import React from 'react';
import { BookOpen, CheckCircle, HelpCircle, Code2, Terminal } from 'lucide-react';

export default function FormulaDocs() {
  return (
    <section className="w-full max-w-7xl px-4 sm:px-6 my-10">
      <div className="surface-card rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Open Methodology
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Mathematical Pricing Formulas & Accounting Rules
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mb-8 max-w-2xl">
          We use standardized GAAP-compliant unit economics to model blended token pricing, KV-cache amortization, and SLA-based batch discounting.
        </p>

        {/* Formulas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Formula 1 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-900 block">
              1. Blended Per-Request Cost
            </span>
            <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono text-[11px] text-indigo-700 leading-relaxed overflow-x-auto shadow-2xs">
              Cost = (I_tokens * P_in + O_tokens * P_out) / 1,000,000
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Accounts for separate input and output token pricing tariffs across all major cloud model providers.
            </p>
          </div>

          {/* Formula 2 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-900 block">
              2. Prompt Cache Amortization
            </span>
            <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono text-[11px] text-emerald-700 leading-relaxed overflow-x-auto shadow-2xs">
              P_eff = (1 - C_rate) * P_in + (C_rate * P_cached)
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Calculates the effective input cost factoring in Anthropic, OpenAI, and DeepSeek prefix cache hit rates.
            </p>
          </div>

          {/* Formula 3 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-900 block">
              3. GPU vs Cloud Breakeven
            </span>
            <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono text-[11px] text-indigo-700 leading-relaxed overflow-x-auto shadow-2xs">
              V_break = Monthly_GPU_TCO / Blended_API_PerToken
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Calculates minimum volume where cluster rent and 20% operational overhead beat hosted API pricing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
