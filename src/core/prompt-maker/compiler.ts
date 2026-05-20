import type { BlueprintQuestionnaire, DigitalProductQuestionnaire } from "@/core/prompt-maker/schemas";
import { applyToolTargetAdapter } from "@/core/prompt-maker/adapters";

export type ToolTarget = "chatgpt" | "claude" | "gemini";

export interface CompiledPromptSection {
  id: string;
  title: string;
  objective: string;
  constraints: string[];
  inputSnapshot: Record<string, unknown>;
}

export interface CompiledPromptOutput {
  flow: "business_blueprint" | "digital_product";
  toolTarget: ToolTarget;
  prompt: string;
  sections: CompiledPromptSection[];
}

function formatList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

function renderSection(section: CompiledPromptSection): string {
  return [
    `## ${section.title}`,
    `Objective: ${section.objective}`,
    section.constraints.length ? `Constraints:\n${formatList(section.constraints)}` : "Constraints: none",
    `Input Snapshot: ${JSON.stringify(section.inputSnapshot, null, 2)}`
  ].join("\n\n");
}

function renderGlobalOutputContract(flow: "business_blueprint" | "digital_product", toolTarget: ToolTarget): string {
  return [
    "## Output Contract",
    `Return markdown only. Optimize structure and style for ${toolTarget}.`,
    "Do not omit section headers.",
    flow === "business_blueprint"
      ? "Final output must include: Executive Summary, Offer Architecture, Go-To-Market Plan, 30/60/90 Timeline, Risks and Mitigations."
      : "Final output must include: Product Architecture, Module Breakdown, Content Production Plan, Packaging and Offer Stack, Conversion Copy Assets.",
    "Use clear action-oriented bullets and measurable milestones."
  ].join("\n\n");
}

export function compileBlueprintPrompt(questionnaire: BlueprintQuestionnaire, toolTarget: ToolTarget): CompiledPromptOutput {
  const sections: CompiledPromptSection[] = [
    {
      id: "market-positioning",
      title: "Market Positioning",
      objective: "Define a winning market position and commercial angle.",
      constraints: [
        "Differentiate from generic AI content services.",
        "Focus on monetizable and executable strategy."
      ],
      inputSnapshot: {
        niche: questionnaire.business.niche,
        offer_type: questionnaire.business.offer_type,
        monetization_model: questionnaire.business.monetization_model,
        uvp: questionnaire.positioning.unique_value_proposition,
        pricing_hint: questionnaire.positioning.pricing_hint
      }
    },
    {
      id: "audience-strategy",
      title: "Audience Strategy",
      objective: "Translate audience pains into message strategy and outcomes.",
      constraints: ["Map pain points directly to outcomes and promises.", "Avoid vague positioning language."],
      inputSnapshot: {
        target_audience: questionnaire.audience.target_audience,
        primary_pain_points: questionnaire.audience.primary_pain_points,
        desired_outcomes: questionnaire.audience.desired_outcomes,
        brand_tone: questionnaire.positioning.brand_tone
      }
    },
    {
      id: "execution-plan",
      title: "Execution Plan",
      objective: "Produce a practical launch and channel plan with risk controls.",
      constraints: ["Respect launch window and constraints.", "Provide phased execution sequence."],
      inputSnapshot: {
        launch_window_days: questionnaire.execution.launch_window_days,
        channels: questionnaire.execution.channels,
        constraints: questionnaire.execution.constraints
      }
    }
  ];

  const baseCompiled: CompiledPromptOutput = {
    flow: "business_blueprint",
    toolTarget,
    prompt: [
      `# Business Blueprint Compiler Prompt (${toolTarget})`,
      ...sections.map(renderSection),
      renderGlobalOutputContract("business_blueprint", toolTarget)
    ].join("\n\n---\n\n"),
    sections
  };

  return applyToolTargetAdapter(baseCompiled);
}

export function compileDigitalProductPrompt(questionnaire: DigitalProductQuestionnaire, toolTarget: ToolTarget): CompiledPromptOutput {
  const sections: CompiledPromptSection[] = [
    {
      id: "product-architecture",
      title: "Product Architecture",
      objective: "Define product structure, learning path, and transformation outcome.",
      constraints: ["Align depth and format with target audience.", "Make deliverables implementation-ready."],
      inputSnapshot: {
        product_type: questionnaire.core.product_type,
        product_topic: questionnaire.core.product_topic,
        transformation_goal: questionnaire.core.transformation_goal,
        format: questionnaire.specs.format,
        depth_level: questionnaire.specs.depth_level,
        estimated_length: questionnaire.specs.estimated_length
      }
    },
    {
      id: "audience-objections",
      title: "Audience and Objections",
      objective: "Pre-handle objections and map pain points to content strategy.",
      constraints: ["Include objection-handling guidance.", "Keep messaging conversion-oriented."],
      inputSnapshot: {
        target_audience: questionnaire.audience.target_audience,
        pain_points: questionnaire.audience.pain_points,
        objections: questionnaire.audience.objections
      }
    },
    {
      id: "offer-packaging",
      title: "Offer Packaging",
      objective: "Package deliverables with strong CTA and compliance-aware messaging.",
      constraints: ["Include CTA placement recommendations.", "Respect compliance notes."],
      inputSnapshot: {
        deliverables: questionnaire.outcomes.deliverables,
        call_to_action: questionnaire.outcomes.call_to_action,
        compliance_notes: questionnaire.outcomes.compliance_notes
      }
    }
  ];

  const baseCompiled: CompiledPromptOutput = {
    flow: "digital_product",
    toolTarget,
    prompt: [
      `# Digital Product Compiler Prompt (${toolTarget})`,
      ...sections.map(renderSection),
      renderGlobalOutputContract("digital_product", toolTarget)
    ].join("\n\n---\n\n"),
    sections
  };

  return applyToolTargetAdapter(baseCompiled);
}
