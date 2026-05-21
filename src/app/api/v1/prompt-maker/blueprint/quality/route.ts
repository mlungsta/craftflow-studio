import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { compileBlueprintPrompt } from "@/core/prompt-maker/compiler";
import { scorePromptSections } from "@/core/prompt-maker/quality";
import { createBlueprintPromptSchema } from "@/types/api";

export async function POST(request: Request): Promise<Response> {
  try {
    const payload = createBlueprintPromptSchema.parse(await request.json());
    const compiled = compileBlueprintPrompt(payload.questionnaire, payload.tool_target);
    const quality = scorePromptSections(compiled.sections);

    return NextResponse.json({ flow: compiled.flow, score: quality.score, weak_sections: quality.weakSections, checks: quality.checks }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: { code: "BAD_REQUEST", message } }, { status: error instanceof ZodError ? 422 : 400 });
  }
}
