import { z } from "zod";

const toolTargetSchema = z.enum(["chatgpt", "claude", "gemini"]);

const blueprintBusinessStepSchema = z.object({
  niche: z.string().min(2).max(120),
  offer_type: z.string().min(2).max(120),
  monetization_model: z.string().min(2).max(120)
});

const blueprintAudienceStepSchema = z.object({
  target_audience: z.string().min(2).max(180),
  primary_pain_points: z.array(z.string().min(2).max(160)).min(1).max(8),
  desired_outcomes: z.array(z.string().min(2).max(160)).min(1).max(8)
});

const blueprintPositioningStepSchema = z.object({
  unique_value_proposition: z.string().min(10).max(400),
  brand_tone: z.string().min(2).max(100),
  pricing_hint: z.string().min(1).max(80)
});

const blueprintExecutionStepSchema = z.object({
  launch_window_days: z.number().int().min(1).max(365),
  channels: z.array(z.string().min(2).max(80)).min(1).max(6),
  constraints: z.array(z.string().min(2).max(200)).max(10).default([])
});

export const blueprintQuestionnaireSchema = z.object({
  business: blueprintBusinessStepSchema,
  audience: blueprintAudienceStepSchema,
  positioning: blueprintPositioningStepSchema,
  execution: blueprintExecutionStepSchema
});

const productCoreStepSchema = z.object({
  product_type: z.string().min(2).max(120),
  product_topic: z.string().min(2).max(160),
  transformation_goal: z.string().min(10).max(400)
});

const productSpecsStepSchema = z.object({
  format: z.string().min(2).max(80),
  depth_level: z.enum(["starter", "intermediate", "advanced"]),
  estimated_length: z.string().min(2).max(80)
});

const productAudienceStepSchema = z.object({
  target_audience: z.string().min(2).max(180),
  pain_points: z.array(z.string().min(2).max(160)).min(1).max(8),
  objections: z.array(z.string().min(2).max(160)).max(8).default([])
});

const productOutcomeStepSchema = z.object({
  deliverables: z.array(z.string().min(2).max(160)).min(1).max(12),
  call_to_action: z.string().min(4).max(220),
  compliance_notes: z.array(z.string().min(2).max(200)).max(8).default([])
});

export const digitalProductQuestionnaireSchema = z.object({
  core: productCoreStepSchema,
  specs: productSpecsStepSchema,
  audience: productAudienceStepSchema,
  outcomes: productOutcomeStepSchema
});

export const createBlueprintPromptSchema = z.object({
  project_id: z.string().uuid(),
  tool_target: toolTargetSchema,
  questionnaire: blueprintQuestionnaireSchema,
  idempotency_key: z.string().min(8).max(128).optional()
});

export const createDigitalProductPromptSchema = z.object({
  project_id: z.string().uuid(),
  tool_target: toolTargetSchema,
  questionnaire: digitalProductQuestionnaireSchema,
  idempotency_key: z.string().min(8).max(128).optional()
});

export const createWebsiteGenerationSchema = z.object({
  project_id: z.string().uuid(),
  product_type: z.string().min(2).max(100),
  audience: z.string().min(2).max(200),
  color_theme: z.string().min(2).max(100),
  store_name: z.string().min(2).max(160),
  has_shopify_account: z.boolean().optional(),
  idempotency_key: z.string().min(8).max(128).optional()
});

export type BlueprintQuestionnaire = z.infer<typeof blueprintQuestionnaireSchema>;
export type DigitalProductQuestionnaire = z.infer<typeof digitalProductQuestionnaireSchema>;
