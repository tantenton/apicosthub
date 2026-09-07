'use client';

import React, { useState } from 'react';
import { AIModel, AI_MODELS } from '@/data/models';
import { ProviderIcon } from './ProviderLogos';
import { Zap, Sparkles, TrendingDown, Eye, Filter } from 'lucide-react';

interface ModelBenchmarkPoint {
  model: AIModel;
  intelligenceScore: number; // 0 - 100
  blendedCostPer1M: number; // (Input * 3 + Output * 1) / 4 roughly typical 3:1 ratio
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

  // Chart dimensions & scaling
  // X-axis: 0 to 15 ($ blended)
  // Y-axis: 75 to 100 (Quality Score)
  const minScore = 78;
  const maxScore = 100;
  const maxCost = 16;

  const getCoords = (cost: number, score: number) => {
    // Non-linear sqrt scale on X-axis to space out low-cost models cleanly
    const normX = Math.sqrt(Math.min(cost, maxCost)) / Math.sqrt(maxCost);
    const xPercent = 8 + normX * 82; // 8% to 90%
    const normY = (score - minScore) / (maxScore - minScore);
    const yPercent = 90 - normY * 78; // inverted for SVG Y
    return { x: xPercent, y: yPercent };
  };

  return (
    <section className="mb-14 rounded-xl border border-[#1E2638] bg-[#0E121B] p-5 sm:p-7 relative overflow-hidden shadow-2xl">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E2638]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Pareto Frontier Matrix
            </span>
            <span className="text-xs text-[#64748B] font-mono">Artificial Analysis Style</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Quality vs. Cost Efficiency Landscape
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl">
            Interactive 2D evaluation mapping <strong>Intelligence Quality Index</strong> against <strong>Blended Token Pricing</strong>. Models closest to the top-left deliver the highest ROI.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-[#080A0F] p-1 rounded-lg border border-[#1E2638] self-start md:self-auto">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
              selectedFilter === 'all'
                ? 'bg-[#1E2638] text-white shadow-sm font-semibold'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            All (16)
          </button>
          <button
            onClick={() => setSelectedFilter('frontier')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-1 ${
              selectedFilter === 'frontier'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'text-[#94A3B8] hover:text-emerald-400'
            }`}
          >
            <Sparkles className="w-3 h-3 text-emerald-400" /> Pareto Value
          </button>
          <button
            onClick={() => setSelectedFilter('fast')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
              selectedFilter === 'fast'
                ? 'bg-[#1E2638] text-white shadow-sm font-semibold'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Sub-$1/1M
          </button>
          <button
            onClick={() => setSelectedFilter('reasoning')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
              selectedFilter === 'reasoning'
                ? 'bg-[#1E2638] text-white shadow-sm font-semibold'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Reasoning
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative w-full h-[400px] sm:h-[460px] mt-6 bg-[#080A0F] rounded-lg border border-[#1E2638] p-4 select-none">
        {/* Y-axis Label */}
        <div className="absolute left-2 top-3 text-[11px] font-mono text-[#64748B] flex items-center gap-1">
          ↑ Quality Index (0–100)
        </div>

        {/* X-axis Label */}
        <div className="absolute right-4 bottom-2 text-[11px] font-mono text-[#64748B]">
          Blended Cost ($ / 1M Tokens) →
        </div>

        {/* Grid lines */}
        <div className="absolute inset-x-12 inset-y-10 pointer-events-none">
          {/* Horizontal lines */}
          <div className="absolute w-full top-0 border-b border-[#1E2638]/60 flex justify-between text-[10px] font-mono text-[#475569] -mt-2">
            <span>Score: 100 (Frontier)</span>
          </div>
          <div className="absolute w-full top-1/3 border-b border-[#1E2638]/40 flex justify-between text-[10px] font-mono text-[#475569] -mt-2">
            <span>Score: 92 (Expert Coding & Analysis)</span>
          </div>
          <div className="absolute w-full top-2/3 border-b border-[#1E2638]/40 flex justify-between text-[10px] font-mono text-[#475569] -mt-2">
            <span>Score: 85 (Production Workhorse)</span>
          </div>
          <div className="absolute w-full bottom-0 border-b border-[#1E2638]/80 flex justify-between text-[10px] font-mono text-[#475569] -mt-2">
            <span>Score: 78 (Fast Utility)</span>
          </div>

          {/* Vertical cost brackets */}
          <div className="absolute h-full left-[22%] border-r border-[#1E2638]/40 flex flex-col justify-end text-[9px] font-mono text-[#475569] pl-1 pb-1">
            $0.50
          </div>
          <div className="absolute h-full left-[48%] border-r border-[#1E2638]/40 flex flex-col justify-end text-[9px] font-mono text-[#475569] pl-1 pb-1">
            $3.00
          </div>
          <div className="absolute h-full left-[78%] border-r border-[#1E2638]/40 flex flex-col justify-end text-[9px] font-mono text-[#475569] pl-1 pb-1">
            $10.00
          </div>
        </div>

        {/* Highlight zone for top value */}
        <div className="absolute left-12 top-10 w-44 h-48 bg-emerald-500/[0.04] border border-emerald-500/10 rounded-br-2xl pointer-events-none flex items-start p-2">
          <span className="text-[10px] font-mono font-bold text-emerald-400/80">
            ★ Sweet Spot: Maximum ROI
          </span>
        </div>

        {/* Plotted Model Nodes */}
        {filteredData.map((item) => {
          const { x, y } = getCoords(item.blendedCostPer1M, item.intelligenceScore);
          const isSelected = hoveredModel?.model.id === item.model.id;

          let colorClass = 'bg-[#1E2638] text-[#94A3B8] border-[#334155]';
          if (item.model.provider === 'DeepSeek') colorClass = 'bg-blue-900/50 text-blue-300 border-blue-500/50 shadow-blue-500/20';
          else if (item.model.provider === 'Anthropic') colorClass = 'bg-amber-900/50 text-amber-300 border-amber-500/50 shadow-amber-500/20';
          else if (item.model.provider === 'OpenAI') colorClass = 'bg-emerald-900/50 text-emerald-300 border-emerald-500/50 shadow-emerald-500/20';
          else if (item.model.provider === 'Google') colorClass = 'bg-cyan-900/50 text-cyan-300 border-cyan-500/50 shadow-cyan-500/20';

          return (
            <div
              key={item.model.id}
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setHoveredModel(item)}
              onMouseLeave={() => setHoveredModel(null)}
              onClick={() => setHoveredModel(item)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform duration-150 hover:scale-125 group"
            >
              {/* Node Circle */}
              <div
                className={`relative flex items-center justify-center p-1.5 rounded-full border shadow-md transition-all ${colorClass} ${
                  isSelected ? 'ring-2 ring-emerald-400 scale-125' : ''
                }`}
              >
                <ProviderIcon provider={item.model.provider} className="w-3.5 h-3.5" />
                {item.isParetoFrontier && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>

              {/* Label below node */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap pointer-events-none">
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    isSelected
                      ? 'bg-white text-black font-bold border-white'
                      : 'bg-[#0E121B]/90 text-[#CBD5E1] border-[#1E2638] group-hover:border-emerald-500/50'
                  }`}
                >
                  {item.model.name}
                </span>
              </div>
            </div>
          );
        })}

        {/* Tooltip Overlay */}
        {hoveredModel && (
          <div
            className="absolute bottom-4 left-4 z-30 p-3.5 bg-[#0E121B] border border-emerald-500/40 rounded-xl shadow-2xl backdrop-blur-md max-w-xs animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between gap-2 border-b border-[#1E2638] pb-2 mb-2">
              <div className="flex items-center gap-2">
                <ProviderIcon provider={hoveredModel.model.provider} className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-sm">{hoveredModel.model.name}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#1E2638] text-white rounded">
                Score: {hoveredModel.intelligenceScore}/100
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div>
                <span className="text-[#64748B] block">Input Token:</span>
                <span className="text-white font-medium">${hoveredModel.model.inputCostPer1M.toFixed(2)}/1M</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Output Token:</span>
                <span className="text-white font-medium">${hoveredModel.model.outputCostPer1M.toFixed(2)}/1M</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Prompt Cache:</span>
                <span className="text-emerald-400 font-medium">
                  {hoveredModel.model.cachedInputCostPer1M ? `$${hoveredModel.model.cachedInputCostPer1M.toFixed(2)}/1M` : 'No Cache'}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">Context Window:</span>
                <span className="text-white font-medium">{(hoveredModel.model.contextWindow / 1000).toLocaleString()}k tok</span>
              </div>
            </div>

            {hoveredModel.isParetoFrontier && (
              <div className="mt-2.5 pt-2 border-t border-[#1E2638] text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3" /> Pareto Frontier: Optimal Value Leader
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className="mt-4 pt-4 border-t border-[#1E2638] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#94A3B8]">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> OpenAI
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Anthropic
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> DeepSeek
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Google
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Meta / Mistral
          </span>
        </div>
        <div className="text-[11px] text-[#64748B]">
          Data updated September 2026 · Source: LMSYS, Artificial Analysis, Vendor Pricing API
        </div>
      </div>
    </section>
  );
}
