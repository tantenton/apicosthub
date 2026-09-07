import { NextResponse } from 'next/server';
import { AI_MODELS, GPU_INSTANCES } from '@/data/models';

export async function GET() {
  const payload = {
    schema_version: '2026.03',
    generated_at: new Date().toISOString(),
    currency: 'USD',
    models: AI_MODELS.map((m) => ({
      id: m.id,
      name: m.name,
      provider: m.provider,
      pricing: {
        input_per_million: m.inputPricePerMillion,
        output_per_million: m.outputPricePerMillion,
        cached_input_per_million: m.cachedInputPricePerMillion ?? null,
        batch_discount_percentage: m.batchDiscountPercentage ?? 0,
      },
      specs: {
        context_window_tokens: m.contextWindow,
        max_output_tokens: m.maxOutput,
        typical_speed_tokens_sec: m.typicalSpeedTokensPerSec,
        is_open_weights: m.isOpenWeights ?? false,
      },
    })),
    gpu_instances: GPU_INSTANCES.map((g) => ({
      id: g.id,
      name: g.name,
      provider: g.provider,
      hourly_rate_usd: g.hourlyCost,
      monthly_cost_usd: g.monthlyCostWithOverhead,
      vram_gb: g.vramGb,
      estimated_tokens_sec: g.estimatedTokensPerSec,
    })),
  };

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
