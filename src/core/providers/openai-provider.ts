import type { GenerationRequestInput, NormalizedGenerationResult } from "@/core/domain/generation";
import type { LlmProvider } from "@/core/providers/types";

export class OpenAiProvider implements LlmProvider {
  public async generate(input: GenerationRequestInput): Promise<NormalizedGenerationResult> {
    const promptPreview = input.prompt.slice(0, 200);

    return {
      outputText: `Stub output for task '${input.taskType}': ${promptPreview}`,
      inputTokens: Math.ceil(input.prompt.length / 4),
      outputTokens: 120,
      totalTokens: Math.ceil(input.prompt.length / 4) + 120,
      latencyMs: 250,
      providerName: "openai",
      modelName: process.env.OPENAI_MODEL ?? "gpt-5.2",
      finishReason: "stop"
    };
  }
}
