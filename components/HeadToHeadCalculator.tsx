'use client';

import React, { useState, useMemo } from 'react';
import { AI_MODELS, AIModel } from '../data/models';
import { calculateWorkloadCost, formatCurrency } from '../lib/calculator';
import { getProviderLogo } from './ProviderLogos';
import { ArrowRightLeft, TrendingDown, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

interface HeadToHeadCalculatorProps {
  initialModelA?: string;
  initialModelB?: string;
}

export default function HeadToHeadCalculator({
  initialModelA = 'claude-3-5-sonnet',
  initialModelB = 'deepseek-v3',
}: HeadToHeadCalculatorProps) {
  const [modelAId, setModelAId] = useState<string>(initialModelA);
  const [modelBId, setModelBId] = useState<string>(initialModelB);
  const [monthlyRequests, setMonthlyRequests] = useState<number>(500_000);

  const modelA = useMemo(() => AI_MODELS.find((m) => m.id === modelAId) || AI_MODELS[0], [modelAId]);
  const modelB = useMemo(() => AI_MODELS.find((m) => m.id === modelBId) || AI_MODELS[1], [modelBId]);

  const costA = useMemo(() => {
    return calculateWorkloadCost({
      model: modelA,
      requestsPerMonth: monthlyRequests,
      inputTokensPerReq: 1500,
      outputTokensPerReq: 600,
      cachingPercentage: 40,
      batchDiscount: false,
    });
  }, [modelA, monthlyRequests]);

  const costB = useMemo(() => {
    return calculateWorkloadCost({
      model: modelB,
      requestsPerMonth: monthlyRequests,
      inputTokensPerReq: 1500,
      outputTokensPerReq: 600,
      cachingPercentage: 40,
      batchDiscount: false,
    });
  }, [modelB, monthlyRequests]);

  const deltaMonthly = costA.totalMonthlyCost - costB.totalMonthlyCost;
  const percentSavings = costA.totalMonthlyCost > 0 ? (deltaMonthly / costA.totalMonthlyCost) * 100 : 0;

  return (
    <section className="w-full max-w-7xl px-4 sm:px-6 my-10">
      <div className="surface-card rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl overflow-hidden">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />
            <span>Direct Head-to-Head Arbitrage</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Compare Any Two Models Side-by-Side
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Evaluate exact monthly invoice differences, prompt caching multipliers, and context limits.
          </p>
        </div>

        {/* Model Selectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Model A Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Baseline Model (A)
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center p-1">
                {getProviderLogo(modelA.provider)}
              </div>
            </div>

            <select
              value={modelAId}
              onChange={(e) => setModelAId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {AI_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.provider})
                </option>
              ))}
            </select>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Input / 1M tokens:</span>
                <span className="font-mono font-bold text-slate-900">${modelA.inputPricePerMillion.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Output / 1M tokens:</span>
                <span className="font-mono font-bold text-slate-900">${modelA.outputPricePerMillion.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Cached Input / 1M:</span>
                <span className="font-mono font-bold text-emerald-600">
                  {modelA.cachedInputPricePerMillion ? `$${modelA.cachedInputPricePerMillion.toFixed(2)}` : 'N/A'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-600">Calculated Monthly Bill:</span>
              <span className="font-mono text-lg font-extrabold text-slate-900">
                <AnimatedCounter value={costA.totalMonthlyCost} prefix="$" decimals={2} />
              </span>
            </div>
          </div>

          {/* Model B Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Alternative Model (B)
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center p-1">
                {getProviderLogo(modelB.provider)}
              </div>
            </div>

            <select
              value={modelBId}
              onChange={(e) => setModelBId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {AI_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.provider})
                </option>
              ))}
            </select>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Input / 1M tokens:</span>
                <span className="font-mono font-bold text-slate-900">${modelB.inputPricePerMillion.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Output / 1M tokens:</span>
                <span className="font-mono font-bold text-slate-900">${modelB.outputPricePerMillion.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Cached Input / 1M:</span>
                <span className="font-mono font-bold text-emerald-600">
                  {modelB.cachedInputPricePerMillion ? `$${modelB.cachedInputPricePerMillion.toFixed(2)}` : 'N/A'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-600">Calculated Monthly Bill:</span>
              <span className="font-mono text-lg font-extrabold text-slate-900">
                <AnimatedCounter value={costB.totalMonthlyCost} prefix="$" decimals={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Delta Callout Bar */}
        <div className="mt-8 p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-900">
                Monthly Arbitrage Delta
              </div>
              <div className="text-xs text-indigo-700">
                Switching from {modelA.name} to {modelB.name} at 500k requests/mo:
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="font-mono text-xl font-extrabold text-indigo-950">
              {deltaMonthly >= 0 ? (
                <span className="text-emerald-600">
                  Save <AnimatedCounter value={deltaMonthly} prefix="$" decimals={2} /> / mo ({percentSavings.toFixed(1)}%)
                </span>
              ) : (
                <span className="text-rose-600">
                  +<AnimatedCounter value={Math.abs(deltaMonthly)} prefix="$" decimals={2} /> / mo ({Math.abs(percentSavings).toFixed(1)}% more)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
