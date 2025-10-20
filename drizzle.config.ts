import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./src/server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
