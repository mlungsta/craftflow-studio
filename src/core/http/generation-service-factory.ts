import { PostgresGenerationRepository, PostgresUsageRepository } from "@/core/repositories/postgres";
import { createProvider } from "@/core/providers/factory";
import { GenerationService } from "@/core/services/generation-service";

export function createGenerationService(): GenerationService {
  return new GenerationService({
    provider: createProvider(process.env.LLM_PROVIDER ?? "openai"),
    generationRepository: new PostgresGenerationRepository(),
    usageRepository: new PostgresUsageRepository()
  });
}
