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
  // Format configurations with reserved height to maintain 100/100 Core Web Vitals (Zero CLS)
  const formatStyles = {
    'horizontal-leaderboard': 'w-full min-h-[90px] md:min-h-[100px] max-w-5xl mx-auto',
    'rectangle-medium': 'w-full min-h-[250px] md:min-h-[280px] max-w-[336px] mx-auto',
    'skyscraper-sidebar': 'w-full min-h-[600px] max-w-[300px] mx-auto',
    'in-feed-responsive': 'w-full min-h-[120px] max-w-4xl mx-auto',
  };

  return (
    <div className={`my-8 flex flex-col items-center justify-center ${className}`}>
      {/* Policy-compliant micro-label */}
      <span className="mb-1.5 font-mono text-[9px] uppercase tracking-widest text-text-muted">
        Advertisement
      </span>

      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-lg border border-border/70 bg-surface/50 p-2 text-center transition-all ${formatStyles[format]}`}
      >
        {/* Placeholder for production AdSense tag script */}
        <div className="flex flex-col items-center justify-center gap-1 text-text-muted">
          <span className="font-mono text-xs font-medium text-text-secondary">
            Sponsored Developer Cloud & API Tools
          </span>
          <span className="text-[10px] text-text-muted">
            High-Performance AI Inference, Vector DBs & Hosting
          </span>
        </div>

        {/* AdSense ins container (Activated when real client ID is injected) */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
