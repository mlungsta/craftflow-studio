import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { getEnv } from "@/core/config/env";
import { createGenerationService } from "@/core/http/generation-service-factory";
import { buildDigitalProductPromptInput } from "@/core/prompt-maker/mapping";
import { requireAuth } from "@/core/security/auth";
import { enforceRateLimit } from "@/core/security/rate-limit";
import { createDigitalProductPromptSchema } from "@/types/api";

export async function POST(request: Request): Promise<Response> {
  try {
    const auth = requireAuth(request.headers);
    const env = getEnv();
    const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
    enforceRateLimit(`user:${auth.userId}`, env.RATE_LIMIT_REQUESTS_PER_MINUTE);
    enforceRateLimit(`ip:${ip}`, env.RATE_LIMIT_REQUESTS_PER_MINUTE);

    const payload = createDigitalProductPromptSchema.parse(await request.json());
    const compiled = buildDigitalProductPromptInput(payload.questionnaire, payload.tool_target);

    const service = createGenerationService();
    const accepted = await service.submit({
      requestType: "prompt_product",
      projectId: payload.project_id,
      userId: auth.userId,
      prompt: compiled.prompt,
      inputContext: compiled.context,
      idempotencyKey: payload.idempotency_key
    });

    void service.process({
      requestType: "prompt_product",
      generationId: accepted.generationId,
      requestId: accepted.requestId,
      projectId: payload.project_id,
      userId: auth.userId,
      prompt: compiled.prompt,
      inputContext: compiled.context,
      idempotencyKey: payload.idempotency_key
    });

    return NextResponse.json({ generation_id: accepted.generationId, status: accepted.status }, { status: 202 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    const isUnauthorized = message === "UNAUTHORIZED";
    const isRateLimited = message === "RATE_LIMIT_EXCEEDED";
    return NextResponse.json(
      { error: { code: isUnauthorized ? "UNAUTHORIZED" : isRateLimited ? "RATE_LIMITED" : "BAD_REQUEST", message } },
      { status: isUnauthorized ? 401 : isRateLimited ? 429 : error instanceof ZodError ? 422 : 400 }
    );
  }
}
