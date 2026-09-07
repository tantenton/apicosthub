'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { GPU_INSTANCES, AI_MODELS } from '@/data/models';
import {
  formatUSD,
  formatNumber,
} from '@/lib/calculator';
import { NvidiaLogo } from './ProviderLogos';
import { Cpu, Server, AlertCircle, CheckCircle2, Gauge } from 'lucide-react';

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

  const gpuHourlyRate = gpu.hourlyRateUSD ?? gpu.hourlyRate;
  const gpuMonthlyCost = gpuHourlyRate * 730 * gpuCount;

  // Real-world monthly token generation capacity based on utilization
  const monthlySecs = 730 * 3600;
  const theoreticalTokens = gpu.estimatedTokensPerSec * monthlySecs * gpuCount;
  const realisticMonthlyTokens = (theoreticalTokens * utilizationRate) / 100;

  // Cost to generate realisticMonthlyTokens on Managed API (70% in, 30% out)
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
    <section className="w-full py-10 border-t border-[#1E2538] bg-[#090B10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-8 pb-4 border-b border-[#1E2538] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Hardware Infrastructure Arbitrage</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Self-Hosted GPU vs Managed Cloud API Simulator
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl">
              Calculate exact volume thresholds where renting dedicated H100 or A100 instances on RunPod, Lambda, or Vast.ai outperforms paying per token on OpenAI, Anthropic, or Bedrock.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto text-xs text-[#94A3B8] bg-[#111520] px-3 py-1.5 rounded-lg border border-[#1E2538]">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>730 Operating Hours / Month</span>
          </div>
        </div>

        {/* 2-Column Main Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: Interactive Sliders & Hardware Selector */}
          <div className="lg:col-span-7 surface-card rounded-xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#1E2538] pb-3">
              <span className="text-xs text-white font-semibold flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" /> Hardware Configuration
              </span>
              <span className="text-xs text-[#94A3B8]">Config Matrix</span>
            </div>

            {/* GPU Select */}
            <div>
              <div className="text-xs text-[#94A3B8] mb-1.5 flex items-center justify-between">
                <span>Select Target GPU Cluster</span>
                <span className="text-emerald-400 font-bold font-mono">${gpuHourlyRate.toFixed(2)}/hr</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {GPU_INSTANCES.map((g) => {
                  const rate = g.hourlyRateUSD ?? g.hourlyRate;
                  const isSelected = g.id === selectedGpuId;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGpuId(g.id)}
                      className={`p-3 rounded-lg border text-left transition-all min-h-[44px] ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                          : 'bg-[#090B10] border-[#1E2538] text-[#94A3B8] hover:border-[#334155]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <NvidiaLogo className="w-3.5 h-3.5 text-emerald-400" />
                          {g.gpuName}
                        </span>
                        <span className="text-xs text-emerald-400 font-mono">${rate.toFixed(2)}/h</span>
                      </div>
                      <div className="text-xs text-[#94A3B8] mt-1 flex justify-between font-mono">
                        <span>{g.vramGB}GB VRAM</span>
                        <span>{g.estimatedTokensPerSec} tok/s</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Number of GPUs */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-[#94A3B8]">GPU Cluster Scale</span>
                <span className="text-white font-bold font-mono">{gpuCount}x GPU Node</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[1, 2, 4, 8].map((count) => (
                  <button
                    key={count}
                    onClick={() => setGpuCount(count)}
                    className={`py-2 rounded border text-center transition-all min-h-[38px] ${
                      gpuCount === count
                        ? 'bg-[#1C2333] border-emerald-500 text-white font-bold'
                        : 'bg-[#090B10] border-[#1E2538] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <span className="font-mono">{count}x</span> ({count * gpu.vramGB}GB)
                  </button>
                ))}
              </div>
            </div>

            {/* Target Comparison Model */}
            <div>
              <label className="block text-xs text-[#94A3B8] mb-1.5 flex items-center justify-between">
                <span>Compare Against Managed API Model</span>
                <span className="text-white font-bold">{model.name}</span>
              </label>
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="w-full bg-[#090B10] border border-[#1E2538] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 min-h-[44px]"
              >
                {AI_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider}): ${m.inputCostPer1M}/in, ${m.outputCostPer1M}/out
                  </option>
                ))}
              </select>
            </div>

            {/* Utilization Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-[#94A3B8] flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" /> GPU Utilization Rate
                </span>
                <span className="text-emerald-400 font-bold font-mono">{utilizationRate}% Capacity</span>
              </div>
              <input
                type="range"
                min={10}
                max={95}
                step={5}
                value={utilizationRate}
                onChange={(e) => setUtilizationRate(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-[#090B10] rounded-lg"
              />
              <div className="flex justify-between text-xs text-[#94A3B8] mt-1">
                <span>10% (Sporadic Dev)</span>
                <span>50% (Standard Prod)</span>
                <span>95% (Continuous Batch)</span>
              </div>
            </div>

            {/* Estimated monthly output */}
            <div className="p-3 bg-[#090B10] rounded-lg border border-[#1E2538] text-xs flex justify-between items-center">
              <span className="text-[#94A3B8]">Estimated Monthly Token Output:</span>
              <span className="text-white font-bold font-mono">{formatNumber(realisticMonthlyTokens)} tokens/mo</span>
            </div>
          </div>

          {/* Right: Decision Matrix & 3D Hardware Visual */}
          <div className="lg:col-span-5 flex flex-col gap-4">

            {/* Visual Hardware Render */}
            <div className="relative h-44 rounded-xl border border-[#1E2538] overflow-hidden group">
              <Image
                src="/images/gpu-server.png"
                alt="NVIDIA H100 GPU Cluster Data Center"
                fill
                className="object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111520] via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3 bg-[#090B10]/90 backdrop-blur-md px-2.5 py-1 rounded border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-1.5">
                <NvidiaLogo className="w-3.5 h-3.5" />
                <span>Dedicated GPU Cluster</span>
              </div>
            </div>

            {/* Verdict Card */}
            <div
              className={`p-5 rounded-xl border shadow-xl transition-all ${
                isGpuCheaper
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/20 border-amber-500/40 text-amber-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                {isGpuCheaper ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Verdict: Self-Hosting GPU is Cheaper</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <span>Verdict: Managed API is Cheaper</span>
                  </>
                )}
              </div>

              <div className="text-xs text-[#CBD5E1] space-y-1.5 my-3">
                <div className="flex justify-between py-1 border-b border-[#1E2538]">
                  <span>GPU Cluster Invoice:</span>
                  <span className="font-bold text-white font-mono">{formatUSD(gpuMonthlyCost)}/mo</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1E2538]">
                  <span>API Equivalent Cost:</span>
                  <span className="font-bold text-white font-mono">{formatUSD(apiEquivalentCost)}/mo</span>
                </div>
                <div className="flex justify-between py-1 font-bold">
                  <span>Net Monthly Arbitrage:</span>
                  <span className={`font-mono ${isGpuCheaper ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isGpuCheaper ? `Save ${formatUSD(monthlySavings)}/mo` : `API is cheaper by ${formatUSD(monthlySavings)}/mo`}
                  </span>
                </div>
              </div>

              {/* Breakeven Threshold */}
              <div className="mt-4 pt-3 border-t border-[#1E2538] text-xs leading-relaxed">
                <span className="text-[#94A3B8] block mb-1">Breakeven Crossover Point:</span>
                <p className="text-white">
                  You need at least <strong className="font-mono text-emerald-400">{formatNumber(breakevenTokensDay)} tokens/day</strong> (<span className="font-mono">{formatNumber(breakevenTokensMonth)}</span>/mo) for dedicated GPU hardware to break even against {model.name}.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
