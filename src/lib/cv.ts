import fs from "node:fs";
import path from "node:path";
import data from "@/data/cv.json";
import type { Cv } from "@/lib/cv-types";

export type { Cv } from "@/lib/cv-types";

/** The CV content. Edit src/data/cv.json — never the generated LaTeX. */
export const cv = data as Cv;

/**
 * Where the compiled CV lands. `npm run cv:pdf` (or CI) writes it; it is a
 * build artifact, so it is not in git.
 */
const PDF_FILE = "cv.pdf";

export type CvPdf = {
  /** Site-relative URL, without the base path. */
  url: string;
  sizeKb: number;
};

/**
 * The compiled PDF, or null when it has not been built yet.
 *
 * Read at build time — every route is prerendered and the export has no server,
 * so a PDF produced later is picked up by the next build.
 */
export function getCvPdf(): CvPdf | null {
  const file = path.join(process.cwd(), "public", PDF_FILE);

  if (!fs.existsSync(file)) {
    return null;
  }

  return {
    url: `/${PDF_FILE}`,
    sizeKb: Math.max(1, Math.round(fs.statSync(file).size / 1024)),
  };
}
