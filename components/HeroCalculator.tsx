'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AI_MODELS, AIModel } from '@/data/models';
import {
  calculateAllModelsCost,
  CalculationParams,
  formatUSD,
  formatNumber,
  formatContextWindow,
} from '@/lib/calculator';
import {
  Sliders,
  Sparkles,
  Zap,
  ArrowRight,
  TrendingDown,
  Check,
  Copy,
  Layers,
  Code2,
  Cpu,
  FileText,
  Filter,
  DollarSign,
  Search,
} from 'lucide-react';

// Preset Workloads
const WORKLOAD_PRESETS = [
  {
    id: 'support',
    name: 'Support Agent',
    desc: '1M calls · 800 in / 250 out · 60% cache',
    requests: 1_000_000,
    inputTokens: 800,
    outputTokens: 250,
    cachedPercent: 60,
    batch: false,
  },
  {
    id: 'agentic',
    name: 'Multi-Step Agent',
    desc: '250K turns · 6,000 in / 1,200 out · 75% cache',
    requests: 250_000,
    inputTokens: 6_000,
    outputTokens: 1_200,
    cachedPercent: 75,
    batch: false,
  },
  {
    id: 'rag',
    name: 'RAG Search Engine',
    desc: '500K queries · 3,500 in / 400 out · 50% cache',
    requests: 500_000,
    inputTokens: 3_500,
    outputTokens: 400,
    cachedPercent: 50,
    batch: false,
  },
  {
    id: 'coding',
    name: 'Code Copilot',
    desc: '2.5M hits · 1,500 in / 120 out · 85% cache',
    requests: 2_500_000,
    inputTokens: 1_500,
    outputTokens: 120,
    cachedPercent: 85,
    batch: false,
  },
  {
    id: 'batch_nlp',
    name: 'Batch Document Extraction',
    desc: '100K docs · 12,000 in / 1,500 out · Batch API 50% off',
    requests: 100_000,
    inputTokens: 12_000,
    outputTokens: 1_500,
    cachedPercent: 30,
    batch: true,
  },
];

export default function HeroCalculator() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'sandbox'>('matrix');

  // Core Slider Parameters
  const [monthlyRequests, setMonthlyRequests] = useState<number>(500_000);
  const [avgInputTokens, setAvgInputTokens] = useState<number>(1_500);
  const [avgOutputTokens, setAvgOutputTokens] = useState<number>(500);
  const [cachedPercentage, setCachedPercentage] = useState<number>(40);
  const [batchEnabled, setBatchEnabled] = useState<boolean>(false);

  // Filters & Sorting
  const [selectedProvider, setSelectedProvider] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Token Sandbox state
  const [sandboxText, setSandboxText] = useState<string>(
    'You are a senior systems engineer reviewing a distributed consensus protocol in Go. Analyze the quorum logic below and return performance edge cases...'
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

  // Results calculation
  const allResults = useMemo(() => calculateAllModelsCost(params), [params]);

  // Filtered & Searched results
  const filteredResults = useMemo(() => {
    return allResults.filter(({ model }) => {
      const matchProvider = selectedProvider === 'All' || model.provider === selectedProvider;
      const matchTier = selectedTier === 'All' || model.qualityTier === selectedTier;
      const matchSearch =
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.provider.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProvider && matchTier && matchSearch;
    });
  }, [allResults, selectedProvider, selectedTier, searchQuery]);

  // Aggregate stats
  const lowestCost = filteredResults[0];
  const totalTokensMonthly = (monthlyRequests * (avgInputTokens + avgOutputTokens)) / 1_000_000;
  const maxSavings = lowestCost?.savingsFromCaching ?? 0;

  // Apply Preset
  const handleApplyPreset = (preset: (typeof WORKLOAD_PRESETS)[0]) => {
    setMonthlyRequests(preset.requests);
    setAvgInputTokens(preset.inputTokens);
    setAvgOutputTokens(preset.outputTokens);
    setCachedPercentage(preset.cachedPercent);
    setBatchEnabled(preset.batch);
  };

  // Copy Markdown Table
  const handleCopyMarkdown = () => {
    let md = `| Model | Provider | Monthly Cost | Cost / 1k Req | Input/1M | Output/1M |\n|---|---|---|---|---|---|\n`;
    filteredResults.slice(0, 10).forEach(({ model, totalMonthlyCost, costPer1kRequests }) => {
      md += `| ${model.name} | ${model.provider} | ${formatUSD(totalMonthlyCost)} | ${formatUSD(
        costPer1kRequests
      )} | $${model.inputCostPer1M} | $${model.outputCostPer1M} |\n`;
    });
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Live Tokenizer Approximation (1 token ≈ 4 characters or 0.75 words)
  const sandboxTokens = Math.max(1, Math.round(sandboxText.length / 4));

  return (
    <section className="w-full pt-6 pb-12 bg-grid-pattern relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Control Header - Clean Engineering Aesthetic */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1E2638] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30">
                PROMPT TOKENOMICS WORKBENCH
              </span>
              <span className="text-xs font-mono text-[#64748B]">Updated March 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
              AI Model Inference Cost Simulator
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 max-w-2xl">
              Calculate exact multi-provider API expenses with live prompt caching discounts, batch APIs, and context window economics.
            </p>
          </div>

          {/* Workbench Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0E121B] border border-[#1E2638] self-start md:self-auto font-mono text-xs">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                activeTab === 'matrix'
                  ? 'bg-[#171E2E] text-white border border-[#2D3952] font-semibold'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#10B981]" />
              Simulation Matrix
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                activeTab === 'sandbox'
                  ? 'bg-[#171E2E] text-white border border-[#2D3952] font-semibold'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              Live Prompt Sandbox
            </button>
          </div>
        </div>

        {/* Workload Presets Pills */}
        <div className="mb-6">
          <div className="text-xs font-mono text-[#64748B] mb-2 uppercase tracking-wider">
            Quick Scenario Presets:
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
                  className={`p-2.5 rounded-lg text-left transition-all border ${
                    isActive
                      ? 'bg-[#10B981]/10 border-[#10B981]/50 text-white'
                      : 'bg-[#0E121B] border-[#1E2638] text-[#94A3B8] hover:border-[#2D3952] hover:text-white'
                  }`}
                >
                  <div className="font-mono text-xs font-semibold text-white flex items-center justify-between">
                    <span>{preset.name}</span>
                    {isActive && <Check className="w-3.5 h-3.5 text-[#10B981]" />}
                  </div>
                  <div className="text-[11px] text-[#64748B] truncate mt-0.5 font-mono">
                    {preset.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Interactive Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Left: 5 Tactile Sliders & Dials (7 cols) */}
          <div className="lg:col-span-7 terminal-card rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-[#1E2638] pb-3">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-white uppercase tracking-wider">
                <Sliders className="w-4 h-4 text-[#10B981]" />
                Inference Parameters
              </div>
              <span className="text-[11px] font-mono text-[#64748B]">Slide or type values</span>
            </div>

            {/* Dial 1: Monthly Requests */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-mono font-medium text-[#CBD5E1]">
                  Monthly API Invocations
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={1000}
                    max={100000000}
                    step={10000}
                    value={monthlyRequests}
                    onChange={(e) => setMonthlyRequests(Number(e.target.value))}
                    className="w-28 px-2 py-0.5 rounded bg-[#141A26] border border-[#232D42] text-right font-mono text-xs text-white focus:outline-none focus:border-[#10B981]"
                  />
                  <span className="text-[11px] font-mono text-[#64748B]">calls</span>
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
              <div className="flex justify-between text-[10px] font-mono text-[#475569] mt-1">
                <span>10K</span>
                <span>1M</span>
                <span>5M</span>
                <span>10M+</span>
              </div>
            </div>

            {/* Dial 2: Input Tokens per Call */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-mono font-medium text-[#CBD5E1]">
                  Avg Input Tokens / Call (Prompt + System Context)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={10}
                    max={2000000}
                    step={100}
                    value={avgInputTokens}
                    onChange={(e) => setAvgInputTokens(Number(e.target.value))}
                    className="w-24 px-2 py-0.5 rounded bg-[#141A26] border border-[#232D42] text-right font-mono text-xs text-white focus:outline-none focus:border-[#10B981]"
                  />
                  <span className="text-[11px] font-mono text-[#64748B]">tok</span>
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
              <div className="flex justify-between text-[10px] font-mono text-[#475569] mt-1">
                <span>100 (Short)</span>
                <span>2K (Chat)</span>
                <span>16K (Doc)</span>
                <span>64K (RAG Context)</span>
              </div>
            </div>

            {/* Dial 3: Output Tokens per Call */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-mono font-medium text-[#CBD5E1]">
                  Avg Output Tokens / Call (Generation)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={10}
                    max={128000}
                    step={50}
                    value={avgOutputTokens}
                    onChange={(e) => setAvgOutputTokens(Number(e.target.value))}
                    className="w-24 px-2 py-0.5 rounded bg-[#141A26] border border-[#232D42] text-right font-mono text-xs text-white focus:outline-none focus:border-[#10B981]"
                  />
                  <span className="text-[11px] font-mono text-[#64748B]">tok</span>
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
              <div className="flex justify-between text-[10px] font-mono text-[#475569] mt-1">
                <span>50 (JSON)</span>
                <span>500 (Standard)</span>
                <span>2K (Code)</span>
                <span>8K (Report)</span>
              </div>
            </div>

            {/* Advanced Mechanics: Caching & Batch API */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1E2638]">
              
              {/* Prompt Caching Slider */}
              <div className="bg-[#121722] p-3 rounded-lg border border-[#1E2638]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono font-medium text-emerald-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> Prompt Caching Hit Rate
                  </span>
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
                <span className="text-[10px] text-[#64748B] block mt-1">
                  Discounts cached input tokens up to 90% (Anthropic, OpenAI, DeepSeek).
                </span>
              </div>

              {/* Batch API Toggle */}
              <div
                onClick={() => setBatchEnabled(!batchEnabled)}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  batchEnabled
                    ? 'bg-[#10B981]/10 border-[#10B981]/50'
                    : 'bg-[#121722] border-[#1E2638] hover:border-[#2D3952]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Batch API (Async)
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      batchEnabled ? 'bg-[#10B981] text-black' : 'bg-[#232D42] text-[#94A3B8]'
                    }`}
                  >
                    {batchEnabled ? '50% OFF ACTIVE' : 'OFF'}
                  </span>
                </div>
                <span className="text-[10px] text-[#64748B] mt-1">
                  Enables 24h turn-around 50% discount for background offline workloads.
                </span>
              </div>
            </div>
          </div>

          {/* Right: Key Summary & Real-Time Unit Economics Dashboard (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Top Stat Box: Lowest Cost Hero */}
            <div className="terminal-card rounded-xl p-5 border-l-4 border-l-[#10B981]">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] flex items-center justify-between">
                <span>Lowest Monthly Projected Cost</span>
                <span className="text-emerald-400 font-bold">TOP EFFICIENCY</span>
              </div>
              
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
                  {lowestCost ? formatUSD(lowestCost.totalMonthlyCost) : '$0'}
                </span>
                <span className="text-xs font-mono text-[#64748B]">/ month</span>
              </div>

              {lowestCost && (
                <div className="mt-3 pt-3 border-t border-[#1E2638] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{lowestCost.model.name}</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#171E2E] text-[#94A3B8] text-[10px]">
                      {lowestCost.model.provider}
                    </span>
                  </div>
                  <span className="text-emerald-400">
                    {formatUSD(lowestCost.costPer1kRequests)} / 1K calls
                  </span>
                </div>
              )}
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="terminal-card rounded-xl p-4">
                <div className="text-[11px] font-mono text-[#64748B]">Total Monthly Tokens</div>
                <div className="text-lg font-mono font-bold text-white mt-1">
                  {totalTokensMonthly >= 1000
                    ? `${(totalTokensMonthly / 1000).toFixed(2)}B`
                    : `${totalTokensMonthly.toFixed(1)}M`}
                </div>
                <div className="text-[10px] font-mono text-[#64748B] mt-0.5">
                  {((monthlyRequests * avgInputTokens) / 1_000_000).toFixed(1)}M in ·{' '}
                  {((monthlyRequests * avgOutputTokens) / 1_000_000).toFixed(1)}M out
                </div>
              </div>

              <div className="terminal-card rounded-xl p-4">
                <div className="text-[11px] font-mono text-[#64748B]">Prompt Cache Savings</div>
                <div className="text-lg font-mono font-bold text-emerald-400 mt-1">
                  {formatUSD(maxSavings)}
                </div>
                <div className="text-[10px] font-mono text-[#64748B] mt-0.5">
                  {cachedPercentage}% cache hit rate
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="terminal-card rounded-xl p-4 flex items-center justify-between">
              <button
                onClick={handleCopyMarkdown}
                className="w-full py-2 px-3 rounded-lg bg-[#141A26] border border-[#232D42] hover:border-[#10B981] text-xs font-mono text-white flex items-center justify-center gap-2 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Markdown Table!' : 'Export Simulation as Markdown'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: Real-Time Multi-Model Comparison Matrix */}
        {activeTab === 'matrix' && (
          <div className="terminal-card rounded-xl overflow-hidden border border-[#1E2638]">
            
            {/* Table Filter Controls */}
            <div className="p-4 border-b border-[#1E2638] bg-[#0E121B] flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* Search Bar */}
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter model name (e.g. claude, gpt, deepseek)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#141A26] border border-[#232D42] text-xs font-mono text-white placeholder-[#64748B] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              {/* Provider Buttons */}
              <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-mono">
                {['All', 'OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'Meta (Hosted)', 'Mistral'].map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedProvider(p)}
                      className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                        selectedProvider === p
                          ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/40 font-bold'
                          : 'text-[#94A3B8] hover:text-white bg-[#141A26]/50'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Dense Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#1E2638] bg-[#0A0D14] text-[#64748B] uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4"># Rank & Model</th>
                    <th className="py-3 px-3">Provider</th>
                    <th className="py-3 px-3">Context</th>
                    <th className="py-3 px-3">Input / 1M</th>
                    <th className="py-3 px-3">Output / 1M</th>
                    <th className="py-3 px-3 text-right">Cost / 1K Calls</th>
                    <th className="py-3 px-4 text-right">Monthly Spend</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2638]/60">
                  {filteredResults.map(({ model, totalMonthlyCost, costPer1kRequests, savingsFromCaching }, idx) => {
                    const isLowest = idx === 0;
                    return (
                      <tr
                        key={model.id}
                        className={`hover:bg-[#141A26]/60 transition-colors ${
                          isLowest ? 'bg-[#10B981]/5' : ''
                        }`}
                      >
                        {/* Model Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="text-[11px] text-[#475569] w-4 text-right">
                              {idx + 1}
                            </span>
                            <div>
                              <Link
                                href={`/model/${model.id}`}
                                className="font-semibold text-white hover:text-[#10B981] transition-colors flex items-center gap-1.5"
                              >
                                {model.name}
                                {isLowest && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                                    CHEAPEST
                                  </span>
                                )}
                              </Link>
                              <div className="text-[10px] text-[#64748B]">{model.qualityTier} Tier</div>
                            </div>
                          </div>
                        </td>

                        {/* Provider */}
                        <td className="py-3 px-3 text-[#94A3B8]">
                          <span className="px-2 py-0.5 rounded bg-[#171E2E] border border-[#232D42] text-[10px]">
                            {model.provider}
                          </span>
                        </td>

                        {/* Context Window */}
                        <td className="py-3 px-3 text-[#94A3B8]">
                          {formatContextWindow(model.contextWindow)}
                        </td>

                        {/* Input Cost */}
                        <td className="py-3 px-3 text-white">
                          ${model.inputCostPer1M.toFixed(2)}
                          {(model.cachedInputCostPer1M ?? 0) > 0 && (
                            <span className="block text-[10px] text-emerald-400">
                              Cache: ${model.cachedInputCostPer1M!.toFixed(2)}
                            </span>
                          )}
                        </td>

                        {/* Output Cost */}
                        <td className="py-3 px-3 text-white">
                          ${model.outputCostPer1M.toFixed(2)}
                        </td>

                        {/* Cost per 1K Calls */}
                        <td className="py-3 px-3 text-right font-medium text-[#CBD5E1]">
                          {formatUSD(costPer1kRequests)}
                        </td>

                        {/* Total Monthly Cost */}
                        <td className="py-3 px-4 text-right">
                          <div className="text-sm font-bold text-white font-mono">
                            {formatUSD(totalMonthlyCost)}
                          </div>
                          {savingsFromCaching > 0 && (
                            <div className="text-[10px] text-emerald-400">
                              Saved {formatUSD(savingsFromCaching)}
                            </div>
                          )}
                        </td>

                        {/* Action Link */}
                        <td className="py-3 px-4 text-center">
                          <Link
                            href={`/model/${model.id}`}
                            className="inline-flex items-center gap-1 text-[11px] text-[#10B981] hover:underline"
                          >
                            Specs <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Live Prompt Sandbox */}
        {activeTab === 'sandbox' && (
          <div className="terminal-card rounded-xl p-6 border border-[#1E2638] space-y-5">
            <div>
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400" />
                Live Prompt Tokenizer & Price Analyzer
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Paste your raw system prompt, few-shot examples, or code context to calculate live cost across providers.
              </p>
            </div>

            <textarea
              rows={5}
              value={sandboxText}
              onChange={(e) => setSandboxText(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#0A0D14] border border-[#1E2638] text-xs font-mono text-white placeholder-[#64748B] focus:outline-none focus:border-[#10B981]"
              placeholder="Paste prompt text here..."
            />

            <div className="flex items-center justify-between text-xs font-mono bg-[#141A26] p-3 rounded-lg border border-[#232D42]">
              <div className="flex items-center gap-4">
                <span>
                  Length: <strong className="text-white">{sandboxText.length}</strong> chars
                </span>
                <span>
                  Words: <strong className="text-white">{sandboxText.trim().split(/\s+/).length}</strong>
                </span>
                <span>
                  Est. Tokens: <strong className="text-[#10B981]">{sandboxTokens}</strong> tok
                </span>
              </div>
              <span className="text-[11px] text-[#64748B]">BPE Approximation (4 chars/tok)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {filteredResults.slice(0, 4).map(({ model }) => {
                const singleCallCost = (sandboxTokens * model.inputCostPer1M) / 1_000_000;
                return (
                  <div key={model.id} className="p-3 rounded-lg bg-[#0E121B] border border-[#1E2638]">
                    <div className="text-[11px] font-mono text-[#94A3B8] truncate">{model.name}</div>
                    <div className="text-sm font-bold text-white font-mono mt-1">
                      ${singleCallCost.toFixed(6)}
                    </div>
                    <div className="text-[10px] text-[#64748B] mt-0.5">Per single prompt execution</div>
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
