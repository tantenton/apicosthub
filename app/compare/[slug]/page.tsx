import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { POPULAR_COMPARISONS, AI_MODELS, PopularComparisonPair } from '@/data/models';
import HeadToHeadCalculator from '@/components/HeadToHeadCalculator';
import AdPlacement from '@/components/AdPlacement';
import Link from 'next/link';
import { ArrowLeft, GitCompare, Zap, Shield, Sparkles, Terminal } from 'lucide-react';
import { formatContextWindow } from '@/lib/calculator';

interface ComparePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return POPULAR_COMPARISONS.map((comp) => ({
    slug: comp.slug,
  }));
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const comparison = POPULAR_COMPARISONS.find((c) => c.slug === params.slug);
  if (!comparison) {
    return {
      title: 'Model Comparison | APICostHub',
    };
  }

  return {
    title: `${comparison.title} — Real-Time API Cost Calculator 2026`,
    description: comparison.subtitle,
    openGraph: {
      title: `${comparison.title} | APICostHub`,
      description: comparison.subtitle,
      url: `https://apicosthub.vercel.app/compare/${params.slug}`,
    },
  };
}

export default function ComparePage({ params }: ComparePageProps) {
  const comparison = POPULAR_COMPARISONS.find((c) => c.slug === params.slug);
  if (!comparison) {
    notFound();
  }

  const modelA = AI_MODELS.find((m) => m.id === comparison.modelAId);
  const modelB = AI_MODELS.find((m) => m.id === comparison.modelBId);

  if (!modelA || !modelB) {
    notFound();
  }

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
            Direct Model Diff & Benchmark Analysis
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            {comparison.title}
          </h1>
          <p className="text-sm text-[#94A3B8] mt-2 max-w-3xl leading-relaxed">
            {comparison.subtitle}
          </p>
        </div>

        {/* Top Sponsor Unit */}
        <AdPlacement slotId="compare-top-ad" format="horizontal-leaderboard" />

        {/* Interactive Comparison Simulator */}
        <div className="my-8">
          <HeadToHeadCalculator
            initialModelA={comparison.modelAId}
            initialModelB={comparison.modelBId}
          />
        </div>

        {/* Deep Analysis & Recommendation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
          
          <div className="terminal-card rounded-xl p-5 border border-[#1E2638] md:col-span-2 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Engineering Verdict & Architecture Guidance
            </h2>
            <div className="text-xs text-[#CBD5E1] space-y-3 leading-relaxed">
              <p>
                When building production workloads, choosing between <strong>{modelA.name}</strong> and{' '}
                <strong>{modelB.name}</strong> depends heavily on your token volume distribution and latency budgets.
              </p>
              <div className="bg-[#0E121B] p-4 rounded-lg border border-[#1E2638] space-y-2">
                <div className="font-bold text-white text-xs">Cost Factor Summary:</div>
                <ul className="list-disc list-inside space-y-1 text-[#94A3B8]">
                  <li>
                    <strong>Input Tokens:</strong> {modelA.name} costs ${modelA.inputCostPer1M}/1M vs{' '}
                    {modelB.name} at ${modelB.inputCostPer1M}/1M.
                  </li>
                  <li>
                    <strong>Output Tokens:</strong> {modelA.name} costs ${modelA.outputCostPer1M}/1M vs{' '}
                    {modelB.name} at ${modelB.outputCostPer1M}/1M.
                  </li>
                  <li>
                    <strong>Prompt Caching:</strong>{' '}
                    {(modelA.cachedInputCostPer1M ?? 0) > 0
                      ? `${modelA.name} supports caching at $${modelA.cachedInputCostPer1M}/1M.`
                      : `${modelA.name} does not offer native prompt caching.`}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="terminal-card rounded-xl p-5 border border-[#1E2638] space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              Quick Specs Comparison
            </h2>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#0E121B] border border-[#1E2638]">
                <div className="text-[#64748B] text-[10px] uppercase">Context Window</div>
                <div className="text-white font-bold mt-0.5">
                  {formatContextWindow(modelA.contextWindow)} vs {formatContextWindow(modelB.contextWindow)}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#0E121B] border border-[#1E2638]">
                <div className="text-[#64748B] text-[10px] uppercase">Throughput Speed</div>
                <div className="text-white font-bold mt-0.5">
                  {modelA.speedTokensPerSec || 80} tok/s vs {modelB.speedTokensPerSec || 80} tok/s
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#0E121B] border border-[#1E2638]">
                <div className="text-[#64748B] text-[10px] uppercase">Weights Visibility</div>
                <div className="text-white font-bold mt-0.5">
                  {modelA.isOpenWeights ? 'Open Weights' : 'Proprietary API'} vs{' '}
                  {modelB.isOpenWeights ? 'Open Weights' : 'Proprietary API'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Comparisons Grid */}
        <div className="pt-8 border-t border-[#1E2638]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            Explore Other Head-to-Head Comparisons
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {POPULAR_COMPARISONS.filter((c) => c.slug !== params.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="p-3 rounded-lg bg-[#0E121B] border border-[#1E2638] hover:border-[#10B981] transition-all text-xs text-[#CBD5E1] flex items-center justify-between"
              >
                <span>{c.title.split(':')[0]}</span>
                <span className="text-[#10B981]">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Ad */}
        <AdPlacement slotId="compare-bottom-ad" format="horizontal-leaderboard" className="mt-10" />
      </div>
    </div>
  );
}
