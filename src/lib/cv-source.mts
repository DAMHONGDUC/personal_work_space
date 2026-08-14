/**
 * The CV data file, named once.
 *
 * Two things read it: `src/lib/cv.ts`, which the site renders from, and
 * `scripts/build-cv-tex.mts`, which generates the LaTeX the PDF is built from.
 * The site's copy has to be a static import for bundling, so it cannot be
 * driven by this constant — instead a test asserts the two resolve to the same
 * content, which is what stops the page and the PDF drifting apart.
 */
export const CV_DATA_FILE = "src/data/cv/cv_2.json";
