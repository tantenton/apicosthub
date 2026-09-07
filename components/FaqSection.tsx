'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    q: 'How does prompt caching affect my monthly invoice?',
    a: 'Prompt caching allows providers to store the KV-cache of identical prompt prefixes (such as agent system instructions, API schemas, or codebases). Anthropic, OpenAI, and DeepSeek offer up to 90% discounts on cached input tokens, drastically reducing costs for agentic loop workflows.',
  },
  {
    q: 'What is the Batch API discount and when should I use it?',
    a: 'Both OpenAI and Anthropic offer a 50% discount on standard token prices for requests submitted via their asynchronous Batch APIs. In exchange, responses are delivered within a 24-hour SLA. This is ideal for bulk document processing, synthetic dataset creation, and offline evaluations.',
  },
  {
    q: 'When does self-hosting open-weight models on GPUs make financial sense?',
    a: 'Self-hosting becomes viable when monthly token volume reaches continuous saturation (typically > 500 million to 1 billion tokens per month). At that point, the fixed hourly lease of an 8x H100 or 8x A100 node produces a lower per-token cost than commercial API gateways, assuming >60% hardware utilization.',
  },
  {
    q: 'How frequently are model pricing tariffs updated on APICostHub?',
    a: 'We monitor official provider price updates (OpenAI, Anthropic, Google DeepMind, DeepSeek, Meta) weekly. Tariffs shown reflect verified production pricing for March 2026.',
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="w-full max-w-7xl px-4 sm:px-6 my-10">
      <div className="surface-card rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl overflow-hidden">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            LLM Tokenomics & Infrastructure FAQ
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-900">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
