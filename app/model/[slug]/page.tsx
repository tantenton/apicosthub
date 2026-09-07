import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { AI_MODELS } from '@/data/models';
import HeadToHeadCalculator from '@/components/HeadToHeadCalculator';
import AdPlacement from '@/components/AdPlacement';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Cpu, ShieldCheck, Zap } from 'lucide-react';
import { formatNumber } from '@/lib/calculator';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return AI_MODELS.map((model) => ({
    slug: model.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const model = AI_MODELS.find((m) => m.id === params.slug);
  if (!model) {
    return {
      title: 'AI Model Pricing | APICostHub',
    };
  }

  return {
    title: `${model.name} Token Pricing & Cost Calculator (2026) — APICostHub`,
    description: `Complete ${model.name} pricing guide. Input costs ($${model.inputCostPer1M}/1M), output costs ($${model.outputCostPer1M}/1M), context window (${formatNumber(model.contextWindow)}), and prompt caching discounts.`,
    openGraph: {
      title: `${model.name} Pricing Calculator | APICostHub`,
      description: model.description,
    },
  };
}

export default function ModelDetailPage({ params }: Props) {
  const model = AI_MODELS.find((m) => m.id === params.slug);
  if (!model) {
    notFound();
  }

  const otherModels = AI_MODELS.filter((m) => m.id !== model.id).slice(0, 6);

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
          <Link href="/pricing-table" className="hover:text-text-primary">
            Models
          </Link>
          <span>/</span>
          <span className="text-brand font-mono">{model.id}</span>
        </div>

        {/* Model Hero Info */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs text-brand bg-brand-subtle px-2.5 py-0.5 rounded border border-brand/20 font-bold">
                  {model.provider}
                </span>
                <span className="font-mono text-xs text-text-muted border border-border px-2.5 py-0.5 rounded">
                  {model.qualityTier}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
                {model.name}
              </h1>
              <p className="mt-2 text-sm text-text-secondary max-w-2xl leading-relaxed">
                {model.description}
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end bg-surface-subtle p-4 rounded-xl border border-border">
              <span className="text-xs text-text-muted uppercase font-mono">Standard Token Rates</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-brand">${model.inputCostPer1M}</span>
                <span className="text-xs text-text-muted">/ 1M in</span>
                <span className="text-xl font-bold font-mono text-text-primary ml-2">${model.outputCostPer1M}</span>
                <span className="text-xs text-text-muted">/ 1M out</span>
              </div>
              {model.cachedInputCostPer1M && (
                <span className="mt-1 text-xs font-mono text-accent-emerald">
                  Cache Read: ${model.cachedInputCostPer1M} / 1M
                </span>
              )}
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="rounded-lg border border-border bg-surface-subtle p-3.5">
              <span className="text-xs text-text-muted block">Context Window</span>
              <span className="font-mono font-bold text-base text-text-primary">
                {formatNumber(model.contextWindow)} tokens
              </span>
            </div>
            <div className="rounded-lg border border-border bg-surface-subtle p-3.5">
              <span className="text-xs text-text-muted block">Max Output</span>
              <span className="font-mono font-bold text-base text-text-primary">
                {formatNumber(model.maxOutput)} tokens
              </span>
            </div>
            <div className="rounded-lg border border-border bg-surface-subtle p-3.5">
              <span className="text-xs text-text-muted block">Latency Tier</span>
              <span className="font-mono font-bold text-base text-text-primary">
                {model.latencyScore}
              </span>
            </div>
            <div className="rounded-lg border border-border bg-surface-subtle p-3.5">
              <span className="text-xs text-text-muted block">Knowledge Cutoff</span>
              <span className="font-mono font-bold text-base text-text-primary">
                {model.knowledgeCutoff}
              </span>
            </div>
          </div>

          {/* Recommended Use Cases */}
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3">
              Recommended Workloads & Ideal Use Cases
            </h3>
            <div className="flex flex-wrap gap-2">
              {model.recommendedFor.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-subtle px-3 py-1 text-xs text-text-secondary"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent-emerald" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Ad Placement */}
        <AdPlacement slotId="model-top-ad" format="horizontal-leaderboard" />

        {/* Interactive Comparison against default flagship */}
        <div className="my-8">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            Simulate Custom Workloads for {model.name}
          </h2>
          <HeadToHeadCalculator
            initialModelA={model.id}
            initialModelB={model.id === 'gpt-4o' ? 'claude-3-5-sonnet' : 'gpt-4o'}
          />
        </div>

        {/* Cross-Link Grid to other models */}
        <div className="my-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">
            Compare with Other Models
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherModels.map((other) => (
              <Link
                key={other.id}
                href={`/compare/${model.id}-vs-${other.id}`}
                className="rounded-xl border border-border bg-surface p-4 hover:border-brand transition-colors block"
              >
                <h4 className="text-xs font-bold text-text-primary mb-1">
                  {model.name} vs {other.name}
                </h4>
                <p className="text-[11px] text-text-muted">
                  Compare {model.provider} vs {other.provider} token rates and monthly savings.
                </p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
