import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { POPULAR_COMPARISONS, AI_MODELS } from '@/data/models';
import HeadToHeadCalculator from '@/components/HeadToHeadCalculator';
import AdPlacement from '@/components/AdPlacement';
import { getProviderLogo } from '@/components/ProviderLogos';
import Link from 'next/link';
import { ArrowLeft, Zap, Shield, ChevronRight } from 'lucide-react';
import { formatTokens } from '@/lib/calculator';

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
    title: `${comparison.title}: Real-Time API Cost Calculator 2026`,
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
          <div className="flex items-center gap-3 text-xs text-indigo-600 font-bold uppercase tracking-wider mb-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200">
              <span>{modelA.name}</span>
            </div>
            <span className="text-slate-400">vs</span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200">
              <span>{modelB.name}</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {comparison.title}
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
            {comparison.subtitle}
          </p>
        </div>

        {/* Interactive Comparison Simulator */}
        <div className="my-8">
          <HeadToHeadCalculator />
        </div>

        {/* Deep Analysis & Recommendation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
          <div className="surface-card rounded-2xl p-6 md:col-span-2 space-y-4 shadow-sm border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-600" />
              Engineering Verdict and Architecture Guidance
            </h2>
            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                When building production workloads, choosing between <strong>{modelA.name}</strong> and{' '}
                <strong>{modelB.name}</strong> depends heavily on your token volume distribution and latency budgets.
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-xs">Cost Factor Summary:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>
                    <strong>Input Tokens:</strong> {modelA.name} costs <span className="font-mono text-slate-900 font-bold">${modelA.inputPricePerMillion}/1M</span> vs{' '}
                    {modelB.name} at <span className="font-mono text-slate-900 font-bold">${modelB.inputPricePerMillion}/1M</span>.
                  </li>
                  <li>
                    <strong>Output Tokens:</strong> {modelA.name} costs <span className="font-mono text-slate-900 font-bold">${modelA.outputPricePerMillion}/1M</span> vs{' '}
                    {modelB.name} at <span className="font-mono text-slate-900 font-bold">${modelB.outputPricePerMillion}/1M</span>.
                  </li>
                  <li>
                    <strong>Prompt Caching:</strong>{' '}
                    {modelA.cachedInputPricePerMillion
                      ? `${modelA.name} supports caching at $${modelA.cachedInputPricePerMillion}/1M.`
                      : `${modelA.name} does not offer native prompt caching.`}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="surface-card rounded-2xl p-6 space-y-4 shadow-sm border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              Quick Specs Comparison
            </h2>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-xs uppercase font-medium">Context Window</div>
                <div className="text-slate-900 font-bold font-mono mt-0.5">
                  {formatTokens(modelA.contextWindow)} vs {formatTokens(modelB.contextWindow)}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-xs uppercase font-medium">Throughput Speed</div>
                <div className="text-slate-900 font-bold font-mono mt-0.5">
                  {modelA.typicalSpeedTokensPerSec} tok/s vs {modelB.typicalSpeedTokensPerSec} tok/s
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-xs uppercase font-medium">Weights Visibility</div>
                <div className="text-slate-900 font-bold mt-0.5">
                  {modelA.isOpenWeights ? 'Open Weights' : 'Proprietary API'} vs{' '}
                  {modelB.isOpenWeights ? 'Open Weights' : 'Proprietary API'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Comparisons Grid */}
        <div className="pt-8 border-t border-slate-200">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
            Explore Other Head-to-Head Comparisons
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {POPULAR_COMPARISONS.filter((c) => c.slug !== params.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-xs transition-all text-xs text-slate-700 flex items-center justify-between"
              >
                <span className="font-semibold">{c.title.split(':')[0]}</span>
                <ChevronRight className="w-4 h-4 text-indigo-600" />
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
