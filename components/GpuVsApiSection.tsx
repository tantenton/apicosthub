'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { GPU_INSTANCES, AI_MODELS } from '@/data/models';
import {
  formatUSD,
  formatNumber,
} from '@/lib/calculator';
import { NvidiaLogo } from './ProviderLogos';
import { Cpu, Server, AlertCircle, CheckCircle2, Gauge, HardDrive } from 'lucide-react';

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
    <section className="w-full py-12 border-t border-white/10 bg-[#08090a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-8 pb-4 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">
              <Server className="w-4 h-4 text-indigo-400" />
              <span>Hardware Infrastructure Arbitrage</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
              Self-Hosted GPU vs Managed Cloud API Simulator
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Calculate exact volume thresholds where renting dedicated H100 or A100 instances on RunPod, Lambda, or Vast.ai outperforms paying per token on OpenAI, Anthropic, or Bedrock.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto text-xs text-slate-400 bg-white/[0.03] px-3.5 py-1.5 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>730 Operating Hours / Month</span>
          </div>
        </div>

        {/* 2-Column Main Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: Interactive Sliders & Hardware Selector */}
          <div className="lg:col-span-7 surface-card rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs text-white font-semibold flex items-center gap-2 uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-indigo-400" /> Hardware Configuration
              </span>
              <span className="text-xs text-slate-500">Config Matrix</span>
            </div>

            {/* GPU Select */}
            <div>
              <div className="text-xs text-slate-400 mb-2 flex items-center justify-between font-medium">
                <span>Select Target GPU Cluster</span>
                <span className="text-indigo-400 font-bold font-mono">${gpuHourlyRate.toFixed(2)}/hr</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {GPU_INSTANCES.map((g) => {
                  const rate = g.hourlyRateUSD ?? g.hourlyRate;
                  const isSelected = g.id === selectedGpuId;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGpuId(g.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all min-h-[44px] ${
                        isSelected
                          ? 'bg-indigo-600/15 border-indigo-500/50 text-white shadow-sm'
                          : 'bg-[#08090a] border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <NvidiaLogo className="w-3.5 h-3.5 text-indigo-400" />
                          {g.gpuName}
                        </span>
                        <span className="text-xs text-indigo-400 font-mono">${rate.toFixed(2)}/h</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1.5 flex justify-between font-mono">
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
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-400 font-medium">GPU Cluster Scale</span>
                <span className="text-white font-bold font-mono">{gpuCount}x GPU Node</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[1, 2, 4, 8].map((count) => (
                  <button
                    key={count}
                    onClick={() => setGpuCount(count)}
                    className={`py-2 rounded-xl border text-center transition-all min-h-[38px] ${
                      gpuCount === count
                        ? 'bg-indigo-600 text-white font-bold border-indigo-500'
                        : 'bg-[#08090a] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="font-mono">{count}x</span> ({count * gpu.vramGB}GB)
                  </button>
                ))}
              </div>
            </div>

            {/* Target Comparison Model */}
            <div>
              <label className="text-xs text-slate-400 mb-2 flex items-center justify-between font-medium">
                <span>Compare Against Managed API Model</span>
                <span className="text-white font-bold">{model.name}</span>
              </label>
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="w-full bg-[#08090a] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 min-h-[44px]"
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
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-400 flex items-center gap-1 font-medium">
                  <Gauge className="w-3.5 h-3.5 text-indigo-400" /> GPU Utilization Rate
                </span>
                <span className="text-indigo-400 font-bold font-mono">{utilizationRate}% Capacity</span>
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
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>10% (Sporadic Dev)</span>
                <span>50% (Standard Prod)</span>
                <span>95% (Continuous Batch)</span>
              </div>
            </div>

            {/* Estimated monthly output */}
            <div className="p-3.5 bg-[#08090a] rounded-xl border border-white/10 text-xs flex justify-between items-center">
              <span className="text-slate-400">Estimated Monthly Token Output:</span>
              <span className="text-white font-bold font-mono">{formatNumber(realisticMonthlyTokens)} tokens/mo</span>
            </div>
          </div>

          {/* Right: Decision Matrix & 3D Hardware Visual */}
          <div className="lg:col-span-5 flex flex-col gap-4">

            {/* Comparison Outcome Card */}
            <div
              className={`surface-card rounded-2xl p-6 border-l-4 shadow-xl ${
                isGpuCheaper ? 'border-l-indigo-500' : 'border-l-amber-500'
              }`}
            >
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold">
                {isGpuCheaper ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span className="text-indigo-400">Dedicated GPU Wins (High Volume)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400">Cloud API Wins (Low/Variable Volume)</span>
                  </>
                )}
              </div>

              <div className="mt-4 flex items-baseline gap-2 font-mono">
                <span className="text-3xl font-bold text-white tracking-tight">
                  {formatUSD(monthlySavings)}
                </span>
                <span className="text-xs text-slate-400">/ mo net differential</span>
              </div>

              <div className="mt-4 space-y-2 text-xs border-t border-white/10 pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Dedicated GPU Cost (730h):</span>
                  <span className="text-white font-mono font-bold">{formatUSD(gpuMonthlyCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Managed API Equivalent:</span>
                  <span className="text-white font-mono font-bold">{formatUSD(apiEquivalentCost)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-white/5">
                  <span className="text-slate-400">Daily Breakeven Volume:</span>
                  <span className="text-indigo-400 font-mono font-bold">
                    ~{formatNumber(breakevenTokensDay)} tokens/day
                  </span>
                </div>
              </div>
            </div>

            {/* Hardware Visual */}
            <div className="surface-card rounded-2xl p-5 shadow-xl flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                  Cluster Telemetry
                </span>
                <span className="text-xs font-mono text-slate-400">SXM5 Spec</span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-white/10 my-1 bg-[#08090a]">
                <Image
                  src="/images/gpu-server.png"
                  alt="Enterprise GPU Server Topology"
                  width={600}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="text-xs text-slate-400 mt-3 space-y-1">
                <p>
                  Self-hosting requires engineering overhead: vLLM or TensorRT-LLM setup, cold-start latency mitigation, and 99.9% uptime SLA monitoring.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
