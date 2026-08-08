import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Mirrors the "@/*" path alias in tsconfig.json.
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  test: {
    // Default is node; component tests opt into jsdom via a file docblock.
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "tests/**/*.test.ts"],
  },
});
