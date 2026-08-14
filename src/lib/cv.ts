import fs from "node:fs";
import path from "node:path";

/** Drop the CV here — `public/cv.pdf` is served at `/cv.pdf`. */
const CV_FILE = "cv.pdf";

export type Cv = {
  /** Site-relative URL, without the base path. */
  url: string;
  /** File mtime as YYYY-MM-DD, used as the "last updated" date. */
  updated: string;
  sizeKb: number;
};

/**
 * The uploaded CV, or null while there is none.
 *
 * Read at build time — every route is prerendered and the export has no server,
 * so a file added later is picked up by the next build (or a dev refresh).
 */
export function getCv(): Cv | null {
  const file = path.join(process.cwd(), "public", CV_FILE);

  if (!fs.existsSync(file)) {
    return null;
  }

  const stat = fs.statSync(file);

  return {
    url: `/${CV_FILE}`,
    updated: stat.mtime.toISOString().slice(0, 10),
    sizeKb: Math.max(1, Math.round(stat.size / 1024)),
  };
}
