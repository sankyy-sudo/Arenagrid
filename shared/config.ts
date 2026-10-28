import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().regex(/^postgres(ql)?:\/\//, "DATABASE_URL must be a PostgreSQL connection URL"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  APP_ORIGIN: z.string().url().default("http://localhost:5173"),
  JWT_SECRET: z.string().min(24).refine((secret) => !secret.startsWith("replace-"), "Replace the example JWT_SECRET with a random secret"),
  ADMIN_SESSION_MINUTES: z.coerce.number().int().positive().default(60),
  MEDIA_STORAGE_PATH: z.string().default("./uploads"),
  MEDIA_MAX_FILE_MB: z.coerce.number().int().positive().default(10),
  TRUST_PROXY_HOPS: z.coerce.number().int().nonnegative().default(0)
});

export type AppEnv = z.infer<typeof envSchema>;
