'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-20 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
                Σ
              </div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900">
                APICost<span className="text-indigo-600">Hub</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Open-source tokenomics benchmark and AI unit economics calculator. Updated continuously for developers and engineering teams.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <span className="font-bold text-slate-900 block">Calculators</span>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/" className="hover:text-indigo-600 transition-colors">
                  Interactive Token Workbench
                </Link>
              </li>
              <li>
                <Link href="/calculator/gpu-vs-api" className="hover:text-indigo-600 transition-colors">
                  GPU Self-Hosting vs API
                </Link>
              </li>
              <li>
                <Link href="/#pareto" className="hover:text-indigo-600 transition-colors">
                  Pareto Frontier Matrix
                </Link>
              </li>
              <li>
                <Link href="/pricing-table" className="hover:text-indigo-600 transition-colors">
                  Complete Pricing Table
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Comparisons */}
          <div className="space-y-2">
            <span className="font-bold text-slate-900 block">Comparisons</span>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/compare/claude-3-5-sonnet-vs-deepseek-v3" className="hover:text-indigo-600 transition-colors">
                  Claude 3.5 Sonnet vs DeepSeek V3
                </Link>
              </li>
              <li>
                <Link href="/compare/gpt-4o-vs-deepseek-v3" className="hover:text-indigo-600 transition-colors">
                  GPT-4o vs DeepSeek V3
                </Link>
              </li>
              <li>
                <Link href="/compare/o1-vs-deepseek-r1" className="hover:text-indigo-600 transition-colors">
                  OpenAI o1 vs DeepSeek R1
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Metadata */}
          <div className="space-y-2">
            <span className="font-bold text-slate-900 block">Data Transparency</span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              All prices reflect official published rates in USD per 1 million tokens. No sponsored placement alters pricing calculations.
            </p>
            <div className="text-[10px] text-slate-400">
              Verified March 2026
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 APICostHub. Built by BirruLabs. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/tantenton/apicosthub" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">
              GitHub Repo
            </a>
            <a href="https://apicosthub.vercel.app/sitemap.xml" className="hover:text-slate-900">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
