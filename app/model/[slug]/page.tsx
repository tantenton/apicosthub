import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { AI_MODELS } from '@/data/models';
import HeadToHeadCalculator from '@/components/HeadToHeadCalculator';
import AdPlacement from '@/components/AdPlacement';
import { getProviderLogo } from '@/components/ProviderLogos';
import Link from 'next/link';
import { ArrowLeft, Cpu, Zap, Shield, Sparkles } from 'lucide-react';
import { formatTokens } from '@/lib/calculator';

interface ModelPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return AI_MODELS.map((model) => ({
    slug: model.slug,
  }));
}

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const model = AI_MODELS.find((m) => m.slug === params.slug);
  if (!model) {
    return {
      title: 'Model Pricing | APICostHub',
    };
  }

  return {
    title: `${model.name} Token Pricing & Cost Calculator 2026: APICostHub`,
    description: `Complete token economics for ${model.name} (${model.provider}). Input tokens: $${model.inputPricePerMillion}/1M, Output tokens: $${model.outputPricePerMillion}/1M. Interactive prompt caching calculator.`,
    openGraph: {
      title: `${model.name} Token Pricing | APICostHub`,
      description: `Inference cost specs for ${model.name} by ${model.provider}.`,
      url: `https://apicosthub.vercel.app/model/${params.slug}`,
    },
  };
}

export default function ModelPage({ params }: ModelPageProps) {
  const model = AI_MODELS.find((m) => m.slug === params.slug);
  if (!model) {
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

        {/* Top Header Card */}
        <div className="mb-8 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs text-indigo-600 font-bold uppercase tracking-wider mb-2">
            <Cpu className="w-4 h-4" />
            Model Specification Index
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                {getProviderLogo(model.provider)}
              </div>
              <span>{model.name}</span>
            </h1>
            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700">
              {model.provider} · {model.category}
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Standard published pricing: <strong className="text-slate-900 font-mono">${model.inputPricePerMillion.toFixed(2)}</strong> per 1M input tokens and{' '}
            <strong className="text-slate-900 font-mono">${model.outputPricePerMillion.toFixed(2)}</strong> per 1M output tokens.
            {model.cachedInputPricePerMillion &&
              ` Supports prompt caching at $${model.cachedInputPricePerMillion.toFixed(2)}/1M.`}
          </p>
        </div>

        {/* Dense Specs Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
          <div className="surface-card rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="text-xs text-slate-500 uppercase font-medium">Input Tokens</div>
            <div className="text-xl font-bold text-slate-900 font-mono mt-1">
              ${model.inputPricePerMillion.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Per 1M Tokens</div>
          </div>

          <div className="surface-card rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="text-xs text-slate-500 uppercase font-medium">Output Tokens</div>
            <div className="text-xl font-bold text-slate-900 font-mono mt-1">
              ${model.outputPricePerMillion.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Per 1M Tokens</div>
          </div>

          <div className="surface-card rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="text-xs text-slate-500 uppercase font-medium">Prompt Caching</div>
            <div className="text-xl font-bold text-emerald-600 font-mono mt-1">
              {model.cachedInputPricePerMillion ? `$${model.cachedInputPricePerMillion.toFixed(2)}` : 'N/A'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {model.cachedInputPricePerMillion ? 'Discounted KV-Cache' : 'No Cache Discount'}
            </div>
          </div>

          <div className="surface-card rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="text-xs text-slate-500 uppercase font-medium">Context Window</div>
            <div className="text-xl font-bold text-indigo-600 font-mono mt-1">
              {formatTokens(model.contextWindow)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">{model.typicalSpeedTokensPerSec} tokens/sec speed</div>
          </div>
        </div>

        {/* Head-to-Head Calculator Section */}
        <div className="my-10">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Interactive Unit Cost Simulator for {model.name}
            </h2>
            <p className="text-xs text-slate-500">
              Simulate monthly infrastructure bills and benchmark against alternative architectures.
            </p>
          </div>
          <HeadToHeadCalculator />
        </div>

        {/* Ad Placement */}
        <div className="my-8">
          <AdPlacement slotId="model-bottom-ad" format="horizontal-leaderboard" />
        </div>
      </div>
    </div>
  );
}
