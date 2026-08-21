/**
 * The shape of a guide, and how one language is picked out of it.
 *
 * Kept apart from the loader in `docs.ts` because the guide pages render in
 * a client component to switch language without a navigation — importing
 * anything that touches `node:fs` from there fails the build.
 */
/** Every language a guide is written in. Both are required, never a fallback. */
export const LANGUAGES = ["en", "vi"] as const;

export type Lang = (typeof LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Lang, string> = {
  en: "English",
  vi: "Tiếng Việt",
};

/** One string in every language. */
export type Localized = Record<Lang, string>;

/**
 * The block types a guide is built from. `T` is what a piece of prose looks
 * like: `Localized` in the JSON on disk, `string` once resolved to one language,
 * so the renderers never learn about translation.
 */
export type Block<T = Localized> =
  /** A sub-heading inside a section, for the "one way / the other way" splits. */
  | { type: "heading"; text: T }
  | { type: "text"; body: T[] }
  | { type: "list"; items: T[] }
  /** Same data as a list, drawn with boxes because the reader ticks it off. */
  | { type: "checklist"; items: T[] }
  /** An ordered list, for steps that only work in the given order. */
  | { type: "steps"; items: T[] }
  /**
   * A command sample. The commands themselves are the same in every language —
   * anything that needs explaining goes in the caption instead of a comment, so
   * the code stays copy-pasteable and the prose stays translated.
   */
  | { type: "code"; language: string; caption?: T; code: string[] }
  | { type: "table"; columns: T[]; rows: T[][] }
  | { type: "note"; tone: "info" | "warning"; body: T[] }
  /**
   * A diagram, described as data rather than markup: stages run top to bottom
   * with an arrow between them, and the boxes within one stage sit side by side.
   * One box per stage draws a pipeline; several boxes feeding one draws a join.
   */
  | {
      type: "flow";
      caption?: T;
      stages: { items: { label: T; detail?: T }[] }[];
    };

/** Named shortcuts for the block types that have a renderer of their own. */
export type CodeBlock<T = Localized> = Extract<Block<T>, { type: "code" }>;
export type TableBlock<T = Localized> = Extract<Block<T>, { type: "table" }>;
export type NoteBlock<T = Localized> = Extract<Block<T>, { type: "note" }>;
export type FlowBlock<T = Localized> = Extract<Block<T>, { type: "flow" }>;

export type DocSection<T = Localized> = {
  /** Anchor id. Language-independent, so switching language keeps your place. */
  id: string;
  title: T;
  /** One line under the heading, also used as the blurb in the index. */
  summary?: T;
  blocks: Block<T>[];
};

/** The shape of one file in src/data/docs. The slug comes from the filename. */
export type DocData<T = Localized> = {
  title: T;
  tagline: T;
  icon: string;
  accent: string;
  /** Product names, left untranslated. */
  tags: string[];
  readingTime: T;
  effectiveDate: string;
  lastUpdated: string;
  intro: T[];
  sections: DocSection<T>[];
};

export type Doc<T = Localized> = DocData<T> & { slug: string };

/** A guide narrowed to one language, which is all the components ever see. */
export type ResolvedDoc = Doc<string>;

function pick(value: Localized, lang: Lang): string {
  return value[lang];
}

function resolveBlock(block: Block, lang: Lang): Block<string> {
  const t = (value: Localized) => pick(value, lang);

  switch (block.type) {
    case "heading":
      return { ...block, text: t(block.text) };
    case "text":
    case "note":
      return { ...block, body: block.body.map(t) };
    case "list":
    case "checklist":
    case "steps":
      return { ...block, items: block.items.map(t) };
    case "code":
      return { ...block, caption: block.caption && t(block.caption) };
    case "table":
      return {
        ...block,
        columns: block.columns.map(t),
        rows: block.rows.map((row) => row.map(t)),
      };
    case "flow":
      return {
        ...block,
        caption: block.caption && t(block.caption),
        stages: block.stages.map((stage) => ({
          items: stage.items.map((item) => ({
            label: t(item.label),
            detail: item.detail && t(item.detail),
          })),
        })),
      };
  }
}

/**
 * One language's version of a guide. Both versions are resolved at build time
 * and handed to the page together, so the language switch is a re-render with
 * nothing left to fetch.
 */
export function resolveDoc(doc: Doc, lang: Lang): ResolvedDoc {
  const t = (value: Localized) => pick(value, lang);

  return {
    ...doc,
    title: t(doc.title),
    tagline: t(doc.tagline),
    readingTime: t(doc.readingTime),
    intro: doc.intro.map(t),
    sections: doc.sections.map((section) => ({
      ...section,
      title: t(section.title),
      summary: section.summary && t(section.summary),
      blocks: section.blocks.map((block) => resolveBlock(block, lang)),
    })),
  };
}

/** Every language's version of a guide, keyed by language. */
export function resolveDocs(doc: Doc): Record<Lang, ResolvedDoc> {
  return Object.fromEntries(
    LANGUAGES.map((lang) => [lang, resolveDoc(doc, lang)]),
  ) as Record<Lang, ResolvedDoc>;
}
