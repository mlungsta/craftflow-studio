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

export async function GET(request: Request, context: { params: { generationId: string } }): Promise<Response> {
  try {
    const auth = requireAuth(request.headers);
    const { generationId } = context.params;

    const service = createService();
    const generation = await service.getById(generationId, auth.userId);

    if (!generation) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Generation not found"
          }
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        id: generation.id,
        project_id: generation.projectId,
        request_id: generation.requestId,
        status: generation.status,
        provider_name: generation.providerName,
        model_name: generation.modelName,
        output_text: generation.outputText,
        error_code: generation.errorCode,
        error_message: generation.errorMessage,
        created_at: generation.createdAt,
        updated_at: generation.updatedAt
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    const isUnauthorized = message === "UNAUTHORIZED";

    return NextResponse.json(
      {
        error: {
          code: isUnauthorized ? "UNAUTHORIZED" : "BAD_REQUEST",
          message
        }
      },
      { status: isUnauthorized ? 401 : 400 }
    );
  }
}
