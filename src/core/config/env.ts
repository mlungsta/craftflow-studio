import { z } from "zod";

const envSchema = z.object({
  JWT_SECRET: z.string().min(1),
  LLM_PROVIDER: z.enum(["openai"]),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  RATE_LIMIT_REQUESTS_PER_MINUTE: z.coerce.number().int().positive(),
  MAX_PROMPT_CHARS: z.coerce.number().int().positive()
});

export type AppEnv = z.infer<typeof envSchema>;

export function getEnv(): AppEnv {
  return envSchema.parse(process.env);
}
