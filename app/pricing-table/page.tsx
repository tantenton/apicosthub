'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AI_MODELS } from '@/data/models';
import AdPlacement from '@/components/AdPlacement';
import { formatContextWindow } from '@/lib/calculator';
import { ArrowLeft, Search, Filter, Terminal, ExternalLink } from 'lucide-react';

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
    <div className="w-full min-h-screen bg-[#080A0F] text-[#E2E8F0] font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Tokenomics Workbench
        </Link>

        {/* Top Header */}
        <div className="mb-8 pb-6 border-b border-[#1E2638]">
          <div className="flex items-center gap-2 text-xs text-[#10B981] font-semibold uppercase tracking-wider mb-2">
            <Terminal className="w-4 h-4" />
            Master Reference Matrix
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Comprehensive AI Model Pricing Index
          </h1>
          <p className="text-xs text-[#94A3B8] mt-2 max-w-2xl leading-relaxed">
            Direct comparison of input, output, and cached token pricing across OpenAI, Anthropic, Google, DeepSeek, Meta, and Mistral.
          </p>
        </div>

        {/* Top Sponsor */}
        <AdPlacement slotId="pricing-table-top" format="horizontal-leaderboard" />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-6">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search model or provider..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0E121B] border border-[#1E2638] text-xs font-mono text-white placeholder-[#64748B] focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto text-[11px]">
            {['All', 'OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'Meta (Hosted)', 'Mistral'].map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setProviderFilter(p)}
                  className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                    providerFilter === p
                      ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/40 font-bold'
                      : 'text-[#94A3B8] hover:text-white bg-[#0E121B] border border-[#1E2638]'
                  }`}
                >
                  {p}
                </button>
              )
            )}
          </div>
        </div>

        {/* Master Table */}
        <div className="terminal-card rounded-xl overflow-hidden border border-[#1E2638]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#1E2638] bg-[#0A0D14] text-[#64748B] uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Model Name</th>
                  <th className="py-3 px-3">Provider</th>
                  <th className="py-3 px-3">Tier</th>
                  <th className="py-3 px-3">Context Window</th>
                  <th className="py-3 px-3">Input / 1M</th>
                  <th className="py-3 px-3">Cached / 1M</th>
                  <th className="py-3 px-3">Output / 1M</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2638]/60">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-[#141A26]/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">
                      <Link href={`/model/${m.id}`} className="hover:text-[#10B981] transition-colors">
                        {m.name}
                      </Link>
                    </td>
                    <td className="py-3 px-3 text-[#94A3B8]">
                      <span className="px-2 py-0.5 rounded bg-[#171E2E] border border-[#232D42] text-[10px]">
                        {m.provider}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#94A3B8]">{m.qualityTier}</td>
                    <td className="py-3 px-3 text-[#CBD5E1]">{formatContextWindow(m.contextWindow)}</td>
                    <td className="py-3 px-3 text-white font-medium">
                      ${m.inputCostPer1M.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-emerald-400">
                      {(m.cachedInputCostPer1M ?? 0) > 0 ? `$${m.cachedInputCostPer1M!.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-3 px-3 text-white font-medium">
                      ${m.outputCostPer1M.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        href={`/model/${m.id}`}
                        className="text-[11px] text-[#10B981] hover:underline"
                      >
                        Details →
                      </Link>
                    </td>
                  </tr>
                ))}
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
