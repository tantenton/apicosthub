'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Terminal, Cpu, GitCompare, Table2, Layers, Github, ExternalLink } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1E2638] bg-[#080A0F]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        
        {/* Brand Identity - Terminal Style */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] group-hover:border-[#10B981] transition-colors">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-white tracking-tight text-sm sm:text-base font-mono">
                API<span className="text-[#10B981]">Cost</span>Hub
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#171E2E] text-[#94A3B8] border border-[#232D42]">
                v2026.3
              </span>
            </div>
          </Link>
        </div>

        {/* Center Navigation - Developer Tabs */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-[#94A3B8]">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-md hover:text-white hover:bg-[#141A26] transition-colors flex items-center gap-1.5 text-white bg-[#141A26]/80 border border-[#232D42]"
          >
            <Layers className="w-3.5 h-3.5 text-[#10B981]" />
            Workbench
          </Link>
          <Link
            href="/#head-to-head"
            className="px-3 py-1.5 rounded-md hover:text-white hover:bg-[#141A26] transition-colors flex items-center gap-1.5"
          >
            <GitCompare className="w-3.5 h-3.5 text-blue-400" />
            Diff & Compare
          </Link>
          <Link
            href="/calculator/gpu-vs-api"
            className="px-3 py-1.5 rounded-md hover:text-white hover:bg-[#141A26] transition-colors flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            Self-Hosted vs API
          </Link>
          <Link
            href="/pricing-table"
            className="px-3 py-1.5 rounded-md hover:text-white hover:bg-[#141A26] transition-colors flex items-center gap-1.5"
          >
            <Table2 className="w-3.5 h-3.5 text-purple-400" />
            Master Matrix
          </Link>
        </nav>

        {/* Right Actions & Status */}
        <div className="flex items-center gap-2.5">
          {/* Real-time Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded border border-[#1E2638] bg-[#0E121B] text-[11px] font-mono text-[#94A3B8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span>16 Models Indexed</span>
          </div>

          <a
            href="https://github.com/tantenton/apicosthub"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded border border-[#1E2638] bg-[#0E121B] hover:bg-[#171E2E] text-[#94A3B8] hover:text-white transition-colors"
            title="View Source on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
