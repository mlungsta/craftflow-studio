export function estimateCostUsd(inputTokens: number, outputTokens: number): number {
  const inputCostPer1k = 0.005;
  const outputCostPer1k = 0.015;
  return Number((((inputTokens / 1000) * inputCostPer1k) + ((outputTokens / 1000) * outputCostPer1k)).toFixed(6));
}
