import { compileBlueprintPrompt, compileDigitalProductPrompt, type ToolTarget } from "@/core/prompt-maker/compiler";
import type { BlueprintQuestionnaire, DigitalProductQuestionnaire } from "@/core/prompt-maker/schemas";

export function buildBlueprintPromptInput(questionnaire: BlueprintQuestionnaire, toolTarget: ToolTarget): {
  prompt: string;
  context: Record<string, unknown>;
} {
  const compiled = compileBlueprintPrompt(questionnaire, toolTarget);

  return {
    prompt: compiled.prompt,
    context: {
      flow: compiled.flow,
      tool_target: compiled.toolTarget,
      sections: compiled.sections,
      questionnaire
    }
  };
}

export function buildDigitalProductPromptInput(questionnaire: DigitalProductQuestionnaire, toolTarget: ToolTarget): {
  prompt: string;
  context: Record<string, unknown>;
} {
  const compiled = compileDigitalProductPrompt(questionnaire, toolTarget);

  return {
    prompt: compiled.prompt,
    context: {
      flow: compiled.flow,
      tool_target: compiled.toolTarget,
      sections: compiled.sections,
      questionnaire
    }
  };
}
