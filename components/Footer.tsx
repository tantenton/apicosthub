import React from 'react';
import Link from 'next/link';
import { POPULAR_COMPARISONS, AI_MODELS } from '@/data/models';
import { Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#1E2638] bg-[#06080C] text-xs font-mono text-[#94A3B8] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-[#1E2638]/60">
          
          {/* Col 1: Brand & Ethos */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-white tracking-tight text-sm">
                API<span className="text-[#10B981]">Cost</span>Hub
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Open-source unit economics workbench and real-time inference pricing index for machine learning engineers and tech founders.
            </p>
            <div className="text-[10px] text-[#475569]">
              Indexed: OpenAI, Anthropic, Google, DeepSeek, Meta, Mistral.
            </div>
          </div>

          {/* Col 2: Popular Comparisons */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-white uppercase tracking-wider">
              Model Comparisons
            </div>
            <ul className="space-y-1.5 text-[11px]">
              {POPULAR_COMPARISONS.slice(0, 5).map((pair) => (
                <li key={pair.slug}>
                  <Link
                    href={`/compare/${pair.slug}`}
                    className="hover:text-[#10B981] transition-colors"
                  >
                    {pair.title.split(':')[0]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Dedicated Calculators */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-white uppercase tracking-wider">
              Calculators & Tools
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/" className="hover:text-[#10B981] transition-colors">
                  Tokenomics Workbench
                </Link>
              </li>
              <li>
                <Link href="/#head-to-head" className="hover:text-[#10B981] transition-colors">
                  Head-to-Head Diff
                </Link>
              </li>
              <li>
                <Link
                  href="/calculator/gpu-vs-api"
                  className="hover:text-[#10B981] transition-colors"
                >
                  GPU vs API Breakeven
                </Link>
              </li>
              <li>
                <Link href="/pricing-table" className="hover:text-[#10B981] transition-colors">
                  Master Pricing Matrix
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Reference & Open Weights */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-white uppercase tracking-wider">
              Models Indexed
            </div>
            <ul className="space-y-1.5 text-[11px]">
              {AI_MODELS.slice(0, 5).map((m) => (
                <li key={m.id}>
                  <Link href={`/model/${m.id}`} className="hover:text-[#10B981] transition-colors">
                    {m.name} Pricing
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#64748B] gap-3">
          <div>
            © {new Date().getFullYear()} APICostHub. Built for AI infrastructure transparency.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sitemap.xml" className="hover:underline">
              Sitemap
            </Link>
            <a
              href="https://github.com/tantenton/apicosthub"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
