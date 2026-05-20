export type GenerationTaskType =
  | "ebook"
  | "template"
  | "prompt_pack"
  | "landing_copy"
  | "custom";

export interface GenerationRequestInput {
  projectId: string;
  userId: string;
  taskType: GenerationTaskType;
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
