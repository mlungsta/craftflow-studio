import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { compileDigitalProductPrompt } from "@/core/prompt-maker/compiler";
import { scorePromptSections } from "@/core/prompt-maker/quality";
import { createDigitalProductPromptSchema } from "@/types/api";

export async function POST(request: Request): Promise<Response> {
  try {
    const payload = createDigitalProductPromptSchema.parse(await request.json());
    const compiled = compileDigitalProductPrompt(payload.questionnaire, payload.tool_target);
    const quality = scorePromptSections(compiled.sections);

    return NextResponse.json({ flow: compiled.flow, score: quality.score, weak_sections: quality.weakSections, checks: quality.checks }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: { code: "BAD_REQUEST", message } }, { status: error instanceof ZodError ? 422 : 400 });
  }
}
