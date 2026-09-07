import React from 'react';
import HeroCalculator from '@/components/HeroCalculator';
import ParetoMatrixChart from '@/components/ParetoMatrixChart';
import ArchitectureBanner from '@/components/ArchitectureBanner';
import HeadToHeadCalculator from '@/components/HeadToHeadCalculator';
import GpuVsApiSection from '@/components/GpuVsApiSection';
import FormulaDocs from '@/components/FormulaDocs';
import FaqSection from '@/components/FaqSection';
import AdPlacement from '@/components/AdPlacement';

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Discreet Developer Partner Unit */}
      <div className="w-full max-w-7xl px-4 sm:px-6 pt-4">
        <AdPlacement slotId="leaderboard-top" format="horizontal-leaderboard" />
      </div>

      {/* Main Interactive Tokenomics Workbench */}
      <HeroCalculator />

      {/* 2D Pareto Frontier Matrix: Artificial Analysis Style */}
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <ParetoMatrixChart />
      </div>

      {/* Mid Sponsor / Ad Placement */}
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <AdPlacement slotId="mid-feed-sponsor" format="horizontal-leaderboard" />
      </div>

      {/* 3D Production Architecture Breakdown */}
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <ArchitectureBanner />
      </div>

      {/* Model Diff / Head-to-Head Comparison */}
      <HeadToHeadCalculator initialModelA="gpt-4o" initialModelB="claude-3-5-sonnet" />

      {/* Cloud Infrastructure / Self-Hosted GPU Breakeven */}
      <GpuVsApiSection />

      {/* Technical Engineering Documentation & Token Formulas */}
      <FormulaDocs />

      {/* High-Intent Developer FAQ */}
      <FaqSection />

      {/* Bottom Sponsor Unit */}
      <div className="w-full max-w-7xl px-4 sm:px-6 pb-6">
        <AdPlacement slotId="bottom-sponsor" format="horizontal-leaderboard" />
      </div>
    </div>
  );
}
