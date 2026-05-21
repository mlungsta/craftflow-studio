import type { GenerationRecord, GenerationRequestInput, GenerationRequestType, NormalizedGenerationResult } from "@/core/domain/generation";

export interface GenerationRepository {
  createRequest(input: GenerationRequestInput): Promise<{ requestId: string }>;
  createGenerationSeed(input: {
    requestType: GenerationRequestType;
    requestId: string;
    projectId: string;
    userId: string;
    providerName: string;
    modelName: string;
  }): Promise<{ generationId: string }>;
  markProcessing(generationId: string): Promise<void>;
  markCompleted(input: {
    generationId: string;
    result: NormalizedGenerationResult;
  }): Promise<GenerationRecord>;
  markFailed(input: {
    generationId: string;
    providerName: string;
    modelName: string;
    errorCode: string;
    errorMessage: string;
  }): Promise<void>;
  getById(generationId: string, userId: string): Promise<GenerationRecord | null>;
  listByProject(projectId: string, userId: string): Promise<GenerationRecord[]>;
}

export interface UsageRepository {
  logUsage(input: {
    generationId: string;
    requestType: GenerationRequestType;
    requestId: string;
    userId: string;
    providerName: string;
    modelName: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    costUsd: number;
    latencyMs: number;
    success: boolean;
  }): Promise<void>;
}
