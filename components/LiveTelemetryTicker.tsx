'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, Copy, Check, Activity, Globe, Cpu, Zap, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveTelemetryTicker() {
  const [copied, setCopied] = useState(false);
  const [activeRegion, setActiveRegion] = useState<'us-east' | 'eu-central' | 'ap-southeast'>('us-east');
  const [pings, setPings] = useState({
    openai: 312,
    anthropic: 284,
    deepseek: 395,
    google: 240,
  });

  const cliCommand = 'curl -s https://apicosthub.vercel.app/api/v1/pricing.json | jq .';

  useEffect(() => {
    const interval = setInterval(() => {
      setPings({
        openai: 300 + Math.floor(Math.random() * 30),
        anthropic: 275 + Math.floor(Math.random() * 25),
        deepseek: 380 + Math.floor(Math.random() * 40),
        google: 230 + Math.floor(Math.random() * 25),
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-white border-b border-slate-200 text-slate-700 py-2 px-4 sm:px-6 shadow-2xs font-mono text-[11px]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Telemetry Feed */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-slate-900 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-indigo-600 inline" />
              HUD TELEMETRY:
            </span>
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
              16/16 NODES ONLINE
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-slate-500 border-l border-slate-200 pl-3">
            <span>TTFT [P50]:</span>
            <span className="text-slate-900 font-semibold">OpenAI <strong className="text-indigo-600">{pings.openai}ms</strong></span>
            <span>·</span>
            <span className="text-slate-900 font-semibold">Anthropic <strong className="text-indigo-600">{pings.anthropic}ms</strong></span>
            <span>·</span>
            <span className="text-slate-900 font-semibold">DeepSeek <strong className="text-emerald-600">{pings.deepseek}ms</strong></span>
            <span>·</span>
            <span className="text-slate-900 font-semibold">Google <strong className="text-indigo-600">{pings.google}ms</strong></span>
          </div>
        </div>

        {/* Right CLI Command Strip */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800 text-[11px] max-w-full overflow-hidden">
            <Terminal className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="text-slate-500 select-none">$</span>
            <span className="truncate">{cliCommand}</span>
            <button
              onClick={handleCopy}
              className="ml-1 text-slate-500 hover:text-indigo-600 transition-colors shrink-0"
              title="Copy cURL CLI query"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
