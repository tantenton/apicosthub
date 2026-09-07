'use client';

import React from 'react';

interface AdPlacementProps {
  slotId?: string;
  format?: 'horizontal-leaderboard' | 'rectangle-medium' | 'skyscraper-sidebar' | 'in-feed-responsive';
  className?: string;
}

export default function AdPlacement({
  slotId = 'default-slot',
  format = 'horizontal-leaderboard',
  className = '',
}: AdPlacementProps) {
  // Height reservation to guarantee 0 Cumulative Layout Shift (CLS)
  const minHeightClass =
    format === 'horizontal-leaderboard'
      ? 'min-h-[90px]'
      : format === 'rectangle-medium'
      ? 'min-h-[250px]'
      : 'min-h-[120px]';

  return (
    <div className={`w-full my-6 flex flex-col items-center justify-center ${className}`}>
      {/* Policy Compliant Label */}
      <div className="w-full max-w-4xl flex items-center justify-between pb-1.5 px-1 text-[10px] uppercase font-mono tracking-wider text-[#64748B]">
        <span>Sponsored · Partner Network</span>
        <span>Ad Placement</span>
      </div>

      {/* Reserved container */}
      <div
        className={`w-full max-w-4xl ${minHeightClass} rounded border border-[#1E2638] bg-[#0A0D14] flex items-center justify-center p-4 transition-all hover:border-[#2A364F]`}
      >
        <ins
          className="adsbygoogle block w-full text-center"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />

        {/* Developer placeholder state (seamlessly integrated) */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full px-4 text-xs text-[#64748B] gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1E2638]" />
            <span className="font-mono text-[#94A3B8]">Compute & Inference Infrastructure Sponsors</span>
          </div>
          <span className="text-[11px] font-mono text-[#475569]">AdSense verified container slot</span>
        </div>
      </div>
    </div>
  );
}
