import { AIModel, GPUInstance, AI_MODELS } from '@/data/models';

export interface WorkloadParams {
  model?: AIModel;
  requestsPerMonth: number;
  inputTokensPerReq: number;
  outputTokensPerReq: number;
  cachingPercentage: number; // 0 to 100
  batchDiscount?: boolean;
}

export interface CalculationResult {
  monthlyInputTokens: number;
  monthlyOutputTokens: number;
  monthlyTotalTokens: number;
  cachedInputTokens: number;
  uncachedInputTokens: number;
  inputCostUSD: number;
  outputCostUSD: number;
  totalMonthlyCost: number;
  totalMonthlyCostUSD: number;
  costPer1kRequests: number;
  effectivePer1MTotal: number;
  savingsFromCaching: number;
}

export function calculateWorkloadCost(params: WorkloadParams): CalculationResult {
  const {
    model,
    requestsPerMonth,
    inputTokensPerReq,
    outputTokensPerReq,
    cachingPercentage,
    batchDiscount = false,
  } = params;

  const inputPrice = model ? (model.inputPricePerMillion ?? model.inputCostPer1M) : 2.5;
  const outputPrice = model ? (model.outputPricePerMillion ?? model.outputCostPer1M) : 10.0;
  const cachedPrice = model ? (model.cachedInputPricePerMillion ?? model.cachedInputCostPer1M ?? inputPrice) : inputPrice;

  const monthlyInputTokens = requestsPerMonth * inputTokensPerReq;
  const monthlyOutputTokens = requestsPerMonth * outputTokensPerReq;
  const monthlyTotalTokens = monthlyInputTokens + monthlyOutputTokens;

  const cacheRatio = Math.min(Math.max(cachingPercentage / 100, 0), 1);
  const cachedInputTokens = monthlyInputTokens * cacheRatio;
  const uncachedInputTokens = monthlyInputTokens - cachedInputTokens;

  const rawInputCost =
    (uncachedInputTokens / 1_000_000) * inputPrice +
    (cachedInputTokens / 1_000_000) * cachedPrice;

  const rawOutputCost = (monthlyOutputTokens / 1_000_000) * outputPrice;

  const discountMultiplier =
    batchDiscount && (model?.batchDiscountPercentage ?? 50) > 0
      ? 1 - (model?.batchDiscountPercentage ?? 50) / 100
      : 1.0;

  const inputCostUSD = rawInputCost * discountMultiplier;
  const outputCostUSD = rawOutputCost * discountMultiplier;
  const totalMonthlyCost = inputCostUSD + outputCostUSD;

  const costPer1kRequests = requestsPerMonth > 0 ? (totalMonthlyCost / requestsPerMonth) * 1000 : 0;
  const effectivePer1MTotal = monthlyTotalTokens > 0 ? (totalMonthlyCost / monthlyTotalTokens) * 1_000_000 : 0;

  const standardNoCacheInputCost = (monthlyInputTokens / 1_000_000) * inputPrice * discountMultiplier;
  const savingsFromCaching = Math.max(0, standardNoCacheInputCost - inputCostUSD);

  return {
    monthlyInputTokens,
    monthlyOutputTokens,
    monthlyTotalTokens,
    cachedInputTokens,
    uncachedInputTokens,
    inputCostUSD,
    outputCostUSD,
    totalMonthlyCost,
    totalMonthlyCostUSD: totalMonthlyCost,
    costPer1kRequests,
    effectivePer1MTotal,
    savingsFromCaching,
  };
}

export interface GpuBreakevenParams {
  gpu: GPUInstance;
  apiModel: AIModel;
  utilizationRate: number; // e.g. 65 (%)
}

export interface GpuBreakevenResult {
  monthlyGpuTcoUSD: number;
  monthlyGpuTokensCapacity: number;
  breakevenTokensPerMonth: number;
  isGpuCheaperAtCapacity: boolean;
  savingsAtFullCapacity: number;
}

export function calculateGpuBreakeven({
  gpu,
  apiModel,
  utilizationRate,
}: GpuBreakevenParams): GpuBreakevenResult {
  const monthlyGpuTcoUSD = gpu.monthlyCostWithOverhead;
  const hoursPerMonth = 730;
  const secondsPerMonth = hoursPerMonth * 3600;
  const rateRatio = utilizationRate / 100;

  const monthlyGpuTokensCapacity = gpu.estimatedTokensPerSec * secondsPerMonth * rateRatio;

  // Blended API price per token (assuming 3:1 input:output distribution)
  const blendedApiPricePer1M = (apiModel.inputPricePerMillion * 3 + apiModel.outputPricePerMillion) / 4;
  const blendedPricePerToken = blendedApiPricePer1M / 1_000_000;

  const breakevenTokensPerMonth = blendedPricePerToken > 0 ? monthlyGpuTcoUSD / blendedPricePerToken : 0;

  const apiCostAtGpuCapacity = monthlyGpuTokensCapacity * blendedPricePerToken;
  const isGpuCheaperAtCapacity = monthlyGpuTcoUSD < apiCostAtGpuCapacity;
  const savingsAtFullCapacity = Math.max(0, apiCostAtGpuCapacity - monthlyGpuTcoUSD);

  return {
    monthlyGpuTcoUSD,
    monthlyGpuTokensCapacity,
    breakevenTokensPerMonth,
    isGpuCheaperAtCapacity,
    savingsAtFullCapacity,
  };
}

export function formatCurrency(val: number, maxDecimals = 2): string {
  if (val === 0) return '$0.00';
  if (val < 0.01) return `$${val.toFixed(4)}`;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: maxDecimals,
  }).format(val);
}

export function formatTokens(tokens: number): string {
  if (tokens >= 1_000_000_000) {
    return `${(tokens / 1_000_000_000).toFixed(1)}B`;
  }
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(tokens % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(0)}K`;
  }
  return tokens.toLocaleString();
}

export function formatContextWindow(tokens: number): string {
  return formatTokens(tokens);
}
