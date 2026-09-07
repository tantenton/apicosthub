'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AI_MODELS } from '@/data/models';
import AdPlacement from '@/components/AdPlacement';
import { ProviderIcon } from '@/components/ProviderLogos';
import { formatContextWindow } from '@/lib/calculator';
import { ArrowLeft, Search, Table2, ChevronRight } from 'lucide-react';

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

  return (
    <div className="w-full min-h-screen bg-[#08090a] text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6 min-h-[36px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Tokenomics Workbench
        </Link>

        {/* Top Header */}
        <div className="mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-2">
            <Table2 className="w-4 h-4" />
            Master Reference Matrix
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Comprehensive AI Model Pricing Index
          </h1>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Direct comparison of input, output, and cached token pricing across OpenAI, Anthropic, Google, DeepSeek, Meta, and Mistral.
          </p>
        </div>

        {/* Top Sponsor */}
        <AdPlacement slotId="pricing-table-top" format="horizontal-leaderboard" />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-6">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search model or provider..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#08090a] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-h-[44px]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
            {['All', 'OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'Meta (Hosted)', 'Mistral'].map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setProviderFilter(p)}
                  className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap min-h-[38px] ${
                    providerFilter === p
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white bg-white/[0.02] border border-white/5'
                  }`}
                >
                  {p}
                </button>
              )
            )}
          </div>
        </div>

        {/* Master Table */}
        <div className="surface-card rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-[#08090a] text-slate-400 uppercase text-xs tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Model Name</th>
                  <th className="py-3.5 px-3 font-semibold">Provider</th>
                  <th className="py-3.5 px-3 font-semibold">Tier</th>
                  <th className="py-3.5 px-3 font-semibold">Context Window</th>
                  <th className="py-3.5 px-3 font-semibold">Input / 1M</th>
                  <th className="py-3.5 px-3 font-semibold">Cached / 1M</th>
                  <th className="py-3.5 px-3 font-semibold">Output / 1M</th>
                  <th className="py-3.5 px-4 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length > 0 ? (
                  filtered.map((m) => (
                    <tr key={m.id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">
                        <Link href={`/model/${m.id}`} className="hover:text-indigo-400 transition-colors flex items-center gap-2">
                          <ProviderIcon provider={m.provider} className="w-4 h-4" />
                          <span>{m.name}</span>
                        </Link>
                      </td>
                      <td className="py-3.5 px-3 text-slate-400">
                        <span className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/10 text-xs">
                          {m.provider}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-400">{m.qualityTier}</td>
                      <td className="py-3.5 px-3 text-slate-300 font-mono">{formatContextWindow(m.contextWindow)}</td>
                      <td className="py-3.5 px-3 text-white font-medium font-mono">
                        ${m.inputCostPer1M.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 text-cyan-400 font-mono">
                        {(m.cachedInputCostPer1M ?? 0) > 0 ? `$${m.cachedInputCostPer1M!.toFixed(2)}` : 'N/A'}
                      </td>
                      <td className="py-3.5 px-3 text-white font-medium font-mono">
                        ${m.outputCostPer1M.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          href={`/model/${m.id}`}
                          className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
                        >
                          <span>Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-xs text-slate-400">
                      No models matching current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Sponsor */}
        <AdPlacement slotId="pricing-table-bottom" format="horizontal-leaderboard" className="mt-10" />
      </div>
    </div>
  );
}
