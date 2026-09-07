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
    <div className="w-full min-h-screen bg-[#08090a] text-slate-200 py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link href="/" className="hover:text-white flex items-center gap-1 min-h-[36px]">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span>Calculators</span>
          <span>/</span>
          <span className="text-indigo-400 font-mono">gpu-vs-api-breakeven</span>
        </div>

        {/* Page Hero */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-indigo-400 mb-3">
            <Cpu className="h-3.5 w-3.5" />
            <span>Infrastructure Unit Economics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Dedicated GPU vs Pay-Per-Token API Breakeven Simulator
          </h1>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Compare flat hourly server hosting costs against dynamic token bills to determine whether to self-host open weights (Llama 3.3, DeepSeek V3/R1) with vLLM or use managed endpoints.
          </p>
        </div>

        {/* Top Ad */}
        <AdPlacement slotId="gpu-page-top" format="horizontal-leaderboard" />

        {/* The Calculator Engine */}
        <div className="my-6">
          <GpuVsApiSection />
        </div>

        {/* Architectural Guide */}
        <div className="my-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="surface-card rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-indigo-400 font-semibold mb-2">
              <Server className="h-4 w-4" />
              <span>When Self-Hosting Wins</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-3">
              High Continuous Duty Cycle (&gt;60% Utilization)
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Steady predictable traffic running 24/7 without deep midnight troughs.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Strict data sovereignty or HIPAA/GDPR constraints where prompts cannot leave private VPCs.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Fine-tuned LoRA adapters requiring custom kernel execution.</span>
              </li>
            </ul>
          </div>

          <div className="surface-card rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2">
              <Cpu className="h-4 w-4" />
              <span>When Managed APIs Win</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-3">
              Spiky, Early-Stage, or Multi-Modal Workloads
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Zero fixed costs when user activity drops to zero on weekends and evenings.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Instant auto-scaling during unexpected viral spikes without queue backpressure.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>No infrastructure maintenance overhead (no CUDA driver updates, PyTorch compile errors, or hardware failures).</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Ad */}
        <AdPlacement slotId="gpu-page-bottom" format="horizontal-leaderboard" />

      </div>
    </div>
  );
}
