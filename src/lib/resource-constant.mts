/**
 * Every path this project reads content from or writes build output to.
 *
 * The paths were spread across the loaders, the build scripts and the tests,
 * which is how a data file gets renamed in one place and missed in another.
 * They are declared once here instead.
 *
 * Two rules keep this file importable from everywhere it is needed:
 *
 * - **Repo-relative strings, no imports.** The commands all run from the repo
 *   root, so callers join with `process.cwd()` themselves. Importing `node:path`
 *   here would make the file unusable from anything bundled for the browser.
 * - **`.mts`.** The CV build scripts are plain Node with no `@/` alias, and
 *   they import this by relative path with its extension.
 */
export class ResourceConstant {
  /** One JSON file per app; the loader reads the whole directory. */
  static readonly APPS_DIR = "src/data/apps";

  /**
   * Guides, as `<lang>/<slug>_<lang>.json` — one folder per language, the same
   * slugs under each, and the language repeated in the filename so an editor
   * tab shows it. The loader reads the folders rather than a list.
   */
  static readonly DOCS_DIR = "src/data/docs";

  /** Publisher details and the privacy-policy sections every app shares. */
  static readonly SITE_FILE = "src/data/site.json";

  /**
   * The live CV. Other files may sit beside it and are equally valid CVs —
   * this constant is what decides which one the site and the PDF are built
   * from.
   */
  static readonly CV_DATA_FILE = "src/data/cv/cv_2.json";

  /** The LaTeX the CV is rendered into. Hand-edited; never generated. */
  static readonly CV_TEMPLATE_DIR = "cv/template";

  /** Images the CV embeds, such as the photo named in the CV data. */
  static readonly CV_ASSETS_DIR = "cv/assets";

  /** Generated LaTeX and the PDF LaTeX produces. Not in git. */
  static readonly CV_BUILD_DIR = "cv/build";

  /** Served at the site root, so a URL is a path here minus this prefix. */
  static readonly PUBLIC_DIR = "public";

  /** The published PDF the CV page links to. A build artifact. */
  static readonly CV_PDF_FILE = "public/cv.pdf";

  /** Page images of the PDF, which the CV page renders inline. */
  static readonly CV_PAGES_DIR = "public/cv";

  // Static members only: the class is a namespace for the constants, and there
  // is nothing to construct.
  private constructor() {}
}
