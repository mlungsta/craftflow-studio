import { z, ZodError } from "zod";
import { NextResponse } from "next/server";
import { compileBlueprintPrompt } from "@/core/prompt-maker/compiler";
import { buildSectionRegenerationPrompt } from "@/core/prompt-maker/quality";
import { createBlueprintPromptSchema } from "@/types/api";

const regenSchema = z.object({
  payload: createBlueprintPromptSchema,
  section_id: z.string().min(2)
});

export async function POST(request: Request): Promise<Response> {
  try {
    const body = regenSchema.parse(await request.json());
    const compiled = compileBlueprintPrompt(body.payload.questionnaire, body.payload.tool_target);
    const section = compiled.sections.find((s) => s.id === body.section_id);
    if (!section) {
      return NextResponse.json({ error: { code: "NOT_FOUND", message: "Section not found" } }, { status: 404 });
    }

    const prompt = buildSectionRegenerationPrompt({ flow: compiled.flow, section, toolTarget: body.payload.tool_target });
    return NextResponse.json({ section_id: section.id, title: section.title, regeneration_prompt: prompt }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: { code: "BAD_REQUEST", message } }, { status: error instanceof ZodError ? 422 : 400 });
  }
}
