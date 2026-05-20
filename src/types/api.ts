import { z } from "zod";

export const createBlueprintPromptSchema = z.object({
  project_id: z.string().uuid(),
  tool_target: z.enum(["chatgpt", "claude", "gemini"]),
  questionnaire: z.record(z.unknown()),
  idempotency_key: z.string().min(8).max(128).optional()
});

export const createDigitalProductPromptSchema = z.object({
  project_id: z.string().uuid(),
  tool_target: z.enum(["chatgpt", "claude", "gemini"]),
  questionnaire: z.record(z.unknown()),
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
