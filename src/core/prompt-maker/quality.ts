import type { CompiledPromptSection } from "@/core/prompt-maker/compiler";

export interface QualityReport {
  score: number;
  weakSections: string[];
  checks: {
    sectionCount: boolean;
    constraintsCoverage: boolean;
    objectiveClarity: boolean;
    inputSpecificity: boolean;
  };
}

function hasSpecificInputs(section: CompiledPromptSection): boolean {
  return Object.keys(section.inputSnapshot).length >= 3;
}

export function scorePromptSections(sections: CompiledPromptSection[]): QualityReport {
  const checks = {
    sectionCount: sections.length >= 3,
    constraintsCoverage: sections.every((s) => s.constraints.length >= 1),
    objectiveClarity: sections.every((s) => s.objective.length >= 20),
    inputSpecificity: sections.every((s) => hasSpecificInputs(s))
  };

  const passed = Object.values(checks).filter(Boolean).length;
  const score = Math.round((passed / 4) * 100);

  const weakSections = sections
    .filter((s) => s.constraints.length === 0 || s.objective.length < 20 || !hasSpecificInputs(s))
    .map((s) => s.id);

  return { score, weakSections, checks };
}

export function buildSectionRegenerationPrompt(input: {
  flow: "business_blueprint" | "digital_product";
  section: CompiledPromptSection;
  toolTarget: "chatgpt" | "claude" | "gemini";
}): string {
  return [
    `Regenerate section '${input.section.title}' for flow ${input.flow}.`,
    `Target model format: ${input.toolTarget}.`,
    `Objective: ${input.section.objective}`,
    `Constraints:\n${input.section.constraints.map((c) => `- ${c}`).join("\n")}`,
    `Input Snapshot: ${JSON.stringify(input.section.inputSnapshot, null, 2)}`,
    "Return only the regenerated section content in markdown."
  ].join("\n\n");
}
