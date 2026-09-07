'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Calculator, GitCompare, Cpu, Table2, Github } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1E2538] bg-[#090B10]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded p-1"
          >
            <div className="w-7 h-7 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-white tracking-tight text-base">
                APICost<span className="text-emerald-400">Hub</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#161B26] text-[#94A3B8] border border-[#232D42]">
                2026 Data
              </span>
            </div>
          </Link>
        </div>

        {/* Center Navigation: Desktop */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-[#94A3B8]">
          <Link
            href="/"
            className="px-3 py-2 rounded hover:text-white hover:bg-[#141A26] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Calculator
          </Link>
          <Link
            href="/#head-to-head"
            className="px-3 py-2 rounded hover:text-white hover:bg-[#141A26] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Compare Models
          </Link>
          <Link
            href="/calculator/gpu-vs-api"
            className="px-3 py-2 rounded hover:text-white hover:bg-[#141A26] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Self-Hosted GPU
          </Link>
          <Link
            href="/pricing-table"
            className="px-3 py-2 rounded hover:text-white hover:bg-[#141A26] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Pricing Table
          </Link>
        </nav>

        {/* Right Actions & Status */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded border border-[#1E2538] bg-[#111520] text-[11px] font-mono text-[#94A3B8]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>16 Models Verified</span>
          </div>

          <a
            href="https://github.com/tantenton/apicosthub"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded border border-[#1E2538] bg-[#111520] hover:bg-[#171E2E] text-[#94A3B8] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            title="View Source on GitHub"
            aria-label="View Source on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-h-[44px] min-w-[44px] p-2.5 rounded border border-[#1E2538] bg-[#111520] text-[#94A3B8] hover:text-white flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#1E2538] bg-[#090B10] px-4 py-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded text-sm text-[#CBD5E1] hover:bg-[#141A26] min-h-[44px]"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>Token Calculator</span>
          </Link>
          <Link
            href="/#head-to-head"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded text-sm text-[#CBD5E1] hover:bg-[#141A26] min-h-[44px]"
          >
            <GitCompare className="w-4 h-4 text-blue-400" />
            <span>Compare Models</span>
          </Link>
          <Link
            href="/calculator/gpu-vs-api"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded text-sm text-[#CBD5E1] hover:bg-[#141A26] min-h-[44px]"
          >
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>Self-Hosted GPU vs API</span>
          </Link>
          <Link
            href="/pricing-table"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded text-sm text-[#CBD5E1] hover:bg-[#141A26] min-h-[44px]"
          >
            <Table2 className="w-4 h-4 text-purple-400" />
            <span>Full Pricing Table</span>
          </Link>
        </div>
      )}
    </header>
  );
}
