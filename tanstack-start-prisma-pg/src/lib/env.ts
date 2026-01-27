import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const getEnv = () => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      JSON.stringify(parsed.error.format(), null, 4),
    );
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
};

export const env = getEnv();
