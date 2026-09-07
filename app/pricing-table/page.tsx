'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AI_MODELS } from '@/data/models';
import AdPlacement from '@/components/AdPlacement';
import { formatNumber } from '@/lib/calculator';
import { Search, Filter, ArrowRight, ArrowLeft, Table as TableIcon, Sparkles } from 'lucide-react';

export default function PricingTablePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [providerFilter, setProviderFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');

  const filtered = useMemo(() => {
    return AI_MODELS.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProvider =
        providerFilter === 'all' || m.providerSlug === providerFilter;
      const matchesTier = tierFilter === 'all' || m.qualityTier === tierFilter;
      return matchesSearch && matchesProvider && matchesTier;
    });
  }, [searchQuery, providerFilter, tierFilter]);

  return (
    <div className="w-full py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-text-muted mb-6">
          <Link href="/" className="hover:text-text-primary flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-brand font-mono">2026-model-index</span>
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-brand mb-3">
            <TableIcon className="h-3.5 w-3.5" />
            <span>Master AI Model Index</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
            Complete LLM API Token Pricing Directory (2026)
          </h1>
          <p className="mt-3 text-base text-text-secondary leading-relaxed">
            Standardized token rates, context windows, prompt caching discounts, and benchmark scores across all major production AI models.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="rounded-xl border border-border bg-surface p-4 sm:p-5 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search model by name, provider, or capability..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-subtle pl-10 pr-4 py-2 text-xs text-text-primary focus:border-brand focus:outline-none placeholder:text-text-muted"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="rounded-lg border border-border bg-surface-subtle px-3 py-2 text-xs font-medium text-text-primary focus:border-brand focus:outline-none"
            >
              <option value="all">All Providers</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="google">Google</option>
              <option value="deepseek">DeepSeek</option>
              <option value="meta">Meta Llama</option>
              <option value="mistral">Mistral</option>
            </select>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="rounded-lg border border-border bg-surface-subtle px-3 py-2 text-xs font-medium text-text-primary focus:border-brand focus:outline-none"
            >
              <option value="all">All Quality Tiers</option>
              <option value="Flagship / Frontier">Flagship / Frontier</option>
              <option value="High-Efficiency">High-Efficiency</option>
              <option value="Lightweight / Fast">Lightweight / Fast</option>
              <option value="Reasoning Heavy">Reasoning Heavy</option>
            </select>
          </div>
        </div>

        {/* Ad */}
        <AdPlacement slotId="table-page-top" format="horizontal-leaderboard" />

        {/* Master Table */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-md my-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-subtle font-mono text-xs uppercase tracking-wider text-text-muted">
                  <th className="py-4 px-4 sm:px-6">Model</th>
                  <th className="py-4 px-3">Provider</th>
                  <th className="py-4 px-3 text-right">Input / 1M</th>
                  <th className="py-4 px-3 text-right">Output / 1M</th>
                  <th className="py-4 px-3 text-right">Cached / 1M</th>
                  <th className="py-4 px-3">Context</th>
                  <th className="py-4 px-3">Latency</th>
                  <th className="py-4 px-4 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-surface-hover/80 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-semibold text-text-primary">
                      <Link href={`/model/${m.id}`} className="hover:text-brand transition-colors">
                        {m.name}
                      </Link>
                    </td>
                    <td className="py-4 px-3 text-xs text-text-secondary">{m.provider}</td>
                    <td className="py-4 px-3 text-right font-mono text-brand font-medium">
                      ${m.inputCostPer1M}
                    </td>
                    <td className="py-4 px-3 text-right font-mono text-text-primary">
                      ${m.outputCostPer1M}
                    </td>
                    <td className="py-4 px-3 text-right font-mono text-accent-emerald text-xs">
                      {m.cachedInputCostPer1M ? `$${m.cachedInputCostPer1M}` : '—'}
                    </td>
                    <td className="py-4 px-3 font-mono text-xs text-text-muted">
                      {formatNumber(m.contextWindow)}
                    </td>
                    <td className="py-4 px-3 text-xs">{m.latencyScore}</td>
                    <td className="py-4 px-4 text-center">
                      <Link
                        href={`/model/${m.id}`}
                        className="inline-flex items-center gap-1 rounded border border-border bg-surface-subtle px-2.5 py-1 text-xs text-text-secondary hover:text-white hover:border-brand"
                      >
                        <span>View</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
