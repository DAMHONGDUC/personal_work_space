import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  LANGUAGES,
  resolveDoc,
  type Block,
  type Localized,
} from "@/lib/doc-model";
import { getDocs } from "@/lib/docs";
import { ResourceConstant } from "@/lib/resource-constant.mts";
import { RESERVED_SLUGS } from "@/lib/routes";

const docsDir = path.join(process.cwd(), ResourceConstant.DOCS_DIR);

const ALLOWED_KEYS = new Set([
  "title",
  "tagline",
  "icon",
  "accent",
  "tags",
  "readingTime",
  "effectiveDate",
  "lastUpdated",
  "intro",
  "sections",
]);

/** Every member of the Block union. A new type has to be added here too. */
const BLOCK_TYPES = new Set([
  "heading",
  "text",
  "list",
  "checklist",
  "steps",
  "code",
  "table",
  "note",
  "flow",
]);

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

/**
 * A guide must stay short enough to be read standing at a new machine, so no
 * single sentence-or-paragraph is allowed to sprawl. Splitting the point into
 * two entries, a list or a table is always the fix.
 */
const MAX_STRING_LENGTH = 280;

function isLocalized(value: unknown): value is Localized {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    LANGUAGES.some((lang) => lang in value)
  );
}

/** Every translated string in a guide, with the path that leads to it. */
function localizedEntries(value: unknown, at = "doc"): [string, Localized][] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => localizedEntries(item, `${at}[${index}]`));
  }

  if (isLocalized(value)) {
    return [[at, value]];
  }

  if (typeof value === "object" && value !== null) {
    return Object.entries(value).flatMap(([key, child]) =>
      localizedEntries(child, `${at}.${key}`),
    );
  }

  return [];
}

const docs = getDocs();

describe("doc files", () => {
  it("contains only .json files", () => {
    const unexpected = fs
      .readdirSync(docsDir)
      .filter((file) => !file.endsWith(".json"));

    expect(unexpected).toEqual([]);
  });

  it("loads at least one doc", () => {
    expect(docs.length).toBeGreaterThan(0);
  });

  it("lists the most recently updated doc first", () => {
    const updated = docs.map((doc) => doc.lastUpdated);

    expect(updated).toEqual([...updated].sort().reverse());
  });
});

describe.each(docs.map((doc) => [doc.slug, doc] as const))("%s", (slug, doc) => {
  const entries = localizedEntries(doc);
  const blocks: Block[] = doc.sections.flatMap((section) => section.blocks);

  it("uses only known fields", () => {
    const unknown = Object.keys(doc).filter(
      (key) => key !== "slug" && !ALLOWED_KEYS.has(key),
    );

    expect(unknown).toEqual([]);
  });

  it("has a url-safe slug that no top-level section shadows", () => {
    expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect([...RESERVED_SLUGS] as string[]).not.toContain(slug);
  });

  it("is written in every language the switch offers", () => {
    // A half-translated guide would render an empty heading rather than fail,
    // so the missing side is named here instead.
    const missing = entries.flatMap(([at, value]) =>
      LANGUAGES.filter((lang) => !value[lang]?.trim()).map(
        (lang) => `${at} (${lang})`,
      ),
    );

    expect(missing).toEqual([]);
  });

  it("keeps every string short enough to scan", () => {
    const sprawling = entries
      .flatMap(([at, value]) =>
        LANGUAGES.map((lang) => [`${at} (${lang})`, value[lang]] as const),
      )
      .filter(([, text]) => text.length > MAX_STRING_LENGTH)
      .map(([at, text]) => `${at}: ${text.length} chars`);

    expect(sprawling).toEqual([]);
  });

  it("illustrates itself with at least one diagram", () => {
    expect(blocks.filter((block) => block.type === "flow").length).toBeGreaterThan(0);
  });

  it("is written in points, not paragraphs", () => {
    // A guide is read standing at a machine, so the content belongs in lists,
    // steps and tables. One block of prose per section is the ceiling; a second
    // one means the point wants breaking up.
    const wordy = doc.sections
      .filter(
        (section) =>
          section.blocks.filter((block) => block.type === "text").length > 1,
      )
      .map((section) => section.id);

    expect(wordy).toEqual([]);
  });

  it("has non-empty plain fields and a hex accent", () => {
    expect(doc.icon.trim()).not.toBe("");
    expect(doc.accent).toMatch(HEX_COLOR);
    expect(doc.tags.length).toBeGreaterThan(0);
    expect(doc.intro.length).toBeGreaterThan(0);
  });

  it("has valid dates that are not in the wrong order", () => {
    expect(doc.effectiveDate).toMatch(ISO_DATE);
    expect(doc.lastUpdated).toMatch(ISO_DATE);

    expect(Date.parse(doc.lastUpdated)).toBeGreaterThanOrEqual(
      Date.parse(doc.effectiveDate),
    );
  });

  it("has sections with unique, language-independent anchor ids", () => {
    // Switching language re-renders in place, so an id that differed between
    // the two would drop the reader out of the section they were in.
    const ids = doc.sections.map((section) => section.id);

    expect(new Set(ids).size).toBe(ids.length);

    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("has a non-empty body in every section", () => {
    expect(doc.sections.length).toBeGreaterThan(0);

    for (const section of doc.sections) {
      expect(section.blocks.length).toBeGreaterThan(0);
    }
  });

  it("only uses block types the renderer knows how to draw", () => {
    const unknown = blocks
      .map((block) => block.type)
      .filter((type) => !BLOCK_TYPES.has(type));

    expect(unknown).toEqual([]);
  });

  it("has content in every block", () => {
    for (const block of blocks) {
      switch (block.type) {
        case "heading":
          break;
        case "text":
        case "note":
          expect(block.body.length).toBeGreaterThan(0);
          break;
        case "list":
        case "checklist":
        case "steps":
          expect(block.items.length).toBeGreaterThan(0);
          break;
        case "code":
          expect(block.code.length).toBeGreaterThan(0);
          expect(block.language.trim()).not.toBe("");
          break;
        case "table":
          expect(block.columns.length).toBeGreaterThan(0);
          expect(block.rows.length).toBeGreaterThan(0);
          break;
        case "flow":
          expect(block.stages.length).toBeGreaterThan(1);
          break;
      }
    }
  });

  it("gives every table row a cell per column", () => {
    // The header and the body are separate arrays, so a short row would render
    // a ragged table rather than fail.
    for (const block of blocks) {
      if (block.type !== "table") continue;

      for (const row of block.rows) {
        expect(row).toHaveLength(block.columns.length);
      }
    }
  });

  it("labels every box in a diagram", () => {
    for (const block of blocks) {
      if (block.type !== "flow") continue;

      for (const stage of block.stages) {
        expect(stage.items.length).toBeGreaterThan(0);
      }
    }
  });

  it("uses a note tone the callout has styling for", () => {
    for (const block of blocks) {
      if (block.type !== "note") continue;

      expect(["info", "warning"]).toContain(block.tone);
    }
  });

  it.each(LANGUAGES)("resolves to plain strings in %s", (lang) => {
    const resolved = resolveDoc(doc, lang);

    expect(typeof resolved.title).toBe("string");
    expect(localizedEntries(resolved)).toEqual([]);
    expect(resolved.sections.map((section) => section.id)).toEqual(
      doc.sections.map((section) => section.id),
    );
  });
});
