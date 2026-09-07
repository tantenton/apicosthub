'use client';

import React, { useState } from 'react';
import { AI_MODELS, AIModel } from '../data/models';
import { Sparkles, Info, ArrowUpRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ParetoMatrixChart() {
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);

  // Quality score estimation (MMLU-Pro / Arena ELO proxy)
  const getQualityScore = (model: AIModel): number => {
    switch (model.id) {
      case 'gpt-6-astra': return 100;
      case 'claude-fable-5-1': return 100;
      case 'claude-opus-5': return 99;
      case 'claude-sonnet-5': return 98;
      case 'gemini-3-1-pro': return 97;
      case 'deepseek-v4-pro': return 96;
      case 'grok-4-6': return 95;
      case 'gemini-3-8-flash': return 94;
      case 'gpt-5-6-terra-pro': return 93;
      case 'mistral-medium-3-5': return 91;
      case 'llama-4-maverick': return 90;
      case 'grok-4-20': return 89;
      case 'devstral-2': return 88;
      case 'gemini-3-5-flash-lite': return 87;
      case 'gpt-5-6-luna': return 86;
      case 'llama-4-scout': return 85;
      case 'deepseek-v4-flash': return 84;
      default: return 75;
    }
  };

  // Blended price per 1M (3:1 input:output)
  const getBlendedPrice = (model: AIModel): number => {
    return (model.inputPricePerMillion * 3 + model.outputPricePerMillion) / 4;
  };

  const chartData = AI_MODELS.map((m) => ({
    model: m,
    score: getQualityScore(m),
    price: getBlendedPrice(m),
  }));

  // Min/Max for plotting
  const minScore = 75;
  const maxScore = 100;
  const minPrice = 0.1;
  const maxPrice = 16.0;

  return (
    <section id="pareto" className="w-full max-w-7xl px-4 sm:px-6 my-10">
      <div className="surface-card rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Frontier Intelligence vs Cost Curve</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pareto Frontier Efficiency Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Identify the highest intelligence yield per dollar spent across 16 frontier models.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Pareto Dominant (Best Value)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              <span>Standard Frontier</span>
            </div>
          </div>
        </div>

        {/* Matrix Plot Container */}
        <div className="relative mt-8 w-full h-[420px] bg-white rounded-2xl border border-slate-200 p-6 overflow-hidden">
          {/* Subtle Grid Lines */}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border-r border-b border-slate-100" />
            ))}
          </div>

          {/* Quadrant Watermark Labels */}
          <div className="absolute top-4 left-6 pointer-events-none">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600/80 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Pareto Frontier · High Intelligence & Low Cost
            </span>
          </div>

          <div className="absolute top-4 right-6 pointer-events-none">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600/80 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
              Heavy Frontier Reasoning
            </span>
          </div>

          {/* Scatter Points */}
          <div className="relative w-full h-full">
            {chartData.map(({ model, score, price }) => {
              // Normalized X (log scale for price 0.1 to 16)
              const logMin = Math.log10(minPrice);
              const logMax = Math.log10(maxPrice);
              const logPrice = Math.log10(Math.max(price, minPrice));
              const leftPercent = Math.min(94, Math.max(6, ((logPrice - logMin) / (logMax - logMin)) * 100));

              // Normalized Y (linear for score 75 to 100)
              const topPercent = Math.min(92, Math.max(8, 100 - ((score - minScore) / (maxScore - minScore)) * 100));

              const isSweetSpot = model.id === 'deepseek-v4-flash' || model.id === 'llama-4-maverick' || model.id === 'gemini-3-8-flash';

              return (
                <div
                  key={model.id}
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                  onClick={() => setSelectedModel(model)}
                >
                  {/* Point Ring & Glow */}
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-transform group-hover:scale-150 ${
                      isSweetSpot
                        ? 'bg-emerald-500 shadow-md ring-4 ring-emerald-200'
                        : 'bg-indigo-600 shadow-sm ring-2 ring-indigo-200'
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>

                  {/* Label */}
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] font-bold text-slate-800 bg-white/90 px-1.5 py-0.5 rounded shadow-xs border border-slate-200 pointer-events-none group-hover:border-indigo-400 group-hover:text-indigo-600 transition-colors">
                    {model.name}
                  </span>

                  {/* Hover Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2.5 rounded-xl bg-slate-900 text-white text-xs whitespace-nowrap shadow-xl z-30 pointer-events-none">
                    <div className="font-bold text-white mb-0.5">{model.name}</div>
                    <div className="text-[11px] text-slate-300">
                      Blended: <span className="font-mono text-emerald-400 font-bold">${price.toFixed(2)}/1M</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Intelligence Index: <span className="font-mono font-bold text-indigo-300">{score}/100</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom X-Axis Guide */}
          <div className="absolute bottom-2 left-6 right-6 flex justify-between text-[10px] text-slate-400 font-mono pointer-events-none border-t border-slate-100 pt-1">
            <span>$0.10 / 1M (Ultra Cheap)</span>
            <span>$1.00 / 1M</span>
            <span>$5.00 / 1M</span>
            <span>$15.00+ / 1M (Frontier)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
