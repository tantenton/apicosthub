import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { AI_MODELS, AIModel } from '@/data/models';
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

export const dynamicParams = true;

function findModel(slug: string): AIModel | undefined {
  const clean = slug.toLowerCase().trim();
  return AI_MODELS.find(
    (m) =>
      m.slug.toLowerCase() === clean ||
      m.id.toLowerCase() === clean ||
      m.id.replace(/-/g, '') === clean.replace(/-/g, '')
  );
}

export async function generateStaticParams() {
  return AI_MODELS.map((model) => ({
    slug: model.slug,
  }));
}

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const model = findModel(params.slug);
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
  const model = findModel(params.slug);
  if (!model) {
    notFound();
  }

  // Find a suggested comparison model
  const competitorModel = AI_MODELS.find(
    (m) => m.id !== model.id && (m.qualityTier === model.qualityTier || m.category === model.category)
  ) || AI_MODELS[0];

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
          <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-2xl">
            {model.description}
          </p>
        </div>

        {/* Core Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-[11px] font-mono uppercase text-slate-500 mb-1">Input Price / 1M</div>
            <div className="text-2xl font-mono font-bold text-slate-900">
              ${model.inputPricePerMillion.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">USD per million tokens</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-[11px] font-mono uppercase text-slate-500 mb-1">Output Price / 1M</div>
            <div className="text-2xl font-mono font-bold text-slate-900">
              ${model.outputPricePerMillion.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">USD per million tokens</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-[11px] font-mono uppercase text-slate-500 mb-1">Context Window</div>
            <div className="text-2xl font-mono font-bold text-indigo-600">
              {formatTokens(model.contextWindow)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Max input tokens</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-[11px] font-mono uppercase text-slate-500 mb-1">Throughput Speed</div>
            <div className="text-2xl font-mono font-bold text-emerald-600">
              ~{model.typicalSpeedTokensPerSec} <span className="text-xs font-normal text-slate-500">t/s</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Streaming velocity</div>
          </div>
        </div>

        {/* Interactive Comparison Workbench */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            Interactive Head-to-Head Simulator
          </div>
          <HeadToHeadCalculator initialModelA={model.id} initialModelB={competitorModel.id} />
        </div>

        {/* Ad Placement */}
        <div className="mb-8">
          <AdPlacement slotId="footer-model-ad" />
        </div>
      </div>
    </div>
  );
}
