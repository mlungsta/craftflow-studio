import type { GenerationRequestInput, NormalizedGenerationResult } from "@/core/domain/generation";

export interface LlmProvider {
  generate(input: GenerationRequestInput): Promise<NormalizedGenerationResult>;
}
