import { randomUUID } from "node:crypto";
import type { GenerationRecord, GenerationRequestInput, NormalizedGenerationResult } from "@/core/domain/generation";
import { getDbPool } from "@/core/repositories/db";
import type { GenerationRepository, UsageRepository } from "@/core/repositories/types";

function mapGenerationRow(row: Record<string, unknown>): GenerationRecord {
  return {
    id: String(row.id),
    requestType: String(row.request_type) as GenerationRecord["requestType"],
    requestId: String(row.request_id),
    projectId: String(row.project_id),
    userId: String(row.user_id),
    status: row.status as GenerationRecord["status"],
    providerName: String(row.provider_name),
    modelName: String(row.model_name),
    outputText: row.output_text ? String(row.output_text) : undefined,
    errorCode: row.error_code ? String(row.error_code) : undefined,
    errorMessage: row.error_message ? String(row.error_message) : undefined,
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString()
  };
}

export class PostgresGenerationRepository implements GenerationRepository {
  public async createRequest(input: GenerationRequestInput): Promise<{ requestId: string }> {
    const pool = getDbPool();
    const requestId = randomUUID();

    if (input.requestType === "prompt_blueprint") {
      await pool.query(
        `INSERT INTO prompt_blueprint_requests
          (id, project_id, user_id, tool_target, questionnaire, idempotency_key, moderation_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [requestId, input.projectId, input.userId, "chatgpt", JSON.stringify(input.inputContext ?? {}), input.idempotencyKey ?? null, "approved"]
      );
    } else if (input.requestType === "prompt_product") {
      await pool.query(
        `INSERT INTO prompt_product_requests
          (id, project_id, user_id, tool_target, questionnaire, idempotency_key, moderation_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [requestId, input.projectId, input.userId, "chatgpt", JSON.stringify(input.inputContext ?? {}), input.idempotencyKey ?? null, "approved"]
      );
    } else {
      await pool.query(
        `INSERT INTO website_generation_requests
          (id, project_id, user_id, product_type, audience, color_theme, store_name, has_shopify_account, idempotency_key, moderation_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          requestId,
          input.projectId,
          input.userId,
          String(input.inputContext?.product_type ?? "digital-product"),
          String(input.inputContext?.audience ?? "general"),
          String(input.inputContext?.color_theme ?? "blue"),
          String(input.inputContext?.store_name ?? "CraftFlow Store"),
          Boolean(input.inputContext?.has_shopify_account ?? false),
          input.idempotencyKey ?? null,
          "approved"
        ]
      );
    }

    return { requestId };
  }

  public async createGenerationSeed(input: {
    requestType: GenerationRecord["requestType"];
    requestId: string;
    projectId: string;
    userId: string;
    providerName: string;
    modelName: string;
  }): Promise<{ generationId: string }> {
    const pool = getDbPool();
    const generationId = randomUUID();

    await pool.query(
      `INSERT INTO generations
        (id, request_type, request_id, project_id, user_id, status, provider_name, model_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [generationId, input.requestType, input.requestId, input.projectId, input.userId, "queued", input.providerName, input.modelName]
    );

    return { generationId };
  }

  public async markProcessing(generationId: string): Promise<void> {
    const pool = getDbPool();
    await pool.query(`UPDATE generations SET status='processing', started_at=NOW(), updated_at=NOW() WHERE id=$1`, [generationId]);
  }

  public async markCompleted(input: { generationId: string; result: NormalizedGenerationResult }): Promise<GenerationRecord> {
    const pool = getDbPool();
    const res = await pool.query(
      `UPDATE generations
       SET status='completed', output_text=$2, provider_name=$3, model_name=$4, completed_at=NOW(), updated_at=NOW()
       WHERE id=$1
       RETURNING id, request_type, request_id, project_id, user_id, status, provider_name, model_name, output_text, error_code, error_message, created_at, updated_at`,
      [input.generationId, input.result.outputText, input.result.providerName, input.result.modelName]
    );
    if (!res.rows[0]) throw new Error("Generation record not found");
    return mapGenerationRow(res.rows[0]);
  }

  public async markFailed(input: {
    generationId: string;
    providerName: string;
    modelName: string;
    errorCode: string;
    errorMessage: string;
  }): Promise<void> {
    const pool = getDbPool();
    await pool.query(
      `UPDATE generations SET status='failed', provider_name=$2, model_name=$3, error_code=$4, error_message=$5, completed_at=NOW(), updated_at=NOW() WHERE id=$1`,
      [input.generationId, input.providerName, input.modelName, input.errorCode, input.errorMessage]
    );
  }

  public async getById(generationId: string, userId: string): Promise<GenerationRecord | null> {
    const pool = getDbPool();
    const res = await pool.query(
      `SELECT id, request_type, request_id, project_id, user_id, status, provider_name, model_name, output_text, error_code, error_message, created_at, updated_at
       FROM generations WHERE id=$1 AND user_id=$2`,
      [generationId, userId]
    );
    return res.rows[0] ? mapGenerationRow(res.rows[0]) : null;
  }

  public async listByProject(projectId: string, userId: string): Promise<GenerationRecord[]> {
    const pool = getDbPool();
    const res = await pool.query(
      `SELECT id, request_type, request_id, project_id, user_id, status, provider_name, model_name, output_text, error_code, error_message, created_at, updated_at
       FROM generations
       WHERE project_id=$1 AND user_id=$2
       ORDER BY created_at DESC`,
      [projectId, userId]
    );
    return res.rows.map((r) => mapGenerationRow(r));
  }
}

export class PostgresUsageRepository implements UsageRepository {
  public async logUsage(input: {
    generationId: string;
    requestType: GenerationRecord["requestType"];
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
  }): Promise<void> {
    const pool = getDbPool();
    await pool.query(
      `INSERT INTO usage_logs
        (id, generation_id, request_type, request_id, user_id, provider_name, model_name, input_tokens, output_tokens, total_tokens, cost_usd, latency_ms, success)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [
        randomUUID(),
        input.generationId,
        input.requestType,
        input.requestId,
        input.userId,
        input.providerName,
        input.modelName,
        input.inputTokens,
        input.outputTokens,
        input.totalTokens,
        input.costUsd,
        input.latencyMs,
        input.success
      ]
    );
  }
}
