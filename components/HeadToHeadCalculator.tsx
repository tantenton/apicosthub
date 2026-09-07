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
import { GitCompare, ArrowRight, CheckCircle2, XCircle, Zap, Shield, Sparkles } from 'lucide-react';

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
  const expensiveModel = costA.totalMonthlyCost < costB.totalMonthlyCost ? modelB : modelA;
  const ratio =
    expensiveModel && cheaperModel && costA.totalMonthlyCost > 0 && costB.totalMonthlyCost > 0
      ? (
          Math.max(costA.totalMonthlyCost, costB.totalMonthlyCost) /
          Math.min(costA.totalMonthlyCost, costB.totalMonthlyCost)
        ).toFixed(1)
      : '1.0';

  return (
    <section id="head-to-head" className="w-full py-10 border-t border-[#1E2638] bg-[#0A0D14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#1E2638]">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-blue-400 font-semibold uppercase tracking-wider">
              <GitCompare className="w-4 h-4" />
              Head-to-Head Model Diff
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
              Side-by-Side Cost & Benchmark Delta
            </h2>
          </div>

          {/* Quick Switch Pairs */}
          <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
            <span className="text-[#64748B]">Popular:</span>
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
                className="px-2.5 py-1 rounded bg-[#141A26] hover:bg-[#1E2638] text-[#94A3B8] hover:text-white border border-[#232D42] transition-colors whitespace-nowrap"
              >
                {pair.label}
              </button>
            ))}
          </div>
        </div>

        {/* Delta Callout Banner */}
        <div className="mb-6 p-4 rounded-xl bg-[#141A26] border border-[#232D42] flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                <span className="text-emerald-400">{cheaperModel.name}</span> saves{' '}
                <span className="text-emerald-400">{formatUSD(diffCost)}/month</span> ({ratio}x cheaper)
              </div>
              <div className="text-xs text-[#94A3B8] mt-0.5">
                Simulated on {formatUSD(requests).replace('$', '')} requests/mo with {cachingRate}% prompt caching.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <div className="text-[#64748B]">Annual Difference</div>
              <div className="text-emerald-400 font-bold">{formatUSD(diffCost * 12)}</div>
            </div>
          </div>
        </div>

        {/* Two-Column Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Model A Card */}
          <div className="terminal-card rounded-xl p-5 border border-[#1E2638]">
            <div className="mb-4">
              <label className="text-[10px] uppercase font-mono tracking-wider text-[#64748B] block mb-1">
                Select Model A
              </label>
              <select
                value={modelAId}
                onChange={(e) => setModelAId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#141A26] border border-[#232D42] font-mono text-sm text-white focus:outline-none focus:border-[#10B981]"
              >
                {AI_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider})
                  </option>
                ))}
              </select>
            </div>

            {/* Model A Price Summary */}
            <div className="p-4 rounded-lg bg-[#080A0F] border border-[#1E2638] mb-4">
              <div className="text-[11px] font-mono text-[#64748B]">Projected Monthly Spend</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {formatUSD(costA.totalMonthlyCost)}
              </div>
              <div className="text-xs font-mono text-[#94A3B8] mt-0.5">
                {formatUSD(costA.costPer1kRequests)} per 1K calls
              </div>
            </div>

            {/* Specs Table */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-[#1E2638]/50">
                <span className="text-[#64748B]">Provider</span>
                <span className="text-white font-medium">{modelA.provider}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1E2638]/50">
                <span className="text-[#64748B]">Context Window</span>
                <span className="text-white font-medium">{formatContextWindow(modelA.contextWindow)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1E2638]/50">
                <span className="text-[#64748B]">Input Pricing</span>
                <span className="text-white font-medium">${modelA.inputCostPer1M.toFixed(2)} / 1M</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1E2638]/50">
                <span className="text-[#64748B]">Cached Input Rate</span>
                <span className="text-emerald-400 font-medium">
                  {(modelA.cachedInputCostPer1M ?? 0) > 0
                    ? `$${modelA.cachedInputCostPer1M!.toFixed(2)} / 1M`
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1E2638]/50">
                <span className="text-[#64748B]">Output Pricing</span>
                <span className="text-white font-medium">${modelA.outputCostPer1M.toFixed(2)} / 1M</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#64748B]">Latency / Speed</span>
                <span className="text-white font-medium">{modelA.speedTokensPerSec || 80} tok/sec</span>
              </div>
            </div>
          </div>

          {/* Model B Card */}
          <div className="terminal-card rounded-xl p-5 border border-[#1E2638]">
            <div className="mb-4">
              <label className="text-[10px] uppercase font-mono tracking-wider text-[#64748B] block mb-1">
                Select Model B
              </label>
              <select
                value={modelBId}
                onChange={(e) => setModelBId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#141A26] border border-[#232D42] font-mono text-sm text-white focus:outline-none focus:border-[#10B981]"
              >
                {AI_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider})
                  </option>
                ))}
              </select>
            </div>

            {/* Model B Price Summary */}
            <div className="p-4 rounded-lg bg-[#080A0F] border border-[#1E2638] mb-4">
              <div className="text-[11px] font-mono text-[#64748B]">Projected Monthly Spend</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {formatUSD(costB.totalMonthlyCost)}
              </div>
              <div className="text-xs font-mono text-[#94A3B8] mt-0.5">
                {formatUSD(costB.costPer1kRequests)} per 1K calls
              </div>
            </div>

            {/* Specs Table */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-[#1E2638]/50">
                <span className="text-[#64748B]">Provider</span>
                <span className="text-white font-medium">{modelB.provider}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1E2638]/50">
                <span className="text-[#64748B]">Context Window</span>
                <span className="text-white font-medium">{formatContextWindow(modelB.contextWindow)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1E2638]/50">
                <span className="text-[#64748B]">Input Pricing</span>
                <span className="text-white font-medium">${modelB.inputCostPer1M.toFixed(2)} / 1M</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1E2638]/50">
                <span className="text-[#64748B]">Cached Input Rate</span>
                <span className="text-emerald-400 font-medium">
                  {(modelB.cachedInputCostPer1M ?? 0) > 0
                    ? `$${modelB.cachedInputCostPer1M!.toFixed(2)} / 1M`
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1E2638]/50">
                <span className="text-[#64748B]">Output Pricing</span>
                <span className="text-white font-medium">${modelB.outputCostPer1M.toFixed(2)} / 1M</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#64748B]">Latency / Speed</span>
                <span className="text-white font-medium">{modelB.speedTokensPerSec || 80} tok/sec</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
