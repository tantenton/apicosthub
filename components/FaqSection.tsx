'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'How accurate is the prompt caching calculation?',
    a: 'Calculations use exact published cache read rates: Anthropic charges 10% of base input rate ($0.30 vs $3.00/1M on Sonnet 3.5), OpenAI charges 50% ($1.25 vs $2.50/1M on GPT-4o), and DeepSeek charges 10% ($0.014 vs $0.14/1M on DeepSeek V3). Cache write premiums for Anthropic (5-minute TTL) are factored into blended calculations.',
  },
  {
    q: 'What is the standard ratio between input and output tokens?',
    a: 'For conversational support and agentic workflows, empirical benchmarks show an average ratio of 4:1 to 5:1 (input to output). For summarization or extraction, ratios often exceed 10:1. For code generation and creative drafting, the ratio drops closer to 2:1.',
  },
  {
    q: 'When should an engineering team switch from Managed APIs to self-hosted GPUs?',
    a: 'Breakeven depends heavily on model size. For 70B parameter models like Llama 3.3 70B or DeepSeek R1 distilled, a dedicated H100 SXM node ($2.49/hr) breaks even at approximately 350M to 450M tokens per month at 50% sustained utilization.',
  },
  {
    q: 'Are batch processing discounts available across all models?',
    a: 'OpenAI, Anthropic, and Google support Batch endpoints with a 50% flat discount on input and output tokens. Turnaround SLAs are 24 hours, making batch ideal for synthetic data generation, periodic classification, and testing evaluation runs.',
  },
  {
    q: 'How frequently are provider prices updated on APICostHub?',
    a: 'Price tables and model metadata are verified and updated within 24 hours of official pricing announcements from OpenAI, Anthropic, Google Cloud, DeepSeek, and Meta.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="w-full py-12 border-t border-white/10 bg-[#08090a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
            LLM API Economics and Infrastructure Guidance
          </h2>
        </div>

        {/* Interactive Accordion List */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.q}
                className="surface-card rounded-2xl border border-white/10 overflow-hidden shadow-lg transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 min-h-[48px]"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-white text-sm">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-indigo-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
