import React from 'react';

export default function FaqSection() {
  const faqs = [
    {
      question: 'Why are output tokens more expensive than input tokens in LLMs?',
      answer:
        'Input tokens can be processed in parallel across GPU tensor cores via matrix multiplication (prefill phase). In contrast, output tokens must be generated sequentially one by one (auto-regressive decoding phase). Each output token requires a full forward pass and memory read of the entire KV cache, causing memory bandwidth bottlenecks and higher compute consumption.',
    },
    {
      question: 'How does prompt caching reduce AI API bills?',
      answer:
        'Prompt caching stores the computed Key-Value (KV) states of static prompt prefixes (like developer system instructions, API documentation, or reference manuals) in high-speed GPU memory. When subsequent requests share that exact prefix, the provider skips computing those tokens, offering discounts of 50% to 90% (e.g. Claude 3.5 Sonnet charges $0.30/1M cached tokens instead of $3.00/1M).',
    },
    {
      question: 'When should a startup switch from Managed API to self-hosted open-weights models?',
      answer:
        'Self-hosting becomes economically viable when monthly API token expenses exceed the cost of dedicated cloud GPU instances (typically starting around $700–$1,500/month per instance) AND when traffic volume maintains high GPU utilization (>50%). For variable or low-volume workloads, managed pay-as-you-go APIs are almost always cheaper due to zero idle costs.',
    },
    {
      question: 'How accurate is this API cost calculator?',
      answer:
        'All token pricing data is verified directly from official provider pricing documentation (OpenAI, Anthropic, Google Cloud Vertex AI, DeepSeek, and Together AI). Pricing reflects published rates as of September 2026.',
    },
  ];

  // Schema.org FAQPage JSON-LD
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <section className="w-full py-12 border-t border-border">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Inject FAQ Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Everything you need to know about AI inference pricing and cost engineering.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border bg-surface p-5 transition-colors"
            >
              <h3 className="text-sm sm:text-base font-semibold text-text-primary mb-2">
                {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
