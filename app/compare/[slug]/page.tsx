import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { POPULAR_COMPARISONS, AI_MODELS, AIModel, ModelComparisonPair } from '@/data/models';
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

export const dynamicParams = true;

function findModel(idOrSlug: string): AIModel | undefined {
  const raw = idOrSlug.toLowerCase().trim();
  const normalized = raw.replace(/\./g, '-');

  // Direct match by ID, slug, or normalized dot replacement
  const exact = AI_MODELS.find(
    (m) =>
      m.id.toLowerCase() === raw ||
      m.slug.toLowerCase() === raw ||
      m.id.toLowerCase() === normalized ||
      m.slug.toLowerCase() === normalized ||
      m.id.replace(/-/g, '') === raw.replace(/[-.]/g, '')
  );
  if (exact) return exact;

  // Prefix matching e.g. "gemini-3-8" or "gemini-3.8" matches "gemini-3-8-flash"
  const prefix = AI_MODELS.find(
    (m) => m.id.toLowerCase().startsWith(normalized) || m.slug.toLowerCase().startsWith(normalized)
  );
  if (prefix) return prefix;

  // Substring matching
  const includes = AI_MODELS.find(
    (m) => m.id.toLowerCase().includes(normalized) || normalized.includes(m.id.toLowerCase())
  );
  if (includes) return includes;

  return undefined;
}

function resolveComparison(slug: string): {
  comparison: ModelComparisonPair;
  modelA: AIModel;
  modelB: AIModel;
} | null {
  // 1. Check popular comparisons
  const existing = POPULAR_COMPARISONS.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
  if (existing) {
    const modelA = findModel(existing.modelAId);
    const modelB = findModel(existing.modelBId);
    if (modelA && modelB) {
      return { comparison: existing, modelA, modelB };
    }
  }

  // 2. Dynamic slug resolution: e.g. claude-3-5-sonnet-vs-deepseek-v3
  if (slug.includes('-vs-')) {
    const [partA, partB] = slug.split('-vs-');
    if (partA && partB) {
      const modelA = findModel(partA);
      const modelB = findModel(partB);
      if (modelA && modelB) {
        return {
          comparison: {
            slug,
            modelAId: modelA.id,
            modelBId: modelB.id,
            title: `${modelA.name} vs ${modelB.name}`,
            focusAngle: `Direct Unit Economics Showdown: ${modelA.name} against ${modelB.name}`,
            subtitle: `Compare pricing, context window, throughput, and prompt caching discounts between ${modelA.name} and ${modelB.name}.`,
          },
          modelA,
          modelB,
        };
      }
    }
  }

  return null;
}

export async function generateStaticParams() {
  return POPULAR_COMPARISONS.map((comp) => ({
    slug: comp.slug,
  }));
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const resolved = resolveComparison(params.slug);
  if (!resolved) {
    return {
      title: 'Model Comparison | APICostHub',
    };
  }

  const { comparison, modelA, modelB } = resolved;

  return {
    title: `${comparison.title}: Real-Time API Cost Calculator 2026`,
    description: comparison.subtitle || `Unit economics benchmark between ${modelA.name} and ${modelB.name}.`,
    openGraph: {
      title: `${comparison.title} | APICostHub`,
      description: comparison.subtitle,
      url: `https://apicosthub.vercel.app/compare/${params.slug}`,
    },
  };
}

export default function ComparePage({ params }: ComparePageProps) {
  const resolved = resolveComparison(params.slug);
  if (!resolved) {
    notFound();
  }

  const { comparison, modelA, modelB } = resolved;

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

        {/* Top Header */}
        <div className="mb-8 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3 text-xs text-indigo-600 font-bold uppercase tracking-wider mb-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200">
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              Verified Head to Head Benchmark
            </div>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 font-mono">2026 Production Tier</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {comparison.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            {comparison.subtitle || comparison.focusAngle}
          </p>
        </div>

        {/* Executive Quick Stats Cards */}
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
              {modelA.contextWindow > modelB.contextWindow ? `${modelA.name} has larger memory` : `${modelB.name} has larger memory`}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-xs font-mono uppercase text-slate-500 mb-1">Caching Efficiency</div>
            <div className="text-2xl font-mono font-bold text-indigo-600">
              {modelA.cachedInputPricePerMillion ? 'Supported' : 'Standard'} vs {modelB.cachedInputPricePerMillion ? 'Supported' : 'Standard'}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Prompt caching cuts repeatable latency and budget
            </div>
          </div>
        </div>

        {/* Interactive Head to Head Workbench */}
        <div className="mb-12">
          <HeadToHeadCalculator initialModelA={modelA.id} initialModelB={modelB.id} />
        </div>

        {/* Detailed Specs Side-by-Side Comparison */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm mb-12">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            Architectural Specification Matrix
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-mono uppercase text-slate-400">
                  <th className="py-3 px-4">Metric</th>
                  <th className="py-3 px-4 flex items-center gap-2">
                    {getProviderLogo(modelA.provider)} {modelA.name}
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
                  <td className="py-3 px-4 font-sans font-medium text-slate-600">Throughput Speed</td>
                  <td className="py-3 px-4 text-slate-900">~{modelA.typicalSpeedTokensPerSec} t/s</td>
                  <td className="py-3 px-4 text-slate-900">~{modelB.typicalSpeedTokensPerSec} t/s</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-600">License Architecture</td>
                  <td className="py-3 px-4 text-slate-900">{modelA.isOpenWeights ? 'Open Weights' : 'Proprietary API'}</td>
                  <td className="py-3 px-4 text-slate-900">{modelB.isOpenWeights ? 'Open Weights' : 'Proprietary API'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Other Comparisons */}
        <div className="mb-12">
          <h3 className="text-base font-bold text-slate-900 mb-4">Related Head-to-Head Comparisons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {POPULAR_COMPARISONS.filter((c) => c.slug !== params.slug).slice(0, 6).map((c) => (
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

        {/* Sponsor Banner */}
        <div className="mb-8">
          <AdPlacement slotId="footer-compare-ad" />
        </div>
      </div>
    </div>
  );
}
