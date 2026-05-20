import { z } from "zod";

export const createGenerationSchema = z.object({
  project_id: z.string().uuid(),
  task_type: z.enum(["ebook", "template", "prompt_pack", "landing_copy", "custom"]),
  prompt: z.string().min(5).max(20000),
  input_context: z.record(z.unknown()).optional(),
  idempotency_key: z.string().min(8).max(128).optional()
});

export type CreateGenerationPayload = z.infer<typeof createGenerationSchema>;
