import React from 'react';
import HeroCalculator from '@/components/HeroCalculator';
import HeadToHeadCalculator from '@/components/HeadToHeadCalculator';
import GpuVsApiSection from '@/components/GpuVsApiSection';
import FormulaDocs from '@/components/FormulaDocs';
import FaqSection from '@/components/FaqSection';
import AdPlacement from '@/components/AdPlacement';
import Link from 'next/link';
import { POPULAR_COMPARISONS } from '@/data/models';
import { GitCompare, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Top Banner Ad Unit (Viewability > 75%) */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <AdPlacement slotId="top-home-leaderboard" format="horizontal-leaderboard" />
      </div>

      {/* Main Interactive Calculator */}
      <HeroCalculator />

      {/* Programmatic Comparison Hub Carousel / Grid */}
      <section className="w-full py-12 border-t border-border bg-surface-subtle/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-border gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand mb-1">
                <GitCompare className="h-4 w-4" />
                <span>Programmatic Model Breakdowns</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                Popular Head-to-Head Token Comparisons
              </h2>
            </div>
            <Link
              href="/pricing-table"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-hover"
            >
              <span>View All 16 Models</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {POPULAR_COMPARISONS.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="group rounded-xl border border-border bg-surface p-5 hover:border-brand/60 hover:bg-surface-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-sm font-bold text-text-primary group-hover:text-brand transition-colors mb-2">
                    {comp.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                    {comp.subtitle}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-brand font-medium">
                  <span>Simulate Custom Workload</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* In-feed Ad Unit */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdPlacement slotId="mid-home-feed" format="in-feed-responsive" />
      </div>

      {/* Head to Head Interactive Section */}
      <section className="w-full py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <HeadToHeadCalculator />
        </div>
      </section>

      {/* GPU vs API Breakeven Section */}
      <GpuVsApiSection />

      {/* Technical Formula & Documentation */}
      <FormulaDocs />

      {/* FAQ with Rich Snippet Schema */}
      <FaqSection />

      {/* Bottom Leaderboard Ad */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
        <AdPlacement slotId="bottom-home-leaderboard" format="horizontal-leaderboard" />
      </div>
    </div>
  );
}
