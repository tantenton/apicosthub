import React from 'react';
import { BookOpen, HelpCircle, Shield, Terminal, ArrowUpRight } from 'lucide-react';

export default function FormulaDocs() {
  return (
    <section className="w-full py-12 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-text-secondary mb-3">
            <BookOpen className="h-3.5 w-3.5 text-brand" />
            <span>Methodology & Unit Economics Documentation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            How LLM Token Economics Are Calculated
          </h2>
          <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed">
            Understanding input vs output token asymmetry, prefix prompt caching discounts, and batch queue execution mechanics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: The Token Pricing Formula */}
          <div className="rounded-xl border border-border bg-surface p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-brand font-mono text-xs uppercase tracking-wider mb-2">
                <Terminal className="h-4 w-4" />
                <span>Core Cost Equation</span>
              </div>
              <h3 className="text-base font-bold text-text-primary mb-3">
                Total Request Cost Formula
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                API providers bill input and output tokens separately at different rates due to GPU auto-regressive decoding overhead:
              </p>
              <div className="rounded-lg bg-surface-subtle p-3 border border-border font-mono text-[11px] text-text-primary leading-relaxed">
                Total = [(Tokens_in × Rate_in) + (Tokens_out × Rate_out)] / 1,000,000
              </div>
            </div>
            <p className="mt-4 text-[11px] text-text-muted">
              Output generation requires serial forward passes, explaining why output tokens cost 3x to 5x more than input tokens.
            </p>
          </div>

          {/* Card 2: Prompt Caching Mechanics */}
          <div className="rounded-xl border border-border bg-surface p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-accent-emerald font-mono text-xs uppercase tracking-wider mb-2">
                <Shield className="h-4 w-4" />
                <span>Prompt Caching</span>
              </div>
              <h3 className="text-base font-bold text-text-primary mb-3">
                Prefix Caching Yields (up to 90% Off)
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                Anthropic, OpenAI, and DeepSeek cache KV pairs of common prompt prefixes (system prompts, tool definitions, documents):
              </p>
              <div className="rounded-lg bg-surface-subtle p-3 border border-border font-mono text-[11px] text-text-primary leading-relaxed">
                Input_Cost = (Uncached × Rate_in) + (Cached × Rate_cache)
              </div>
            </div>
            <p className="mt-4 text-[11px] text-text-muted">
              Claude 3.5 Sonnet drops from $3.00 to $0.30 per 1M tokens on cache reads, slashing RAG agent expenses drastically.
            </p>
          </div>

          {/* Card 3: Batch API Economics */}
          <div className="rounded-xl border border-border bg-surface p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-accent-amber font-mono text-xs uppercase tracking-wider mb-2">
                <HelpCircle className="h-4 w-4" />
                <span>Batch Processing</span>
              </div>
              <h3 className="text-base font-bold text-text-primary mb-3">
                Async 24h Queue Discount (50% Off)
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                OpenAI and Anthropic provide a 50% flat discount on non-realtime batch jobs processed during idle datacentre capacity:
              </p>
              <div className="rounded-lg bg-surface-subtle p-3 border border-border font-mono text-[11px] text-text-primary leading-relaxed">
                Batch_Cost = Standard_Total × 0.50
              </div>
            </div>
            <p className="mt-4 text-[11px] text-text-muted">
              Ideal for daily embedding generation, synthetic dataset evaluation, backtesting, and overnight email triage.
            </p>
          </div>

        </div>

        {/* Token Estimation Cheat-Sheet Table */}
        <div className="rounded-xl border border-border bg-surface p-6">
          <h3 className="text-base font-bold text-text-primary mb-2">
            Token Estimation Benchmarks (English Language)
          </h3>
          <p className="text-xs text-text-secondary mb-4">
            Rule of thumb for text tokenization (BPE tokenizers like tiktoken or SentencePiece):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="rounded-lg border border-border bg-surface-subtle p-3">
              <span className="font-mono text-lg font-bold text-brand">1 Token</span>
              <p className="text-xs text-text-muted mt-1">≈ 0.75 words / 4 chars</p>
            </div>
            <div className="rounded-lg border border-border bg-surface-subtle p-3">
              <span className="font-mono text-lg font-bold text-brand">1,000 Tokens</span>
              <p className="text-xs text-text-muted mt-1">≈ 750 words (1.5 pages)</p>
            </div>
            <div className="rounded-lg border border-border bg-surface-subtle p-3">
              <span className="font-mono text-lg font-bold text-brand">1 Million Tokens</span>
              <p className="text-xs text-text-muted mt-1">≈ 750,000 words (12 novels)</p>
            </div>
            <div className="rounded-lg border border-border bg-surface-subtle p-3">
              <span className="font-mono text-lg font-bold text-brand">Code Snippet</span>
              <p className="text-xs text-text-muted mt-1">≈ 1 line = 10–15 tokens</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
