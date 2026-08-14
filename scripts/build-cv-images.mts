/**
 * Rasterises cv/build/main.pdf into public/cv/page-N.png.
 *
 * The CV page stacks these images in the document flow so the whole CV renders
 * at once and the ordinary page scroll carries it. An <object>/<embed> cannot
 * do that: the browser's PDF plugin always builds its own fixed-height scroll
 * box, and nothing in the page can measure the document to size it.
 *
 * The PDF itself stays the download, so this only affects what is shown inline.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/** 160dpi on US Letter is 1360x1760 — sharp on a HiDPI screen at ~800px wide. */
const DPI = 160;

const optional = process.argv.includes("--optional");

const root = path.join(import.meta.dirname, "..");
const pdf = path.join(root, "cv/build/main.pdf");
const outDir = path.join(root, "public/cv");

function has(command: string): boolean {
  try {
    execFileSync("command", ["-v", command], { shell: "/bin/sh", stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

if (!fs.existsSync(pdf)) {
  // Without a PDF there is nothing to rasterise. Under --optional the LaTeX
  // step has already explained why, so stay quiet rather than repeat it.
  if (optional) process.exit(0);
  throw new Error("cv/build/main.pdf is missing — run `npm run cv:pdf` first.");
}

if (!has("pdftoppm")) {
  console.error(
    [
      "pdftoppm not found, so the CV page images were not built.",
      "The CV page falls back to the download link until they are.",
      "",
      "  brew install poppler",
    ].join("\n"),
  );
  process.exit(optional ? 0 : 1);
}

// Rebuilt from scratch so pages dropped from a shorter CV cannot linger.
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

execFileSync("pdftoppm", ["-png", "-r", String(DPI), pdf, path.join(outDir, "page")]);

const pages = fs.readdirSync(outDir).filter((file) => file.endsWith(".png"));

if (pages.length === 0) {
  throw new Error("pdftoppm produced no images from cv/build/main.pdf.");
}

console.log(`public/cv/ written with ${pages.length} page image(s) at ${DPI}dpi`);
