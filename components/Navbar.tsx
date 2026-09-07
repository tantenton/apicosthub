'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Calculator, GitCompare, Cpu, Table2, Github, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#08090a]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-white tracking-tight text-base">
                APICost<span className="text-indigo-400">Hub</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded-md bg-white/[0.05] text-slate-400 border border-white/10">
                2026 Live
              </span>
            </div>
          </Link>
        </div>

        {/* Center Navigation: Desktop */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-400">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Calculator
          </Link>
          <Link
            href="/#head-to-head"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Compare Models
          </Link>
          <Link
            href="/calculator/gpu-vs-api"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Self-Hosted GPU
          </Link>
          <Link
            href="/pricing-table"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Pricing Table
          </Link>
        </nav>

        {/* Right Actions & Status */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span>16 Models Verified</span>
          </div>

          <a
            href="https://github.com/tantenton/apicosthub"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            title="View Source on GitHub"
            aria-label="View Source on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#08090a] px-4 py-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-200 hover:bg-white/[0.04] min-h-[44px]"
          >
            <Calculator className="w-4 h-4 text-indigo-400" />
            <span>Calculator Workbench</span>
          </Link>
          <Link
            href="/#head-to-head"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-200 hover:bg-white/[0.04] min-h-[44px]"
          >
            <GitCompare className="w-4 h-4 text-indigo-400" />
            <span>Head-to-Head Comparison</span>
          </Link>
          <Link
            href="/calculator/gpu-vs-api"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-200 hover:bg-white/[0.04] min-h-[44px]"
          >
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Self-Hosted GPU Simulator</span>
          </Link>
          <Link
            href="/pricing-table"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-200 hover:bg-white/[0.04] min-h-[44px]"
          >
            <Table2 className="w-4 h-4 text-indigo-400" />
            <span>Master Pricing Table</span>
          </Link>
        </div>
      )}
    </header>
  );
}
