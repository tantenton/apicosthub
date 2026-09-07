import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { POPULAR_COMPARISONS, AI_MODELS, PopularComparisonPair } from '@/data/models';
import HeadToHeadCalculator from '@/components/HeadToHeadCalculator';
import AdPlacement from '@/components/AdPlacement';
import Link from 'next/link';
import { GitCompare, CheckCircle, ArrowLeft, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { formatNumber } from '@/lib/calculator';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return POPULAR_COMPARISONS.map((comp) => ({
    slug: comp.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const comparison = POPULAR_COMPARISONS.find((c) => c.slug === params.slug);
  if (!comparison) {
    return {
      title: 'Model Comparison | APICostHub',
    };
  }

  const modelA = AI_MODELS.find((m) => m.id === comparison.modelAId);
  const modelB = AI_MODELS.find((m) => m.id === comparison.modelBId);

  return {
    title: `${comparison.title} (2026 Calculator) — APICostHub`,
    description: `Detailed cost comparison between ${modelA?.name} and ${modelB?.name}. Calculate token pricing, prompt caching yields, and annual savings for custom request volumes.`,
    openGraph: {
      title: `${comparison.title} | APICostHub`,
      description: comparison.subtitle,
    },
  };
}

export default function ComparisonPage({ params }: Props) {
  const comparison = POPULAR_COMPARISONS.find((c) => c.slug === params.slug);
  if (!comparison) {
    notFound();
  }

  const modelA = AI_MODELS.find((m) => m.id === comparison.modelAId) || AI_MODELS[0];
  const modelB = AI_MODELS.find((m) => m.id === comparison.modelBId) || AI_MODELS[4];

  return (
    <div className="w-full py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-2 text-xs text-text-muted mb-6">
          <Link href="/" className="hover:text-text-primary flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-text-secondary">Comparisons</span>
          <span>/</span>
          <span className="text-brand font-mono">{params.slug}</span>
        </div>

        {/* Hero Section for Page */}
        <div className="max-w-4xl mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-brand mb-3">
            <GitCompare className="h-3.5 w-3.5" />
            <span>Head-to-Head Token Benchmark</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
            {comparison.title}
          </h1>
          <p className="mt-3 text-base text-text-secondary leading-relaxed">
            {comparison.subtitle}
          </p>
        </div>

        {/* Top Ad Unit */}
        <AdPlacement slotId="compare-top-ad" format="horizontal-leaderboard" />

        {/* The Live Interactive Calculator preloaded with this pair */}
        <div className="my-8">
          <HeadToHeadCalculator
            initialModelA={comparison.modelAId}
            initialModelB={comparison.modelBId}
          />
        </div>

        {/* Deep Dive Comparison Matrix */}
        <div className="my-12 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <h2 className="text-xl font-bold text-text-primary mb-6">
            Detailed Specification & Benchmark Matrix
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-subtle font-mono text-xs uppercase text-text-muted">
                  <th className="py-3 px-4">Metric</th>
                  <th className="py-3 px-4">{modelA.name}</th>
                  <th className="py-3 px-4">{modelB.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                <tr>
                  <td className="py-3.5 px-4 font-medium text-text-secondary">Provider</td>
                  <td className="py-3.5 px-4 font-semibold text-text-primary">{modelA.provider}</td>
                  <td className="py-3.5 px-4 font-semibold text-text-primary">{modelB.provider}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-text-secondary">Input Price (1M tokens)</td>
                  <td className="py-3.5 px-4 font-mono text-brand">${modelA.inputCostPer1M}</td>
                  <td className="py-3.5 px-4 font-mono text-brand">${modelB.inputCostPer1M}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-text-secondary">Output Price (1M tokens)</td>
                  <td className="py-3.5 px-4 font-mono text-text-primary">${modelA.outputCostPer1M}</td>
                  <td className="py-3.5 px-4 font-mono text-text-primary">${modelB.outputCostPer1M}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-text-secondary">Prompt Caching Discount</td>
                  <td className="py-3.5 px-4 font-mono text-accent-emerald">
                    ${modelA.cachedInputCostPer1M ? `${modelA.cachedInputCostPer1M} (cached)` : 'N/A'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-accent-emerald">
                    ${modelB.cachedInputCostPer1M ? `${modelB.cachedInputCostPer1M} (cached)` : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-text-secondary">Context Window</td>
                  <td className="py-3.5 px-4 font-mono">{formatNumber(modelA.contextWindow)} tokens</td>
                  <td className="py-3.5 px-4 font-mono">{formatNumber(modelB.contextWindow)} tokens</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-text-secondary">Latency Speed Tier</td>
                  <td className="py-3.5 px-4">{modelA.latencyScore}</td>
                  <td className="py-3.5 px-4">{modelB.latencyScore}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-text-secondary">MMLU Benchmark Score</td>
                  <td className="py-3.5 px-4 font-mono text-text-primary">{modelA.benchmarks?.mmlu || 'N/A'}%</td>
                  <td className="py-3.5 px-4 font-mono text-text-primary">{modelB.benchmarks?.mmlu || 'N/A'}%</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-text-secondary">Code Benchmark (HumanEval)</td>
                  <td className="py-3.5 px-4 font-mono text-text-primary">{modelA.benchmarks?.code || 'N/A'}%</td>
                  <td className="py-3.5 px-4 font-mono text-text-primary">{modelB.benchmarks?.code || 'N/A'}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Other Comparisons Navigation */}
        <div className="my-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">
            More Popular Head-to-Head Comparisons
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_COMPARISONS.filter((c) => c.slug !== params.slug).map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="rounded-xl border border-border bg-surface p-4 hover:border-brand transition-colors block"
              >
                <h4 className="text-xs font-bold text-text-primary mb-1">{comp.title}</h4>
                <p className="text-[11px] text-text-muted truncate">{comp.subtitle}</p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
