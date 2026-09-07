'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { GPU_INSTANCES, AI_MODELS } from '@/data/models';
import {
  formatUSD,
  formatNumber,
} from '@/lib/calculator';
import { NvidiaLogo, ProviderIcon } from './ProviderLogos';
import { Cpu, Server, TrendingUp, AlertCircle, CheckCircle2, ArrowRight, Zap, Gauge } from 'lucide-react';

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
    <section className="w-full py-10 border-t border-[#1E2638] bg-[#080A0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-8 pb-4 border-b border-[#1E2638] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Hardware Infrastructure Arbitrage</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Self-Hosted GPU vs. Managed Cloud API Simulator
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl">
              Calculate exact volume thresholds where renting dedicated H100/A100 instances on RunPod, Lambda, or Vast.ai outperforms paying per token on OpenAI/Anthropic/Bedrock.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto font-mono text-[11px] text-[#94A3B8] bg-[#0E121B] px-3 py-1.5 rounded-lg border border-[#1E2638]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            730 Operating Hours / Month
          </div>
        </div>

        {/* 2-Column Main Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: Interactive Sliders & Hardware Selector */}
          <div className="lg:col-span-7 bg-[#0E121B] rounded-xl border border-[#1E2638] p-5 sm:p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1E2638] pb-3">
              <span className="font-mono text-xs text-white font-semibold flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" /> Hardware Configuration
              </span>
              <span className="text-[10px] font-mono text-[#64748B]">Config Matrix</span>
            </div>

            {/* GPU Select */}
            <div>
              <label className="block text-xs font-mono text-[#94A3B8] mb-1.5 flex items-center justify-between">
                <span>Select Target GPU Cluster</span>
                <span className="text-emerald-400 font-bold">${gpuHourlyRate.toFixed(2)}/hr</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {GPU_INSTANCES.map((g) => {
                  const rate = g.hourlyRateUSD ?? g.hourlyRate;
                  const isSelected = g.id === selectedGpuId;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGpuId(g.id)}
                      className={`p-3 rounded-lg border text-left font-mono transition-all ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                          : 'bg-[#080A0F] border-[#1E2638] text-[#94A3B8] hover:border-[#334155]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <NvidiaLogo className="w-3.5 h-3.5 text-emerald-400" />
                          {g.gpuName}
                        </span>
                        <span className="text-[10px] text-emerald-400">${rate.toFixed(2)}/h</span>
                      </div>
                      <div className="text-[10px] text-[#64748B] mt-1 flex justify-between">
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
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-[#94A3B8]">GPU Cluster Scale</span>
                <span className="text-white font-bold">{gpuCount}x GPU Node</span>
              </div>
              <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                {[1, 2, 4, 8].map((count) => (
                  <button
                    key={count}
                    onClick={() => setGpuCount(count)}
                    className={`py-2 rounded border text-center transition-all ${
                      gpuCount === count
                        ? 'bg-[#1E2638] border-emerald-500 text-white font-bold'
                        : 'bg-[#080A0F] border-[#1E2638] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {count}x ({count * gpu.vramGB}GB)
                  </button>
                ))}
              </div>
            </div>

            {/* Target Comparison Model */}
            <div>
              <label className="block text-xs font-mono text-[#94A3B8] mb-1.5 flex items-center justify-between">
                <span>Compare Against Managed API Model</span>
                <span className="text-white font-bold">{model.name}</span>
              </label>
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="w-full bg-[#080A0F] border border-[#1E2638] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              >
                {AI_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider}) — ${m.inputCostPer1M}/in, ${m.outputCostPer1M}/out
                  </option>
                ))}
              </select>
            </div>

            {/* Utilization Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-[#94A3B8] flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" /> GPU Utilization Rate
                </span>
                <span className="text-emerald-400 font-bold">{utilizationRate}% Capacity</span>
              </div>
              <input
                type="range"
                min={10}
                max={95}
                step={5}
                value={utilizationRate}
                onChange={(e) => setUtilizationRate(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-[#080A0F] rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#475569] mt-1">
                <span>10% (Sporadic Dev)</span>
                <span>50% (Standard Prod)</span>
                <span>95% (Continuous Batch)</span>
              </div>
            </div>

            {/* Estimated monthly output */}
            <div className="p-3 bg-[#080A0F] rounded-lg border border-[#1E2638] font-mono text-xs flex justify-between items-center">
              <span className="text-[#94A3B8]">Est. Monthly Token Output:</span>
              <span className="text-white font-bold">{formatNumber(realisticMonthlyTokens)} tokens/mo</span>
            </div>
          </div>

          {/* Right: Decision Matrix & 3D Hardware Visual */}
          <div className="lg:col-span-5 flex flex-col gap-4">

            {/* Visual Hardware Render from 9Router */}
            <div className="relative h-44 rounded-xl border border-[#1E2638] overflow-hidden group">
              <Image
                src="/images/gpu-server.png"
                alt="NVIDIA H100 GPU Cluster Data Center"
                fill
                className="object-cover object-center opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E121B] via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3 bg-[#080A0F]/90 backdrop-blur-md px-2.5 py-1 rounded border border-emerald-500/30 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                <NvidiaLogo className="w-3.5 h-3.5" />
                <span>RunPod / Lambda Serverless Fabric</span>
              </div>
            </div>

            {/* Verdict Card */}
            <div
              className={`p-5 rounded-xl border font-mono shadow-xl transition-all ${
                isGpuCheaper
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/20 border-amber-500/40 text-amber-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                {isGpuCheaper ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>VERDICT: SELF-HOSTING GPU IS CHEAPER</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <span>VERDICT: MANAGED API IS CHEAPER</span>
                  </>
                )}
              </div>

              <div className="text-xs text-[#CBD5E1] space-y-1.5 my-3">
                <div className="flex justify-between py-1 border-b border-[#1E2638]">
                  <span>GPU Cluster Invoice:</span>
                  <span className="font-bold text-white">{formatUSD(gpuMonthlyCost)}/mo</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1E2638]">
                  <span>API Equivalent Cost:</span>
                  <span className="font-bold text-white">{formatUSD(apiEquivalentCost)}/mo</span>
                </div>
                <div className="flex justify-between py-1 font-bold">
                  <span>Net Monthly Arbitrage:</span>
                  <span className={isGpuCheaper ? 'text-emerald-400' : 'text-amber-400'}>
                    {isGpuCheaper ? `Save ${formatUSD(monthlySavings)}/mo` : `API is cheaper by ${formatUSD(monthlySavings)}/mo`}
                  </span>
                </div>
              </div>

              {/* Breakeven Threshold */}
              <div className="mt-4 pt-3 border-t border-[#1E2638] text-[11px] leading-relaxed">
                <span className="text-[#64748B] block mb-1">Breakeven Crossover Point:</span>
                <p className="text-white">
                  You need at least <strong>{formatNumber(breakevenTokensDay)} tokens/day</strong> ({formatNumber(breakevenTokensMonth)}/mo) for dedicated GPU hardware to break even against {model.name}.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
