import React from 'react';
import { BookOpen, Terminal, Cpu, Zap, Calculator, Database } from 'lucide-react';

export default function FormulaDocs() {
  return (
    <section className="w-full py-12 border-t border-[#1E2638] bg-[#0A0D14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-8 pb-4 border-b border-[#1E2638]">
          <div className="flex items-center gap-2 font-mono text-xs text-[#10B981] font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            Engineering Guide & Reference
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
            Tokenomics Mathematical Formulas & Caching Mechanics
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1 font-mono">
            How model providers calculate inference billing, prefix caching discounts, and reasoning token overhead.
          </p>
        </div>

        {/* 4 Technical Reference Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Core Formula */}
          <div className="terminal-card rounded-xl p-5 border border-[#1E2638] space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-white font-bold">
              <Calculator className="w-4 h-4 text-[#10B981]" />
              1. Monthly Blended API Cost Formula
            </div>
            <p className="text-[#94A3B8]">
              API invoices are calculated as the linear combination of cached inputs, uncached inputs, and generated output tokens:
            </p>
            <div className="bg-[#080A0F] p-3 rounded-lg border border-[#1E2638] text-[#CBD5E1] text-[11px] leading-relaxed">
              <code>
                Total Monthly Cost = <br />
                &nbsp;&nbsp;[ (T_uncached_in × P_in) + (T_cached_in × P_cache) + (T_out × P_out) ] / 1,000,000 <br />
                &nbsp;&nbsp;× (1 - D_batch)
              </code>
            </div>
            <p className="text-[11px] text-[#64748B]">
              Where <code>D_batch</code> is 0.50 (50% discount) when using async Batch APIs.
            </p>
          </div>

          {/* Card 2: Prompt Caching */}
          <div className="terminal-card rounded-xl p-5 border border-[#1E2638] space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-white font-bold">
              <Zap className="w-4 h-4 text-emerald-400" />
              2. Prompt Caching (Prefix Tree Hash)
            </div>
            <p className="text-[#94A3B8]">
              Modern LLM gateways (Anthropic Claude 3.5, OpenAI GPT-4o, DeepSeek V3) cache the KV-cache of identical prompt prefixes:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#CBD5E1] text-[11px]">
              <li><strong>Minimum Cache Threshold:</strong> 1,024 tokens (Anthropic) / 1,024 tokens (OpenAI).</li>
              <li><strong>Read Discount:</strong> 75% to 90% discount on cached input tokens.</li>
              <li><strong>TTL (Time to Live):</strong> 5 minutes (auto-refreshed on subsequent hits).</li>
            </ul>
          </div>

          {/* Card 3: Reasoning Tokens */}
          <div className="terminal-card rounded-xl p-5 border border-[#1E2638] space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-white font-bold">
              <Cpu className="w-4 h-4 text-purple-400" />
              3. Reasoning / Chain-of-Thought Billing
            </div>
            <p className="text-[#94A3B8]">
              Reasoning models like <strong>OpenAI o1</strong> and <strong>DeepSeek R1</strong> generate hidden "thinking" tokens before emitting the final answer:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#CBD5E1] text-[11px]">
              <li>Hidden reasoning tokens are billed at full <strong>Output Rate ($/1M)</strong>.</li>
              <li>A 100-word prompt might generate 2,000 hidden reasoning tokens + 300 visible tokens.</li>
              <li>DeepSeek R1 offers equivalent reasoning benchmarks at ~95% lower unit cost than o1.</li>
            </ul>
          </div>

          {/* Card 4: Token Sizing Estimation */}
          <div className="terminal-card rounded-xl p-5 border border-[#1E2638] space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-white font-bold">
              <Database className="w-4 h-4 text-blue-400" />
              4. BPE Token Sizing Conversion
            </div>
            <p className="text-[#94A3B8]">
              Byte-Pair Encoding (BPE) compression ratios across different payload types:
            </p>
            <div className="bg-[#080A0F] p-3 rounded-lg border border-[#1E2638] space-y-1 text-[11px]">
              <div className="flex justify-between text-[#CBD5E1]">
                <span>English Plaintext</span>
                <span className="text-[#10B981]">~0.75 words / token (4 chars/tok)</span>
              </div>
              <div className="flex justify-between text-[#CBD5E1]">
                <span>Source Code (Python/TS)</span>
                <span className="text-blue-400">~0.50 words / token (2.5 chars/tok)</span>
              </div>
              <div className="flex justify-between text-[#CBD5E1]">
                <span>JSON / Structured Schema</span>
                <span className="text-amber-400">~0.40 words / token (brackets & quotes)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
