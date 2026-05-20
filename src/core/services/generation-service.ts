import { getEnv } from "@/core/config/env";
import type { GenerationRecord, GenerationRequestType } from "@/core/domain/generation";
import { estimateCostUsd } from "@/core/observability/cost";
import { logError, logInfo } from "@/core/observability/logger";
import type { LlmProvider } from "@/core/providers/types";
import type { GenerationRepository, UsageRepository } from "@/core/repositories/types";
import { moderatePrompt } from "@/core/security/moderation";

interface RunGenerationInput {
  requestType: GenerationRequestType;
  projectId: string;
  userId: string;
  prompt: string;
  inputContext?: Record<string, unknown>;
  idempotencyKey?: string;
}

interface RunGenerationDeps {
  provider: LlmProvider;
  generationRepository: GenerationRepository;
  usageRepository: UsageRepository;
}

export class GenerationService {
  public constructor(private readonly deps: RunGenerationDeps) {}

  public async submit(input: RunGenerationInput): Promise<{ generationId: string; requestId: string; status: "queued" }> {
    const env = getEnv();
    if (input.prompt.length > env.MAX_PROMPT_CHARS) throw new Error("PROMPT_TOO_LARGE");

    const moderation = moderatePrompt(input.prompt);
    if (moderation.status === "blocked") throw new Error(moderation.reason ?? "MODERATION_BLOCKED");

    const request = await this.deps.generationRepository.createRequest(input);
    const seed = await this.deps.generationRepository.createGenerationSeed({
      requestType: input.requestType,
      requestId: request.requestId,
      projectId: input.projectId,
      userId: input.userId,
      providerName: env.LLM_PROVIDER,
      modelName: env.OPENAI_MODEL
    });

    return { generationId: seed.generationId, requestId: request.requestId, status: "queued" };
  }

  public async process(input: RunGenerationInput & { generationId: string; requestId: string }): Promise<void> {
    const env = getEnv();
    await this.deps.generationRepository.markProcessing(input.generationId);

    try {
      const result = await this.deps.provider.generate({
        requestType: input.requestType,
        projectId: input.projectId,
        userId: input.userId,
        prompt: input.prompt,
        inputContext: input.inputContext,
        idempotencyKey: input.idempotencyKey
      });

      const completed = await this.deps.generationRepository.markCompleted({ generationId: input.generationId, result });

      await this.deps.usageRepository.logUsage({
        generationId: completed.id,
        requestType: input.requestType,
        requestId: input.requestId,
        userId: input.userId,
        providerName: result.providerName,
        modelName: result.modelName,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        totalTokens: result.totalTokens,
        costUsd: estimateCostUsd(result.inputTokens, result.outputTokens),
        latencyMs: result.latencyMs,
        success: true
      });

      logInfo("Generation completed", { generationId: completed.id, userId: input.userId, requestType: input.requestType });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Generation failed";
      await this.deps.generationRepository.markFailed({
        generationId: input.generationId,
        providerName: env.LLM_PROVIDER,
        modelName: env.OPENAI_MODEL,
        errorCode: "GENERATION_FAILED",
        errorMessage: message
      });

      await this.deps.usageRepository.logUsage({
        generationId: input.generationId,
        requestType: input.requestType,
        requestId: input.requestId,
        userId: input.userId,
        providerName: env.LLM_PROVIDER,
        modelName: env.OPENAI_MODEL,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        costUsd: 0,
        latencyMs: 0,
        success: false
      });

      logError("Generation failed", { generationId: input.generationId, error: message, requestType: input.requestType });
    }
  }

  public async getById(generationId: string, userId: string): Promise<GenerationRecord | null> {
    return this.deps.generationRepository.getById(generationId, userId);
  }
}
