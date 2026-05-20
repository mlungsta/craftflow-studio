export type GenerationRequestType = "prompt_blueprint" | "prompt_product" | "website_maker";

export interface GenerationRequestInput {
  requestType: GenerationRequestType;
  projectId: string;
  userId: string;
  prompt: string;
  inputContext?: Record<string, unknown>;
  idempotencyKey?: string;
}

export interface NormalizedGenerationResult {
  outputText: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  latencyMs: number;
  providerName: string;
  modelName: string;
  finishReason: string;
}

export interface GenerationRecord {
  id: string;
  requestType: GenerationRequestType;
  requestId: string;
  projectId: string;
  userId: string;
  status: "queued" | "processing" | "completed" | "failed" | "blocked";
  providerName: string;
  modelName: string;
  outputText?: string;
  errorCode?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}
