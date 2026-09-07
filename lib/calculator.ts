import { AIModel, GPUInstance } from '@/data/models';

export interface CalculationParams {
  monthlyRequests: number;
  avgInputTokens: number;
  avgOutputTokens: number;
  cachedInputPercentage: number; // 0 to 100
  enableBatchDiscount: boolean;
}

export interface ModelCostResult {
  model: AIModel;
  monthlyInputTokens: number;
  monthlyOutputTokens: number;
  monthlyTotalTokens: number;
  cachedInputTokens: number;
  uncachedInputTokens: number;
  inputCostUSD: number;
  outputCostUSD: number;
  totalMonthlyCostUSD: number;
  annualCostUSD: number;
  costPer1kRequestsUSD: number;
  effectiveCostPer1MTokensUSD: number;
  savingsVsBaselineUSD?: number;
}

export function calculateSingleModelCost(
  model: AIModel,
  params: CalculationParams
): ModelCostResult {
  const {
    monthlyRequests,
    avgInputTokens,
    avgOutputTokens,
    cachedInputPercentage,
    enableBatchDiscount,
  } = params;

  const monthlyInputTokens = monthlyRequests * avgInputTokens;
  const monthlyOutputTokens = monthlyRequests * avgOutputTokens;
  const monthlyTotalTokens = monthlyInputTokens + monthlyOutputTokens;

  const cachedRatio = Math.min(Math.max(cachedInputPercentage / 100, 0), 1);
  const cachedInputTokens = monthlyInputTokens * cachedRatio;
  const uncachedInputTokens = monthlyInputTokens - cachedInputTokens;

  const cachedRate = model.cachedInputCostPer1M ?? model.inputCostPer1M;
  const rawInputCost =
    (uncachedInputTokens / 1_000_000) * model.inputCostPer1M +
    (cachedInputTokens / 1_000_000) * cachedRate;

  const rawOutputCost = (monthlyOutputTokens / 1_000_000) * model.outputCostPer1M;

  const discountMultiplier =
    enableBatchDiscount && model.batchDiscountPercentage
      ? 1 - model.batchDiscountPercentage / 100
      : 1;

  const inputCostUSD = rawInputCost * discountMultiplier;
  const outputCostUSD = rawOutputCost * discountMultiplier;
  const totalMonthlyCostUSD = inputCostUSD + outputCostUSD;
  const annualCostUSD = totalMonthlyCostUSD * 12;

  const costPer1kRequestsUSD =
    monthlyRequests > 0 ? (totalMonthlyCostUSD / monthlyRequests) * 1000 : 0;

  const effectiveCostPer1MTokensUSD =
    monthlyTotalTokens > 0
      ? (totalMonthlyCostUSD / monthlyTotalTokens) * 1_000_000
      : 0;

  return {
    model,
    monthlyInputTokens,
    monthlyOutputTokens,
    monthlyTotalTokens,
    cachedInputTokens,
    uncachedInputTokens,
    inputCostUSD,
    outputCostUSD,
    totalMonthlyCostUSD,
    annualCostUSD,
    costPer1kRequestsUSD,
    effectiveCostPer1MTokensUSD,
  };
}

export function calculateAllModelsCost(
  models: AIModel[],
  params: CalculationParams
): ModelCostResult[] {
  const results = models.map((m) => calculateSingleModelCost(m, params));
  // Sort ascending by total monthly cost
  return results.sort((a, b) => a.totalMonthlyCostUSD - b.totalMonthlyCostUSD);
}

export interface GpuBreakevenResult {
  gpu: GPUInstance;
  monthlyGpuCostUSD: number; // 730 hours
  monthlyTokensCapacity: number; // estimated maximum tokens at 60% avg utilization
  apiCostEquivalentUSD: number; // cost if generated on model (e.g. Llama 3.3 70B API)
  isGpuCheaper: boolean;
  monthlySavingsUSD: number;
  breakevenRequestsPerMonth: number;
}

export function calculateGpuBreakeven(
  gpu: GPUInstance,
  targetModel: AIModel,
  params: CalculationParams,
  utilizationRate = 0.55 // 55% average server capacity utilization
): GpuBreakevenResult {
  const hoursPerMonth = 730;
  const monthlyGpuCostUSD = gpu.hourlyRate * hoursPerMonth;

  // Maximum token production capacity per month
  const secondsPerMonth = hoursPerMonth * 3600;
  const monthlyTokensCapacity =
    gpu.estimatedTokensPerSec * secondsPerMonth * utilizationRate;

  const apiResult = calculateSingleModelCost(targetModel, params);
  const apiCostEquivalentUSD = apiResult.totalMonthlyCostUSD;

  const isGpuCheaper = monthlyGpuCostUSD < apiCostEquivalentUSD;
  const monthlySavingsUSD = Math.abs(apiCostEquivalentUSD - monthlyGpuCostUSD);

  // Compute how many requests needed to hit breakeven
  const costPerReqApi =
    params.monthlyRequests > 0
      ? apiResult.totalMonthlyCostUSD / params.monthlyRequests
      : 0.001;
  const breakevenRequestsPerMonth =
    costPerReqApi > 0 ? Math.ceil(monthlyGpuCostUSD / costPerReqApi) : 0;

  return {
    gpu,
    monthlyGpuCostUSD,
    monthlyTokensCapacity,
    apiCostEquivalentUSD,
    isGpuCheaper,
    monthlySavingsUSD,
    breakevenRequestsPerMonth,
  };
}

export function formatUSD(val: number, maxDecimals = 2): string {
  if (val === 0) return '$0.00';
  if (val < 0.01) {
    return `$${val.toFixed(4)}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: maxDecimals,
  }).format(val);
}

export function formatNumber(val: number): string {
  if (val >= 1_000_000_000) {
    return `${(val / 1_000_000_000).toFixed(1)}B`;
  }
  if (val >= 1_000_000) {
    return `${(val / 1_000_000).toFixed(1)}M`;
  }
  if (val >= 1_000) {
    return `${(val / 1_000).toFixed(1)}K`;
  }
  return val.toLocaleString('en-US');
}
