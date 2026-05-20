import { randomUUID } from "node:crypto";
import type { GenerationRecord, NormalizedGenerationResult } from "@/core/domain/generation";
import type { GenerationRepository, UsageRepository } from "@/core/repositories/types";

const generationStore = new Map<string, GenerationRecord>();

export class InMemoryGenerationRepository implements GenerationRepository {
  public async createRequest(_input: import("@/core/domain/generation").GenerationRequestInput): Promise<{ requestId: string }> {
    return { requestId: randomUUID() };
  }

  public async createGenerationSeed(input: {
    requestId: string;
    projectId: string;
    userId: string;
    providerName: string;
    modelName: string;
  }): Promise<{ generationId: string }> {
    const generationId = randomUUID();
    const now = new Date().toISOString();

    generationStore.set(generationId, {
      id: generationId,
      requestId: input.requestId,
      projectId: input.projectId,
      userId: input.userId,
      status: "queued",
      providerName: input.providerName,
      modelName: input.modelName,
      createdAt: now,
      updatedAt: now
    });

    return { generationId };
  }

  public async markProcessing(generationId: string): Promise<void> {
    const existing = generationStore.get(generationId);
    if (!existing) return;
    generationStore.set(generationId, { ...existing, status: "processing", updatedAt: new Date().toISOString() });
  }

  public async markCompleted(input: { generationId: string; result: NormalizedGenerationResult }): Promise<GenerationRecord> {
    const existing = generationStore.get(input.generationId);
    if (!existing) throw new Error("Generation record not found");

    const updated: GenerationRecord = {
      ...existing,
      status: "completed",
      outputText: input.result.outputText,
      providerName: input.result.providerName,
      modelName: input.result.modelName,
      updatedAt: new Date().toISOString()
    };

    generationStore.set(input.generationId, updated);
    return updated;
  }

  public async markFailed(input: {
    generationId: string;
    providerName: string;
    modelName: string;
    errorCode: string;
    errorMessage: string;
  }): Promise<void> {
    const existing = generationStore.get(input.generationId);
    if (!existing) return;

    generationStore.set(input.generationId, {
      ...existing,
      status: "failed",
      providerName: input.providerName,
      modelName: input.modelName,
      errorCode: input.errorCode,
      errorMessage: input.errorMessage,
      updatedAt: new Date().toISOString()
    });
  }

  public async getById(generationId: string, userId: string): Promise<GenerationRecord | null> {
    const rec = generationStore.get(generationId);
    if (!rec || rec.userId !== userId) return null;
    return rec;
  }
}

export class InMemoryUsageRepository implements UsageRepository {
  public async logUsage(): Promise<void> {
    return;
  }
}
