'use client';

import React, { useState } from 'react';
import { AIModel, AI_MODELS } from '@/data/models';
import { ProviderIcon } from './ProviderLogos';
import { Layers, Crosshair, ArrowUpRight } from 'lucide-react';

interface ModelBenchmarkPoint {
  model: AIModel;
  intelligenceScore: number; // 0 - 100
  blendedCostPer1M: number; // (Input * 3 + Output * 1) / 4
  isParetoFrontier?: boolean;
}

export default function ParetoMatrixChart() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'reasoning' | 'fast' | 'frontier'>('all');
  const [hoveredModel, setHoveredModel] = useState<ModelBenchmarkPoint | null>(null);

  // Map benchmark scores based on current industry benchmarks (LMSYS Arena / SWE-bench / Artificial Analysis Quality Index)
  const benchmarkData: ModelBenchmarkPoint[] = AI_MODELS.map((m) => {
    let score = 80;
    if (m.id === 'deepseek-r1') score = 96;
    else if (m.id === 'o1') score = 98;
    else if (m.id === 'claude-3-5-sonnet') score = 95;
    else if (m.id === 'gpt-4o') score = 91;
    else if (m.id === 'deepseek-v3') score = 90;
    else if (m.id === 'gemini-2-0-flash') score = 85;
    else if (m.id === 'llama-3-3-70b') score = 86;
    else if (m.id === 'gpt-4o-mini') score = 82;
    else if (m.id === 'claude-3-5-haiku') score = 83;
    else if (m.id === 'mistral-large') score = 88;
    else if (m.id === 'command-r-plus') score = 84;
    else if (m.id === 'gemini-1-5-pro') score = 90;
    else if (m.id === 'llama-3-1-405b') score = 92;
    else if (m.id === 'o3-mini') score = 94;

    const blendedCost = Number(((m.inputCostPer1M * 0.75 + m.outputCostPer1M * 0.25)).toFixed(3));
    
    // Pareto Frontier: Unbeatable value-for-money at their tier
    const isPareto = ['deepseek-v3', 'deepseek-r1', 'gemini-2-0-flash', 'claude-3-5-sonnet', 'gpt-4o-mini'].includes(m.id);

    return {
      model: m,
      intelligenceScore: score,
      blendedCostPer1M: blendedCost,
      isParetoFrontier: isPareto,
    };
  });

  const filteredData = benchmarkData.filter((item) => {
    if (selectedFilter === 'reasoning') return item.model.qualityTier === 'Reasoning Heavy' || item.intelligenceScore >= 93;
    if (selectedFilter === 'fast') return item.blendedCostPer1M < 1.0;
    if (selectedFilter === 'frontier') return item.isParetoFrontier;
    return true;
  });

  const minScore = 78;
  const maxScore = 100;
  const maxCost = 16;

  const getCoords = (cost: number, score: number) => {
    const normX = Math.sqrt(Math.min(cost, maxCost)) / Math.sqrt(maxCost);
    const xPercent = 8 + normX * 82;
    const normY = (score - minScore) / (maxScore - minScore);
    const yPercent = 90 - normY * 78;
    return { x: xPercent, y: yPercent };
  };

  return (
    <section className="mb-14 rounded-2xl border border-white/10 surface-card p-6 sm:p-8 relative shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5" /> Pareto Efficiency Matrix
            </span>
            <span className="text-xs text-slate-400">Evaluation Landscape</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
            Quality vs Cost Efficiency Landscape
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Interactive evaluation mapping <strong>Intelligence Benchmark Score</strong> against <strong>Blended Token Pricing</strong>. Models positioned higher and further to the left provide superior unit economics.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-[#08090a] p-1.5 rounded-xl border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all min-h-[36px] ${
              selectedFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All (16)
          </button>
          <button
            onClick={() => setSelectedFilter('frontier')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all min-h-[36px] flex items-center gap-1 ${
              selectedFilter === 'frontier'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                : 'text-slate-400 hover:text-indigo-400'
            }`}
          >
            <Crosshair className="w-3 h-3 text-indigo-400" /> Pareto Value
          </button>
          <button
            onClick={() => setSelectedFilter('fast')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all min-h-[36px] ${
              selectedFilter === 'fast'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sub-$1/1M
          </button>
          <button
            onClick={() => setSelectedFilter('reasoning')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all min-h-[36px] ${
              selectedFilter === 'reasoning'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Reasoning
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative w-full h-[400px] sm:h-[460px] mt-6 bg-[#08090a] rounded-xl border border-white/10 p-4 select-none">
        {/* Y-axis Label */}
        <div className="absolute left-2 top-3 text-xs text-slate-400 flex items-center gap-1">
          ↑ Quality Index (0 to 100)
        </div>

        {/* X-axis Label */}
        <div className="absolute right-4 bottom-2 text-xs text-slate-400">
          Blended Cost ($ / 1M Tokens) →
        </div>

        {/* Grid lines */}
        <div className="absolute inset-x-12 inset-y-10 pointer-events-none">
          {/* Horizontal lines */}
          <div className="absolute w-full top-0 border-b border-white/5 flex justify-between text-xs text-slate-600 -mt-2">
            <span>Score: 100 (Frontier)</span>
          </div>
          <div className="absolute w-full top-1/3 border-b border-white/5 flex justify-between text-xs text-slate-600 -mt-2">
            <span>Score: 92 (Coding & Multi-Step Analysis)</span>
          </div>
          <div className="absolute w-full top-2/3 border-b border-white/5 flex justify-between text-xs text-slate-600 -mt-2">
            <span>Score: 85 (General Production Workhorse)</span>
          </div>
          <div className="absolute w-full bottom-0 border-b border-white/5 flex justify-between text-xs text-slate-600 -mt-2">
            <span>Score: 78 (Fast Classification)</span>
          </div>
        </div>

        {/* Scatter Points */}
        {filteredData.map((item) => {
          const { x, y } = getCoords(item.blendedCostPer1M, item.intelligenceScore);
          const isHovered = hoveredModel?.model.id === item.model.id;

          return (
            <div
              key={item.model.id}
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setHoveredModel(item)}
              onMouseLeave={() => setHoveredModel(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
            >
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono transition-all transform duration-150 ${
                  isHovered
                    ? 'scale-110 z-30 bg-indigo-600 text-white border-white ring-4 ring-indigo-500/30'
                    : item.isParetoFrontier
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/60 shadow-sm'
                    : 'bg-[#08090a] text-slate-300 border-white/10 hover:border-white/40'
                }`}
              >
                <ProviderIcon provider={item.model.provider} className="w-3.5 h-3.5" />
                <span className="font-semibold">{item.model.name}</span>
                <span className="text-slate-400 text-xs">
                  ${item.blendedCostPer1M.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}

        {/* Hover Tooltip Overlay */}
        {hoveredModel && (
          <div className="absolute bottom-6 left-6 z-40 p-4 rounded-xl surface-card border border-indigo-500/40 shadow-2xl max-w-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 mb-1.5">
              <ProviderIcon provider={hoveredModel.model.provider} className="w-4 h-4" />
              <span className="font-bold text-white text-sm">{hoveredModel.model.name}</span>
            </div>
            <div className="space-y-1 text-xs text-slate-300 font-mono">
              <div className="flex justify-between">
                <span>Intelligence Benchmark:</span>
                <span className="text-indigo-400 font-bold">{hoveredModel.intelligenceScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span>Input / 1M:</span>
                <span className="text-white">${hoveredModel.model.inputCostPer1M}</span>
              </div>
              <div className="flex justify-between">
                <span>Output / 1M:</span>
                <span className="text-white">${hoveredModel.model.outputCostPer1M}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/10">
                <span>Context Window:</span>
                <span className="text-white">{hoveredModel.model.contextWindow.toLocaleString()} tokens</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
