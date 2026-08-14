/**
 * Compiles cv/build/main.tex to public/cv.pdf, so `/personal/cv/` shows the
 * real document during local development.
 *
 * Needs a LaTeX installation. CI does the same compile in a container, so this
 * is a convenience rather than the source of the deployed PDF — skipping it
 * only means the CV page keeps saying the PDF has not been built.
 *
 * With --optional, a missing LaTeX is a note rather than a failure, so the step
 * can sit in front of `next dev` without blocking it. A LaTeX that is present
 * but fails to compile is still an error either way.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const optional = process.argv.includes("--optional");

const root = path.join(import.meta.dirname, "..");
const buildDir = path.join(root, "cv/build");
const pdf = path.join(buildDir, "main.pdf");
const published = path.join(root, "public/cv.pdf");

function has(command: string): boolean {
  try {
    execFileSync("command", ["-v", command], { shell: "/bin/sh", stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

if (!fs.existsSync(path.join(buildDir, "main.tex"))) {
  throw new Error("cv/build/main.tex is missing — run `npm run cv:tex` first.");
}

// Ordered by fidelity to what CI ships. CI compiles with pdflatex, which is
// also what Overleaf defaults to, so those two reproduce the deployed PDF
// exactly. Tectonic is the fallback because it installs without sudo and
// fetches packages on demand — same layout, but it is XeTeX, so it falls back
// to Latin Modern where the others use Charter.
const engine = ["latexmk", "pdflatex", "tectonic"].find(has);

if (!engine) {
  console.error(
    [
      "No LaTeX installation found, so the CV PDF was not built.",
      "",
      "Three ways to see the CV:",
      "  1. Overleaf  — drag cv/build/ into a new project (nothing to install)",
      "  2. CI        — open a PR and download the `cv-pdf` artifact",
      "  3. Locally   — brew install tectonic (no sudo), then re-run this",
      "",
      "The site works either way; /personal/cv/ just says the PDF is not built.",
    ].join("\n"),
  );
  process.exit(optional ? 0 : 1);
}

const ARGS: Record<string, string[]> = {
  latexmk: ["-pdf", "-interaction=nonstopmode", "-halt-on-error", "main.tex"],
  pdflatex: ["-interaction=nonstopmode", "-halt-on-error", "main.tex"],
  tectonic: ["--chatter", "minimal", "main.tex"],
};

// Bare pdflatex needs a second pass to settle references; the other two rerun
// themselves as needed.
const passes = engine === "pdflatex" ? 2 : 1;

for (let pass = 0; pass < passes; pass += 1) {
  execFileSync(engine, ARGS[engine], { cwd: buildDir, stdio: "inherit" });
}

fs.mkdirSync(path.dirname(published), { recursive: true });
fs.copyFileSync(pdf, published);

console.log(`public/cv.pdf written with ${engine}`);
