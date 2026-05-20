import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { getEnv } from "@/core/config/env";
import { createGenerationService } from "@/core/http/generation-service-factory";
import { requireAuth } from "@/core/security/auth";
import { enforceRateLimit } from "@/core/security/rate-limit";
import { createWebsiteGenerationSchema } from "@/types/api";

export async function POST(request: Request): Promise<Response> {
  try {
    const auth = requireAuth(request.headers);
    const env = getEnv();
    const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
    enforceRateLimit(`user:${auth.userId}`, env.RATE_LIMIT_REQUESTS_PER_MINUTE);
    enforceRateLimit(`ip:${ip}`, env.RATE_LIMIT_REQUESTS_PER_MINUTE);

    const payload = createWebsiteGenerationSchema.parse(await request.json());
    const prompt = `Build website package for ${payload.store_name} targeting ${payload.audience} with ${payload.color_theme}`;
    const context = {
      product_type: payload.product_type,
      audience: payload.audience,
      color_theme: payload.color_theme,
      store_name: payload.store_name,
      has_shopify_account: payload.has_shopify_account ?? false
    };

    const service = createGenerationService();
    const accepted = await service.submit({
      requestType: "website_maker",
      projectId: payload.project_id,
      userId: auth.userId,
      prompt,
      inputContext: context,
      idempotencyKey: payload.idempotency_key
    });

    void service.process({
      requestType: "website_maker",
      generationId: accepted.generationId,
      requestId: accepted.requestId,
      projectId: payload.project_id,
      userId: auth.userId,
      prompt,
      inputContext: context,
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
