import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(4000),
  APP_ORIGIN: z.string().url().default("http://localhost:5173"),
  JWT_SECRET: z.string().min(24),
  ADMIN_SESSION_MINUTES: z.coerce.number().int().positive().default(60),
  MEDIA_STORAGE_PATH: z.string().default("./uploads")
});

export type AppEnv = z.infer<typeof envSchema>;
