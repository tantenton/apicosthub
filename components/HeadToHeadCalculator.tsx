'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AI_MODELS, AIModel } from '@/data/models';
import {
  calculateSingleModelCost,
  CalculationParams,
  formatUSD,
  formatContextWindow,
} from '@/lib/calculator';
import { ProviderIcon } from './ProviderLogos';
import { GitCompare, Zap, ArrowRight } from 'lucide-react';

interface HeadToHeadCalculatorProps {
  initialModelA?: string;
  initialModelB?: string;
}

export default function HeadToHeadCalculator({
  initialModelA = 'gpt-4o',
  initialModelB = 'claude-3-5-sonnet',
}: HeadToHeadCalculatorProps) {
  const [modelAId, setModelAId] = useState<string>(initialModelA);
  const [modelBId, setModelBId] = useState<string>(initialModelB);

  // Volume parameters
  const [requests, setRequests] = useState<number>(500_000);
  const [inputTokens, setInputTokens] = useState<number>(2_000);
  const [outputTokens, setOutputTokens] = useState<number>(500);
  const [cachingRate, setCachingRate] = useState<number>(50);

  const modelA = useMemo(
    () => AI_MODELS.find((m) => m.id === modelAId) || AI_MODELS[0],
    [modelAId]
  );
  const modelB = useMemo(
    () => AI_MODELS.find((m) => m.id === modelBId) || AI_MODELS[4],
    [modelBId]
  );

  const params: CalculationParams = useMemo(
    () => ({
      monthlyRequests: requests,
      avgInputTokens: inputTokens,
      avgOutputTokens: outputTokens,
      cachedInputPercentage: cachingRate,
      batchDiscount: false,
    }),
    [requests, inputTokens, outputTokens, cachingRate]
  );

  const costA = useMemo(() => calculateSingleModelCost(modelA, params), [modelA, params]);
  const costB = useMemo(() => calculateSingleModelCost(modelB, params), [modelB, params]);

  const diffCost = Math.abs(costA.totalMonthlyCost - costB.totalMonthlyCost);
  const cheaperModel = costA.totalMonthlyCost < costB.totalMonthlyCost ? modelA : modelB;
  const ratio =
    costA.totalMonthlyCost > 0 && costB.totalMonthlyCost > 0
      ? (
          Math.max(costA.totalMonthlyCost, costB.totalMonthlyCost) /
          Math.min(costA.totalMonthlyCost, costB.totalMonthlyCost)
        ).toFixed(1)
      : '1.0';

  return (
    <section id="head-to-head" className="w-full py-12 border-t border-white/10 bg-[#08090a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
              <GitCompare className="w-4 h-4" />
              Direct Model Comparison
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-white mt-1">
              Side-by-Side Cost Differential
            </h2>
          </div>

          {/* Quick Switch Pairs */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400">Quick Compare:</span>
            {[
              { a: 'gpt-4o', b: 'claude-3-5-sonnet', label: 'GPT-4o vs Claude 3.5' },
              { a: 'deepseek-v3', b: 'gpt-4o', label: 'DeepSeek V3 vs GPT-4o' },
              { a: 'deepseek-r1', b: 'o1', label: 'DeepSeek R1 vs o1' },
            ].map((pair) => (
              <button
                key={pair.label}
                onClick={() => {
                  setModelAId(pair.a);
                  setModelBId(pair.b);
                }}
                className="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 transition-colors whitespace-nowrap min-h-[36px]"
              >
                {pair.label}
              </button>
            ))}
          </div>
        </div>

        {/* Delta Callout Banner */}
        <div className="mb-8 p-5 rounded-2xl surface-card border-l-4 border-l-indigo-500 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                <span className="text-indigo-400">{cheaperModel.name}</span> yields monthly savings of{' '}
                <span className="text-indigo-400 font-mono">{formatUSD(diffCost)}</span> ({ratio}x difference)
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Simulated at {formatUSD(requests).replace('$', '')} calls/mo with {cachingRate}% prompt caching.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <div className="text-slate-400">Annual Spend Delta</div>
              <div className="text-indigo-400 font-bold text-base">{formatUSD(diffCost * 12)}</div>
            </div>
          </div>
        </div>

        {/* Two-Column Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Model A Card */}
          <div className="surface-card rounded-2xl p-6 shadow-xl">
            <div className="mb-5">
              <label className="text-xs uppercase font-semibold text-slate-400 block mb-2">
                Select Model A
              </label>
              <div className="relative">
                <select
                  value={modelAId}
                  onChange={(e) => setModelAId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090a] border border-white/10 text-xs font-medium text-white focus:outline-none focus:border-indigo-500 min-h-[44px]"
                >
                  {AI_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.provider})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Summary */}
            <div className="p-4 rounded-xl bg-[#08090a] border border-white/10 mb-5">
              <div className="text-xs text-slate-400">Projected Monthly Spend</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {formatUSD(costA.totalMonthlyCost)}
              </div>
              <div className="text-xs font-mono text-slate-500 mt-0.5">
                {formatUSD(costA.costPer1kRequests)} per 1K calls
              </div>
            </div>

            {/* Specs Table */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Provider</span>
                <span className="text-white font-medium flex items-center gap-1.5">
                  <ProviderIcon provider={modelA.provider} className="w-3.5 h-3.5" />
                  {modelA.provider}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Context Window</span>
                <span className="text-white font-mono">{formatContextWindow(modelA.contextWindow)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Input Pricing</span>
                <span className="text-white font-mono">${modelA.inputCostPer1M.toFixed(2)} / 1M</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Cached Input Rate</span>
                <span className="text-cyan-400 font-mono">
                  {(modelA.cachedInputCostPer1M ?? 0) > 0
                    ? `$${modelA.cachedInputCostPer1M!.toFixed(2)} / 1M`
                    : 'Not supported'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Output Pricing</span>
                <span className="text-white font-mono">${modelA.outputCostPer1M.toFixed(2)} / 1M</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Throughput Rate</span>
                <span className="text-white font-mono">{modelA.speedTokensPerSec || 80} tok/sec</span>
              </div>
            </div>
          </div>

          {/* Model B Card */}
          <div className="surface-card rounded-2xl p-6 shadow-xl">
            <div className="mb-5">
              <label className="text-xs uppercase font-semibold text-slate-400 block mb-2">
                Select Model B
              </label>
              <div className="relative">
                <select
                  value={modelBId}
                  onChange={(e) => setModelBId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090a] border border-white/10 text-xs font-medium text-white focus:outline-none focus:border-indigo-500 min-h-[44px]"
                >
                  {AI_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.provider})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Summary */}
            <div className="p-4 rounded-xl bg-[#08090a] border border-white/10 mb-5">
              <div className="text-xs text-slate-400">Projected Monthly Spend</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {formatUSD(costB.totalMonthlyCost)}
              </div>
              <div className="text-xs font-mono text-slate-500 mt-0.5">
                {formatUSD(costB.costPer1kRequests)} per 1K calls
              </div>
            </div>

            {/* Specs Table */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Provider</span>
                <span className="text-white font-medium flex items-center gap-1.5">
                  <ProviderIcon provider={modelB.provider} className="w-3.5 h-3.5" />
                  {modelB.provider}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Context Window</span>
                <span className="text-white font-mono">{formatContextWindow(modelB.contextWindow)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Input Pricing</span>
                <span className="text-white font-mono">${modelB.inputCostPer1M.toFixed(2)} / 1M</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Cached Input Rate</span>
                <span className="text-cyan-400 font-mono">
                  {(modelB.cachedInputCostPer1M ?? 0) > 0
                    ? `$${modelB.cachedInputCostPer1M!.toFixed(2)} / 1M`
                    : 'Not supported'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Output Pricing</span>
                <span className="text-white font-mono">${modelB.outputCostPer1M.toFixed(2)} / 1M</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Throughput Rate</span>
                <span className="text-white font-mono">{modelB.speedTokensPerSec || 80} tok/sec</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
