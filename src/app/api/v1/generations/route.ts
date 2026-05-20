import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { getEnv } from "@/core/config/env";
import { createProvider } from "@/core/providers/factory";
import { PostgresGenerationRepository, PostgresUsageRepository } from "@/core/repositories/postgres";
import { GenerationService } from "@/core/services/generation-service";
import { requireAuth } from "@/core/security/auth";
import { enforceRateLimit } from "@/core/security/rate-limit";
import { createGenerationSchema } from "@/types/api";

function createService(): GenerationService {
  const provider = createProvider(process.env.LLM_PROVIDER ?? "openai");
  return new GenerationService({
    provider,
    generationRepository: new PostgresGenerationRepository(),
    usageRepository: new PostgresUsageRepository()
  });
}

export async function POST(request: Request): Promise<Response> {
  try {
    const auth = requireAuth(request.headers);
    const env = getEnv();

    const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
    enforceRateLimit(`user:${auth.userId}`, env.RATE_LIMIT_REQUESTS_PER_MINUTE);
    enforceRateLimit(`ip:${ip}`, env.RATE_LIMIT_REQUESTS_PER_MINUTE);

    const rawBody = await request.json();
    const payload = createGenerationSchema.parse(rawBody);

    const service = createService();
    const accepted = await service.submit({
      projectId: payload.project_id,
      userId: auth.userId,
      taskType: payload.task_type,
      prompt: payload.prompt,
      inputContext: payload.input_context,
      idempotencyKey: payload.idempotency_key
    });

    void service.process({
      generationId: accepted.generationId,
      requestId: accepted.requestId,
      projectId: payload.project_id,
      userId: auth.userId,
      taskType: payload.task_type,
      prompt: payload.prompt,
      inputContext: payload.input_context,
      idempotencyKey: payload.idempotency_key
    });

    return NextResponse.json(
      {
        generation_id: accepted.generationId,
        status: accepted.status
      },
      { status: 202 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    const isUnauthorized = message === "UNAUTHORIZED";
    const isRateLimited = message === "RATE_LIMIT_EXCEEDED";
    const isValidationError = error instanceof ZodError || message.includes("PROMPT") || message.includes("Blocked term");

    return NextResponse.json(
      {
        error: {
          code: isUnauthorized ? "UNAUTHORIZED" : isRateLimited ? "RATE_LIMITED" : "BAD_REQUEST",
          message
        }
      },
      { status: isUnauthorized ? 401 : isRateLimited ? 429 : isValidationError ? 422 : 400 }
    );
  }
}
