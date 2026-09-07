'use client';

import React, { useState, useMemo } from 'react';
import { AI_MODELS, AIModel } from '../data/models';
import { calculateWorkloadCost, formatCurrency } from '../lib/calculator';
import { GitFork, ArrowDown, Zap, ShieldCheck, Sparkles, Copy, Check, Terminal, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

export default function RouterCascadeSimulator() {
  const [tier1Id, setTier1Id] = useState<string>('gemini-3-5-flash-lite');
  const [tier2Id, setTier2Id] = useState<string>('deepseek-v3-2');
  const [tier3Id, setTier3Id] = useState<string>('claude-sonnet-4-6');

  const [tier1Pct, setTier1Pct] = useState<number>(70);
  const [tier2Pct, setTier2Pct] = useState<number>(20);
  // tier3 is remaining (100 - tier1 - tier2)
  const tier3Pct = Math.max(0, 100 - tier1Pct - tier2Pct);

  const [totalRequests, setTotalRequests] = useState<number>(1_000_000);
  const [avgInTokens, setAvgInTokens] = useState<number>(1_500);
  const [avgOutTokens, setAvgOutTokens] = useState<number>(500);
  const [copiedConfig, setCopiedConfig] = useState(false);

  const model1 = useMemo(() => AI_MODELS.find((m) => m.id === tier1Id) || AI_MODELS[0], [tier1Id]);
  const model2 = useMemo(() => AI_MODELS.find((m) => m.id === tier2Id) || AI_MODELS[1], [tier2Id]);
  const model3 = useMemo(() => AI_MODELS.find((m) => m.id === tier3Id) || AI_MODELS[2], [tier3Id]);

  // Calculations
  const cost1 = useMemo(() => {
    return calculateWorkloadCost({
      model: model1,
      requestsPerMonth: (totalRequests * tier1Pct) / 100,
      inputTokensPerReq: avgInTokens,
      outputTokensPerReq: avgOutTokens,
      cachingPercentage: 40,
    });
  }, [model1, totalRequests, tier1Pct, avgInTokens, avgOutTokens]);

  const cost2 = useMemo(() => {
    return calculateWorkloadCost({
      model: model2,
      requestsPerMonth: (totalRequests * tier2Pct) / 100,
      inputTokensPerReq: avgInTokens,
      outputTokensPerReq: avgOutTokens,
      cachingPercentage: 40,
    });
  }, [model2, totalRequests, tier2Pct, avgInTokens, avgOutTokens]);

  const cost3 = useMemo(() => {
    return calculateWorkloadCost({
      model: model3,
      requestsPerMonth: (totalRequests * tier3Pct) / 100,
      inputTokensPerReq: avgInTokens,
      outputTokensPerReq: avgOutTokens,
      cachingPercentage: 40,
    });
  }, [model3, totalRequests, tier3Pct, avgInTokens, avgOutTokens]);

  const totalCascadedMonthlyCost = cost1.totalMonthlyCost + cost2.totalMonthlyCost + cost3.totalMonthlyCost;

  // Single monolithic tier 3 cost baseline
  const monolithicTier3Cost = useMemo(() => {
    return calculateWorkloadCost({
      model: model3,
      requestsPerMonth: totalRequests,
      inputTokensPerReq: avgInTokens,
      outputTokensPerReq: avgOutTokens,
      cachingPercentage: 40,
    }).totalMonthlyCost;
  }, [model3, totalRequests, avgInTokens, avgOutTokens]);

  const monthlySavings = Math.max(0, monolithicTier3Cost - totalCascadedMonthlyCost);
  const savingsPct = monolithicTier3Cost > 0 ? (monthlySavings / monolithicTier3Cost) * 100 : 0;
  const blendedPer1M = (totalCascadedMonthlyCost / ((totalRequests * (avgInTokens + avgOutTokens)) / 1_000_000));

  const litellmYaml = `model_list:
  - model_name: router-cascade
    litellm_params:
      model: ${model1.providerSlug}/${model1.id}
      rpm: 5000
  - model_name: router-cascade
    litellm_params:
      model: ${model2.providerSlug}/${model2.id}
      rpm: 2000
  - model_name: router-cascade
    litellm_params:
      model: ${model3.providerSlug}/${model3.id}
      rpm: 500

router_settings:
  routing_strategy: "cost-based-fallback"
  fallbacks: [{"${model1.id}": ["${model2.id}", "${model3.id}"]}]`;

  const copyLiteLlm = () => {
    navigator.clipboard.writeText(litellmYaml);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  return (
    <section className="w-full max-w-7xl px-4 sm:px-6 my-10">
      <div className="surface-card rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl overflow-hidden">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
              <GitFork className="w-3.5 h-3.5 text-indigo-600" />
              <span>Production Architecture Synthesizer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Multi-Tier Cascading Router Simulator
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Model deterministic fallback waterfalls. Filter cheap classification queries early, and escalate only complex reasoning tasks to top-tier models.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyLiteLlm}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              {copiedConfig ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Terminal className="w-3.5 h-3.5 text-indigo-400" />}
              <span>{copiedConfig ? 'Copied YAML!' : 'Export LiteLLM Config'}</span>
            </button>
          </div>
        </div>

        {/* 3-Tier Interactive Waterfall Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Tier 1 Box */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold flex items-center justify-center border border-emerald-200">
                  1
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Classifier / Fast Tier
                </span>
              </div>
              <span className="font-mono text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                {tier1Pct}% traffic
              </span>
            </div>

            <select
              value={tier1Id}
              onChange={(e) => setTier1Id(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {AI_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (${m.inputPricePerMillion.toFixed(2)}/${m.outputPricePerMillion.toFixed(2)})
                </option>
              ))}
            </select>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Traffic Allocation</span>
                <span>{tier1Pct}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={90}
                step={5}
                value={tier1Pct}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTier1Pct(val);
                  if (val + tier2Pct > 95) setTier2Pct(95 - val);
                }}
                className="w-full cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex justify-between items-center">
              <span className="text-slate-500">Tier Monthly Spend:</span>
              <span className="font-mono font-bold text-slate-900">
                <AnimatedCounter value={cost1.totalMonthlyCost} prefix="$" decimals={2} />
              </span>
            </div>
          </div>

          {/* Tier 2 Box */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-mono text-[11px] font-bold flex items-center justify-center border border-indigo-200">
                  2
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  General Execution Tier
                </span>
              </div>
              <span className="font-mono text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                {tier2Pct}% traffic
              </span>
            </div>

            <select
              value={tier2Id}
              onChange={(e) => setTier2Id(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {AI_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (${m.inputPricePerMillion.toFixed(2)}/${m.outputPricePerMillion.toFixed(2)})
                </option>
              ))}
            </select>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Traffic Allocation</span>
                <span>{tier2Pct}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={90}
                step={5}
                value={tier2Pct}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (tier1Pct + val <= 95) setTier2Pct(val);
                }}
                className="w-full cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex justify-between items-center">
              <span className="text-slate-500">Tier Monthly Spend:</span>
              <span className="font-mono font-bold text-slate-900">
                <AnimatedCounter value={cost2.totalMonthlyCost} prefix="$" decimals={2} />
              </span>
            </div>
          </div>

          {/* Tier 3 Box */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 font-mono text-[11px] font-bold flex items-center justify-center border border-amber-200">
                  3
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Escalated Reasoning Tier
                </span>
              </div>
              <span className="font-mono text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                {tier3Pct}% traffic
              </span>
            </div>

            <select
              value={tier3Id}
              onChange={(e) => setTier3Id(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {AI_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (${m.inputPricePerMillion.toFixed(2)}/${m.outputPricePerMillion.toFixed(2)})
                </option>
              ))}
            </select>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Remainder Fallback</span>
                <span>{tier3Pct}% (Auto)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div style={{ width: `${tier3Pct}%` }} className="bg-amber-500 h-full transition-all" />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex justify-between items-center">
              <span className="text-slate-500">Tier Monthly Spend:</span>
              <span className="font-mono font-bold text-slate-900">
                <AnimatedCounter value={cost3.totalMonthlyCost} prefix="$" decimals={2} />
              </span>
            </div>
          </div>
        </div>

        {/* Synthesis Result Callout */}
        <div className="mt-8 p-6 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                Cascaded Architecture OPEX Yield
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              <AnimatedCounter value={totalCascadedMonthlyCost} prefix="$" decimals={2} />
              <span className="text-xs font-normal text-slate-500 font-sans ml-2">
                / month (Blended: ${blendedPer1M.toFixed(3)}/1M)
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Versus unrouted monolithic <strong>{model3.name}</strong> spend of{' '}
              <span className="font-mono font-bold text-slate-800">${monolithicTier3Cost.toFixed(2)}/mo</span>.
            </p>
          </div>

          <div className="text-center md:text-right p-4 rounded-xl bg-white border border-indigo-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Net Monthly Cost Reduction
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 font-mono block mt-0.5">
              Save <AnimatedCounter value={monthlySavings} prefix="$" decimals={2} /> / mo
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
              -{savingsPct.toFixed(1)}% Cost Reduction
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
