'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { GPU_INSTANCES, AI_MODELS } from '../data/models';
import { calculateGpuBreakeven, formatCurrency, formatTokens } from '../lib/calculator';
import { Server, Cpu, Zap, ArrowRight, CheckCircle, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

export default function GpuVsApiSection() {
  const [selectedGpuId, setSelectedGpuId] = useState<string>('8x-h100-sxm5');
  const [selectedApiId, setSelectedApiId] = useState<string>('llama-3-3-70b');
  const [utilizationRate, setUtilizationRate] = useState<number>(65);

  const selectedGpu = useMemo(
    () => GPU_INSTANCES.find((g) => g.id === selectedGpuId) || GPU_INSTANCES[0],
    [selectedGpuId]
  );

  const selectedApiModel = useMemo(
    () => AI_MODELS.find((m) => m.id === selectedApiId) || AI_MODELS[0],
    [selectedApiId]
  );

  const breakevenData = useMemo(() => {
    return calculateGpuBreakeven({
      gpu: selectedGpu,
      apiModel: selectedApiModel,
      utilizationRate,
    });
  }, [selectedGpu, selectedApiModel, utilizationRate]);

  return (
    <section className="w-full max-w-7xl px-4 sm:px-6 my-10">
      <div className="surface-card rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
              <Server className="w-3.5 h-3.5 text-indigo-600" />
              <span>Self-Hosted Infrastructure Arbitrage</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Cloud GPU vs Hosted API Breakeven Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Determine the precise monthly token volume where self-hosting vLLM / SGLang on dedicated GPU nodes becomes cheaper than cloud APIs.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
            <span>Includes 20% MLOps & Egress Overhead</span>
          </div>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Hardware Config */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                GPU Node Instance
              </span>
              <Cpu className="w-4 h-4 text-indigo-600" />
            </div>

            <select
              value={selectedGpuId}
              onChange={(e) => setSelectedGpuId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {GPU_INSTANCES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} (${g.hourlyCost.toFixed(2)}/hr)
                </option>
              ))}
            </select>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">VRAM Buffer:</span>
                <span className="font-mono font-bold text-slate-900">{selectedGpu.vramGb} GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Base Hourly:</span>
                <span className="font-mono font-bold text-slate-900">${selectedGpu.hourlyCost.toFixed(2)}/hr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Monthly Node Bill:</span>
                <span className="font-mono font-bold text-indigo-600">${selectedGpu.monthlyCostWithOverhead.toLocaleString()}/mo</span>
              </div>
            </div>
          </div>

          {/* Model Config */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Comparable Cloud API
              </span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>

            <select
              value={selectedApiId}
              onChange={(e) => setSelectedApiId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {AI_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (${m.inputPricePerMillion.toFixed(2)}/${m.outputPricePerMillion.toFixed(2)})
                </option>
              ))}
            </select>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Provider:</span>
                <span className="font-bold text-slate-900">{selectedApiModel.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Input Price / 1M:</span>
                <span className="font-mono font-bold text-slate-900">${selectedApiModel.inputPricePerMillion.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Output Price / 1M:</span>
                <span className="font-mono font-bold text-slate-900">${selectedApiModel.outputPricePerMillion.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Utilization Slider */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Target GPU Utilization
              </span>
              <span className="font-mono font-bold text-indigo-600 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-xs">
                {utilizationRate}% Duty Cycle
              </span>
            </div>

            <div className="pt-3">
              <input
                type="range"
                min={20}
                max={95}
                step={5}
                value={utilizationRate}
                onChange={(e) => setUtilizationRate(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>20% (Spiky)</span>
                <span>65% (Balanced)</span>
                <span>95% (Continuous)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-slate-600">
              High utilization lowers unit cost per token, but increases queue latency during peak traffic bursts.
            </div>
          </div>
        </div>

        {/* Breakeven Result Banner */}
        <div className="mt-8 p-6 rounded-2xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Mathematical Breakeven Threshold
            </div>
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Self-hosting is cheaper above{' '}
              <span className="text-emerald-400 font-mono">
                {formatTokens(breakevenData.breakevenTokensPerMonth)} tokens/mo
              </span>
            </div>
            <p className="text-xs text-slate-400">
              At this monthly volume, your ${selectedGpu.monthlyCostWithOverhead.toLocaleString()}/mo cluster equals the exact hosted API spend.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/calculator/gpu-vs-api"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Detailed TCO Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
