import { NextResponse } from "next/server";
import { createProvider } from "@/core/providers/factory";
import { PostgresGenerationRepository, PostgresUsageRepository } from "@/core/repositories/postgres";
import { GenerationService } from "@/core/services/generation-service";
import { requireAuth } from "@/core/security/auth";

function createService(): GenerationService {
  const provider = createProvider(process.env.LLM_PROVIDER ?? "openai");
  return new GenerationService({
    provider,
    generationRepository: new PostgresGenerationRepository(),
    usageRepository: new PostgresUsageRepository()
  });
}

export async function GET(request: Request, context: { params: Promise<{ projectId: string }> }): Promise<Response> {
  try {
    const auth = requireAuth(request.headers);
    const { projectId } = await context.params;

    const service = createService();
    const data = await service.listByProject(projectId, auth.userId);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    const isUnauthorized = message === "UNAUTHORIZED";
    return NextResponse.json({ error: { code: isUnauthorized ? "UNAUTHORIZED" : "BAD_REQUEST", message } }, { status: isUnauthorized ? 401 : 400 });
  }
}
