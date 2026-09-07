import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { AI_MODELS } from '@/data/models';
import HeadToHeadCalculator from '@/components/HeadToHeadCalculator';
import AdPlacement from '@/components/AdPlacement';
import { ProviderIcon } from '@/components/ProviderLogos';
import Link from 'next/link';
import { ArrowLeft, Cpu, Zap, Shield } from 'lucide-react';
import { formatContextWindow } from '@/lib/calculator';

interface ModelPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return AI_MODELS.map((model) => ({
    slug: model.id,
  }));
}

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const model = AI_MODELS.find((m) => m.id === params.slug);
  if (!model) {
    return {
      title: 'Model Pricing | APICostHub',
    };
  }

  return {
    title: `${model.name} Token Pricing & Cost Calculator 2026: APICostHub`,
    description: `Complete token economics for ${model.name} (${model.provider}). Input tokens: $${model.inputCostPer1M}/1M, Output tokens: $${model.outputCostPer1M}/1M. Interactive prompt caching calculator.`,
    openGraph: {
      title: `${model.name} Token Pricing | APICostHub`,
      description: `Inference cost specs for ${model.name} by ${model.provider}.`,
      url: `https://apicosthub.vercel.app/model/${params.slug}`,
    },
  };
}

export default function ModelPage({ params }: ModelPageProps) {
  const model = AI_MODELS.find((m) => m.id === params.slug);
  if (!model) {
    notFound();
  }

  // Find alternative comparison model
  const altModel = AI_MODELS.find((m) => m.id !== model.id && m.qualityTier === model.qualityTier) || AI_MODELS[0];

  return (
    <div className="w-full min-h-screen bg-[#090B10] text-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors mb-6 min-h-[36px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Tokenomics Workbench
        </Link>

        {/* Top Header Card */}
        <div className="mb-8 pb-6 border-b border-[#1E2538]">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-2">
            <Cpu className="w-4 h-4" />
            Model Specification Index
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-[#111520] border border-[#1E2538]">
                <ProviderIcon provider={model.provider} className="w-6 h-6 text-emerald-400" />
              </div>
              <span>{model.name}</span>
            </h1>
            <span className="px-2.5 py-1 rounded bg-[#111520] border border-[#1E2538] text-xs text-[#94A3B8]">
              {model.provider} · {model.qualityTier} Tier
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-2 max-w-3xl leading-relaxed">
            Standard pricing: <strong className="text-white font-mono">${model.inputCostPer1M}</strong> per 1M input tokens and{' '}
            <strong className="text-white font-mono">${model.outputCostPer1M}</strong> per 1M output tokens.
            {(model.cachedInputCostPer1M ?? 0) > 0 &&
              ` Supports prompt caching at $${model.cachedInputCostPer1M}/1M.`}
          </p>
        </div>

        {/* Top Sponsor */}
        <AdPlacement slotId="model-top-ad" format="horizontal-leaderboard" />

        {/* Dense Specs Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
          <div className="surface-card rounded-xl p-4">
            <div className="text-xs text-[#94A3B8] uppercase">Input Tokens</div>
            <div className="text-xl font-bold text-white font-mono mt-1">
              ${model.inputCostPer1M.toFixed(2)}
            </div>
            <div className="text-xs text-[#64748B] mt-0.5 font-mono">Per 1M Tokens</div>
          </div>

          <div className="surface-card rounded-xl p-4">
            <div className="text-xs text-[#94A3B8] uppercase">Output Tokens</div>
            <div className="text-xl font-bold text-white font-mono mt-1">
              ${model.outputCostPer1M.toFixed(2)}
            </div>
            <div className="text-xs text-[#64748B] mt-0.5 font-mono">Per 1M Tokens</div>
          </div>

          <div className="surface-card rounded-xl p-4">
            <div className="text-xs text-[#94A3B8] uppercase">Cached Input Rate</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
              {(model.cachedInputCostPer1M ?? 0) > 0
                ? `$${model.cachedInputCostPer1M!.toFixed(2)}`
                : 'Not supported'}
            </div>
            <div className="text-xs text-[#64748B] mt-0.5 font-mono">Prompt Cache Hits</div>
          </div>

          <div className="surface-card rounded-xl p-4">
            <div className="text-xs text-[#94A3B8] uppercase">Context Window</div>
            <div className="text-xl font-bold text-white font-mono mt-1">
              {formatContextWindow(model.contextWindow)}
            </div>
            <div className="text-xs text-[#64748B] mt-0.5 font-mono">Max Sequence Length</div>
          </div>
        </div>

        {/* Interactive Head-to-Head Comparison with Peer */}
        <div className="my-10">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white">
              Compare {model.name} Against Alternative Models
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Simulate monthly cost differences against other models in the {model.qualityTier} tier.
            </p>
          </div>
          <HeadToHeadCalculator initialModelA={model.id} initialModelB={altModel.id} />
        </div>

        {/* Bottom Ad */}
        <AdPlacement slotId="model-bottom-ad" format="horizontal-leaderboard" className="mt-10" />
      </div>
    </div>
  );
}
