export interface AIModel {
  id: string;
  slug: string;
  name: string;
  provider: 'OpenAI' | 'Anthropic' | 'Google' | 'DeepSeek' | 'Meta (Hosted)' | 'Mistral' | 'Cohere';
  providerSlug: string;
  contextWindow: number; // in tokens
  maxOutput: number; // in tokens
  inputPricePerMillion: number; // in USD per 1M tokens
  outputPricePerMillion: number; // in USD per 1M tokens
  cachedInputPricePerMillion?: number; // in USD per 1M tokens
  // Compatibility aliases
  inputCostPer1M: number;
  outputCostPer1M: number;
  cachedInputCostPer1M?: number;
  batchDiscountPercentage?: number; // percentage discount (e.g. 50)
  typicalSpeedTokensPerSec: number;
  speedTokensPerSec?: number;
  latencyScore: 'Ultra-Fast' | 'Fast' | 'Standard' | 'Reasoning (Slow)';
  qualityTier: 'Flagship / Frontier' | 'High-Efficiency' | 'Lightweight / Fast' | 'Reasoning Heavy';
  category: 'frontier' | 'fast' | 'reasoning' | 'open-weights';
  knowledgeCutoff: string;
  description: string;
  recommended?: boolean;
  isOpenWeights?: boolean;
  recommendedFor: string[];
}

export interface GPUInstance {
  id: string;
  name: string;
  gpuName?: string;
  provider: string;
  vramGb: number;
  vramGB?: number;
  hourlyCost: number; // USD/hr
  hourlyRate?: number;
  hourlyRateUSD?: number;
  monthlyCostWithOverhead: number;
  estimatedTokensPerSec: number;
  optimalModelSize: string;
}

export interface WorkloadPreset {
  id: string;
  name: string;
  desc: string;
  requestsPerMonth: number;
  inputTokensPerReq: number;
  outputTokensPerReq: number;
  cachingPercentage: number;
  batchDiscount: boolean;
}

export const WORKLOAD_PRESETS: WorkloadPreset[] = [
  {
    id: 'ai-chat-saas',
    name: 'B2B AI Chatbot',
    desc: '500k reqs · 1.5k in / 600 out · 40% cache',
    requestsPerMonth: 500_000,
    inputTokensPerReq: 1_500,
    outputTokensPerReq: 600,
    cachingPercentage: 40,
    batchDiscount: false,
  },
  {
    id: 'agentic-loop',
    name: 'Autonomous Agent',
    desc: '200k reqs · 8k in / 1.2k out · 75% cache',
    requestsPerMonth: 200_000,
    inputTokensPerReq: 8_000,
    outputTokensPerReq: 1_200,
    cachingPercentage: 75,
    batchDiscount: false,
  },
  {
    id: 'batch-extraction',
    name: 'Offline Doc OCR',
    desc: '2M reqs · 3k in / 300 out · 50% batch',
    requestsPerMonth: 2_000_000,
    inputTokensPerReq: 3_000,
    outputTokensPerReq: 300,
    cachingPercentage: 10,
    batchDiscount: true,
  },
  {
    id: 'code-review',
    name: 'Code Review Bot',
    desc: '100k reqs · 16k in / 1.5k out · 60% cache',
    requestsPerMonth: 100_000,
    inputTokensPerReq: 16_000,
    outputTokensPerReq: 1_500,
    cachingPercentage: 60,
    batchDiscount: false,
  },
  {
    id: 'lightweight-classifier',
    name: 'Intent Router',
    desc: '5M reqs · 300 in / 50 out · 0% cache',
    requestsPerMonth: 5_000_000,
    inputTokensPerReq: 300,
    outputTokensPerReq: 50,
    cachingPercentage: 0,
    batchDiscount: false,
  },
];

export const AI_MODELS: AIModel[] = [
  // OpenAI
  {
    id: 'gpt-4o',
    slug: 'gpt-4o',
    name: 'GPT-4o (Omni)',
    provider: 'OpenAI',
    providerSlug: 'openai',
    contextWindow: 128000,
    maxOutput: 16384,
    inputPricePerMillion: 2.50,
    outputPricePerMillion: 10.00,
    cachedInputPricePerMillion: 1.25,
    inputCostPer1M: 2.50,
    outputCostPer1M: 10.00,
    cachedInputCostPer1M: 1.25,
    batchDiscountPercentage: 50,
    typicalSpeedTokensPerSec: 110,
    speedTokensPerSec: 110,
    latencyScore: 'Fast',
    qualityTier: 'Flagship / Frontier',
    category: 'frontier',
    knowledgeCutoff: 'Oct 2023',
    description: 'OpenAIs flagship multimodal model for high-intelligence text, vision, and complex reasoning.',
    recommended: true,
    recommendedFor: ['Complex reasoning', 'Customer support bots', 'Data extraction', 'Multimodal analysis'],
  },
  {
    id: 'gpt-4o-mini',
    slug: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    provider: 'OpenAI',
    providerSlug: 'openai',
    contextWindow: 128000,
    maxOutput: 16384,
    inputPricePerMillion: 0.15,
    outputPricePerMillion: 0.60,
    cachedInputPricePerMillion: 0.075,
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.60,
    cachedInputCostPer1M: 0.075,
    batchDiscountPercentage: 50,
    typicalSpeedTokensPerSec: 160,
    speedTokensPerSec: 160,
    latencyScore: 'Ultra-Fast',
    qualityTier: 'Lightweight / Fast',
    category: 'fast',
    knowledgeCutoff: 'Oct 2023',
    description: 'Ultra-low-cost, high-speed lightweight model for high-volume pipelines.',
    recommendedFor: ['Lightweight classification', 'Content summarization', 'High-volume ETL'],
  },
  {
    id: 'o1',
    slug: 'o1',
    name: 'OpenAI o1',
    provider: 'OpenAI',
    providerSlug: 'openai',
    contextWindow: 200000,
    maxOutput: 100000,
    inputPricePerMillion: 15.00,
    outputPricePerMillion: 60.00,
    cachedInputPricePerMillion: 7.50,
    inputCostPer1M: 15.00,
    outputCostPer1M: 60.00,
    cachedInputCostPer1M: 7.50,
    batchDiscountPercentage: 50,
    typicalSpeedTokensPerSec: 35,
    speedTokensPerSec: 35,
    latencyScore: 'Reasoning (Slow)',
    qualityTier: 'Reasoning Heavy',
    category: 'reasoning',
    knowledgeCutoff: 'Oct 2023',
    description: 'Frontier reasoning model using deep reinforcement learning chain-of-thought for competitive math and coding.',
    recommendedFor: ['Complex math proof', 'Architecture design', 'Multi-step vulnerability analysis'],
  },
  {
    id: 'o3-mini',
    slug: 'o3-mini',
    name: 'OpenAI o3-mini',
    provider: 'OpenAI',
    providerSlug: 'openai',
    contextWindow: 200000,
    maxOutput: 100000,
    inputPricePerMillion: 1.10,
    outputPricePerMillion: 4.40,
    cachedInputPricePerMillion: 0.55,
    inputCostPer1M: 1.10,
    outputCostPer1M: 4.40,
    cachedInputCostPer1M: 0.55,
    batchDiscountPercentage: 50,
    typicalSpeedTokensPerSec: 75,
    speedTokensPerSec: 75,
    latencyScore: 'Fast',
    qualityTier: 'Reasoning Heavy',
    category: 'reasoning',
    knowledgeCutoff: 'Oct 2023',
    description: 'Cost-efficient STEM reasoning model with selectable reasoning effort knobs.',
    recommended: true,
    recommendedFor: ['High-volume code synthesis', 'Automated test generation', 'Technical problem solving'],
  },

  // Anthropic
  {
    id: 'claude-3-5-sonnet',
    slug: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    providerSlug: 'anthropic',
    contextWindow: 200000,
    maxOutput: 8192,
    inputPricePerMillion: 3.00,
    outputPricePerMillion: 15.00,
    cachedInputPricePerMillion: 0.30,
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    cachedInputCostPer1M: 0.30,
    batchDiscountPercentage: 50,
    typicalSpeedTokensPerSec: 90,
    speedTokensPerSec: 90,
    latencyScore: 'Fast',
    qualityTier: 'Flagship / Frontier',
    category: 'frontier',
    knowledgeCutoff: 'Apr 2024',
    description: 'The industry-standard coding and analytical engine with 90% prompt cache discounts.',
    recommended: true,
    recommendedFor: ['Software engineering', 'Agentic workflow orchestration', 'Nuanced copywriting'],
  },
  {
    id: 'claude-3-5-haiku',
    slug: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    providerSlug: 'anthropic',
    contextWindow: 200000,
    maxOutput: 8192,
    inputPricePerMillion: 0.80,
    outputPricePerMillion: 4.00,
    cachedInputPricePerMillion: 0.08,
    inputCostPer1M: 0.80,
    outputCostPer1M: 4.00,
    cachedInputCostPer1M: 0.08,
    batchDiscountPercentage: 50,
    typicalSpeedTokensPerSec: 140,
    speedTokensPerSec: 140,
    latencyScore: 'Ultra-Fast',
    qualityTier: 'High-Efficiency',
    category: 'fast',
    knowledgeCutoff: 'Jul 2024',
    description: 'Sub-second response model surpassing Claude 3 Opus on standard benchmarks.',
    recommendedFor: ['Real-time chatbots', 'Interactive code autocomplete', 'Fast triage'],
  },

  // DeepSeek
  {
    id: 'deepseek-v3',
    slug: 'deepseek-v3',
    name: 'DeepSeek V3 (671B MoE)',
    provider: 'DeepSeek',
    providerSlug: 'deepseek',
    contextWindow: 64000,
    maxOutput: 8192,
    inputPricePerMillion: 0.14,
    outputPricePerMillion: 0.28,
    cachedInputPricePerMillion: 0.014,
    inputCostPer1M: 0.14,
    outputCostPer1M: 0.28,
    cachedInputCostPer1M: 0.014,
    batchDiscountPercentage: 0,
    typicalSpeedTokensPerSec: 85,
    speedTokensPerSec: 85,
    latencyScore: 'Fast',
    qualityTier: 'Flagship / Frontier',
    category: 'frontier',
    knowledgeCutoff: 'Dec 2024',
    description: 'Groundbreaking 671B parameter Mixture-of-Experts model delivering frontier performance at commodity pricing.',
    recommended: true,
    isOpenWeights: true,
    recommendedFor: ['Large-scale synthetic data generation', 'Cost-sensitive SaaS backends', 'General knowledge extraction'],
  },
  {
    id: 'deepseek-r1',
    slug: 'deepseek-r1',
    name: 'DeepSeek R1 (Reasoning)',
    provider: 'DeepSeek',
    providerSlug: 'deepseek',
    contextWindow: 64000,
    maxOutput: 8192,
    inputPricePerMillion: 0.55,
    outputPricePerMillion: 2.19,
    cachedInputPricePerMillion: 0.14,
    inputCostPer1M: 0.55,
    outputCostPer1M: 2.19,
    cachedInputCostPer1M: 0.14,
    batchDiscountPercentage: 0,
    typicalSpeedTokensPerSec: 45,
    speedTokensPerSec: 45,
    latencyScore: 'Reasoning (Slow)',
    qualityTier: 'Reasoning Heavy',
    category: 'reasoning',
    knowledgeCutoff: 'Dec 2024',
    description: 'Open-weights reasoning model matching OpenAI o1 on math, coding, and logical deduction at 1/20th the price.',
    recommended: true,
    isOpenWeights: true,
    recommendedFor: ['Autonomous bug bounty PoCs', 'Complex algorithms', 'Deep mathematical analysis'],
  },

  // Google
  {
    id: 'gemini-1-5-pro',
    slug: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro (2M Ctx)',
    provider: 'Google',
    providerSlug: 'google',
    contextWindow: 2097152,
    maxOutput: 8192,
    inputPricePerMillion: 1.25,
    outputPricePerMillion: 5.00,
    cachedInputPricePerMillion: 0.3125,
    inputCostPer1M: 1.25,
    outputCostPer1M: 5.00,
    cachedInputCostPer1M: 0.3125,
    batchDiscountPercentage: 50,
    typicalSpeedTokensPerSec: 75,
    speedTokensPerSec: 75,
    latencyScore: 'Standard',
    qualityTier: 'Flagship / Frontier',
    category: 'frontier',
    knowledgeCutoff: 'May 2024',
    description: 'Massive 2-million token context window capable of ingesting entire video files, audio, and large repositories.',
    recommendedFor: ['Full repository audits', 'Long video/audio analysis', 'Cross-document correlation'],
  },
  {
    id: 'gemini-1-5-flash',
    slug: 'gemini-1-5-flash',
    name: 'Gemini 1.5 Flash (1M Ctx)',
    provider: 'Google',
    providerSlug: 'google',
    contextWindow: 1048576,
    maxOutput: 8192,
    inputPricePerMillion: 0.075,
    outputPricePerMillion: 0.30,
    cachedInputPricePerMillion: 0.01875,
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.30,
    cachedInputCostPer1M: 0.01875,
    batchDiscountPercentage: 50,
    typicalSpeedTokensPerSec: 170,
    speedTokensPerSec: 170,
    latencyScore: 'Ultra-Fast',
    qualityTier: 'Lightweight / Fast',
    category: 'fast',
    knowledgeCutoff: 'May 2024',
    description: 'High-speed multimodal workhorse with 1M context at sub-dime unit pricing.',
    recommended: true,
    recommendedFor: ['Real-time streaming agent tools', 'Video frame parsing', 'Fast structured extraction'],
  },

  // Meta Open Weights
  {
    id: 'llama-3-3-70b',
    slug: 'llama-3-3-70b',
    name: 'Llama 3.3 70B (Hosted)',
    provider: 'Meta (Hosted)',
    providerSlug: 'meta',
    contextWindow: 128000,
    maxOutput: 8192,
    inputPricePerMillion: 0.59,
    outputPricePerMillion: 0.79,
    inputCostPer1M: 0.59,
    outputCostPer1M: 0.79,
    batchDiscountPercentage: 0,
    typicalSpeedTokensPerSec: 95,
    speedTokensPerSec: 95,
    latencyScore: 'Fast',
    qualityTier: 'High-Efficiency',
    category: 'open-weights',
    knowledgeCutoff: 'Dec 2024',
    description: 'Meta flagship open model offering GPT-4 class capabilities at open-weights accessibility.',
    isOpenWeights: true,
    recommendedFor: ['Private deployments', 'Custom fine-tunes', 'Unrestricted tool calling'],
  },
  {
    id: 'llama-3-1-405b',
    slug: 'llama-3-1-405b',
    name: 'Llama 3.1 405B (Hosted)',
    provider: 'Meta (Hosted)',
    providerSlug: 'meta',
    contextWindow: 128000,
    maxOutput: 4096,
    inputPricePerMillion: 2.40,
    outputPricePerMillion: 2.40,
    inputCostPer1M: 2.40,
    outputCostPer1M: 2.40,
    batchDiscountPercentage: 0,
    typicalSpeedTokensPerSec: 40,
    speedTokensPerSec: 40,
    latencyScore: 'Standard',
    qualityTier: 'Flagship / Frontier',
    category: 'open-weights',
    knowledgeCutoff: 'Dec 2023',
    description: 'First frontier-class 405B parameter open-weights model capable of synthetic data distillation.',
    isOpenWeights: true,
    recommendedFor: ['Teacher model data distillation', 'High-complexity synthesis', 'Offline private inference'],
  },

  // Mistral
  {
    id: 'mistral-large',
    slug: 'mistral-large',
    name: 'Mistral Large 2',
    provider: 'Mistral',
    providerSlug: 'mistral',
    contextWindow: 128000,
    maxOutput: 8192,
    inputPricePerMillion: 2.00,
    outputPricePerMillion: 6.00,
    inputCostPer1M: 2.00,
    outputCostPer1M: 6.00,
    batchDiscountPercentage: 50,
    typicalSpeedTokensPerSec: 80,
    speedTokensPerSec: 80,
    latencyScore: 'Fast',
    qualityTier: 'Flagship / Frontier',
    category: 'frontier',
    knowledgeCutoff: 'Nov 2024',
    description: 'European frontier model with state-of-the-art multilingual reasoning and code synthesis.',
    recommendedFor: ['European GDPR sovereignty', 'Multilingual workflows', 'Function calling'],
  },
  {
    id: 'codestral',
    slug: 'codestral',
    name: 'Codestral 2501',
    provider: 'Mistral',
    providerSlug: 'mistral',
    contextWindow: 256000,
    maxOutput: 8192,
    inputPricePerMillion: 0.30,
    outputPricePerMillion: 0.90,
    inputCostPer1M: 0.30,
    outputCostPer1M: 0.90,
    batchDiscountPercentage: 0,
    typicalSpeedTokensPerSec: 130,
    speedTokensPerSec: 130,
    latencyScore: 'Ultra-Fast',
    qualityTier: 'High-Efficiency',
    category: 'fast',
    knowledgeCutoff: 'Jan 2025',
    description: 'Specialized 256k context model purpose-built for code generation, fill-in-the-middle, and refactoring.',
    recommendedFor: ['IDE autocomplete', 'Fill-in-the-middle editing', 'Fast unit test synthesis'],
  },
];

export const GPU_INSTANCES: GPUInstance[] = [
  {
    id: '8x-h100-sxm5',
    name: '8x NVIDIA H100 SXM5 (640GB VRAM)',
    provider: 'RunPod / Lambda Cloud',
    vramGb: 640,
    vramGB: 640,
    hourlyCost: 24.80,
    hourlyRate: 24.80,
    hourlyRateUSD: 24.80,
    monthlyCostWithOverhead: 21724, // 730 hrs * 24.80 + 20% ops/egress
    estimatedTokensPerSec: 900,
    optimalModelSize: 'Llama 3.3 70B / DeepSeek MoE (Tensor Parallel 8)',
  },
  {
    id: '8x-a100-80gb',
    name: '8x NVIDIA A100 SXM4 (640GB VRAM)',
    provider: 'Vast.ai / RunPod',
    vramGb: 640,
    vramGB: 640,
    hourlyCost: 14.40,
    hourlyRate: 14.40,
    hourlyRateUSD: 14.40,
    monthlyCostWithOverhead: 12614,
    estimatedTokensPerSec: 520,
    optimalModelSize: 'Llama 3.3 70B (FP8 / AWQ Quantized)',
  },
  {
    id: '1x-h100-pcie',
    name: '1x NVIDIA H100 PCIe (80GB VRAM)',
    provider: 'Lambda Cloud',
    vramGb: 80,
    vramGB: 80,
    hourlyCost: 2.89,
    hourlyRate: 2.89,
    hourlyRateUSD: 2.89,
    monthlyCostWithOverhead: 2531,
    estimatedTokensPerSec: 180,
    optimalModelSize: 'Llama 3.1 8B / Mistral NeMo / Qwen 2.5 14B',
  },
  {
    id: '1x-rtx-4090',
    name: '1x NVIDIA RTX 4090 (24GB VRAM)',
    provider: 'Vast.ai Community',
    vramGb: 24,
    vramGB: 24,
    hourlyCost: 0.44,
    hourlyRate: 0.44,
    hourlyRateUSD: 0.44,
    monthlyCostWithOverhead: 385,
    estimatedTokensPerSec: 75,
    optimalModelSize: 'Llama 3.1 8B (4-bit GPTQ / EXL2)',
  },
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
    slug: 'claude-3-5-sonnet-vs-deepseek-v3',
    modelAId: 'claude-3-5-sonnet',
    modelBId: 'deepseek-v3',
    title: 'Claude 3.5 Sonnet vs DeepSeek V3 Cost Comparison',
    subtitle: 'Evaluate total annual savings switching from Anthropic flagship to DeepSeek 671B MoE.'
  },
  {
    slug: 'gpt-4o-vs-deepseek-v3',
    modelAId: 'gpt-4o',
    modelBId: 'deepseek-v3',
    title: 'GPT-4o vs DeepSeek V3 Cost & Pricing Comparison',
    subtitle: 'Compare token unit economics between OpenAIs multimodal flagship and DeepSeek V3.'
  },
  {
    slug: 'o1-vs-deepseek-r1',
    modelAId: 'o1',
    modelBId: 'deepseek-r1',
    title: 'OpenAI o1 vs DeepSeek R1 Reasoning Model Cost Calculator',
    subtitle: 'Chain-of-thought unit economics: how much do deep reasoning steps actually cost at scale?'
  },
  {
    slug: 'gpt-4o-mini-vs-gemini-1-5-flash',
    modelAId: 'gpt-4o-mini',
    modelBId: 'gemini-1-5-flash',
    title: 'GPT-4o mini vs Gemini 1.5 Flash High-Speed Benchmark',
    subtitle: 'Sub-dime pricing comparison for high-volume customer support and realtime agents.'
  },
  {
    slug: 'claude-3-5-haiku-vs-gpt-4o-mini',
    modelAId: 'claude-3-5-haiku',
    modelBId: 'gpt-4o-mini',
    title: 'Claude 3.5 Haiku vs GPT-4o Mini Pricing Breakdown',
    subtitle: 'High-throughput lightweight model economics: which one delivers higher ROI for high-volume apps?'
  },
];
