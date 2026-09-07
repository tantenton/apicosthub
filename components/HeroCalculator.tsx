'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AI_MODELS, AIModel } from '@/data/models';
import { ProviderIcon } from './ProviderLogos';
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
  const [activeTab, setActiveTab] = useState<'matrix' | 'sandbox'>('matrix');

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
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1E2538] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                TOKENOMICS CALCULATOR
              </span>
              <span className="text-xs text-[#94A3B8]">Verified September 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              LLM API Pricing & Monthly Expense Calculator
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 max-w-2xl leading-relaxed">
              Model token expenditure across frontier providers with prompt caching discounts, asynchronous batch rates, and context size specifications.
            </p>
          </div>

          {/* Workbench Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#111520] border border-[#1E2538] self-start md:self-auto text-xs font-medium">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
                activeTab === 'matrix'
                  ? 'bg-[#1C2333] text-white border border-[#2D3952] font-semibold'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Model Comparison</span>
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
                activeTab === 'sandbox'
                  ? 'bg-[#1C2333] text-white border border-[#2D3952] font-semibold'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Prompt Tokenizer</span>
            </button>
          </div>
        </div>

        {/* Workload Presets */}
        <div className="mb-6">
          <div className="text-xs text-[#94A3B8] mb-2 font-medium">
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
                  className={`p-3 rounded-lg text-left transition-colors border min-h-[44px] ${
                    isActive
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                      : 'bg-[#111520] border-[#1E2538] text-[#94A3B8] hover:border-[#2D3952] hover:text-white'
                  }`}
                >
                  <div className="text-xs font-semibold text-white flex items-center justify-between">
                    <span>{preset.name}</span>
                    {isActive && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="text-[11px] text-[#64748B] truncate mt-1">
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
          <div className="lg:col-span-7 surface-card rounded-xl p-5 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#1E2538] pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
                <Sliders className="w-4 h-4 text-emerald-400" />
                Workload Parameters
              </div>
              <span className="text-xs text-[#64748B]">Adjust sliders or type values</span>
            </div>

            {/* Dial 1: Monthly Requests */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-[#CBD5E1]">
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
                    className="w-28 px-2 py-1 rounded bg-[#090B10] border border-[#1E2538] text-right text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-xs text-[#64748B]">calls</span>
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
              <div className="flex justify-between text-[11px] font-mono text-[#64748B] mt-1">
                <span>10K</span>
                <span>1M</span>
                <span>5M</span>
                <span>10M</span>
              </div>
            </div>

            {/* Dial 2: Input Tokens */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-[#CBD5E1]">
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
                    className="w-24 px-2 py-1 rounded bg-[#090B10] border border-[#1E2538] text-right text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-xs text-[#64748B]">tok</span>
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
              <div className="flex justify-between text-[11px] font-mono text-[#64748B] mt-1">
                <span>100 (Short)</span>
                <span>2,000 (Chat)</span>
                <span>16,000 (Doc)</span>
                <span>64,000 (RAG)</span>
              </div>
            </div>

            {/* Dial 3: Output Tokens */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-[#CBD5E1]">
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
                    className="w-24 px-2 py-1 rounded bg-[#090B10] border border-[#1E2538] text-right text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-xs text-[#64748B]">tok</span>
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
              <div className="flex justify-between text-[11px] font-mono text-[#64748B] mt-1">
                <span>50 (JSON)</span>
                <span>500 (Standard)</span>
                <span>2,000 (Code)</span>
                <span>8,000 (Report)</span>
              </div>
            </div>

            {/* Advanced Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#1E2538]">
              <div className="bg-[#090B10] p-3.5 rounded-lg border border-[#1E2538]">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-medium text-white">Prompt Caching Hit Rate</span>
                  <span className="font-mono text-xs font-bold text-emerald-400">
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
                <span className="text-[11px] text-[#64748B] block mt-1 leading-normal">
                  Reduces input token billing by 50% to 90% for repeated prefix contexts.
                </span>
              </div>

              <div
                onClick={() => setBatchEnabled(!batchEnabled)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-colors flex flex-col justify-between ${
                  batchEnabled
                    ? 'bg-emerald-500/10 border-emerald-500/40'
                    : 'bg-[#090B10] border-[#1E2538] hover:border-[#2D3952]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white">Batch API (Asynchronous)</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      batchEnabled ? 'bg-emerald-500 text-black' : 'bg-[#1E2538] text-[#94A3B8]'
                    }`}
                  >
                    {batchEnabled ? '50% DISCOUNT' : 'STANDARD'}
                  </span>
                </div>
                <span className="text-[11px] text-[#64748B] mt-1 leading-normal">
                  Calculates 50% off-peak discount for 24-hour turnaround background jobs.
                </span>
              </div>
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Projected Lowest Card */}
            <div className="surface-card rounded-xl p-5 border-l-4 border-l-emerald-500">
              <div className="text-xs uppercase tracking-wider text-[#94A3B8] font-medium flex items-center justify-between">
                <span>Lowest Monthly Projected Cost</span>
                <span className="text-emerald-400 font-mono text-[11px]">OPTIMIZED</span>
              </div>
              
              <div className="mt-2 flex items-baseline gap-2 font-mono">
                <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  {lowestCost ? formatUSD(lowestCost.totalMonthlyCost) : '$0'}
                </span>
                <span className="text-xs text-[#64748B]">/ month</span>
              </div>

              {lowestCost && (
                <div className="mt-3 pt-3 border-t border-[#1E2538] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ProviderIcon provider={lowestCost.model.provider} className="w-3.5 h-3.5" />
                    <span className="font-semibold text-white">{lowestCost.model.name}</span>
                  </div>
                  <span className="text-emerald-400 font-mono">
                    {formatUSD(lowestCost.costPer1kRequests)} per 1K calls
                  </span>
                </div>
              )}
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="surface-card rounded-xl p-4">
                <div className="text-xs text-[#94A3B8]">Total Monthly Tokens</div>
                <div className="text-lg font-mono font-bold text-white mt-1">
                  {totalTokensMonthly >= 1000
                    ? `${(totalTokensMonthly / 1000).toFixed(2)}B`
                    : `${totalTokensMonthly.toFixed(1)}M`}
                </div>
                <div className="text-[11px] font-mono text-[#64748B] mt-1">
                  {((monthlyRequests * avgInputTokens) / 1_000_000).toFixed(1)}M in ·{' '}
                  {((monthlyRequests * avgOutputTokens) / 1_000_000).toFixed(1)}M out
                </div>
              </div>

              <div className="surface-card rounded-xl p-4">
                <div className="text-xs text-[#94A3B8]">Prompt Cache Savings</div>
                <div className="text-lg font-mono font-bold text-emerald-400 mt-1">
                  {formatUSD(maxSavings)}
                </div>
                <div className="text-[11px] text-[#64748B] mt-1">
                  At {cachedPercentage}% cache hit rate
                </div>
              </div>
            </div>

            {/* Markdown Export Button */}
            <div className="surface-card rounded-xl p-3">
              <button
                onClick={handleCopyMarkdown}
                className="w-full py-2.5 px-3 rounded bg-[#1C2333] hover:bg-[#252E42] border border-[#2D3952] text-xs font-medium text-white flex items-center justify-center gap-2 transition-colors min-h-[44px]"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Markdown to Clipboard' : 'Export Table as Markdown'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: Comparison Table */}
        {activeTab === 'matrix' && (
          <div className="surface-card rounded-xl overflow-hidden shadow-sm">
            
            {/* Table Filters */}
            <div className="p-4 border-b border-[#1E2538] bg-[#0E121B] flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter models (e.g. claude, gpt, deepseek)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded bg-[#090B10] border border-[#1E2538] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Provider Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {['All', 'OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'Meta (Hosted)', 'Mistral'].map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedProvider(p)}
                      className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 min-h-[36px] ${
                        selectedProvider === p
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-semibold'
                          : 'text-[#94A3B8] hover:text-white bg-[#090B10] border border-[#1E2538]'
                      }`}
                    >
                      {p !== 'All' && <ProviderIcon provider={p} className="w-3 h-3" />}
                      <span>{p}</span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Empty State Check */}
            {filteredResults.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-sm text-[#94A3B8]">No models match your search criteria.</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1C2333] border border-[#2D3952] text-xs text-white hover:bg-[#252E42]"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#1E2538] bg-[#090B10] text-[#94A3B8] text-[11px] uppercase tracking-wider">
                      <th
                        onClick={() => handleSort('name')}
                        className="py-3 px-4 cursor-pointer hover:text-white"
                      >
                        <div className="flex items-center gap-1">
                          <span>Model Name</span>
                          <ArrowUpDown className="w-3 h-3 text-[#64748B]" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('provider')}
                        className="py-3 px-3 cursor-pointer hover:text-white"
                      >
                        <div className="flex items-center gap-1">
                          <span>Provider</span>
                          <ArrowUpDown className="w-3 h-3 text-[#64748B]" />
                        </div>
                      </th>
                      <th className="py-3 px-3">Context Window</th>
                      <th
                        onClick={() => handleSort('input')}
                        className="py-3 px-3 cursor-pointer hover:text-white"
                      >
                        <div className="flex items-center gap-1">
                          <span>Input / 1M</span>
                          <ArrowUpDown className="w-3 h-3 text-[#64748B]" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('output')}
                        className="py-3 px-3 cursor-pointer hover:text-white"
                      >
                        <div className="flex items-center gap-1">
                          <span>Output / 1M</span>
                          <ArrowUpDown className="w-3 h-3 text-[#64748B]" />
                        </div>
                      </th>
                      <th className="py-3 px-3 text-right">Cost / 1K Calls</th>
                      <th
                        onClick={() => handleSort('cost')}
                        className="py-3 px-4 text-right cursor-pointer hover:text-white"
                      >
                        <div className="flex items-center justify-end gap-1">
                          <span>Monthly Invoice</span>
                          <ArrowUpDown className="w-3 h-3 text-[#64748B]" />
                        </div>
                      </th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E2538]/60">
                    {filteredResults.map(({ model, totalMonthlyCost, costPer1kRequests, savingsFromCaching }, idx) => {
                      const isLowest = idx === 0 && sortBy === 'cost' && sortAsc;
                      return (
                        <tr
                          key={model.id}
                          className={`hover:bg-[#151B27]/60 transition-colors ${
                            isLowest ? 'bg-emerald-500/[0.04]' : ''
                          }`}
                        >
                          {/* Model */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <span className="text-[11px] text-[#475569] w-4 text-right font-mono">
                                {idx + 1}
                              </span>
                              <div className="p-1 rounded bg-[#090B10] border border-[#1E2538]">
                                <ProviderIcon provider={model.provider} className="w-4 h-4" />
                              </div>
                              <div>
                                <Link
                                  href={`/model/${model.id}`}
                                  className="font-semibold text-white hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                                >
                                  {model.name}
                                  {isLowest && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono font-medium border border-emerald-500/30">
                                      Lowest Cost
                                    </span>
                                  )}
                                </Link>
                                <div className="text-[11px] text-[#64748B]">
                                  {model.qualityTier} · {model.latencyScore}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Provider */}
                          <td className="py-3 px-3 text-[#94A3B8]">
                            <span className="px-2 py-0.5 rounded bg-[#141A26] border border-[#1E2538] text-[11px]">
                              {model.provider}
                            </span>
                          </td>

                          {/* Context */}
                          <td className="py-3 px-3 text-[#94A3B8] font-mono">
                            {formatContextWindow(model.contextWindow)}
                          </td>

                          {/* Input */}
                          <td className="py-3 px-3 text-white font-mono">
                            ${model.inputCostPer1M.toFixed(2)}
                            {(model.cachedInputCostPer1M ?? 0) > 0 && (
                              <span className="block text-[10px] text-emerald-400 font-mono">
                                Cache: ${model.cachedInputCostPer1M!.toFixed(2)}
                              </span>
                            )}
                          </td>

                          {/* Output */}
                          <td className="py-3 px-3 text-white font-mono">
                            ${model.outputCostPer1M.toFixed(2)}
                          </td>

                          {/* Cost / 1k Calls */}
                          <td className="py-3 px-3 text-right font-mono text-[#CBD5E1]">
                            {formatUSD(costPer1kRequests)}
                          </td>

                          {/* Total Cost */}
                          <td className="py-3 px-4 text-right font-mono">
                            <div className="text-sm font-bold text-white">
                              {formatUSD(totalMonthlyCost)}
                            </div>
                            {savingsFromCaching > 0 && (
                              <div className="text-[10px] text-emerald-400">
                                Save {formatUSD(savingsFromCaching)}
                              </div>
                            )}
                          </td>

                          {/* Action */}
                          <td className="py-3 px-4 text-center">
                            <Link
                              href={`/model/${model.id}`}
                              className="text-xs text-emerald-400 hover:underline px-2 py-1"
                            >
                              Details
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

        {/* TAB 2: Sandbox */}
        {activeTab === 'sandbox' && (
          <div className="surface-card rounded-xl p-6 space-y-5">
            <div>
              <h3 className="text-base font-semibold text-white">
                Live Prompt Tokenizer & Expense Analyzer
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Paste prompt instructions or system schemas to compute execution cost across providers.
              </p>
            </div>

            <textarea
              rows={4}
              value={sandboxText}
              onChange={(e) => setSandboxText(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#090B10] border border-[#1E2538] text-xs font-mono text-white placeholder-[#64748B] focus:outline-none focus:border-emerald-500"
              placeholder="Paste raw prompt text here..."
            />

            <div className="flex items-center justify-between text-xs font-mono bg-[#090B10] p-3 rounded-lg border border-[#1E2538]">
              <div className="flex items-center gap-4">
                <span>
                  Length: <strong className="text-white">{sandboxText.length}</strong> chars
                </span>
                <span>
                  Words: <strong className="text-white">{sandboxText.trim().split(/\s+/).length}</strong>
                </span>
                <span>
                  Approx. Tokens: <strong className="text-emerald-400">{sandboxTokens}</strong> tok
                </span>
              </div>
              <span className="text-[11px] text-[#64748B]">BPE Approximation</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {filteredResults.slice(0, 4).map(({ model }) => {
                const singleCallCost = (sandboxTokens * model.inputCostPer1M) / 1_000_000;
                return (
                  <div key={model.id} className="p-3.5 rounded-lg bg-[#090B10] border border-[#1E2538]">
                    <div className="text-xs text-[#94A3B8] truncate">{model.name}</div>
                    <div className="text-sm font-bold text-white font-mono mt-1">
                      ${singleCallCost.toFixed(6)}
                    </div>
                    <div className="text-[10px] text-[#64748B] mt-0.5 font-mono">Per invocation</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
