import { OpenAiProvider } from "@/core/providers/openai-provider";
import type { LlmProvider } from "@/core/providers/types";

export function createProvider(providerName: string): LlmProvider {
  if (providerName === "openai") {
    return new OpenAiProvider();
  }

  throw new Error(`Unsupported provider: ${providerName}`);
}
