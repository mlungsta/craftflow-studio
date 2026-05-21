import type { GenerationRequestType } from "@/core/domain/generation";

export function pickModelForRequest(requestType: GenerationRequestType): string {
  if (requestType === "website_maker") {
    return process.env.OPENAI_MODEL ?? "gpt-5.2";
  }
  return process.env.OPENAI_MODEL ?? "gpt-5.2";
}
