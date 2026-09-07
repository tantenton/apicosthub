'use client';

import React, { useState, useMemo } from 'react';
import { AI_MODELS, POPULAR_COMPARISONS, AIModel } from '@/data/models';
import HeadToHeadCalculator from '@/components/HeadToHeadCalculator';
import AdPlacement from '@/components/AdPlacement';
import { getProviderLogo } from '@/components/ProviderLogos';
import Link from 'next/link';
import { ArrowLeft, ArrowLeftRight, Share2, Check, Sparkles, Zap, Shield, ChevronRight, Search } from 'lucide-react';
import { formatTokens } from '@/lib/calculator';

export default function CompareStudioPage() {
  const [modelAId, setModelAId] = useState<string>('gemini-3-8-flash');
  const [modelBId, setModelBId] = useState<string>('gemini-3-7-flash');
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const modelA = useMemo(() => AI_MODELS.find((m) => m.id === modelAId) || AI_MODELS[0], [modelAId]);
  const modelB = useMemo(() => AI_MODELS.find((m) => m.id === modelBId) || AI_MODELS[1] || AI_MODELS[0], [modelBId]);

  const handleSwap = () => {
    const temp = modelAId;
    setModelAId(modelBId);
    setModelBId(temp);
  };

  const shareableUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/compare/${modelA.slug}-vs-${modelB.slug}`
    : `https://apicosthub.vercel.app/compare/${modelA.slug}-vs-${modelB.slug}`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredModels = useMemo(() => {
    if (!searchFilter) return AI_MODELS;
    const q = searchFilter.toLowerCase();
    return AI_MODELS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q)
    );
  }, [searchFilter]);

  const costDelta = Math.abs(modelA.inputPricePerMillion - modelB.inputPricePerMillion);
  const cheaperModel = modelA.inputPricePerMillion < modelB.inputPricePerMillion ? modelA : modelB;
  const pricierModel = modelA.inputPricePerMillion < modelB.inputPricePerMillion ? modelB : modelA;
  const savingsPct = pricierModel.inputPricePerMillion > 0
    ? Math.round(((pricierModel.inputPricePerMillion - cheaperModel.inputPricePerMillion) / pricierModel.inputPricePerMillion) * 100)
    : 0;

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Tokenomics Workbench
        </Link>

        {/* Page Header */}
        <div className="mb-8 pb-6 border-b border-slate-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-bold uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4" />
              Custom Model Arena
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Compare Any Two AI Models
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
              Select any two models across Google, Anthropic, OpenAI, DeepSeek, xAI, Meta, and Mistral to calculate exact unit economics and prompt caching arbitrage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-indigo-400 hover:text-indigo-600 shadow-sm transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span>Share Custom Comparison</span>
                </>
              )}
            </button>

            <Link
              href={`/compare/${modelA.slug}-vs-${modelB.slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              <span>Direct Link</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Custom Selector Bar */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm mb-8">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4">
            Select Models to Benchmark
          </div>

          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            {/* Model A Selector */}
            <div className="md:col-span-5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                <span>Baseline Model (A)</span>
                <span className="text-[11px] font-mono text-indigo-600 font-normal">{modelA.provider}</span>
              </label>
              <select
                value={modelAId}
                onChange={(e) => setModelAId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer"
              >
                {AI_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider}) - ${m.inputPricePerMillion.toFixed(2)}/1M in
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center pt-2 md:pt-6">
              <button
                onClick={handleSwap}
                title="Swap Model A and Model B"
                className="p-3 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200 hover:border-indigo-300 transition-all"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* Model B Selector */}
            <div className="md:col-span-5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                <span>Alternative Model (B)</span>
                <span className="text-[11px] font-mono text-indigo-600 font-normal">{modelB.provider}</span>
              </label>
              <select
                value={modelBId}
                onChange={(e) => setModelBId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer"
              >
                {AI_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider}) - ${m.inputPricePerMillion.toFixed(2)}/1M in
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Live Delta Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-xs font-mono uppercase text-slate-500 mb-1">Input Arbitrage</div>
            <div className="text-2xl font-mono font-bold text-emerald-600">
              {savingsPct > 0 ? `${savingsPct}% Cheaper` : 'Parity'}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {cheaperModel.name} saves ${costDelta.toFixed(2)} per 1M input tokens
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-xs font-mono uppercase text-slate-500 mb-1">Context Window</div>
            <div className="text-2xl font-mono font-bold text-slate-900">
              {formatTokens(modelA.contextWindow)} vs {formatTokens(modelB.contextWindow)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {modelA.contextWindow > modelB.contextWindow
                ? `${modelA.name} has larger memory`
                : modelA.contextWindow < modelB.contextWindow
                ? `${modelB.name} has larger memory`
                : 'Equal context capacity'}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-xs font-mono uppercase text-slate-500 mb-1">Speed Throughput</div>
            <div className="text-2xl font-mono font-bold text-indigo-600">
              ~{modelA.typicalSpeedTokensPerSec} vs ~{modelB.typicalSpeedTokensPerSec} <span className="text-xs text-slate-500">t/s</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {modelA.typicalSpeedTokensPerSec > modelB.typicalSpeedTokensPerSec
                ? `${modelA.name} streams faster`
                : `${modelB.name} streams faster`}
            </div>
          </div>
        </div>

        {/* Interactive Head to Head Workbench with Active Models */}
        <div className="mb-12">
          <HeadToHeadCalculator initialModelA={modelA.id} initialModelB={modelB.id} />
        </div>

        {/* Side-by-Side Detailed Spec Matrix */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm mb-12">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            Side-by-Side Architecture Matrix
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-mono uppercase text-slate-400">
                  <th className="py-3 px-4">Metric</th>
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getProviderLogo(modelA.provider)} {modelA.name}
                    </div>
                  </th>
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getProviderLogo(modelB.provider)} {modelB.name}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-600">Provider</td>
                  <td className="py-3 px-4 text-slate-900">{modelA.provider}</td>
                  <td className="py-3 px-4 text-slate-900">{modelB.provider}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-600">Input Price / 1M</td>
                  <td className="py-3 px-4 text-slate-900 font-bold">${modelA.inputPricePerMillion.toFixed(2)}</td>
                  <td className="py-3 px-4 text-slate-900 font-bold">${modelB.inputPricePerMillion.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-600">Output Price / 1M</td>
                  <td className="py-3 px-4 text-slate-900 font-bold">${modelA.outputPricePerMillion.toFixed(2)}</td>
                  <td className="py-3 px-4 text-slate-900 font-bold">${modelB.outputPricePerMillion.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-600">Cached Input / 1M</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">
                    {modelA.cachedInputPricePerMillion ? `$${modelA.cachedInputPricePerMillion.toFixed(3)}` : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">
                    {modelB.cachedInputPricePerMillion ? `$${modelB.cachedInputPricePerMillion.toFixed(3)}` : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-600">Context Window</td>
                  <td className="py-3 px-4 text-slate-900">{modelA.contextWindow.toLocaleString()} tokens</td>
                  <td className="py-3 px-4 text-slate-900">{modelB.contextWindow.toLocaleString()} tokens</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-600">Streaming Speed</td>
                  <td className="py-3 px-4 text-slate-900">~{modelA.typicalSpeedTokensPerSec} t/s</td>
                  <td className="py-3 px-4 text-slate-900">~{modelB.typicalSpeedTokensPerSec} t/s</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-600">License Model</td>
                  <td className="py-3 px-4 text-slate-900">{modelA.isOpenWeights ? 'Open Weights' : 'Proprietary API'}</td>
                  <td className="py-3 px-4 text-slate-900">{modelB.isOpenWeights ? 'Open Weights' : 'Proprietary API'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Head-to-Head Benchmarks */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Curated Head-to-Head Comparisons</h3>
            <span className="text-xs text-slate-500 font-mono">1-Click Fast Previews</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {POPULAR_COMPARISONS.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {c.title}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {c.focusAngle}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0 ml-2" />
              </Link>
            ))}
          </div>
        </div>

        {/* Ad Placement */}
        <div className="mb-8">
          <AdPlacement slotId="footer-compare-studio-ad" />
        </div>
      </div>
    </div>
  );
}
