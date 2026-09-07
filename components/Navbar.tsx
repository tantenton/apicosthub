'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calculator, Cpu, GitCompare, Table, Menu, X, Sparkles, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface border border-border group-hover:border-brand transition-colors">
            <span className="font-mono text-base font-bold text-brand">&gt;_</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-text-primary group-hover:text-white transition-colors">
              APICostHub<span className="text-brand">.com</span>
            </span>
            <span className="text-[10px] font-mono tracking-wider uppercase text-text-muted">
              AI Token & Cloud Unit Economics
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
          >
            <Calculator className="h-4 w-4 text-brand" />
            <span>Calculator</span>
          </Link>
          <Link
            href="/compare/gpt-4o-vs-claude-3-5-sonnet"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
          >
            <GitCompare className="h-4 w-4 text-accent-emerald" />
            <span>Head-to-Head</span>
          </Link>
          <Link
            href="/calculator/gpu-vs-api"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
          >
            <Cpu className="h-4 w-4 text-accent-amber" />
            <span>GPU vs API</span>
          </Link>
          <Link
            href="/pricing-table"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
          >
            <Table className="h-4 w-4 text-text-secondary" />
            <span>2026 Model Index</span>
          </Link>
        </nav>

        {/* Badge & CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary">
            <span className="h-2 w-2 rounded-full bg-accent-emerald animate-pulse" />
            <span className="font-mono">Updated Sep 2026</span>
          </div>
          <Link
            href="/pricing-table"
            className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-hover transition-colors"
          >
            Compare 16 Models
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 py-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-hover"
          >
            <Calculator className="h-4 w-4 text-brand" />
            <span>Cost Calculator</span>
          </Link>
          <Link
            href="/compare/gpt-4o-vs-claude-3-5-sonnet"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-hover"
          >
            <GitCompare className="h-4 w-4 text-accent-emerald" />
            <span>Model Comparisons</span>
          </Link>
          <Link
            href="/calculator/gpu-vs-api"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-hover"
          >
            <Cpu className="h-4 w-4 text-accent-amber" />
            <span>GPU Breakeven Calculator</span>
          </Link>
          <Link
            href="/pricing-table"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-hover"
          >
            <Table className="h-4 w-4 text-text-secondary" />
            <span>All Model Pricing</span>
          </Link>
        </div>
      )}
    </header>
  );
}
