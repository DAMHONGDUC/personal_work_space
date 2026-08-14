/**
 * Generates cv/build/ from the CV data file (see cv-source.mts).
 *
 * Run with `npm run cv:tex`. The output is a single self-contained main.tex
 * plus the image, which is all Overleaf needs — drag the folder in to preview.
 * CI runs the same script and then compiles it to public/cv.pdf.
 *
 * Executed by plain Node (TypeScript types are stripped at load), so value
 * imports need their .ts extension and no "@/" alias is available here.
 */
import fs from "node:fs";
import path from "node:path";
import { renderCvLatex } from "../src/lib/cv-latex.mts";
import { CV_DATA_FILE } from "../src/lib/cv-source.mts";
import type { Cv } from "../src/lib/cv-types";

const root = path.join(import.meta.dirname, "..");
const dataFile = path.join(root, CV_DATA_FILE);
const templateDir = path.join(root, "cv/template");
const assetsDir = path.join(root, "cv/assets");
const outDir = path.join(root, "cv/build");

const cv = JSON.parse(fs.readFileSync(dataFile, "utf8")) as Cv;
const template = fs.readFileSync(path.join(templateDir, "main.tex"), "utf8");

// Rebuilt from scratch so a renamed asset cannot linger from an earlier run.
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, "main.tex"), renderCvLatex(cv, template));

const photo = path.join(assetsDir, cv.header.photo);
if (!fs.existsSync(photo)) {
  throw new Error(
    `${CV_DATA_FILE} points at header.photo "${cv.header.photo}", which is not in cv/assets.`,
  );
}
fs.copyFileSync(photo, path.join(outDir, cv.header.photo));

console.log(`cv/build/main.tex written (${cv.header.photo} copied alongside it)`);
