/**
 * Reads the guides off disk. Server-only: it opens the filesystem, so nothing
 * rendered in the browser may import it. The shape it returns lives in
 * `doc-model.ts`, which is safe to import from anywhere.
 */
import fs from "node:fs";
import path from "node:path";
import type { Doc, DocData } from "@/lib/doc-model";

const docsDir = path.join(process.cwd(), "src/data/docs");

/**
 * Every .json file in src/data/docs, most recently updated first, read fresh so
 * adding a file is picked up by a refresh in dev. Like the apps loader this only
 * runs at build time — every route is prerendered — so there is nothing to cache.
 */
export function getDocs(): Doc[] {
  return fs
    .readdirSync(docsDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const slug = path.basename(file, ".json");
      const raw = fs.readFileSync(path.join(docsDir, file), "utf8");

      try {
        return { slug, ...(JSON.parse(raw) as DocData) };
      } catch (error) {
        throw new Error(
          `src/data/docs/${file} is not valid JSON: ${(error as Error).message}`,
        );
      }
    })
    .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
}

export function getDoc(slug: string): Doc | undefined {
  return getDocs().find((doc) => doc.slug === slug);
}
