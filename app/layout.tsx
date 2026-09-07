import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'AI & LLM API Cost Calculator 2026 | Compare Token Pricing: APICostHub',
  description:
    'Calculate and compare LLM API token costs across OpenAI, Anthropic, Google Gemini, DeepSeek, and Meta Llama. Real-time prompt caching savings, batch API discounts, and GPU breakeven simulator.',
  keywords: [
    'LLM API pricing calculator',
    'AI token cost calculator',
    'GPT-4o vs Claude 3.5 Sonnet cost',
    'DeepSeek V3 pricing',
    'prompt caching discount calculator',
    'self hosted GPU vs API breakeven',
    'AI unit economics',
  ],
  authors: [{ name: 'APICostHub Research Team' }],
  openGraph: {
    title: 'AI & LLM API Cost Calculator 2026 | APICostHub',
    description:
      'Compare real-time LLM token costs across OpenAI, Anthropic, Google Gemini, DeepSeek, and Meta Llama. Instant client-side unit economics simulator.',
    url: 'https://apicosthub.com',
    siteName: 'APICostHub',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI & LLM API Cost Calculator 2026 | APICostHub',
    description:
      'Instant interactive simulator for LLM token pricing, prompt caching, and cloud GPU breakeven.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'APICostHub AI Token Economics Calculator',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
    description:
      'Client-side developer tool to calculate, benchmark, and compare AI model API token costs, prompt caching yields, and GPU infrastructure breakeven.',
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
        />
        {/* Google AdSense Script Tag Hook (Insert Publisher ID when account is active) */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0000000000000000"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-background text-text-primary antialiased flex flex-col justify-between">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
