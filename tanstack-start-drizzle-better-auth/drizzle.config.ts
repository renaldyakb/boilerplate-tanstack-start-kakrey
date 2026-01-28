import { type Config, defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config);
