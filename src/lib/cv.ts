import fs from "node:fs";
import path from "node:path";
import data from "@/data/cv_2.json";
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

/** One rasterised page of the CV, as written by `npm run cv:pdf`. */
export type CvPage = {
  url: string;
  width: number;
  height: number;
};

const PAGES_DIR = "cv";
const PAGE_FILE = /^page-(\d+)\.png$/;

/**
 * A PNG's pixel dimensions, read from the IHDR chunk that always starts at
 * byte 16. The <img> needs them to reserve the right space before the image
 * loads, and reading the header beats adding an image library for two numbers.
 */
function pngSize(file: string): { width: number; height: number } {
  const header = Buffer.alloc(24);
  const handle = fs.openSync(file, "r");

  try {
    fs.readSync(handle, header, 0, 24, 0);
  } finally {
    fs.closeSync(handle);
  }

  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
}

/**
 * Every page of the CV in order, or an empty list when the images have not been
 * built. Read at build time, like the rest of the content.
 */
export function getCvPages(): CvPage[] {
  const dir = path.join(process.cwd(), "public", PAGES_DIR);

  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .map((file) => ({ file, match: PAGE_FILE.exec(file) }))
    .filter((entry): entry is { file: string; match: RegExpExecArray } =>
      Boolean(entry.match),
    )
    // Numeric, not lexicographic: page-10 must not sort between page-1 and 2.
    .sort((a, b) => Number(a.match[1]) - Number(b.match[1]))
    .map(({ file }) => ({
      url: `/${PAGES_DIR}/${file}`,
      ...pngSize(path.join(dir, file)),
    }));
}
