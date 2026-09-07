export interface AIModel {
  id: string;
  name: string;
  provider: 'OpenAI' | 'Anthropic' | 'Google' | 'DeepSeek' | 'Meta (Hosted)' | 'Mistral' | 'Cohere';
  providerSlug: string;
  contextWindow: number; // in tokens
  maxOutput: number; // in tokens
  inputCostPer1M: number; // in USD per 1M tokens
  outputCostPer1M: number; // in USD per 1M tokens
  cachedInputCostPer1M?: number; // in USD per 1M tokens
  batchDiscountPercentage?: number; // percentage discount (e.g. 50)
  latencyScore: 'Ultra-Fast' | 'Fast' | 'Standard' | 'Reasoning (Slow)';
  qualityTier: 'Flagship / Frontier' | 'High-Efficiency' | 'Lightweight / Fast' | 'Reasoning Heavy';
  knowledgeCutoff: string;
  description: string;
  recommendedFor: string[];
  isOpenWeights?: boolean;
  speedTokensPerSec?: number;
  benchmarks?: {
    mmlu?: number;
    code?: number;
    math?: number;
  };
}

export interface GPUInstance {
  id: string;
  gpuName: string;
  name?: string;
  provider: string;
  vramGB: number;
  hourlyRate: number; // USD/hr
  hourlyRateUSD: number;
  estimatedTokensPerSec: number; // for 70B or 8B model throughput
  optimalModelSize: string;
}

export const AI_MODELS: AIModel[] = [
  // OpenAI
  {
    id: 'gpt-4o',
    name: 'GPT-4o (Omni)',
    provider: 'OpenAI',
    providerSlug: 'openai',
    contextWindow: 128000,
    maxOutput: 16384,
    inputCostPer1M: 2.50,
    outputCostPer1M: 10.00,
    cachedInputCostPer1M: 1.25,
    batchDiscountPercentage: 50,
    latencyScore: 'Fast',
    qualityTier: 'Flagship / Frontier',
    knowledgeCutoff: 'Oct 2023',
    description: 'OpenAIs flagship multimodal model for high-intelligence text, vision, and complex reasoning.',
    recommendedFor: ['Complex reasoning', 'Customer support bots', 'Data extraction', 'Multimodal analysis'],
    benchmarks: { mmlu: 88.7, code: 90.2, math: 76.6 }
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    provider: 'OpenAI',
    providerSlug: 'openai',
    contextWindow: 128000,
    maxOutput: 16384,
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.60,
    cachedInputCostPer1M: 0.075,
    batchDiscountPercentage: 50,
    latencyScore: 'Ultra-Fast',
    qualityTier: 'Lightweight / Fast',
    knowledgeCutoff: 'Oct 2023',
    description: 'High-speed, ultra low-cost model replacing GPT-3.5 Turbo with superior intelligence.',
    recommendedFor: ['High-volume classification', 'Summarization', 'Simple agents', 'Content moderation'],
    benchmarks: { mmlu: 82.0, code: 87.0, math: 70.2 }
  },
  {
    id: 'o1',
    name: 'OpenAI o1',
    provider: 'OpenAI',
    providerSlug: 'openai',
    contextWindow: 200000,
    maxOutput: 100000,
    inputCostPer1M: 15.00,
    outputCostPer1M: 60.00,
    cachedInputCostPer1M: 7.50,
    batchDiscountPercentage: 50,
    latencyScore: 'Reasoning (Slow)',
    qualityTier: 'Reasoning Heavy',
    knowledgeCutoff: 'Oct 2023',
    description: 'Deep chain-of-thought reasoning model for complex STEM, coding architectures, and mathematics.',
    recommendedFor: ['Complex code synthesis', 'Mathematical proof', 'Multi-step planning', 'Scientific research'],
    benchmarks: { mmlu: 91.8, code: 93.4, math: 94.8 }
  },
  {
    id: 'o1-mini',
    name: 'OpenAI o1-mini',
    provider: 'OpenAI',
    providerSlug: 'openai',
    contextWindow: 128000,
    maxOutput: 65536,
    inputCostPer1M: 3.00,
    outputCostPer1M: 12.00,
    cachedInputCostPer1M: 1.50,
    batchDiscountPercentage: 50,
    latencyScore: 'Fast',
    qualityTier: 'Reasoning Heavy',
    knowledgeCutoff: 'Oct 2023',
    description: 'Cost-efficient reasoning model optimized for programming, STEM, and quantitative analysis.',
    recommendedFor: ['Code debugging', 'Algorithm optimization', 'Math problem solving'],
    benchmarks: { mmlu: 85.2, code: 92.4, math: 90.0 }
  },

  // Anthropic
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    providerSlug: 'anthropic',
    contextWindow: 200000,
    maxOutput: 8192,
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    cachedInputCostPer1M: 0.30, // Prompt caching 90% discount on read
    batchDiscountPercentage: 50,
    latencyScore: 'Fast',
    qualityTier: 'Flagship / Frontier',
    knowledgeCutoff: 'Apr 2024',
    description: 'Industry benchmark for software engineering, nuance comprehension, and agentic workflows.',
    recommendedFor: ['Autonomous coding agents', 'Complex document analysis', 'Technical writing', 'Tool calling'],
    benchmarks: { mmlu: 88.3, code: 93.7, math: 78.3 }
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    providerSlug: 'anthropic',
    contextWindow: 200000,
    maxOutput: 8192,
    inputCostPer1M: 0.80,
    outputCostPer1M: 4.00,
    cachedInputCostPer1M: 0.08,
    batchDiscountPercentage: 50,
    latencyScore: 'Ultra-Fast',
    qualityTier: 'Lightweight / Fast',
    knowledgeCutoff: 'Jul 2024',
    description: 'Lightning-fast execution matching Claude 3 Opus intelligence at high-throughput economics.',
    recommendedFor: ['Interactive chat', 'High-throughput parsing', 'Lightweight coding assistance'],
    benchmarks: { mmlu: 80.9, code: 88.1, math: 69.4 }
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    providerSlug: 'anthropic',
    contextWindow: 200000,
    maxOutput: 4096,
    inputCostPer1M: 15.00,
    outputCostPer1M: 75.00,
    cachedInputCostPer1M: 1.50,
    batchDiscountPercentage: 50,
    latencyScore: 'Standard',
    qualityTier: 'Flagship / Frontier',
    knowledgeCutoff: 'Aug 2023',
    description: 'Deep philosophical, highly articulate synthesis engine for mission-critical enterprise tasks.',
    recommendedFor: ['Deep literary writing', 'Complex policy review', 'Executive summaries'],
    benchmarks: { mmlu: 86.8, code: 84.9, math: 60.1 }
  },

  // Google
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    providerSlug: 'google',
    contextWindow: 2000000,
    maxOutput: 8192,
    inputCostPer1M: 1.25, // <=128k tokens rate (or $2.50 for >128k)
    outputCostPer1M: 5.00,
    cachedInputCostPer1M: 0.3125,
    batchDiscountPercentage: 50,
    latencyScore: 'Standard',
    qualityTier: 'Flagship / Frontier',
    knowledgeCutoff: 'Nov 2024',
    description: '2 Million token massive context window champion. Analyzes full codebases, hours of audio, and books.',
    recommendedFor: ['Full repository indexing', 'Hour-long video QA', 'Massive PDF audits'],
    benchmarks: { mmlu: 85.9, code: 84.1, math: 67.7 }
  },
  {
    id: 'gemini-1-5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    providerSlug: 'google',
    contextWindow: 1000000,
    maxOutput: 8192,
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.30,
    cachedInputCostPer1M: 0.01875,
    batchDiscountPercentage: 50,
    latencyScore: 'Ultra-Fast',
    qualityTier: 'Lightweight / Fast',
    knowledgeCutoff: 'Nov 2024',
    description: 'Ultra-budget high-speed 1M context model built for scale and multimodal tasks.',
    recommendedFor: ['Video transcription parsing', 'High-volume web scraping extraction', 'Real-time apps'],
    benchmarks: { mmlu: 78.9, code: 74.3, math: 55.4 }
  },
  {
    id: 'gemini-2-0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    providerSlug: 'google',
    contextWindow: 1000000,
    maxOutput: 8192,
    inputCostPer1M: 0.10,
    outputCostPer1M: 0.40,
    cachedInputCostPer1M: 0.025,
    batchDiscountPercentage: 50,
    latencyScore: 'Ultra-Fast',
    qualityTier: 'Lightweight / Fast',
    knowledgeCutoff: 'Dec 2024',
    description: 'Next-gen real-time multimodal reasoning with native tool use and ultra-low latency.',
    recommendedFor: ['Live voice assistants', 'Real-time vision streaming', 'Interactive devtools'],
    benchmarks: { mmlu: 84.5, code: 86.2, math: 69.8 }
  },

  // DeepSeek
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    providerSlug: 'deepseek',
    contextWindow: 64000,
    maxOutput: 8192,
    inputCostPer1M: 0.14,
    outputCostPer1M: 0.28,
    cachedInputCostPer1M: 0.014, // 90% cache hit discount
    batchDiscountPercentage: 0,
    latencyScore: 'Fast',
    qualityTier: 'High-Efficiency',
    knowledgeCutoff: 'Dec 2024',
    description: '671B MoE architecture delivering frontier-grade capability at unprecedented cost efficiency.',
    recommendedFor: ['Cost-sensitive production APIs', 'Large scale data transformation', 'Open-weight workflows'],
    benchmarks: { mmlu: 88.5, code: 89.0, math: 75.9 }
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    providerSlug: 'deepseek',
    contextWindow: 64000,
    maxOutput: 8192,
    inputCostPer1M: 0.55,
    outputCostPer1M: 2.19,
    cachedInputCostPer1M: 0.14,
    batchDiscountPercentage: 0,
    latencyScore: 'Reasoning (Slow)',
    qualityTier: 'Reasoning Heavy',
    knowledgeCutoff: 'Dec 2024',
    description: 'Open reasoning model matching OpenAI o1 on math, coding, and logical deductions.',
    recommendedFor: ['Complex math proofing', 'Code architecture review', 'Hard logic puzzles'],
    benchmarks: { mmlu: 90.8, code: 92.5, math: 93.1 }
  },

  // Meta Llama (Hosted on Together/Fireworks/Groq)
  {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B (Instruct)',
    provider: 'Meta (Hosted)',
    providerSlug: 'meta',
    contextWindow: 128000,
    maxOutput: 4096,
    inputCostPer1M: 0.70,
    outputCostPer1M: 0.90,
    cachedInputCostPer1M: 0.35,
    batchDiscountPercentage: 30,
    latencyScore: 'Ultra-Fast',
    qualityTier: 'High-Efficiency',
    knowledgeCutoff: 'Dec 2024',
    description: 'Meta flagship open weights model rivaling proprietary GPT-4 tier intelligence.',
    recommendedFor: ['Self-hosting alternative', 'Enterprise privacy pipelines', 'Custom fine-tuning'],
    benchmarks: { mmlu: 86.4, code: 81.7, math: 68.3 }
  },
  {
    id: 'llama-3-1-405b',
    name: 'Llama 3.1 405B',
    provider: 'Meta (Hosted)',
    providerSlug: 'meta',
    contextWindow: 128000,
    maxOutput: 4096,
    inputCostPer1M: 3.50,
    outputCostPer1M: 3.50,
    cachedInputCostPer1M: 1.75,
    batchDiscountPercentage: 30,
    latencyScore: 'Standard',
    qualityTier: 'Flagship / Frontier',
    knowledgeCutoff: 'Jul 2024',
    description: 'The largest open-weights foundation model ever built for synthetic data generation and distillation.',
    recommendedFor: ['Model distillation', 'Dataset generation', 'Complex multi-domain research'],
    benchmarks: { mmlu: 88.6, code: 89.0, math: 73.8 }
  },

  // Mistral
  {
    id: 'mistral-large-2407',
    name: 'Mistral Large 2',
    provider: 'Mistral',
    providerSlug: 'mistral',
    contextWindow: 128000,
    maxOutput: 4096,
    inputCostPer1M: 2.00,
    outputCostPer1M: 6.00,
    cachedInputCostPer1M: 1.00,
    batchDiscountPercentage: 40,
    latencyScore: 'Fast',
    qualityTier: 'Flagship / Frontier',
    knowledgeCutoff: 'Jul 2024',
    description: 'European frontier model with top-tier multilingual capabilities and code mastery.',
    recommendedFor: ['Multilingual applications (French, German, Spanish)', 'Strict European compliance'],
    benchmarks: { mmlu: 84.0, code: 86.0, math: 68.0 }
  },
  {
    id: 'codestral',
    name: 'Codestral (Mistral)',
    provider: 'Mistral',
    providerSlug: 'mistral',
    contextWindow: 32000,
    maxOutput: 4096,
    inputCostPer1M: 0.30,
    outputCostPer1M: 0.90,
    cachedInputCostPer1M: 0.15,
    batchDiscountPercentage: 40,
    latencyScore: 'Ultra-Fast',
    qualityTier: 'High-Efficiency',
    knowledgeCutoff: 'May 2024',
    description: 'Specialized code completion and generation model supporting 80+ programming languages.',
    recommendedFor: ['IDE autocomplete', 'Fill-in-the-middle (FIM) code completions', 'Unit test generation'],
    benchmarks: { mmlu: 75.0, code: 91.6, math: 64.0 }
  }
];

export const GPU_INSTANCES: GPUInstance[] = [
  {
    id: 'rtx-4090',
    gpuName: 'NVIDIA RTX 4090 (24GB)',
    name: 'NVIDIA RTX 4090 (24GB)',
    provider: 'RunPod / Vast.ai',
    vramGB: 24,
    hourlyRate: 0.44,
    hourlyRateUSD: 0.44,
    estimatedTokensPerSec: 140, // For 8B quantized model (FP8/AWQ)
    optimalModelSize: '8B – 14B Q4/FP8'
  },
  {
    id: 'l40s',
    gpuName: 'NVIDIA L40S (48GB)',
    name: 'NVIDIA L40S (48GB)',
    provider: 'RunPod / Lambda Labs',
    vramGB: 48,
    hourlyRate: 0.85,
    hourlyRateUSD: 0.85,
    estimatedTokensPerSec: 95,
    optimalModelSize: '32B – 70B Quantized'
  },
  {
    id: 'a100-80gb',
    gpuName: 'NVIDIA A100 SXM4 (80GB)',
    name: 'NVIDIA A100 SXM4 (80GB)',
    provider: 'Lambda / GCP / RunPod',
    vramGB: 80,
    hourlyRate: 1.49,
    hourlyRateUSD: 1.49,
    estimatedTokensPerSec: 75,
    optimalModelSize: '70B FP8 or vLLM Batch'
  },
  {
    id: 'h100-sxm5',
    gpuName: 'NVIDIA H100 SXM5 (80GB)',
    name: 'NVIDIA H100 SXM5 (80GB)',
    provider: 'RunPod / Lambda / CoreWeave',
    vramGB: 80,
    hourlyRate: 2.89,
    hourlyRateUSD: 2.89,
    estimatedTokensPerSec: 190,
    optimalModelSize: '70B – 405B MoE vLLM'
  }
];

export interface PopularComparisonPair {
  slug: string;
  modelAId: string;
  modelBId: string;
  title: string;
  subtitle: string;
}

export const POPULAR_COMPARISONS: PopularComparisonPair[] = [
  {
    slug: 'gpt-4o-vs-claude-3-5-sonnet',
    modelAId: 'gpt-4o',
    modelBId: 'claude-3-5-sonnet',
    title: 'GPT-4o vs Claude 3.5 Sonnet Cost & Pricing Comparison',
    subtitle: 'Head-to-head token economics, prompt caching discounts, coding capability, and annual cost projections.'
  },
  {
    slug: 'deepseek-v3-vs-gpt-4o',
    modelAId: 'deepseek-v3',
    modelBId: 'gpt-4o',
    title: 'DeepSeek V3 vs GPT-4o Token Cost Comparison',
    subtitle: 'Calculate your savings switching from OpenAIs flagship to DeepSeek V3 671B MoE architecture.'
  },
  {
    slug: 'deepseek-r1-vs-o1',
    modelAId: 'deepseek-r1',
    modelBId: 'o1',
    title: 'DeepSeek R1 vs OpenAI o1 Reasoning Cost Calculator',
    subtitle: 'Compare costs of cutting-edge chain-of-thought reasoning models for math, science, and coding.'
  },
  {
    slug: 'claude-3-5-haiku-vs-gpt-4o-mini',
    modelAId: 'claude-3-5-haiku',
    modelBId: 'gpt-4o-mini',
    title: 'Claude 3.5 Haiku vs GPT-4o Mini Pricing Breakdown',
    subtitle: 'High-throughput lightweight model economics: which one delivers higher ROI for high-volume apps?'
  },
  {
    slug: 'gemini-1-5-pro-vs-claude-3-5-sonnet',
    modelAId: 'gemini-1-5-pro',
    modelBId: 'claude-3-5-sonnet',
    title: 'Gemini 1.5 Pro vs Claude 3.5 Sonnet Long-Context Costs',
    subtitle: 'Evaluate 2M token context window economics against industry-leading coding intelligence.'
  },
  {
    slug: 'llama-3-3-70b-vs-gpt-4o',
    modelAId: 'llama-3-3-70b',
    modelBId: 'gpt-4o',
    title: 'Llama 3.3 70B vs GPT-4o Cost & Performance',
    subtitle: 'Hosted open weights vs proprietary API: analyze total cost of ownership across traffic tiers.'
  }
];
