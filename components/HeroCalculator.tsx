'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  Sparkles, 
  Sliders, 
  ArrowUpDown, 
  Layers, 
  Check, 
  Info, 
  Zap, 
  TrendingDown, 
  Activity, 
  ArrowRight, 
  ShieldCheck, 
  Search, 
  BarChart3, 
  Server, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Code,
  Eye,
  Brain,
  Gauge
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AI_MODELS, WORKLOAD_PRESETS, WorkloadPreset, AIModel } from '../data/models';
import { calculateWorkloadCost, formatCurrency, formatTokens } from '../lib/calculator';
import { getProviderLogo } from './ProviderLogos';
import TokenFlowCanvas from './TokenFlowCanvas';
import AnimatedCounter from './AnimatedCounter';

type ViewMode = 'economics' | 'benchmarks' | 'multihost' | 'canvas';
type FilterTag = 'all' | 'reasoning' | 'vision' | 'coding' | 'fast' | 'long-context' | 'open-weights';
type SortField = 'monthlyCost' | 'name' | 'inputPer1M' | 'outputPer1M' | 'tokensPerSec' | 'sweBench' | 'mmluPro' | 'arenaElo' | 'efficiency';
type SortOrder = 'asc' | 'desc';

export default function HeroCalculator() {
  // Simulator State
  const [requestsPerMonth, setRequestsPerMonth] = useState<number>(500_000);
  const [inputTokensPerReq, setInputTokensPerReq] = useState<number>(1_500);
  const [outputTokensPerReq, setOutputTokensPerReq] = useState<number>(600);
  const [cachingPercentage, setCachingPercentage] = useState<number>(40);
  const [batchDiscount, setBatchDiscount] = useState<boolean>(false);
  
  // View & Filter State
  const [viewMode, setViewMode] = useState<ViewMode>('economics');
  const [selectedTag, setSelectedTag] = useState<FilterTag>('all');
  const [sortField, setSortField] = useState<SortField>('monthlyCost');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedModelId, setExpandedModelId] = useState<string | null>(null);

  // Apply Preset
  const applyPreset = (preset: WorkloadPreset) => {
    setRequestsPerMonth(preset.requestsPerMonth);
    setInputTokensPerReq(preset.inputTokensPerReq);
    setOutputTokensPerReq(preset.outputTokensPerReq);
    setCachingPercentage(preset.cachingPercentage);
    setBatchDiscount(preset.batchDiscount);
  };

  // Memoized Calculations
  const calculatedRows = useMemo(() => {
    return AI_MODELS.map((model) => {
      const calculation = calculateWorkloadCost({
        model,
        requestsPerMonth,
        inputTokensPerReq,
        outputTokensPerReq,
        cachingPercentage,
        batchDiscount,
      });

      // Efficiency index: Arena Elo divided by (blended cost per 1M + 0.1)
      const blendedPer1M = calculation.effectivePer1MTotal || 1.0;
      const elo = model.benchmarks?.arenaElo || 1300;
      const efficiencyScore = Math.round((elo / blendedPer1M) * 10);

      return {
        model,
        calculation,
        efficiencyScore,
      };
    });
  }, [requestsPerMonth, inputTokensPerReq, outputTokensPerReq, cachingPercentage, batchDiscount]);

  // Filter & Sort
  const filteredAndSorted = useMemo(() => {
    return calculatedRows
      .filter(({ model }) => {
        // Tag filtering
        let matchesTag = true;
        if (selectedTag === 'reasoning') matchesTag = !!model.supportsReasoning || model.category === 'reasoning';
        else if (selectedTag === 'vision') matchesTag = !!model.supportsVision;
        else if (selectedTag === 'coding') matchesTag = model.category === 'coding' || (model.benchmarks?.sweBenchVerified || 0) > 65;
        else if (selectedTag === 'fast') matchesTag = model.typicalSpeedTokensPerSec >= 200 || model.category === 'fast';
        else if (selectedTag === 'long-context') matchesTag = model.contextWindow >= 1_000_000;
        else if (selectedTag === 'open-weights') matchesTag = !!model.isOpenWeights;

        // Search query
        const matchesSearch = 
          model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.id.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTag && matchesSearch;
      })
      .sort((a, b) => {
        let valA: number | string = 0;
        let valB: number | string = 0;

        if (sortField === 'monthlyCost') {
          valA = a.calculation.totalMonthlyCost;
          valB = b.calculation.totalMonthlyCost;
        } else if (sortField === 'name') {
          valA = a.model.name;
          valB = b.model.name;
        } else if (sortField === 'inputPer1M') {
          valA = a.model.inputPricePerMillion;
          valB = b.model.inputPricePerMillion;
        } else if (sortField === 'outputPer1M') {
          valA = a.model.outputPricePerMillion;
          valB = b.model.outputPricePerMillion;
        } else if (sortField === 'tokensPerSec') {
          valA = a.model.typicalSpeedTokensPerSec;
          valB = b.model.typicalSpeedTokensPerSec;
        } else if (sortField === 'sweBench') {
          valA = a.model.benchmarks?.sweBenchVerified || 0;
          valB = b.model.benchmarks?.sweBenchVerified || 0;
        } else if (sortField === 'mmluPro') {
          valA = a.model.benchmarks?.mmluPro || 0;
          valB = b.model.benchmarks?.mmluPro || 0;
        } else if (sortField === 'arenaElo') {
          valA = a.model.benchmarks?.arenaElo || 0;
          valB = b.model.benchmarks?.arenaElo || 0;
        } else if (sortField === 'efficiency') {
          valA = a.efficiencyScore;
          valB = b.efficiencyScore;
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [calculatedRows, selectedTag, sortField, sortOrder, searchQuery]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      // For benchmarks, default to desc (highest score first)
      if (['sweBench', 'mmluPro', 'arenaElo', 'efficiency', 'tokensPerSec'].includes(field)) {
        setSortOrder('desc');
      } else {
        setSortOrder('asc');
      }
    }
  };

  const toggleExpand = (modelId: string) => {
    setExpandedModelId(expandedModelId === modelId ? null : modelId);
  };

  // Top baseline comparison: Claude 3.5 Sonnet vs DeepSeek V3
  const claudeRow = calculatedRows.find((r) => r.model.id === 'claude-3-5-sonnet');
  const deepseekRow = calculatedRows.find((r) => r.model.id === 'deepseek-v3');
  const costDeltaMonthly = (claudeRow?.calculation.totalMonthlyCost || 0) - (deepseekRow?.calculation.totalMonthlyCost || 0);

  return (
    <section className="w-full max-w-7xl px-4 sm:px-6 py-8 flex flex-col items-center">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold mb-4 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Frontier AI Unit Economics & Academic Benchmarks : September 2026</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4"
        >
          AI Token Cost & Benchmark Matrix
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-slate-600 leading-relaxed"
        >
          Simulate real-world production workloads across 29 frontier models. Balance raw inference pricing, prompt caching, SWE-bench Verified coding scores, and multi-provider hosting latency.
        </motion.p>
      </div>

      {/* Preset Workflow Pills */}
      <div className="w-full mb-6">
        <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" />
          <span>Production Workload Presets</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {WORKLOAD_PRESETS.map((p) => {
            const isSelected = requestsPerMonth === p.requestsPerMonth && inputTokensPerReq === p.inputTokensPerReq;
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-slate-900">{p.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </div>
                <div className="text-[11px] text-slate-500 font-mono truncate">{p.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Controls Panel */}
      <div className="w-full surface-card rounded-2xl p-5 sm:p-6 mb-8 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <h2 className="font-bold text-sm text-slate-900">Workload Parameters</h2>
          </div>
          <div className="text-xs font-mono text-slate-500">
            Total Monthly Volume:{' '}
            <span className="font-bold text-indigo-600">
              {formatTokens(requestsPerMonth * (inputTokensPerReq + outputTokensPerReq))} tokens
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Monthly Requests */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Monthly Requests</label>
              <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                {requestsPerMonth.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="5000000"
              step="10000"
              value={requestsPerMonth}
              onChange={(e) => setRequestsPerMonth(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>10k (Startup)</span>
              <span>1M</span>
              <span>5M (Enterprise)</span>
            </div>
          </div>

          {/* Input Tokens */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Input Tokens / Req</label>
              <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                {inputTokensPerReq.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="64000"
              step="200"
              value={inputTokensPerReq}
              onChange={(e) => setInputTokensPerReq(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>200</span>
              <span>16k</span>
              <span>64k</span>
            </div>
          </div>

          {/* Output Tokens */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Output Tokens / Req</label>
              <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                {outputTokensPerReq.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="8000"
              step="50"
              value={outputTokensPerReq}
              onChange={(e) => setOutputTokensPerReq(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>50 (Short)</span>
              <span>2k</span>
              <span>8k (Code)</span>
            </div>
          </div>

          {/* Prompt Caching % */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Cache Hit Rate</label>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {cachingPercentage}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={cachingPercentage}
              onChange={(e) => setCachingPercentage(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% (Cold)</span>
              <span>50%</span>
              <span>90% (Hot)</span>
            </div>
          </div>
        </div>

        {/* Bottom Toggles & Highlights */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={batchDiscount}
              onChange={(e) => setBatchDiscount(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <span className="text-xs font-semibold text-slate-700">
              Apply 50% Batch API Discount (24hr SLA Queue)
            </span>
          </label>

          {costDeltaMonthly > 0 && (
            <div className="text-xs font-medium text-slate-600 flex items-center gap-2">
              <span>DeepSeek-V3 saves</span>
              <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <AnimatedCounter value={costDeltaMonthly} prefix="$" decimals={2} />
              </span>
              <span>/mo vs Claude 3.5 Sonnet</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Table & Simulation Tabs */}
      <div className="w-full surface-card rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Table Top Controls & Tabs */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Switcher Tabs */}
          <div className="flex flex-wrap items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('economics')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'economics'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Unit Economics</span>
            </button>
            <button
              onClick={() => setViewMode('benchmarks')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'benchmarks'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Academic Benchmarks</span>
            </button>
            <button
              onClick={() => setViewMode('multihost')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'multihost'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Server className="w-3.5 h-3.5 text-amber-600" />
              <span>Multi-Host Arbitrage</span>
            </button>
            <button
              onClick={() => setViewMode('canvas')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'canvas'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>Live Flow Canvas</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 29 models, providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Capability / Modality Filter Pills */}
        <div className="px-4 sm:px-5 py-3 bg-slate-50/70 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold shrink-0">Filter:</span>
          {(
            [
              { id: 'all', label: 'All Models', icon: null },
              { id: 'reasoning', label: 'Reasoning Models', icon: Brain },
              { id: 'vision', label: 'Vision Multimodal', icon: Eye },
              { id: 'coding', label: 'Coding Specialists', icon: Code },
              { id: 'fast', label: 'High Throughput (>200 t/s)', icon: Zap },
              { id: 'long-context', label: '1M+ Context', icon: Layers },
              { id: 'open-weights', label: 'Open Weights', icon: Server },
            ] as const
          ).map((filter) => {
            const Icon = filter.icon;
            const isSelected = selectedTag === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setSelectedTag(filter.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {Icon && <Icon className="w-3 h-3" />}
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>

        {/* View Content: Canvas View */}
        {viewMode === 'canvas' ? (
          <div className="p-4 sm:p-6">
            <TokenFlowCanvas
              requestsPerMonth={requestsPerMonth}
              cachingPercentage={cachingPercentage}
            />
          </div>
        ) : viewMode === 'benchmarks' ? (
          /* ACADEMIC BENCHMARKS VIEW */
          <div className="overflow-x-auto max-h-[720px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-100/95 backdrop-blur-md border-b border-slate-200 text-slate-700 uppercase tracking-widest font-mono text-[10px] select-none shadow-2xs">
                <tr>
                  <th onClick={() => handleSort('name')} className="py-3 px-4 sm:px-6 cursor-pointer hover:text-indigo-600 transition-colors">
                    <div className="flex items-center gap-1.5">
                      <span>MODEL // LAB</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('sweBench')} className="py-3 px-4 cursor-pointer hover:text-indigo-600 transition-colors">
                    <div className="flex items-center gap-1.5">
                      <span>SWE-BENCH VERIFIED</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('mmluPro')} className="py-3 px-4 cursor-pointer hover:text-indigo-600 transition-colors hidden sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      <span>MMLU-PRO</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('arenaElo')} className="py-3 px-4 cursor-pointer hover:text-indigo-600 transition-colors">
                    <div className="flex items-center gap-1.5">
                      <span>ARENA ELO</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 hidden md:table-cell">
                    <span>GPQA DIAMOND</span>
                  </th>
                  <th onClick={() => handleSort('efficiency')} className="py-3 px-4 cursor-pointer hover:text-indigo-600 transition-colors">
                    <div className="flex items-center gap-1.5">
                      <span>ELO / $ RATIO</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">
                    <span>ACTION</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredAndSorted.map(({ model, calculation, efficiencyScore }) => {
                  const b = model.benchmarks;
                  return (
                    <tr key={model.id} className="hover:bg-indigo-50/30 transition-colors">
                      {/* Model / Lab */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center p-1 border border-slate-200 shrink-0">
                            {getProviderLogo(model.provider)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{model.name}</span>
                              {model.supportsReasoning && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                  REASONING
                                </span>
                              )}
                              {model.isOpenWeights && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  OPEN
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                              <span>{model.provider}</span>
                              <span>·</span>
                              <span>{formatTokens(model.contextWindow)} ctx</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SWE-bench Verified */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-xs">
                            {b?.sweBenchVerified ? `${b.sweBenchVerified.toFixed(1)}%` : 'N/A'}
                          </span>
                        </div>
                        {b?.sweBenchVerified && (
                          <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                            <div
                              style={{ width: `${Math.min(100, (b.sweBenchVerified / 85) * 100)}%` }}
                              className="bg-indigo-600 h-full rounded-full"
                            />
                          </div>
                        )}
                      </td>

                      {/* MMLU-Pro */}
                      <td className="py-3.5 px-4 hidden sm:table-cell">
                        <div className="font-mono font-bold text-slate-800 text-xs">
                          {b?.mmluPro ? `${b.mmluPro.toFixed(1)}%` : 'N/A'}
                        </div>
                        {b?.mmluPro && (
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                            <div
                              style={{ width: `${Math.min(100, (b.mmluPro / 95) * 100)}%` }}
                              className="bg-emerald-500 h-full rounded-full"
                            />
                          </div>
                        )}
                      </td>

                      {/* Arena Elo */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-slate-100 text-slate-800 border border-slate-200">
                          {b?.arenaElo || 1300}
                        </span>
                      </td>

                      {/* GPQA Diamond */}
                      <td className="py-3.5 px-4 font-mono text-slate-700 hidden md:table-cell">
                        {b?.gpqaDiamond ? `${b.gpqaDiamond.toFixed(1)}%` : 'N/A'}
                      </td>

                      {/* Elo / $ Ratio */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-500" />
                          <span>{efficiencyScore.toLocaleString()}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          at ${(calculation.effectivePer1MTotal).toFixed(2)}/1M
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/model/${model.slug}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 font-mono font-semibold text-[11px] transition-all"
                        >
                          <span>Spec</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : viewMode === 'multihost' ? (
          /* MULTI-HOST ARBITRAGE VIEW */
          <div className="p-5 sm:p-6 bg-slate-50">
            <div className="mb-5 pb-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Server className="w-4 h-4 text-amber-600" />
                  <span>Open-Weights Multi-Host Arbitrage Matrix</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Compare cloud hosting providers (Groq LPU, Together AI, Fireworks AI, DeepInfra, Mistral) for pricing, token streaming speed, and median TTFT.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500">Live Provider Telemetry</span>
            </div>

            <div className="space-y-4">
              {filteredAndSorted
                .filter(({ model }) => model.hostingQuotes && model.hostingQuotes.length > 0)
                .map(({ model }) => (
                  <div key={model.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center p-1 border border-slate-200">
                          {getProviderLogo(model.provider)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <span>{model.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Open Weights
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 font-mono">
                            Official: ${model.inputPricePerMillion.toFixed(2)} in / ${model.outputPricePerMillion.toFixed(2)} out
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-slate-500">SWE-bench:</span>
                        <span className="font-bold text-slate-800">{model.benchmarks?.sweBenchVerified}%</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-500">Context:</span>
                        <span className="font-bold text-slate-800">{formatTokens(model.contextWindow)}</span>
                      </div>
                    </div>

                    {/* Providers Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 text-[10px] font-mono uppercase text-slate-400">
                            <th className="py-2 px-3">Hosting Provider</th>
                            <th className="py-2 px-3">Input / 1M</th>
                            <th className="py-2 px-3">Output / 1M</th>
                            <th className="py-2 px-3">Throughput</th>
                            <th className="py-2 px-3">TTFT (P50)</th>
                            <th className="py-2 px-3">90D Uptime</th>
                            <th className="py-2 px-3 text-right">Recommendation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-mono">
                          {model.hostingQuotes?.map((quote) => (
                            <tr key={quote.providerName} className="hover:bg-slate-50/80">
                              <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 flex items-center gap-1.5">
                                <span>{quote.providerName}</span>
                                {quote.isRecommended && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                    TOP VALUE
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-slate-900 font-bold">
                                ${quote.inputPricePerMillion.toFixed(2)}
                              </td>
                              <td className="py-2.5 px-3 text-slate-900 font-bold">
                                ${quote.outputPricePerMillion.toFixed(2)}
                              </td>
                              <td className="py-2.5 px-3 text-indigo-600 font-bold">
                                ~{quote.speedTokensPerSec} t/s
                              </td>
                              <td className="py-2.5 px-3 text-slate-600">
                                {quote.ttftMedianMs}ms
                              </td>
                              <td className="py-2.5 px-3 text-emerald-600 font-semibold">
                                {quote.uptime90d}%
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <Link
                                  href={`/compare/${model.slug}-vs-${quote.providerSlug}`}
                                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                                >
                                  Benchmark
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          /* STANDARD UNIT ECONOMICS TABLE VIEW */
          <div className="overflow-x-auto max-h-[720px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-100/95 backdrop-blur-md border-b border-slate-200 text-slate-700 uppercase tracking-widest font-mono text-[10px] select-none shadow-2xs">
                <tr>
                  <th
                    onClick={() => handleSort('name')}
                    className="py-3 px-4 sm:px-6 cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>MODEL // SPEC</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('monthlyCost')}
                    className="py-3 px-4 cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>MONTHLY BILL</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('inputPer1M')}
                    className="py-3 px-4 cursor-pointer hover:text-indigo-600 transition-colors hidden md:table-cell"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>INPUT / 1M</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('outputPer1M')}
                    className="py-3 px-4 cursor-pointer hover:text-indigo-600 transition-colors hidden md:table-cell"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>OUTPUT / 1M</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 hidden lg:table-cell">
                    <span>CACHE PRICE (-%)</span>
                  </th>
                  <th
                    onClick={() => handleSort('tokensPerSec')}
                    className="py-3 px-4 cursor-pointer hover:text-indigo-600 transition-colors hidden sm:table-cell"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>SPEED (TPS)</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">
                    <span>ACTION</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredAndSorted.map(({ model, calculation }) => (
                  <tr
                    key={model.id}
                    className="hover:bg-indigo-50/40 transition-colors group cursor-default"
                  >
                    {/* Model Spec */}
                    <td className="py-3 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center p-1 border border-slate-200 shrink-0">
                          {getProviderLogo(model.provider)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                            <span>{model.name}</span>
                            {model.recommended && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                                Top Pick
                              </span>
                            )}
                            {model.isOpenWeights && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                                Open Wts
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 font-mono">
                            <span>{model.provider}</span>
                            <span>·</span>
                            <span>{formatTokens(model.contextWindow)} ctx</span>
                            <span>·</span>
                            <span className="text-indigo-600 font-semibold">{model.qualityTier}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Calculated Monthly Cost */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                        <AnimatedCounter
                          value={calculation.totalMonthlyCost}
                          prefix="$"
                          decimals={2}
                        />
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-mono tabular-nums">
                        ${(calculation.effectivePer1MTotal).toFixed(2)}/1M blended
                      </div>
                    </td>

                    {/* Input Price */}
                    <td className="py-3 px-4 font-mono text-slate-700 tabular-nums hidden md:table-cell">
                      ${model.inputPricePerMillion.toFixed(2)}
                    </td>

                    {/* Output Price */}
                    <td className="py-3 px-4 font-mono text-slate-700 tabular-nums hidden md:table-cell">
                      ${model.outputPricePerMillion.toFixed(2)}
                    </td>

                    {/* Cache Pricing */}
                    <td className="py-3 px-4 hidden lg:table-cell">
                      {model.cachedInputPricePerMillion ? (
                        <div className="font-mono text-emerald-600 font-semibold tabular-nums">
                          ${model.cachedInputPricePerMillion.toFixed(3)}
                          <span className="text-[10px] text-slate-400 block font-normal">
                            (-{Math.round((1 - model.cachedInputPricePerMillion / model.inputPricePerMillion) * 100)}%)
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs font-mono">No cache</span>
                      )}
                    </td>

                    {/* Speed Tokens/sec */}
                    <td className="py-3 px-4 font-mono text-slate-600 tabular-nums hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">{model.typicalSpeedTokensPerSec}</span>
                        <span className="text-[10px] text-slate-400">t/s</span>
                      </div>
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          style={{ width: `${Math.min(100, (model.typicalSpeedTokensPerSec / 320) * 100)}%` }}
                          className="bg-indigo-500 h-full rounded-full"
                        />
                      </div>
                    </td>

                    {/* Action Link */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/model/${model.slug}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 font-mono font-semibold text-[11px] transition-all"
                        >
                          <span>Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer Stats Strip */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-2">
          <div>
            Showing <span className="font-bold text-slate-800">{filteredAndSorted.length}</span> of {AI_MODELS.length} verified frontier & workhorse models
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Latency update frequency: 15m live poll</span>
            <Link href="/api/v1/pricing.json" target="_blank" className="text-indigo-600 hover:underline flex items-center gap-1">
              <span>JSON Feed</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
