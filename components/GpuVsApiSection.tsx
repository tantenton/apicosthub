'use client';

import React, { useState, useMemo } from 'react';
import { GPU_INSTANCES, AI_MODELS } from '@/data/models';
import {
  calculateGpuBreakeven,
  CalculationParams,
  formatUSD,
  formatNumber,
} from '@/lib/calculator';
import { Cpu, Server, TrendingUp, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function GpuVsApiSection() {
  const [selectedGpuId, setSelectedGpuId] = useState<string>('h100-sxm');
  const [selectedModelId, setSelectedModelId] = useState<string>('llama-3-3-70b');
  const [gpuCount, setGpuCount] = useState<number>(1);
  const [utilizationRate, setUtilizationRate] = useState<number>(50); // 50% realistic average

  const gpu = useMemo(
    () => GPU_INSTANCES.find((g) => g.id === selectedGpuId) || GPU_INSTANCES[0],
    [selectedGpuId]
  );
  const model = useMemo(
    () => AI_MODELS.find((m) => m.id === selectedModelId) || AI_MODELS[8],
    [selectedModelId]
  );

  // GPU monthly cost = hourlyRate * 730 hours * gpuCount
  const gpuMonthlyCost = gpu.hourlyRateUSD * 730 * gpuCount;

  // Real-world monthly token generation capacity based on utilization
  const monthlySecs = 730 * 3600;
  const theoreticalTokens = gpu.estimatedTokensPerSec * monthlySecs * gpuCount;
  const realisticMonthlyTokens = (theoreticalTokens * utilizationRate) / 100;

  // Cost to generate realisticMonthlyTokens on Managed API
  // Assuming 70% input tokens, 30% output tokens
  const inputTokens = realisticMonthlyTokens * 0.7;
  const outputTokens = realisticMonthlyTokens * 0.3;
  const apiEquivalentCost =
    (inputTokens * model.inputCostPer1M + outputTokens * model.outputCostPer1M) / 1_000_000;

  const isGpuCheaper = gpuMonthlyCost < apiEquivalentCost;
  const monthlySavings = Math.abs(apiEquivalentCost - gpuMonthlyCost);

  // Daily breakeven tokens
  const blendedApiPer1M = model.inputCostPer1M * 0.7 + model.outputCostPer1M * 0.3;
  const breakevenTokensMonth =
    blendedApiPer1M > 0 ? (gpuMonthlyCost / blendedApiPer1M) * 1_000_000 : 0;
  const breakevenTokensDay = breakevenTokensMonth / 30.4;

  return (
    <section className="w-full py-10 border-t border-[#1E2638] bg-[#080A0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-6 pb-4 border-b border-[#1E2638] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-semibold uppercase tracking-wider">
              <Server className="w-4 h-4" />
              Infrastructure Economics
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
              Self-Hosted GPU vs Managed API Breakeven
            </h2>
          </div>
          <span className="text-xs font-mono text-[#64748B]">vLLM / TensorRT-LLM on RunPod/Lambda</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls (6 cols) */}
          <div className="lg:col-span-6 terminal-card rounded-xl p-5 space-y-4">
            
            {/* GPU Instance Picker */}
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-[#64748B] block mb-1">
                Select Cloud GPU Hardware (RunPod / Lambda Labs)
              </label>
              <select
                value={selectedGpuId}
                onChange={(e) => setSelectedGpuId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#141A26] border border-[#232D42] font-mono text-xs text-white focus:outline-none focus:border-amber-400"
              >
                {GPU_INSTANCES.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.vramGB}GB VRAM) — ${g.hourlyRateUSD}/hr (~{g.estimatedTokensPerSec} tok/s)
                  </option>
                ))}
              </select>
            </div>

            {/* Target Open Model */}
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-[#64748B] block mb-1">
                Equivalent Open Model (Hosting with vLLM)
              </label>
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#141A26] border border-[#232D42] font-mono text-xs text-white focus:outline-none focus:border-amber-400"
              >
                {AI_MODELS.filter((m) => m.isOpenWeights).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (${m.inputCostPer1M} in / ${m.outputCostPer1M} out per 1M on Managed API)
                  </option>
                ))}
              </select>
            </div>

            {/* Cluster Size */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-mono text-[#CBD5E1]">GPU Node Count</span>
                <span className="font-mono text-xs font-bold text-white">{gpuCount} GPU(s)</span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                step={1}
                value={gpuCount}
                onChange={(e) => setGpuCount(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>

            {/* Utilization Rate */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-mono text-[#CBD5E1]">Average Cluster Utilization</span>
                <span className="font-mono text-xs font-bold text-amber-400">{utilizationRate}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={95}
                step={5}
                value={utilizationRate}
                onChange={(e) => setUtilizationRate(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#475569] mt-1">
                <span>10% (Burst/Dev)</span>
                <span>50% (Production SRE)</span>
                <span>90% (Saturated Batch)</span>
              </div>
            </div>
          </div>

          {/* Verdict Dashboard (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Verdict Card */}
            <div
              className={`terminal-card rounded-xl p-5 border-l-4 ${
                isGpuCheaper ? 'border-l-emerald-400' : 'border-l-blue-400'
              }`}
            >
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#64748B]">
                Infrastructure Verdict at {utilizationRate}% Utilization
              </div>
              
              <div className="text-lg sm:text-xl font-mono font-bold text-white mt-1">
                {isGpuCheaper ? (
                  <span className="text-emerald-400">
                    Self-Hosted GPU is {formatUSD(monthlySavings)}/mo Cheaper
                  </span>
                ) : (
                  <span className="text-blue-400">
                    Managed API is {formatUSD(monthlySavings)}/mo Cheaper
                  </span>
                )}
              </div>

              <p className="text-xs text-[#94A3B8] mt-2 font-mono">
                {isGpuCheaper
                  ? `Your sustained volume justifies running ${gpuCount}x ${gpu.name}. Rented instances beat managed provider token billing.`
                  : `At ${utilizationRate}% utilization, server idle time eats your margins. Stick with Managed API until volume surpasses breakeven.`}
              </p>
            </div>

            {/* Side-by-Side Cost Numbers */}
            <div className="grid grid-cols-2 gap-3">
              <div className="terminal-card rounded-xl p-4">
                <div className="text-[11px] font-mono text-[#64748B]">GPU Server Cost</div>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {formatUSD(gpuMonthlyCost)}
                </div>
                <div className="text-[10px] font-mono text-[#64748B] mt-0.5">
                  ${gpu.hourlyRateUSD}/hr · 730 hrs/mo
                </div>
              </div>

              <div className="terminal-card rounded-xl p-4">
                <div className="text-[11px] font-mono text-[#64748B]">Managed API Equivalent</div>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {formatUSD(apiEquivalentCost)}
                </div>
                <div className="text-[10px] font-mono text-[#64748B] mt-0.5">
                  {(realisticMonthlyTokens / 1_000_000).toFixed(1)}M tokens produced
                </div>
              </div>
            </div>

            {/* Breakeven Rule of Thumb */}
            <div className="p-3.5 rounded-lg bg-[#141A26] border border-[#232D42] text-xs font-mono text-[#CBD5E1] flex items-center justify-between">
              <div>
                <span className="text-[#64748B]">Breakeven Daily Volume: </span>
                <strong className="text-white">
                  {(breakevenTokensDay / 1_000_000).toFixed(2)}M tokens/day
                </strong>
              </div>
              <span className="text-[11px] text-amber-400">Threshold Point</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
