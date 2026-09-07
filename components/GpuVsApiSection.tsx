'use client';

import React, { useState, useMemo } from 'react';
import { GPU_INSTANCES, AI_MODELS } from '@/data/models';
import {
  calculateGpuBreakeven,
  CalculationParams,
  formatUSD,
  formatNumber,
} from '@/lib/calculator';
import { Cpu, Server, CheckCircle2, AlertCircle, TrendingUp, Info } from 'lucide-react';

export default function GpuVsApiSection() {
  const [selectedGpuId, setSelectedGpuId] = useState<string>('a100-80gb');
  const [targetModelId, setTargetModelId] = useState<string>('llama-3-3-70b');
  const [monthlyRequests, setMonthlyRequests] = useState<number>(350000);
  const [avgInputTokens, setAvgInputTokens] = useState<number>(1000);
  const [avgOutputTokens, setAvgOutputTokens] = useState<number>(400);

  const selectedGpu = useMemo(
    () => GPU_INSTANCES.find((g) => g.id === selectedGpuId) || GPU_INSTANCES[2],
    [selectedGpuId]
  );
  const targetModel = useMemo(
    () => AI_MODELS.find((m) => m.id === targetModelId) || AI_MODELS[12],
    [targetModelId]
  );

  const params: CalculationParams = useMemo(
    () => ({
      monthlyRequests,
      avgInputTokens,
      avgOutputTokens,
      cachedInputPercentage: 0,
      enableBatchDiscount: false,
    }),
    [monthlyRequests, avgInputTokens, avgOutputTokens]
  );

  const breakeven = useMemo(
    () => calculateGpuBreakeven(selectedGpu, targetModel, params),
    [selectedGpu, targetModel, params]
  );

  return (
    <section className="w-full py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          
          <div className="flex items-center gap-3 pb-6 border-b border-border">
            <Cpu className="h-6 w-6 text-accent-amber" />
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Self-Hosted GPU vs Managed API Breakeven Engine
              </h2>
              <p className="text-xs text-text-secondary">
                Calculate when spinning up dedicated cloud GPUs (vLLM / TGI) on RunPod/Lambda becomes cheaper than pay-per-token APIs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-8">
            
            {/* Column 1: Configuration Controls */}
            <div className="space-y-5 lg:col-span-1 border-b lg:border-b-0 lg:border-r border-border pb-6 lg:pb-0 lg:pr-6">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-text-muted mb-2 block">
                  Select Dedicated GPU Instance
                </label>
                <select
                  value={selectedGpuId}
                  onChange={(e) => setSelectedGpuId(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface-subtle px-3.5 py-2.5 text-sm font-semibold text-text-primary focus:border-brand focus:outline-none"
                >
                  {GPU_INSTANCES.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.gpuName} — ${g.hourlyRate}/hr ({g.provider})
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-[11px] text-text-muted">
                  Recommended for: {selectedGpu.optimalModelSize}
                </p>
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-text-muted mb-2 block">
                  Compare vs Managed Model API
                </label>
                <select
                  value={targetModelId}
                  onChange={(e) => setTargetModelId(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface-subtle px-3.5 py-2.5 text-sm font-semibold text-text-primary focus:border-brand focus:outline-none"
                >
                  {AI_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (${m.inputCostPer1M}/${m.outputCostPer1M} per 1M)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-xs font-medium text-text-secondary">
                  <span>Monthly Workload:</span>
                  <span className="font-mono text-brand font-bold">{formatNumber(monthlyRequests)} reqs</span>
                </div>
                <input
                  type="range"
                  min="25000"
                  max="2000000"
                  step="25000"
                  value={monthlyRequests}
                  onChange={(e) => setMonthlyRequests(Number(e.target.value))}
                  className="w-full accent-brand h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Column 2 & 3: Results & Comparison Cards */}
            <div className="lg:col-span-2 flex flex-col justify-between space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Dedicated GPU Instance Cost */}
                <div className="rounded-xl border border-border bg-surface-subtle p-5">
                  <div className="flex items-center justify-between text-xs font-mono text-text-muted uppercase">
                    <span>Dedicated Cloud GPU (730h)</span>
                    <Server className="h-4 w-4 text-accent-amber" />
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-bold font-mono text-text-primary">
                      {formatUSD(breakeven.monthlyGpuCostUSD)}
                    </span>
                    <span className="text-xs text-text-muted"> / month flat</span>
                    <p className="mt-2 text-xs text-text-secondary">
                      Max throughput: ~{formatNumber(breakeven.monthlyTokensCapacity)} tokens/mo @ 55% avg duty cycle.
                    </p>
                  </div>
                </div>

                {/* Managed API Equivalent Cost */}
                <div className="rounded-xl border border-border bg-surface-subtle p-5">
                  <div className="flex items-center justify-between text-xs font-mono text-text-muted uppercase">
                    <span>Managed API Pay-As-You-Go</span>
                    <Cpu className="h-4 w-4 text-brand" />
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-bold font-mono text-brand">
                      {formatUSD(breakeven.apiCostEquivalentUSD)}
                    </span>
                    <span className="text-xs text-text-muted"> / month</span>
                    <p className="mt-2 text-xs text-text-secondary">
                      Zero ops overhead, autoscaling from 0 to peak without idle server bills.
                    </p>
                  </div>
                </div>

              </div>

              {/* Breakeven Verdict Box */}
              <div
                className={`rounded-xl border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  breakeven.isGpuCheaper
                    ? 'border-accent-emerald/40 bg-accent-emeraldSubtle/20'
                    : 'border-brand/40 bg-brand-subtle/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  {breakeven.isGpuCheaper ? (
                    <CheckCircle2 className="h-5 w-5 text-accent-emerald mt-0.5" />
                  ) : (
                    <Info className="h-5 w-5 text-brand mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-text-primary">
                      {breakeven.isGpuCheaper
                        ? `Dedicated GPU is ${formatUSD(breakeven.monthlySavingsUSD)}/mo cheaper at this scale`
                        : `Managed API is more cost-effective for your current traffic`}
                    </h4>
                    <p className="text-xs text-text-secondary mt-1">
                      Breakeven inflection point occurs at{' '}
                      <span className="font-mono font-bold text-text-primary">
                        {formatNumber(breakeven.breakevenRequestsPerMonth)} requests/month
                      </span>
                      .
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
