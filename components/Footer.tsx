import React from 'react';
import Link from 'next/link';
import { POPULAR_COMPARISONS, AI_MODELS } from '@/data/models';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface-subtle py-12 text-xs text-text-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-brand">&gt;_</span>
              <span className="text-sm font-bold text-text-primary">APICostHub.com</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Open-access developer utility for AI token economics, LLM price simulation, and cloud GPU breakeven analysis.
            </p>
            <p className="text-[11px] text-text-muted">
              Built with Astro/Next.js and client-side Web Workers for zero-latency instant calculation.
            </p>
          </div>

          {/* Col 2: Popular Comparisons (Programmatic Links) */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-primary mb-3">
              Head-to-Head Comparisons
            </h4>
            <ul className="space-y-2">
              {POPULAR_COMPARISONS.slice(0, 5).map((comp) => (
                <li key={comp.slug}>
                  <Link
                    href={`/compare/${comp.slug}`}
                    className="hover:text-brand transition-colors truncate block"
                  >
                    {comp.title.replace(' Cost & Pricing Comparison', '').replace(' Token Cost Comparison', '')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Popular Models */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-primary mb-3">
              Model Price Indexes
            </h4>
            <ul className="space-y-2">
              {AI_MODELS.slice(0, 5).map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/model/${m.id}`}
                    className="hover:text-brand transition-colors flex items-center justify-between"
                  >
                    <span>{m.name}</span>
                    <span className="font-mono text-[10px] text-text-muted">${m.inputCostPer1M}/1M</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Tools & Resources */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-primary mb-3">
              Calculators & Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-brand transition-colors">
                  Multi-Model Cost Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculator/gpu-vs-api" className="hover:text-brand transition-colors">
                  Self-Hosted GPU vs API Breakeven
                </Link>
              </li>
              <li>
                <Link href="/pricing-table" className="hover:text-brand transition-colors">
                  Full 2026 Model Index Table
                </Link>
              </li>
              <li>
                <Link href="/compare/gpt-4o-vs-claude-3-5-sonnet" className="hover:text-brand transition-colors">
                  Prompt Caching Savings Simulator
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom line */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-[11px] text-text-muted">
            © 2026 APICostHub. All model names and trademarks belong to their respective creators (OpenAI, Anthropic, Google, DeepSeek, Meta, Mistral).
          </p>
          <div className="flex items-center gap-4 text-[11px] text-text-muted">
            <span>Client-Side Privacy Safe (Zero Logged Inputs)</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
