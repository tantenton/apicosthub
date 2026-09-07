'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AI_MODELS, AIModel } from '@/data/models';
import {
  calculateAllModelsCost,
  CalculationParams,
  formatUSD,
  formatNumber,
} from '@/lib/calculator';
import {
  Sliders,
  DollarSign,
  Zap,
  TrendingDown,
  Layers,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Search,
  Filter,
} from 'lucide-react';

export default function HeroCalculator() {
  // Calculator State
  const [monthlyRequests, setMonthlyRequests] = useState<number>(100000);
  const [avgInputTokens, setAvgInputTokens] = useState<number>(1200);
  const [avgOutputTokens, setAvgOutputTokens] = useState<number>(450);
  const [cachedPercentage, setCachedPercentage] = useState<number>(30);
  const [batchDiscount, setBatchDiscount] = useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);

  const calcParams: CalculationParams = useMemo(
    () => ({
      monthlyRequests,
      avgInputTokens,
      avgOutputTokens,
      cachedInputPercentage: cachedPercentage,
      enableBatchDiscount: batchDiscount,
    }),
    [monthlyRequests, avgInputTokens, avgOutputTokens, cachedPercentage, batchDiscount]
  );

  // Filter models
  const filteredModels = useMemo(() => {
    if (selectedProvider === 'all') return AI_MODELS;
    return AI_MODELS.filter((m) => m.providerSlug === selectedProvider);
  }, [selectedProvider]);

  // Compute all costs
  const results = useMemo(() => {
    return calculateAllModelsCost(filteredModels, calcParams);
  }, [filteredModels, calcParams]);

  // Summary Highlights
  const lowestCost = results[0];
  const flagshipModels = results.filter((r) => r.model.qualityTier === 'Flagship / Frontier');
  const topFlagship = flagshipModels[0];

  const totalMonthlyTokens = monthlyRequests * (avgInputTokens + avgOutputTokens);

  // Calculate potential savings with caching on top model
  const cachingSavingsOnFlagship = useMemo(() => {
    if (!topFlagship) return 0;
    const noCacheParams = { ...calcParams, cachedInputPercentage: 0 };
    const noCacheResults = calculateAllModelsCost([topFlagship.model], noCacheParams);
    return Math.max(0, noCacheResults[0].totalMonthlyCostUSD - topFlagship.totalMonthlyCostUSD);
  }, [topFlagship, calcParams]);

  const copyMarkdownSummary = () => {
    const summary = `### API Cost Hub Estimate (${formatNumber(monthlyRequests)} reqs/mo, ${avgInputTokens} in / ${avgOutputTokens} out)
- **Lowest Cost Option:** ${lowestCost?.model.name} (${formatUSD(lowestCost?.totalMonthlyCostUSD)}/mo)
- **Frontier Value Pick:** ${topFlagship?.model.name} (${formatUSD(topFlagship?.totalMonthlyCostUSD)}/mo)
- **Monthly Token Volume:** ${formatNumber(totalMonthlyTokens)} tokens
- **Calculated at:** https://apicosthub.com`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-brand mb-4">
            <Zap className="h-3.5 w-3.5 text-accent-amber" />
            <span>Interactive AI Unit Economics Engine 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary">
            Calculate & Compare <span className="text-brand">LLM API Costs</span> in Real-Time
          </h1>
          <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed">
            Model token pricing across OpenAI, Anthropic, Google, and DeepSeek. Simulate prompt caching discounts, batch APIs, and request volumes to budget production AI architectures.
          </p>
        </div>

        {/* Highlight Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-border bg-surface p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-text-muted text-xs font-medium uppercase tracking-wider">
              <span>Lowest Cost Model</span>
              <TrendingDown className="h-4 w-4 text-accent-emerald" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold font-mono text-accent-emerald">
                {formatUSD(lowestCost?.totalMonthlyCostUSD || 0)}
              </span>
              <span className="text-xs text-text-muted"> / mo</span>
              <p className="mt-1 text-sm font-medium text-text-primary truncate">
                {lowestCost?.model.name}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-text-muted text-xs font-medium uppercase tracking-wider">
              <span>Frontier Tier Leader</span>
              <DollarSign className="h-4 w-4 text-brand" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold font-mono text-brand">
                {formatUSD(topFlagship?.totalMonthlyCostUSD || 0)}
              </span>
              <span className="text-xs text-text-muted"> / mo</span>
              <p className="mt-1 text-sm font-medium text-text-primary truncate">
                {topFlagship?.model.name}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-text-muted text-xs font-medium uppercase tracking-wider">
              <span>Monthly Tokens</span>
              <Layers className="h-4 w-4 text-accent-amber" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold font-mono text-text-primary">
                {formatNumber(totalMonthlyTokens)}
              </span>
              <span className="text-xs text-text-muted"> tokens</span>
              <p className="mt-1 text-xs text-text-muted">
                {formatNumber(monthlyRequests * avgInputTokens)} in / {formatNumber(monthlyRequests * avgOutputTokens)} out
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-text-muted text-xs font-medium uppercase tracking-wider">
              <span>Caching Savings</span>
              <Zap className="h-4 w-4 text-accent-emerald" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold font-mono text-accent-emerald">
                {formatUSD(cachingSavingsOnFlagship)}
              </span>
              <span className="text-xs text-text-muted"> / mo saved</span>
              <p className="mt-1 text-xs text-text-muted">
                At {cachedPercentage}% prefix cache hit rate
              </p>
            </div>
          </div>
        </div>

        {/* Main Controls Card */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 mb-10 shadow-xl shadow-black/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-border gap-4">
            <div className="flex items-center gap-2.5">
              <Sliders className="h-5 w-5 text-brand" />
              <h2 className="text-lg font-bold text-text-primary">Workload & Traffic Parameters</h2>
            </div>
            <button
              onClick={copyMarkdownSummary}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-hover px-3.5 py-1.5 text-xs font-medium text-text-secondary hover:text-white transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-accent-emerald" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Summary Copied!' : 'Copy Summary'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Control 1: Monthly Requests */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Monthly API Requests
                </label>
                <span className="font-mono text-sm font-bold text-brand bg-brand-subtle px-2 py-0.5 rounded border border-brand/20">
                  {formatNumber(monthlyRequests)}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="5000000"
                step="5000"
                value={monthlyRequests}
                onChange={(e) => setMonthlyRequests(Number(e.target.value))}
                className="w-full accent-brand h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex gap-1.5 pt-1">
                {[10000, 50000, 100000, 500000, 1000000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setMonthlyRequests(preset)}
                    className={`flex-1 text-[11px] font-mono py-1 rounded border transition-colors ${
                      monthlyRequests === preset
                        ? 'border-brand bg-brand/10 text-brand font-bold'
                        : 'border-border bg-surface-subtle text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {formatNumber(preset)}
                  </button>
                ))}
              </div>
            </div>

            {/* Control 2: Avg Input Tokens */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Avg Input Tokens / Req
                </label>
                <span className="font-mono text-sm font-bold text-text-primary bg-surface-hover px-2 py-0.5 rounded border border-border">
                  {avgInputTokens.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="32000"
                step="100"
                value={avgInputTokens}
                onChange={(e) => setAvgInputTokens(Number(e.target.value))}
                className="w-full accent-brand h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex gap-1.5 pt-1">
                {[
                  { label: '350 (Chat)', val: 350 },
                  { label: '1.2K (Std)', val: 1200 },
                  { label: '4K (Doc)', val: 4000 },
                  { label: '16K (RAG)', val: 16000 },
                ].map((p) => (
                  <button
                    key={p.val}
                    onClick={() => setAvgInputTokens(p.val)}
                    className={`flex-1 text-[11px] font-mono py-1 rounded border transition-colors ${
                      avgInputTokens === p.val
                        ? 'border-brand bg-brand/10 text-brand font-bold'
                        : 'border-border bg-surface-subtle text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Control 3: Avg Output Tokens */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Avg Output Tokens / Req
                </label>
                <span className="font-mono text-sm font-bold text-text-primary bg-surface-hover px-2 py-0.5 rounded border border-border">
                  {avgOutputTokens.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="8000"
                step="50"
                value={avgOutputTokens}
                onChange={(e) => setAvgOutputTokens(Number(e.target.value))}
                className="w-full accent-brand h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex gap-1.5 pt-1">
                {[
                  { label: '150 (Brief)', val: 150 },
                  { label: '450 (Std)', val: 450 },
                  { label: '1.5K (Code)', val: 1500 },
                  { label: '4K (Long)', val: 4000 },
                ].map((p) => (
                  <button
                    key={p.val}
                    onClick={() => setAvgOutputTokens(p.val)}
                    className={`flex-1 text-[11px] font-mono py-1 rounded border transition-colors ${
                      avgOutputTokens === p.val
                        ? 'border-brand bg-brand/10 text-brand font-bold'
                        : 'border-border bg-surface-subtle text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sub-controls: Caching & Batch API Toggles */}
          <div className="mt-8 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            
            {/* Prompt Caching Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-text-secondary">
                    Prompt Cache Hit Rate
                  </span>
                  <span className="text-[10px] text-text-muted">(Anthropic, OpenAI, DeepSeek)</span>
                </div>
                <span className="font-mono text-xs font-bold text-accent-emerald bg-accent-emeraldSubtle px-2 py-0.5 rounded">
                  {cachedPercentage}% Hit Rate
                </span>
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

            {/* Batch API 50% discount switch */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-surface-subtle p-3.5">
              <div>
                <p className="text-xs font-semibold text-text-primary">Enable Batch API (50% Off)</p>
                <p className="text-[11px] text-text-muted">
                  For async 24h queue jobs on supported providers
                </p>
              </div>
              <button
                onClick={() => setBatchDiscount(!batchDiscount)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  batchDiscount ? 'bg-brand' : 'bg-border'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    batchDiscount ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Provider Filtering Tabs */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {[
              { label: 'All Providers', slug: 'all' },
              { label: 'OpenAI', slug: 'openai' },
              { label: 'Anthropic', slug: 'anthropic' },
              { label: 'Google', slug: 'google' },
              { label: 'DeepSeek', slug: 'deepseek' },
              { label: 'Meta Llama', slug: 'meta' },
              { label: 'Mistral', slug: 'mistral' },
            ].map((p) => (
              <button
                key={p.slug}
                onClick={() => setSelectedProvider(p.slug)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  selectedProvider === p.slug
                    ? 'bg-brand text-white font-semibold shadow-sm'
                    : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <span className="text-xs font-mono text-text-muted">
            Showing {results.length} configured models
          </span>
        </div>

        {/* Master Comparison Table */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-subtle font-mono text-xs uppercase tracking-wider text-text-muted">
                  <th className="py-4 px-4 sm:px-6">Model & Provider</th>
                  <th className="py-4 px-3">Quality Tier</th>
                  <th className="py-4 px-3 text-right">Cost / 1K Reqs</th>
                  <th className="py-4 px-4 text-right">Monthly Spend</th>
                  <th className="py-4 px-3 text-right">Annual Run-Rate</th>
                  <th className="py-4 px-3">Context</th>
                  <th className="py-4 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {results.map((res, index) => {
                  const isLowest = index === 0;
                  return (
                    <tr
                      key={res.model.id}
                      className="hover:bg-surface-hover/80 transition-colors group"
                    >
                      {/* Model & Provider */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/model/${res.model.id}`}
                                className="font-semibold text-text-primary group-hover:text-brand transition-colors"
                              >
                                {res.model.name}
                              </Link>
                              {isLowest && (
                                <span className="inline-flex items-center rounded-full bg-accent-emeraldSubtle border border-accent-emerald/30 px-2 py-0.5 text-[10px] font-semibold text-accent-emerald">
                                  Best Value
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-text-muted">
                              {res.model.provider} · ${res.model.inputCostPer1M} in / ${res.model.outputCostPer1M} out (per 1M)
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Tier */}
                      <td className="py-4 px-3">
                        <span className="inline-block rounded px-2 py-0.5 text-xs font-mono border border-border bg-surface-subtle text-text-secondary">
                          {res.model.qualityTier}
                        </span>
                      </td>

                      {/* Cost per 1K Reqs */}
                      <td className="py-4 px-3 text-right font-mono font-medium text-text-primary">
                        {formatUSD(res.costPer1kRequestsUSD, 4)}
                      </td>

                      {/* Monthly Spend */}
                      <td className="py-4 px-4 text-right font-mono font-bold text-base">
                        <span className={isLowest ? 'text-accent-emerald' : 'text-text-primary'}>
                          {formatUSD(res.totalMonthlyCostUSD)}
                        </span>
                      </td>

                      {/* Annual */}
                      <td className="py-4 px-3 text-right font-mono text-xs text-text-secondary">
                        {formatUSD(res.annualCostUSD)}
                      </td>

                      {/* Context */}
                      <td className="py-4 px-3 font-mono text-xs text-text-muted">
                        {formatNumber(res.model.contextWindow)}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-center">
                        <Link
                          href={`/compare/${res.model.id}-vs-claude-3-5-sonnet`}
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text-secondary hover:text-white hover:border-brand transition-colors"
                        >
                          <span>Compare</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
