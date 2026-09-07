import React from 'react';
import Link from 'next/link';
import { POPULAR_COMPARISONS, AI_MODELS } from '@/data/models';
import { Calculator } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#08090a] text-xs text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          
          {/* Col 1: Brand & Ethos */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Calculator className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-white tracking-tight text-sm">
                API<span className="text-indigo-400">Cost</span>Hub
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open source unit economics workbench and real-time inference pricing index for machine learning engineers and technology leaders.
            </p>
            <div className="text-xs text-slate-600">
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
                    className="hover:text-indigo-400 transition-colors"
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
                <Link href="/" className="hover:text-indigo-400 transition-colors">
                  Tokenomics Workbench
                </Link>
              </li>
              <li>
                <Link
                  href="/calculator/gpu-vs-api"
                  className="hover:text-indigo-400 transition-colors"
                >
                  GPU Breakeven Simulator
                </Link>
              </li>
              <li>
                <Link href="/pricing-table" className="hover:text-indigo-400 transition-colors">
                  Master Pricing Table
                </Link>
              </li>
              <li>
                <Link href="/#head-to-head" className="hover:text-indigo-400 transition-colors">
                  Head-to-Head Comparator
                </Link>
              </li>
              <li>
                <Link href="/#methodology" className="hover:text-indigo-400 transition-colors">
                  Calculation Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Top Models */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Frontier Models
            </div>
            <ul className="space-y-1.5 text-xs">
              {AI_MODELS.slice(0, 6).map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/model/${m.id}`}
                    className="hover:text-indigo-400 transition-colors"
                  >
                    {m.name} Pricing
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} APICostHub. MIT Licensed. Open source intelligence.
          </div>
          <div className="flex items-center gap-6">
            <span>Verified 2026</span>
            <span>Zero Tracking Cookies</span>
            <a
              href="https://github.com/tantenton/apicosthub"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
