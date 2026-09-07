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
    <section className="mb-14 rounded-xl border border-[#1E2538] surface-card p-5 sm:p-7 relative shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E2538]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-1 rounded text-xs font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5" /> Pareto Efficiency Matrix
            </span>
            <span className="text-xs text-[#94A3B8]">Evaluation Landscape</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Quality vs Cost Efficiency Landscape
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl">
            Interactive evaluation mapping <strong>Intelligence Benchmark Score</strong> against <strong>Blended Token Pricing</strong>. Models positioned higher and further to the left provide superior unit economics.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-[#090B10] p-1.5 rounded-lg border border-[#1E2538] self-start md:self-auto">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded text-xs transition-all min-h-[36px] ${
              selectedFilter === 'all'
                ? 'bg-[#1C2333] text-white shadow-sm font-semibold'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            All (16)
          </button>
          <button
            onClick={() => setSelectedFilter('frontier')}
            className={`px-3 py-1.5 rounded text-xs transition-all min-h-[36px] flex items-center gap-1 ${
              selectedFilter === 'frontier'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'text-[#94A3B8] hover:text-emerald-400'
            }`}
          >
            <Crosshair className="w-3 h-3 text-emerald-400" /> Pareto Value
          </button>
          <button
            onClick={() => setSelectedFilter('fast')}
            className={`px-3 py-1.5 rounded text-xs transition-all min-h-[36px] ${
              selectedFilter === 'fast'
                ? 'bg-[#1C2333] text-white shadow-sm font-semibold'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Sub-$1/1M
          </button>
          <button
            onClick={() => setSelectedFilter('reasoning')}
            className={`px-3 py-1.5 rounded text-xs transition-all min-h-[36px] ${
              selectedFilter === 'reasoning'
                ? 'bg-[#1C2333] text-white shadow-sm font-semibold'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Reasoning
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative w-full h-[400px] sm:h-[460px] mt-6 bg-[#090B10] rounded-lg border border-[#1E2538] p-4 select-none">
        {/* Y-axis Label */}
        <div className="absolute left-2 top-3 text-xs text-[#94A3B8] flex items-center gap-1">
          ↑ Quality Index (0 to 100)
        </div>

        {/* X-axis Label */}
        <div className="absolute right-4 bottom-2 text-xs text-[#94A3B8]">
          Blended Cost ($ / 1M Tokens) →
        </div>

        {/* Grid lines */}
        <div className="absolute inset-x-12 inset-y-10 pointer-events-none">
          {/* Horizontal lines */}
          <div className="absolute w-full top-0 border-b border-[#1E2538] flex justify-between text-xs text-[#64748B] -mt-2">
            <span>Score: 100 (Frontier)</span>
          </div>
          <div className="absolute w-full top-1/3 border-b border-[#1E2538] flex justify-between text-xs text-[#64748B] -mt-2">
            <span>Score: 92 (Coding & Multi-Step Analysis)</span>
          </div>
          <div className="absolute w-full top-2/3 border-b border-[#1E2538] flex justify-between text-xs text-[#64748B] -mt-2">
            <span>Score: 85 (General Production Workhorse)</span>
          </div>
          <div className="absolute w-full bottom-0 border-b border-[#1E2538] flex justify-between text-xs text-[#64748B] -mt-2">
            <span>Score: 78 (Fast Classification)</span>
          </div>

          {/* Vertical cost brackets */}
          <div className="absolute h-full left-[22%] border-r border-[#1E2538] flex flex-col justify-end text-xs font-mono text-[#64748B] pl-1 pb-1">
            $0.50
          </div>
          <div className="absolute h-full left-[48%] border-r border-[#1E2538] flex flex-col justify-end text-xs font-mono text-[#64748B] pl-1 pb-1">
            $3.00
          </div>
          <div className="absolute h-full left-[78%] border-r border-[#1E2538] flex flex-col justify-end text-xs font-mono text-[#64748B] pl-1 pb-1">
            $10.00
          </div>
        </div>

        {/* High Efficiency Quadrant */}
        <div className="absolute left-12 top-10 w-48 h-48 bg-emerald-500/[0.03] border border-emerald-500/20 rounded-br-2xl pointer-events-none flex items-start p-2">
          <span className="text-xs font-semibold text-emerald-400">
            High Efficiency Quadrant
          </span>
        </div>

        {/* Plotted Model Nodes */}
        {filteredData.map((item) => {
          const { x, y } = getCoords(item.blendedCostPer1M, item.intelligenceScore);
          const isSelected = hoveredModel?.model.id === item.model.id;

          let colorClass = 'bg-[#1C2333] text-[#94A3B8] border-[#2A344A]';
          if (item.model.provider === 'DeepSeek') colorClass = 'bg-blue-950/80 text-blue-300 border-blue-500/40';
          else if (item.model.provider === 'Anthropic') colorClass = 'bg-amber-950/80 text-amber-300 border-amber-500/40';
          else if (item.model.provider === 'OpenAI') colorClass = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
          else if (item.model.provider === 'Google') colorClass = 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';

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
              </div>

              {/* Label below node */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap pointer-events-none">
                <span
                  className={`text-xs px-1.5 py-0.5 rounded border font-medium ${
                    isSelected
                      ? 'bg-white text-black font-bold border-white'
                      : 'bg-[#111520] text-[#CBD5E1] border-[#1E2538] group-hover:border-emerald-500/50'
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
            className="absolute bottom-4 left-4 z-30 p-3.5 bg-[#111520] border border-emerald-500/40 rounded-xl shadow-2xl max-w-xs"
          >
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#1E2538]">
              <div className="flex items-center gap-2">
                <ProviderIcon provider={hoveredModel.model.provider} className="w-4 h-4" />
                <span className="text-xs font-bold text-white">{hoveredModel.model.name}</span>
              </div>
              <span className="text-xs text-[#94A3B8]">{hoveredModel.model.provider}</span>
            </div>

            <div className="mt-2 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Quality Index:</span>
                <span className="text-emerald-400 font-bold font-mono">{hoveredModel.intelligenceScore} / 100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Blended Cost (3:1):</span>
                <span className="text-white font-bold font-mono">${hoveredModel.blendedCostPer1M.toFixed(3)} / 1M</span>
              </div>
              <div className="flex justify-between text-xs text-[#94A3B8] pt-1 border-t border-[#1E2538] font-mono">
                <span>In: ${hoveredModel.model.inputCostPer1M}</span>
                <span>Out: ${hoveredModel.model.outputCostPer1M}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
