import React from 'react';
import HeroCalculator from '@/components/HeroCalculator';
import RouterCascadeSimulator from '@/components/RouterCascadeSimulator';
import CodeSnippetPlayground from '@/components/CodeSnippetPlayground';
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
      {/* Main Interactive Tokenomics Workbench */}
      <HeroCalculator />

      {/* Developer Integration Code Generator */}
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <CodeSnippetPlayground />
      </div>

      {/* Multi-Tier Cascading Router Simulator */}
      <RouterCascadeSimulator />

      {/* 2D Pareto Frontier Matrix */}
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <ParetoMatrixChart />
      </div>

      {/* Discreet Developer Partner Unit */}
      <div className="w-full max-w-7xl px-4 sm:px-6 my-4">
        <AdPlacement slotId="mid-feed-sponsor" format="horizontal-leaderboard" />
      </div>

      {/* 3D Production Architecture & Looping Video */}
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
