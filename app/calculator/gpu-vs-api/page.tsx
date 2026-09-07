import React from 'react';
import { Metadata } from 'next';
import GpuVsApiSection from '@/components/GpuVsApiSection';
import AdPlacement from '@/components/AdPlacement';
import Link from 'next/link';
import { Cpu, ArrowLeft, CheckCircle2, Server } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Self-Hosted GPU vs LLM API Cost Calculator (2026): APICostHub',
  description:
    'Calculate the exact breakeven point between renting dedicated cloud GPUs (NVIDIA H100, A100, L40S, RTX 4090 on RunPod or Lambda) and paying per-token managed model APIs.',
};

export default function GpuVsApiPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-indigo-600 flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span>Calculators</span>
          <span>/</span>
          <span className="text-indigo-600 font-mono font-semibold">gpu-vs-api-breakeven</span>
        </div>

        {/* Page Hero */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs text-indigo-700 font-bold mb-3">
            <Cpu className="h-3.5 w-3.5" />
            <span>Infrastructure Unit Economics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Dedicated GPU vs Pay-Per-Token API Breakeven Simulator
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            At low query volumes, serverless API endpoints (OpenAI, Anthropic, DeepSeek) are orders of magnitude cheaper than provisioning dedicated compute. However, once continuous token generation surpasses cluster lease costs, self-hosting vLLM, SGLang, or TensorRT-LLM on dedicated GPU nodes yields massive operational savings.
          </p>
        </div>

        {/* The Interactive Simulator */}
        <GpuVsApiSection />

        {/* Architectural Explanation */}
        <div className="my-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="surface-card rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Server className="h-4 w-4 text-indigo-600" />
              <span>When to Keep Using Serverless Cloud APIs</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Variable or unpredictable diurnal traffic patterns where GPUs would sit idle during off-peak hours.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Zero infrastructure overhead requirement: no Kubernetes clusters, vLLM driver updates, or autoscalers to maintain.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Need for proprietary frontier reasoning capabilities (o1, Claude 3.5 Sonnet) that cannot be self-hosted.</span>
              </li>
            </ul>
          </div>

          <div className="surface-card rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Cpu className="h-4 w-4 text-indigo-600" />
              <span>When to Self-Host on Dedicated GPUs</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>Continuous token throughput exceeding 500 million tokens per month (e.g. 24/7 autonomous agents or continuous indexing).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>Strict data sovereignty, HIPAA compliance, or on-premise privacy mandates preventing external API egress.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>Custom speculative decoding, LoRA adapters, or low-latency vLLM prompt caching optimizations.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Ad Placement */}
        <div className="my-8">
          <AdPlacement slotId="gpu-bottom" format="horizontal-leaderboard" />
        </div>
      </div>
    </div>
  );
}
