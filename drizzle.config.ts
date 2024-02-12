import { postgresUrl } from "@/lib/env";
import "dotenv/config";

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: postgresUrl! + "?sslmode=require",
  },
  verbose: true,
  strict: true,
});
