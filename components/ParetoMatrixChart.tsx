'use client';

import React, { useState } from 'react';
import { AI_MODELS, AIModel } from '../data/models';
import { Sparkles, Info, ArrowUpRight, TrendingUp, BarChart2, Shield, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getProviderLogo } from './ProviderLogos';
import { formatTokens } from '../lib/calculator';

type ParetoMetric = 'sweBench' | 'arenaElo' | 'mmluPro';

export default function ParetoMatrixChart() {
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [activeMetric, setActiveMetric] = useState<ParetoMetric>('sweBench');

  // Quality score based on active metric
  const getScore = (model: AIModel): number => {
    const b = model.benchmarks;
    if (activeMetric === 'sweBench') {
      return b?.sweBenchVerified || 45;
    } else if (activeMetric === 'arenaElo') {
      return b?.arenaElo || 1300;
    } else {
      return b?.mmluPro || 75;
    }
  };

  // Blended price per 1M (3:1 input:output ratio)
  const getBlendedPrice = (model: AIModel): number => {
    return (model.inputPricePerMillion * 3 + model.outputPricePerMillion) / 4;
  };

  const chartData = AI_MODELS.map((m) => ({
    model: m,
    score: getScore(m),
    price: getBlendedPrice(m),
  }));

  // Min/Max for plotting depending on metric
  let minScore = 25;
  let maxScore = 88;
  let metricUnit = '%';
  let metricLabel = 'SWE-bench Verified';

  if (activeMetric === 'arenaElo') {
    minScore = 1240;
    maxScore = 1460;
    metricUnit = ' Elo';
    metricLabel = 'Chatbot Arena Elo';
  } else if (activeMetric === 'mmluPro') {
    minScore = 65;
    maxScore = 95;
    metricUnit = '%';
    metricLabel = 'MMLU-Pro Accuracy';
  }

  const minPrice = 0.08;
  const maxPrice = 18.0;

  return (
    <section id="pareto" className="w-full max-w-7xl px-4 sm:px-6 my-10">
      <div className="surface-card rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Frontier Intelligence vs Cost Curve</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pareto Frontier Efficiency Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Identify the highest intelligence yield per dollar spent across {AI_MODELS.length} frontier and workhorse models.
            </p>
          </div>

          {/* Metric Selector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-semibold text-slate-400 mr-1">Metric:</span>
            {(
              [
                { id: 'sweBench', label: 'SWE-bench Verified' },
                { id: 'arenaElo', label: 'Arena Elo' },
                { id: 'mmluPro', label: 'MMLU-Pro' },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMetric(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeMetric === m.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Plot Container */}
        <div className="relative mt-8 w-full h-[460px] bg-white rounded-2xl border border-slate-200 p-6 overflow-hidden">
          {/* Subtle Grid Lines */}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border-r border-b border-slate-100" />
            ))}
          </div>

          {/* Quadrant Watermark Labels */}
          <div className="absolute top-4 left-6 pointer-events-none z-0">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Pareto Sweet Spot (High Yield / Low Cost)
            </span>
          </div>

          <div className="absolute top-4 right-6 pointer-events-none z-0">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
              Ultra Frontier Reasoning
            </span>
          </div>

          {/* Scatter Points */}
          <div className="relative w-full h-full">
            {chartData.map(({ model, score, price }) => {
              // Normalized X (log scale for price 0.08 to 18)
              const logMin = Math.log10(minPrice);
              const logMax = Math.log10(maxPrice);
              const logPrice = Math.log10(Math.max(price, minPrice));
              const leftPercent = Math.min(94, Math.max(6, ((logPrice - logMin) / (logMax - logMin)) * 100));

              // Normalized Y (linear for score)
              const topPercent = Math.min(90, Math.max(10, 100 - ((score - minScore) / (maxScore - minScore)) * 100));

              const isSweetSpot = 
                model.id === 'deepseek-v4-flash' || 
                model.id === 'llama-4-maverick' || 
                model.id === 'gemini-3-8-flash' ||
                model.id === 'claude-sonnet-5';

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
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] font-bold text-slate-800 bg-white/95 px-1.5 py-0.5 rounded shadow-xs border border-slate-200 pointer-events-none group-hover:border-indigo-400 group-hover:text-indigo-600 transition-colors">
                    {model.name}
                  </span>

                  {/* Hover Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 rounded-xl bg-slate-900 text-white text-xs whitespace-nowrap shadow-xl z-30 pointer-events-none min-w-[180px]">
                    <div className="font-bold text-white mb-1 flex items-center justify-between gap-2">
                      <span>{model.name}</span>
                      <span className="text-[10px] font-mono text-indigo-300">{model.provider}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 flex justify-between gap-2">
                      <span>Blended Cost:</span>
                      <span className="font-mono text-emerald-400 font-bold">${price.toFixed(2)}/1M</span>
                    </div>
                    <div className="text-[11px] text-slate-300 flex justify-between gap-2 mt-0.5">
                      <span>{metricLabel}:</span>
                      <span className="font-mono font-bold text-indigo-300">{score}{metricUnit}</span>
                    </div>
                    {model.benchmarks?.sweBenchVerified && activeMetric !== 'sweBench' && (
                      <div className="text-[10px] text-slate-400 flex justify-between gap-2 mt-1 pt-1 border-t border-slate-800">
                        <span>SWE-bench:</span>
                        <span className="font-mono text-slate-200">{model.benchmarks.sweBenchVerified}%</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom X-Axis Guide */}
          <div className="absolute bottom-2 left-6 right-6 flex justify-between text-[10px] text-slate-400 font-mono pointer-events-none border-t border-slate-100 pt-1">
            <span>$0.10 / 1M (Ultra Low Cost)</span>
            <span>$1.00 / 1M</span>
            <span>$5.00 / 1M</span>
            <span>$15.00+ / 1M (Frontier Reasoning)</span>
          </div>
        </div>

        {/* Selected Model Detail Modal */}
        <AnimatePresence>
          {selectedModel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-6 p-6 rounded-2xl bg-white border border-indigo-200 shadow-md relative"
            >
              <button
                onClick={() => setSelectedModel(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center p-1.5 border border-slate-200">
                    {getProviderLogo(selectedModel.provider)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>{selectedModel.name}</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                        {selectedModel.provider}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">{selectedModel.description}</p>
                  </div>
                </div>

                <Link
                  href={`/model/${selectedModel.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-sm transition-all whitespace-nowrap"
                >
                  <span>Full Model Economics</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Benchmarks Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase">SWE-bench Verified</div>
                  <div className="text-base font-bold text-indigo-700 mt-1">
                    {selectedModel.benchmarks?.sweBenchVerified ? `${selectedModel.benchmarks.sweBenchVerified}%` : 'N/A'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase">MMLU-Pro</div>
                  <div className="text-base font-bold text-slate-900 mt-1">
                    {selectedModel.benchmarks?.mmluPro ? `${selectedModel.benchmarks.mmluPro}%` : 'N/A'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase">Chatbot Arena Elo</div>
                  <div className="text-base font-bold text-slate-900 mt-1">
                    {selectedModel.benchmarks?.arenaElo || 1300}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase">Price / 1M (In / Out)</div>
                  <div className="text-base font-bold text-emerald-600 mt-1">
                    ${selectedModel.inputPricePerMillion.toFixed(2)} / ${selectedModel.outputPricePerMillion.toFixed(2)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
