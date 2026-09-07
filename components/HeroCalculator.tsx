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
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AI_MODELS, WORKLOAD_PRESETS, WorkloadPreset, AIModel } from '../data/models';
import { calculateWorkloadCost, formatCurrency, formatTokens } from '../lib/calculator';
import { getProviderLogo } from './ProviderLogos';
import TokenFlowCanvas from './TokenFlowCanvas';
import AnimatedCounter from './AnimatedCounter';

type SortField = 'monthlyCost' | 'name' | 'inputPer1M' | 'outputPer1M' | 'tokensPerSec';
type SortOrder = 'asc' | 'desc';

export default function HeroCalculator() {
  // Simulator State
  const [requestsPerMonth, setRequestsPerMonth] = useState<number>(500_000);
  const [inputTokensPerReq, setInputTokensPerReq] = useState<number>(1_500);
  const [outputTokensPerReq, setOutputTokensPerReq] = useState<number>(600);
  const [cachingPercentage, setCachingPercentage] = useState<number>(40);
  const [batchDiscount, setBatchDiscount] = useState<boolean>(false);
  
  // View & Filter State
  const [activeTab, setActiveTab] = useState<'table' | 'canvas'>('table');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('monthlyCost');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
      return {
        model,
        calculation,
      };
    });
  }, [requestsPerMonth, inputTokensPerReq, outputTokensPerReq, cachingPercentage, batchDiscount]);

  // Filter & Sort
  const filteredAndSorted = useMemo(() => {
    return calculatedRows
      .filter(({ model }) => {
        const matchesCat = selectedCategory === 'all' || model.category === selectedCategory;
        const matchesSearch = 
          model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.provider.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
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
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [calculatedRows, selectedCategory, sortField, sortOrder, searchQuery]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
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
          <span>Frontier AI Unit Economics Benchmark · Updated 2026</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]"
        >
          Calculate & Optimize <br className="hidden sm:inline" />
          <span className="text-indigo-600">LLM Inference Unit Costs</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3.5 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
        >
          Compare 16+ frontier model architectures, test prompt cache discounts, and model real-world agentic workload costs with micro-cent precision.
        </motion.p>
      </div>

      {/* Interactive Workload Presets */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Workload Profiles
          </span>
          <span className="text-xs text-slate-400">Click to instantly populate parameters</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {WORKLOAD_PRESETS.map((preset) => {
            const isMatch =
              requestsPerMonth === preset.requestsPerMonth &&
              inputTokensPerReq === preset.inputTokensPerReq &&
              outputTokensPerReq === preset.outputTokensPerReq;

            return (
              <motion.button
                key={preset.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => applyPreset(preset)}
                className={`p-3.5 rounded-xl text-left transition-all border ${
                  isMatch
                    ? 'bg-indigo-50/90 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isMatch ? 'text-indigo-700' : 'text-slate-800'}`}>
                    {preset.name}
                  </span>
                  {isMatch && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </div>
                <div className="text-[11px] text-slate-500 leading-snug">
                  {preset.desc}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Simulator Control Sliders Box */}
      <div className="w-full surface-card rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-200 mb-8">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-bold text-slate-900">Custom Workload Parameters</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Dynamic Recalculation Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Slider 1: Requests */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Monthly Invocations</span>
              <span className="font-mono font-bold text-indigo-600 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">
                {requestsPerMonth.toLocaleString()} calls
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={10000000}
              step={50000}
              value={requestsPerMonth}
              onChange={(e) => setRequestsPerMonth(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>10K</span>
              <span>1M</span>
              <span>10M</span>
            </div>
          </div>

          {/* Slider 2: Input Tokens */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Input Tokens / Req</span>
              <span className="font-mono font-bold text-indigo-600 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">
                {inputTokensPerReq.toLocaleString()} tokens
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={64000}
              step={200}
              value={inputTokensPerReq}
              onChange={(e) => setInputTokensPerReq(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>100</span>
              <span>8K</span>
              <span>64K</span>
            </div>
          </div>

          {/* Slider 3: Output Tokens */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Output Tokens / Req</span>
              <span className="font-mono font-bold text-indigo-600 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">
                {outputTokensPerReq.toLocaleString()} tokens
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={8192}
              step={50}
              value={outputTokensPerReq}
              onChange={(e) => setOutputTokensPerReq(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>50</span>
              <span>2K</span>
              <span>8K</span>
            </div>
          </div>

          {/* Slider 4: Cache Percentage */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Prompt Caching Hits</span>
              <span className="font-mono font-bold text-emerald-600 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100">
                {cachingPercentage}% cache
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={90}
              step={5}
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
              <span>/mo vs Claude 3.5</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Table & Simulation Tabs */}
      <div className="w-full surface-card rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Table Top Controls & Tabs */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Switcher Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setActiveTab('table')}
              className={`relative px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'table'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interactive Table
            </button>
            <button
              onClick={() => setActiveTab('canvas')}
              className={`relative px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'canvas'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>Live Flow Canvas</span>
            </button>
          </div>

          {/* Search Box & Category Filters */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              {['all', 'frontier', 'fast', 'reasoning'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md capitalize font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View Content: Table OR Canvas */}
        {activeTab === 'canvas' ? (
          <div className="p-4 sm:p-6">
            <TokenFlowCanvas
              requestsPerMonth={requestsPerMonth}
              cachingPercentage={cachingPercentage}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold select-none">
                <tr>
                  <th
                    onClick={() => handleSort('name')}
                    className="py-3 px-4 sm:px-6 cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Model Architecture</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('monthlyCost')}
                    className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Calculated Monthly</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('inputPer1M')}
                    className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors hidden md:table-cell"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Input / 1M</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('outputPer1M')}
                    className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors hidden md:table-cell"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Output / 1M</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 hidden lg:table-cell">Prompt Cache</th>
                  <th
                    onClick={() => handleSort('tokensPerSec')}
                    className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors hidden sm:table-cell"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Speed</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAndSorted.map(({ model, calculation }, idx) => (
                  <tr
                    key={model.id}
                    className="hover:bg-indigo-50/40 transition-colors group"
                  >
                    {/* Model Name & Provider */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center p-1 shadow-2xs">
                          {getProviderLogo(model.provider)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Link href={`/model/${model.slug}`} className="hover:text-indigo-600 transition-colors">
                              {model.name}
                            </Link>
                            {model.recommended && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                Popular
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>{model.provider}</span>
                            <span>·</span>
                            <span>{formatTokens(model.contextWindow)} ctx</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Calculated Monthly Cost */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900 text-sm">
                        <AnimatedCounter
                          value={calculation.totalMonthlyCost}
                          prefix="$"
                          decimals={2}
                        />
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        ${(calculation.effectivePer1MTotal).toFixed(2)}/1M blended
                      </div>
                    </td>

                    {/* Input Price */}
                    <td className="py-3.5 px-4 font-mono text-slate-700 hidden md:table-cell">
                      ${model.inputPricePerMillion.toFixed(2)}
                    </td>

                    {/* Output Price */}
                    <td className="py-3.5 px-4 font-mono text-slate-700 hidden md:table-cell">
                      ${model.outputPricePerMillion.toFixed(2)}
                    </td>

                    {/* Cache Pricing */}
                    <td className="py-3.5 px-4 hidden lg:table-cell">
                      {model.cachedInputPricePerMillion ? (
                        <div className="font-mono text-emerald-600 font-semibold">
                          ${model.cachedInputPricePerMillion.toFixed(2)}
                          <span className="text-[10px] text-slate-400 block font-normal">
                            (-{Math.round((1 - model.cachedInputPricePerMillion / model.inputPricePerMillion) * 100)}%)
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">No cache</span>
                      )}
                    </td>

                    {/* Speed Tokens/sec */}
                    <td className="py-3.5 px-4 font-mono text-slate-600 hidden sm:table-cell">
                      {model.typicalSpeedTokensPerSec} t/s
                    </td>

                    {/* Action Link */}
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/model/${model.slug}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 font-semibold text-[11px] transition-all"
                      >
                        <span>Deep Dive</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
