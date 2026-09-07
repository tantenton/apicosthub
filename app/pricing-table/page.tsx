'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AI_MODELS } from '@/data/models';
import AdPlacement from '@/components/AdPlacement';
import { getProviderLogo } from '@/components/ProviderLogos';
import { formatTokens } from '@/lib/calculator';
import { ArrowLeft, Search, Table2, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PricingTablePage() {
  const [search, setSearch] = useState('');
  const [providerFilter, setProviderFilter] = useState('All');

  const filtered = useMemo(() => {
    return AI_MODELS.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.provider.toLowerCase().includes(search.toLowerCase());
      const matchProvider = providerFilter === 'All' || m.provider === providerFilter;
      return matchSearch && matchProvider;
    });
  }, [search, providerFilter]);

  const providers = ['All', 'OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'Meta', 'Mistral'];

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

        {/* Top Header */}
        <div className="mb-8 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs text-indigo-600 font-bold uppercase tracking-wider mb-2">
            <Table2 className="w-4 h-4" />
            Master Reference Matrix
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Comprehensive AI Model Pricing Index
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Direct comparison of input, output, and cached token pricing across OpenAI, Anthropic, Google, DeepSeek, Meta, and Mistral.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="surface-card rounded-2xl p-4 border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search model or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {providers.map((p) => (
              <button
                key={p}
                onClick={() => setProviderFilter(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  providerFilter === p
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Master Table */}
        <div className="surface-card rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Model Architecture</th>
                  <th className="py-3.5 px-4">Provider</th>
                  <th className="py-3.5 px-4">Input / 1M</th>
                  <th className="py-3.5 px-4">Output / 1M</th>
                  <th className="py-3.5 px-4">Prompt Cache / 1M</th>
                  <th className="py-3.5 px-4">Context Window</th>
                  <th className="py-3.5 px-4">Typical Speed</th>
                  <th className="py-3.5 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-indigo-50/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center p-0.5">
                          {getProviderLogo(m.provider)}
                        </div>
                        <Link href={`/model/${m.slug}`} className="hover:text-indigo-600 transition-colors">
                          {m.name}
                        </Link>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600">{m.provider}</td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">${m.inputPricePerMillion.toFixed(2)}</td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">${m.outputPricePerMillion.toFixed(2)}</td>
                    <td className="py-4 px-4 font-mono text-emerald-600">
                      {m.cachedInputPricePerMillion ? `$${m.cachedInputPricePerMillion.toFixed(2)}` : '-'}
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-600">{formatTokens(m.contextWindow)}</td>
                    <td className="py-4 px-4 font-mono text-slate-600">{m.typicalSpeedTokensPerSec} t/s</td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/model/${m.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        Inspect <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ad Placement */}
        <div className="my-8">
          <AdPlacement slotId="pricing-table-bottom" format="horizontal-leaderboard" />
        </div>
      </div>
    </div>
  );
}
