'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AI_MODELS, AIModel } from '@/data/models';
import {
  calculateSingleModelCost,
  CalculationParams,
  formatUSD,
  formatNumber,
} from '@/lib/calculator';
import {
  GitCompare,
  TrendingDown,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  Percent,
} from 'lucide-react';

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

  // Workload parameters
  const [monthlyRequests, setMonthlyRequests] = useState<number>(250000);
  const [avgInputTokens, setAvgInputTokens] = useState<number>(1500);
  const [avgOutputTokens, setAvgOutputTokens] = useState<number>(500);
  const [cachedPercentage, setCachedPercentage] = useState<number>(40);

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
      monthlyRequests,
      avgInputTokens,
      avgOutputTokens,
      cachedInputPercentage: cachedPercentage,
      enableBatchDiscount: false,
    }),
    [monthlyRequests, avgInputTokens, avgOutputTokens, cachedPercentage]
  );

  const costA = useMemo(() => calculateSingleModelCost(modelA, params), [modelA, params]);
  const costB = useMemo(() => calculateSingleModelCost(modelB, params), [modelB, params]);

  const diffUSD = Math.abs(costA.totalMonthlyCostUSD - costB.totalMonthlyCostUSD);
  const cheaperModel =
    costA.totalMonthlyCostUSD < costB.totalMonthlyCostUSD ? modelA : modelB;
  const pricierModel =
    costA.totalMonthlyCostUSD < costB.totalMonthlyCostUSD ? modelB : modelA;
  const percentSaved =
    pricierModel.inputCostPer1M > 0
      ? ((diffUSD / (pricierModel === modelA ? costA.totalMonthlyCostUSD : costB.totalMonthlyCostUSD)) * 100).toFixed(1)
      : '0';

  return (
    <div className="w-full rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xl">
      <div className="flex items-center gap-3 pb-6 border-b border-border">
        <GitCompare className="h-6 w-6 text-brand" />
        <div>
          <h2 className="text-xl font-bold text-text-primary">
            Head-to-Head Token Economics & Savings
          </h2>
          <p className="text-xs text-text-secondary">
            Select two models to compare monthly run-rate, latency tier, and caching yield.
          </p>
        </div>
      </div>

      {/* Model Selectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Model A Box */}
        <div className="rounded-xl border border-border bg-surface-subtle p-5">
          <label className="text-xs font-mono uppercase tracking-wider text-text-muted mb-2 block">
            Baseline Model (A)
          </label>
          <select
            value={modelAId}
            onChange={(e) => setModelAId(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm font-semibold text-text-primary focus:border-brand focus:outline-none"
          >
            {AI_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.provider})
              </option>
            ))}
          </select>
          <div className="mt-4 space-y-2 text-xs">
            <div className="flex justify-between text-text-secondary">
              <span>Input Cost (per 1M):</span>
              <span className="font-mono text-text-primary">${modelA.inputCostPer1M}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Output Cost (per 1M):</span>
              <span className="font-mono text-text-primary">${modelA.outputCostPer1M}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Cached Input Rate:</span>
              <span className="font-mono text-accent-emerald">${modelA.cachedInputCostPer1M || modelA.inputCostPer1M}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Context Window:</span>
              <span className="font-mono text-text-primary">{formatNumber(modelA.contextWindow)}</span>
            </div>
          </div>
        </div>

        {/* Model B Box */}
        <div className="rounded-xl border border-border bg-surface-subtle p-5">
          <label className="text-xs font-mono uppercase tracking-wider text-text-muted mb-2 block">
            Alternative Model (B)
          </label>
          <select
            value={modelBId}
            onChange={(e) => setModelBId(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm font-semibold text-text-primary focus:border-brand focus:outline-none"
          >
            {AI_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.provider})
              </option>
            ))}
          </select>
          <div className="mt-4 space-y-2 text-xs">
            <div className="flex justify-between text-text-secondary">
              <span>Input Cost (per 1M):</span>
              <span className="font-mono text-text-primary">${modelB.inputCostPer1M}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Output Cost (per 1M):</span>
              <span className="font-mono text-text-primary">${modelB.outputCostPer1M}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Cached Input Rate:</span>
              <span className="font-mono text-accent-emerald">${modelB.cachedInputCostPer1M || modelB.inputCostPer1M}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Context Window:</span>
              <span className="font-mono text-text-primary">{formatNumber(modelB.contextWindow)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Delta Banner */}
      <div className="rounded-xl border border-accent-emerald/40 bg-accent-emeraldSubtle/30 p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-emerald/20 text-accent-emerald">
            <TrendingDown className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">
              {cheaperModel.name} saves {formatUSD(diffUSD)} / month ({percentSaved}%)
            </h3>
            <p className="text-xs text-text-secondary">
              Annual projected savings: <span className="font-mono font-bold text-accent-emerald">{formatUSD(diffUSD * 12)}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div>
            <span className="text-xs text-text-muted block">Model A Spend</span>
            <span className="font-mono font-bold text-text-primary">{formatUSD(costA.totalMonthlyCostUSD)}</span>
          </div>
          <span className="text-text-muted font-bold">vs</span>
          <div>
            <span className="text-xs text-text-muted block">Model B Spend</span>
            <span className="font-mono font-bold text-text-primary">{formatUSD(costB.totalMonthlyCostUSD)}</span>
          </div>
        </div>
      </div>

      {/* Sliders for H2H */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-border">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-text-secondary">
            <span>Requests / Mo:</span>
            <span className="font-mono text-brand">{formatNumber(monthlyRequests)}</span>
          </div>
          <input
            type="range"
            min="10000"
            max="2000000"
            step="10000"
            value={monthlyRequests}
            onChange={(e) => setMonthlyRequests(Number(e.target.value))}
            className="w-full accent-brand h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-text-secondary">
            <span>Input Tokens / Req:</span>
            <span className="font-mono text-text-primary">{avgInputTokens.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="200"
            max="16000"
            step="100"
            value={avgInputTokens}
            onChange={(e) => setAvgInputTokens(Number(e.target.value))}
            className="w-full accent-brand h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-text-secondary">
            <span>Cache Hit Rate:</span>
            <span className="font-mono text-accent-emerald">{cachedPercentage}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="90"
            step="5"
            value={cachedPercentage}
            onChange={(e) => setCachedPercentage(Number(e.target.value))}
            className="w-full accent-accent-emerald h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
