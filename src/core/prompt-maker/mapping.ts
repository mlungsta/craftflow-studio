import type { BlueprintQuestionnaire, DigitalProductQuestionnaire } from "@/core/prompt-maker/schemas";

function joinList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

export function buildBlueprintPromptInput(questionnaire: BlueprintQuestionnaire, toolTarget: "chatgpt" | "claude" | "gemini"): {
  prompt: string;
  context: Record<string, unknown>;
} {
  const prompt = [
    `Generate a Business Blueprint optimized for ${toolTarget}.`,
    `Niche: ${questionnaire.business.niche}`,
    `Offer Type: ${questionnaire.business.offer_type}`,
    `Monetization Model: ${questionnaire.business.monetization_model}`,
    `Target Audience: ${questionnaire.audience.target_audience}`,
    `Primary Pain Points:\n${joinList(questionnaire.audience.primary_pain_points)}`,
    `Desired Outcomes:\n${joinList(questionnaire.audience.desired_outcomes)}`,
    `Unique Value Proposition: ${questionnaire.positioning.unique_value_proposition}`,
    `Brand Tone: ${questionnaire.positioning.brand_tone}`,
    `Pricing Hint: ${questionnaire.positioning.pricing_hint}`,
    `Launch Window (days): ${questionnaire.execution.launch_window_days}`,
    `Channels:\n${joinList(questionnaire.execution.channels)}`,
    `Constraints:\n${joinList(questionnaire.execution.constraints)}`,
    "Return: strategy summary, offer architecture, go-to-market plan, launch timeline, and risk controls."
  ].join("\n\n");

  return {
    prompt,
    context: {
      tool_target: toolTarget,
      flow: "business_blueprint",
      ...questionnaire
    }
  };
}

export function buildDigitalProductPromptInput(questionnaire: DigitalProductQuestionnaire, toolTarget: "chatgpt" | "claude" | "gemini"): {
  prompt: string;
  context: Record<string, unknown>;
} {
  const prompt = [
    `Generate a Digital Product build prompt optimized for ${toolTarget}.`,
    `Product Type: ${questionnaire.core.product_type}`,
    `Topic: ${questionnaire.core.product_topic}`,
    `Transformation Goal: ${questionnaire.core.transformation_goal}`,
    `Format: ${questionnaire.specs.format}`,
    `Depth Level: ${questionnaire.specs.depth_level}`,
    `Estimated Length: ${questionnaire.specs.estimated_length}`,
    `Target Audience: ${questionnaire.audience.target_audience}`,
    `Pain Points:\n${joinList(questionnaire.audience.pain_points)}`,
    `Objections:\n${joinList(questionnaire.audience.objections)}`,
    `Deliverables:\n${joinList(questionnaire.outcomes.deliverables)}`,
    `Call to Action: ${questionnaire.outcomes.call_to_action}`,
    `Compliance Notes:\n${joinList(questionnaire.outcomes.compliance_notes)}`,
    "Return: product structure, content blocks, packaging guidance, and conversion-focused copy directions."
  ].join("\n\n");

  return {
    prompt,
    context: {
      tool_target: toolTarget,
      flow: "digital_product",
      ...questionnaire
    }
  };
}
