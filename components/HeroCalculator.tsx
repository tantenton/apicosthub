'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AI_MODELS, AIModel } from '@/data/models';
import { ProviderIcon } from './ProviderLogos';
import TokenFlowCanvas from './TokenFlowCanvas';
import {
  calculateAllModelsCost,
  CalculationParams,
  formatUSD,
  formatNumber,
  formatContextWindow,
} from '@/lib/calculator';
import {
  Sliders,
  Check,
  Copy,
  Layers,
  Code2,
  Search,
  ArrowUpDown,
  RotateCcw,
  Activity,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';

const WORKLOAD_PRESETS = [
  {
    id: 'support',
    name: 'Customer Support Bot',
    desc: '1M calls · 800 in / 250 out · 60% cache',
    requests: 1_000_000,
    inputTokens: 800,
    outputTokens: 250,
    cachedPercent: 60,
    batch: false,
  },
  {
    id: 'agentic',
    name: 'Multi-Step Autonomous Agent',
    desc: '250K turns · 6,000 in / 1,200 out · 75% cache',
    requests: 250_000,
    inputTokens: 6_000,
    outputTokens: 1_200,
    cachedPercent: 75,
    batch: false,
  },
  {
    id: 'rag',
    name: 'RAG Knowledge Search',
    desc: '500K queries · 3,500 in / 400 out · 50% cache',
    requests: 500_000,
    inputTokens: 3_500,
    outputTokens: 400,
    cachedPercent: 50,
    batch: false,
  },
  {
    id: 'coding',
    name: 'Code Completion Assistant',
    desc: '2.5M completions · 1,500 in / 120 out · 85% cache',
    requests: 2_500_000,
    inputTokens: 1_500,
    outputTokens: 120,
    cachedPercent: 85,
    batch: false,
  },
  {
    id: 'batch_nlp',
    name: 'Batch Document Analysis',
    desc: '100K docs · 12,000 in / 1,500 out · 50% Batch discount',
    requests: 100_000,
    inputTokens: 12_000,
    outputTokens: 1_500,
    cachedPercent: 30,
    batch: true,
  },
];

type SortKey = 'cost' | 'name' | 'provider' | 'input' | 'output';

export default function HeroCalculator() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'simulator' | 'sandbox'>('matrix');

  // Parameters
  const [monthlyRequests, setMonthlyRequests] = useState<number>(500_000);
  const [avgInputTokens, setAvgInputTokens] = useState<number>(1_500);
  const [avgOutputTokens, setAvgOutputTokens] = useState<number>(500);
  const [cachedPercentage, setCachedPercentage] = useState<number>(40);
  const [batchEnabled, setBatchEnabled] = useState<boolean>(false);

  // Filters & Sorting
  const [selectedProvider, setSelectedProvider] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortKey>('cost');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Token Sandbox
  const [sandboxText, setSandboxText] = useState<string>(
    'Review the database query latency profile and propose index partitioning options.'
  );

  // Calculation parameters
  const params: CalculationParams = useMemo(
    () => ({
      monthlyRequests,
      avgInputTokens,
      avgOutputTokens,
      cachedInputPercentage: cachedPercentage,
      batchDiscount: batchEnabled,
    }),
    [monthlyRequests, avgInputTokens, avgOutputTokens, cachedPercentage, batchEnabled]
  );

  const allResults = useMemo(() => calculateAllModelsCost(params), [params]);

  // Filtered & Sorted results
  const filteredResults = useMemo(() => {
    const list = allResults.filter(({ model }) => {
      const matchProvider = selectedProvider === 'All' || model.provider === selectedProvider;
      const matchSearch =
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.provider.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProvider && matchSearch;
    });

    list.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'cost') comparison = a.totalMonthlyCost - b.totalMonthlyCost;
      else if (sortBy === 'name') comparison = a.model.name.localeCompare(b.model.name);
      else if (sortBy === 'provider') comparison = a.model.provider.localeCompare(b.model.provider);
      else if (sortBy === 'input') comparison = a.model.inputCostPer1M - b.model.inputCostPer1M;
      else if (sortBy === 'output') comparison = a.model.outputCostPer1M - b.model.outputCostPer1M;
      return sortAsc ? comparison : -comparison;
    });

    return list;
  }, [allResults, selectedProvider, searchQuery, sortBy, sortAsc]);

  const lowestCost = filteredResults[0];
  const totalTokensMonthly = (monthlyRequests * (avgInputTokens + avgOutputTokens)) / 1_000_000;
  const maxSavings = lowestCost?.savingsFromCaching ?? 0;

  const handleApplyPreset = (preset: (typeof WORKLOAD_PRESETS)[0]) => {
    setMonthlyRequests(preset.requests);
    setAvgInputTokens(preset.inputTokens);
    setAvgOutputTokens(preset.outputTokens);
    setCachedPercentage(preset.cachedPercent);
    setBatchEnabled(preset.batch);
  };

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(key);
      setSortAsc(true);
    }
  };

  const handleResetFilters = () => {
    setSelectedProvider('All');
    setSearchQuery('');
  };

  const handleCopyMarkdown = () => {
    let md = `| Model | Provider | Monthly Cost | Cost / 1k Calls | Input/1M | Output/1M |\n|---|---|---|---|---|---|\n`;
    filteredResults.slice(0, 10).forEach(({ model, totalMonthlyCost, costPer1kRequests }) => {
      md += `| ${model.name} | ${model.provider} | ${formatUSD(totalMonthlyCost)} | ${formatUSD(
        costPer1kRequests
      )} | $${model.inputCostPer1M} | $${model.outputCostPer1M} |\n`;
    });
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sandboxTokens = Math.max(1, Math.round(sandboxText.length / 4));

  return (
    <section className="w-full pt-6 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                TOKENOMICS CALCULATOR
              </span>
              <span className="text-xs text-slate-400">Verified September 2026</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
              LLM API Pricing & Monthly Expense Calculator
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Model token expenditure across frontier providers with prompt caching discounts, asynchronous batch rates, and context size specifications.
            </p>
          </div>

          {/* Workbench Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10 self-start md:self-auto text-xs font-medium">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'matrix'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-white" />
              <span>Model Matrix</span>
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'simulator'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-white" />
              <span>Live Flow Canvas</span>
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'sandbox'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-white" />
              <span>Tokenizer</span>
            </button>
          </div>
        </div>

        {/* Workload Presets */}
        <div className="mb-6">
          <div className="text-xs text-slate-400 mb-2 font-medium">
            Reference Workload Scenarios:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {WORKLOAD_PRESETS.map((preset) => {
              const isActive =
                monthlyRequests === preset.requests &&
                avgInputTokens === preset.inputTokens &&
                avgOutputTokens === preset.outputTokens;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-3 rounded-xl text-left transition-all border min-h-[44px] ${
                    isActive
                      ? 'bg-indigo-600/15 border-indigo-500/50 text-white shadow-sm'
                      : 'bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-semibold text-white flex items-center justify-between">
                    <span>{preset.name}</span>
                    {isActive && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <div className="text-xs text-slate-500 truncate mt-1">
                    {preset.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Sliders Column */}
          <div className="lg:col-span-7 surface-card rounded-2xl p-5 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Workload Parameters
              </div>
              <span className="text-xs text-slate-500">Real-time dynamic adjustment</span>
            </div>

            {/* Dial 1: Monthly Requests */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Monthly API Invocations
                </label>
                <div className="flex items-center gap-1.5 font-mono">
                  <input
                    type="number"
                    min={1000}
                    max={100000000}
                    step={10000}
                    value={monthlyRequests}
                    onChange={(e) => setMonthlyRequests(Number(e.target.value))}
                    className="w-28 px-2.5 py-1 rounded-lg bg-[#08090a] border border-white/10 text-right text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-xs text-slate-500">calls</span>
                </div>
              </div>
              <input
                type="range"
                min={10000}
                max={10000000}
                step={25000}
                value={monthlyRequests}
                onChange={(e) => setMonthlyRequests(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-xs font-mono text-slate-500 mt-1">
                <span>10K</span>
                <span>1M</span>
                <span>5M</span>
                <span>10M</span>
              </div>
            </div>

            {/* Dial 2: Input Tokens */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Input Tokens per Call (System Context + User Prompt)
                </label>
                <div className="flex items-center gap-1.5 font-mono">
                  <input
                    type="number"
                    min={10}
                    max={2000000}
                    step={100}
                    value={avgInputTokens}
                    onChange={(e) => setAvgInputTokens(Number(e.target.value))}
                    className="w-24 px-2.5 py-1 rounded-lg bg-[#08090a] border border-white/10 text-right text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-xs text-slate-500">tok</span>
                </div>
              </div>
              <input
                type="range"
                min={100}
                max={64000}
                step={200}
                value={avgInputTokens}
                onChange={(e) => setAvgInputTokens(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-xs font-mono text-slate-500 mt-1">
                <span>100 (Short)</span>
                <span>2,000 (Chat)</span>
                <span>16,000 (Doc)</span>
                <span>64,000 (RAG)</span>
              </div>
            </div>

            {/* Dial 3: Output Tokens */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Output Tokens per Call (Generated Content)
                </label>
                <div className="flex items-center gap-1.5 font-mono">
                  <input
                    type="number"
                    min={10}
                    max={128000}
                    step={50}
                    value={avgOutputTokens}
                    onChange={(e) => setAvgOutputTokens(Number(e.target.value))}
                    className="w-24 px-2.5 py-1 rounded-lg bg-[#08090a] border border-white/10 text-right text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-xs text-slate-500">tok</span>
                </div>
              </div>
              <input
                type="range"
                min={50}
                max={8192}
                step={50}
                value={avgOutputTokens}
                onChange={(e) => setAvgOutputTokens(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-xs font-mono text-slate-500 mt-1">
                <span>50 (JSON)</span>
                <span>500 (Standard)</span>
                <span>2,000 (Code)</span>
                <span>8,000 (Report)</span>
              </div>
            </div>

            {/* Advanced Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/10">
              <div className="bg-[#08090a] p-3.5 rounded-xl border border-white/10">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-medium text-white">Prompt Caching Hit Rate</span>
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {cachedPercentage}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={95}
                  step={5}
                  value={cachedPercentage}
                  onChange={(e) => setCachedPercentage(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
                <span className="text-xs text-slate-500 block mt-1 leading-normal">
                  Reduces input token billing by 50% to 90% for repeated prefix contexts.
                </span>
              </div>

              <div
                onClick={() => setBatchEnabled(!batchEnabled)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-colors flex flex-col justify-between ${
                  batchEnabled
                    ? 'bg-indigo-500/10 border-indigo-500/40'
                    : 'bg-[#08090a] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white">Batch API (Asynchronous)</span>
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded-md font-bold ${
                      batchEnabled ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {batchEnabled ? '50% DISCOUNT' : 'STANDARD'}
                  </span>
                </div>
                <span className="text-xs text-slate-500 mt-1 leading-normal">
                  Calculates 50% off-peak discount for 24-hour turnaround background jobs.
                </span>
              </div>
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Projected Lowest Card */}
            <div className="surface-card rounded-2xl p-5 border-l-4 border-l-indigo-500 glow-card">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium flex items-center justify-between">
                <span>Lowest Monthly Projected Cost</span>
                <span className="text-indigo-400 font-mono text-xs">OPTIMIZED TIER</span>
              </div>
              
              <div className="mt-2 flex items-baseline gap-2 font-mono">
                <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  {lowestCost ? formatUSD(lowestCost.totalMonthlyCost) : '$0'}
                </span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>

              {lowestCost && (
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ProviderIcon provider={lowestCost.model.provider} className="w-4 h-4" />
                    <span className="font-semibold text-white">{lowestCost.model.name}</span>
                  </div>
                  <span className="text-indigo-400 font-mono">
                    {formatUSD(lowestCost.costPer1kRequests)} per 1K calls
                  </span>
                </div>
              )}
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="surface-card rounded-2xl p-4">
                <div className="text-xs text-slate-400">Total Monthly Tokens</div>
                <div className="text-lg font-mono font-bold text-white mt-1">
                  {totalTokensMonthly >= 1000
                    ? `${(totalTokensMonthly / 1000).toFixed(2)}B`
                    : `${totalTokensMonthly.toFixed(1)}M`}
                </div>
                <div className="text-xs font-mono text-slate-500 mt-1">
                  {((monthlyRequests * avgInputTokens) / 1_000_000).toFixed(1)}M in ·{' '}
                  {((monthlyRequests * avgOutputTokens) / 1_000_000).toFixed(1)}M out
                </div>
              </div>

              <div className="surface-card rounded-2xl p-4">
                <div className="text-xs text-slate-400">Prompt Cache Savings</div>
                <div className="text-lg font-mono font-bold text-cyan-400 mt-1">
                  {formatUSD(maxSavings)}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  At {cachedPercentage}% cache hit rate
                </div>
              </div>
            </div>

            {/* Markdown Export Button */}
            <div className="surface-card rounded-2xl p-3">
              <button
                onClick={handleCopyMarkdown}
                className="w-full py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-white flex items-center justify-center gap-2 transition-colors min-h-[44px]"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                <span>{copied ? 'Copied Markdown Table to Clipboard' : 'Export Table as Markdown'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: Comparison Table */}
        {activeTab === 'matrix' && (
          <div className="surface-card rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Table Filters */}
            <div className="p-4 border-b border-white/10 bg-white/[0.01] flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter models (e.g. claude, gpt, deepseek)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#08090a] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Provider Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {['All', 'OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'Meta (Hosted)', 'Mistral'].map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedProvider(p)}
                      className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 min-h-[36px] ${
                        selectedProvider === p
                          ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                          : 'text-slate-400 hover:text-white bg-white/[0.02] border border-white/5'
                      }`}
                    >
                      {p !== 'All' && <ProviderIcon provider={p} className="w-3.5 h-3.5" />}
                      <span>{p}</span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Empty State Check */}
            {filteredResults.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-sm text-slate-400">No models match your search criteria.</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-xs text-white hover:bg-indigo-500 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#08090a] text-slate-400 text-xs uppercase tracking-wider">
                      <th
                        onClick={() => handleSort('name')}
                        className="py-3.5 px-4 cursor-pointer hover:text-white font-semibold"
                      >
                        <div className="flex items-center gap-1">
                          <span>Model Name</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-500" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('provider')}
                        className="py-3.5 px-3 cursor-pointer hover:text-white font-semibold"
                      >
                        <div className="flex items-center gap-1">
                          <span>Provider</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-500" />
                        </div>
                      </th>
                      <th className="py-3.5 px-3 font-semibold">Context Window</th>
                      <th
                        onClick={() => handleSort('input')}
                        className="py-3.5 px-3 cursor-pointer hover:text-white font-semibold"
                      >
                        <div className="flex items-center gap-1">
                          <span>Input / 1M</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-500" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('output')}
                        className="py-3.5 px-3 cursor-pointer hover:text-white font-semibold"
                      >
                        <div className="flex items-center gap-1">
                          <span>Output / 1M</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-500" />
                        </div>
                      </th>
                      <th className="py-3.5 px-3 text-right font-semibold">Cost / 1K Calls</th>
                      <th
                        onClick={() => handleSort('cost')}
                        className="py-3.5 px-4 text-right cursor-pointer hover:text-white font-semibold"
                      >
                        <div className="flex items-center justify-end gap-1">
                          <span>Monthly Total</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-500" />
                        </div>
                      </th>
                      <th className="py-3.5 px-4 text-center font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredResults.map(({ model, totalMonthlyCost, costPer1kRequests }, index) => {
                      const isTopRanked = index === 0;

                      return (
                        <tr
                          key={model.id}
                          className={`transition-colors hover:bg-white/[0.04] ${
                            isTopRanked ? 'bg-indigo-500/[0.03]' : ''
                          }`}
                        >
                          {/* Model Name */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono text-xs text-slate-500 w-4">
                                {index + 1}
                              </span>
                              <div>
                                <Link
                                  href={`/model/${model.id}`}
                                  className="font-bold text-white hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                                >
                                  <span>{model.name}</span>
                                </Link>
                                <span className="text-xs text-slate-500">{model.qualityTier}</span>
                              </div>
                            </div>
                          </td>

                          {/* Provider */}
                          <td className="py-3.5 px-3 text-slate-300">
                            <div className="flex items-center gap-1.5">
                              <ProviderIcon provider={model.provider} className="w-3.5 h-3.5" />
                              <span>{model.provider}</span>
                            </div>
                          </td>

                          {/* Context Window */}
                          <td className="py-3.5 px-3 font-mono text-slate-300">
                            {formatContextWindow(model.contextWindow)}
                          </td>

                          {/* Input Rate */}
                          <td className="py-3.5 px-3 font-mono text-slate-200">
                            ${model.inputCostPer1M.toFixed(2)}
                          </td>

                          {/* Output Rate */}
                          <td className="py-3.5 px-3 font-mono text-slate-200">
                            ${model.outputCostPer1M.toFixed(2)}
                          </td>

                          {/* Cost per 1K Calls */}
                          <td className="py-3.5 px-3 font-mono text-right text-slate-300">
                            {formatUSD(costPer1kRequests)}
                          </td>

                          {/* Total Monthly Spend */}
                          <td className="py-3.5 px-4 text-right">
                            <span
                              className={`font-mono font-bold ${
                                isTopRanked
                                  ? 'text-indigo-400 text-sm'
                                  : 'text-white'
                              }`}
                            >
                              {formatUSD(totalMonthlyCost)}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-center">
                            <Link
                              href={`/model/${model.id}`}
                              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-0.5"
                            >
                              <span>Details</span>
                              <ChevronRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Interactive Token Stream Canvas */}
        {activeTab === 'simulator' && (
          <TokenFlowCanvas
            requestsPerMonth={monthlyRequests}
            cachingPercentage={cachedPercentage}
          />
        )}

        {/* TAB 3: Prompt Tokenizer Sandbox */}
        {activeTab === 'sandbox' && (
          <div className="surface-card rounded-2xl p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              Interactive Prompt Token Count Sandbox
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Estimate token consumption based on average 4 characters per BPE token rule of thumb.
            </p>

            <textarea
              rows={5}
              value={sandboxText}
              onChange={(e) => setSandboxText(e.target.value)}
              placeholder="Paste your system prompt, function definitions, or sample user input here..."
              className="w-full p-3.5 rounded-xl bg-[#08090a] border border-white/10 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
            />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#08090a] border border-white/10">
              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-slate-500 block">Character Count:</span>
                  <span className="text-white font-mono font-bold text-sm">
                    {sandboxText.length.toLocaleString()} chars
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Estimated Tokens:</span>
                  <span className="text-indigo-400 font-mono font-bold text-sm">
                    ~{sandboxTokens.toLocaleString()} tokens
                  </span>
                </div>
              </div>

              <button
                onClick={() => setAvgInputTokens(sandboxTokens)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors min-h-[40px]"
              >
                Apply as Input Tokens ({sandboxTokens})
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
