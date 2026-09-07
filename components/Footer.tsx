import React from 'react';
import Link from 'next/link';
import { POPULAR_COMPARISONS, AI_MODELS } from '@/data/models';
import { Calculator } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#1E2538] bg-[#090B10] text-xs text-[#94A3B8] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-[#1E2538]">
          
          {/* Col 1: Brand & Ethos */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Calculator className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-white tracking-tight text-sm">
                API<span className="text-emerald-400">Cost</span>Hub
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Open source unit economics workbench and real-time inference pricing index for machine learning engineers and technology leaders.
            </p>
            <div className="text-xs text-[#64748B]">
              Indexed: OpenAI, Anthropic, Google, DeepSeek, Meta, Mistral.
            </div>
          </div>

          {/* Col 2: Popular Comparisons */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Model Comparisons
            </div>
            <ul className="space-y-1.5 text-xs">
              {POPULAR_COMPARISONS.slice(0, 5).map((pair) => (
                <li key={pair.slug}>
                  <Link
                    href={`/compare/${pair.slug}`}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {pair.title.split(':')[0]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Dedicated Calculators */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Calculators & Tools
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Tokenomics Workbench
                </Link>
              </li>
              <li>
                <Link href="/#head-to-head" className="hover:text-emerald-400 transition-colors">
                  Head-to-Head Diff
                </Link>
              </li>
              <li>
                <Link
                  href="/calculator/gpu-vs-api"
                  className="hover:text-emerald-400 transition-colors"
                >
                  GPU vs API Breakeven
                </Link>
              </li>
              <li>
                <Link href="/pricing-table" className="hover:text-emerald-400 transition-colors">
                  Master Pricing Matrix
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Reference & Open Weights */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Models Indexed
            </div>
            <ul className="space-y-1.5 text-xs">
              {AI_MODELS.slice(0, 5).map((m) => (
                <li key={m.id}>
                  <Link href={`/model/${m.id}`} className="hover:text-emerald-400 transition-colors">
                    {m.name} Pricing
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-3">
          <div>
            © {new Date().getFullYear()} APICostHub. Independent AI infrastructure benchmarking.
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
