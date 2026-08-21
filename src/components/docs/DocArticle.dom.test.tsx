/** @vitest-environment jsdom */
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DocArticle } from "./DocArticle";
import type { Lang, ResolvedDoc } from "@/lib/doc-model";

function version(lang: Lang): ResolvedDoc {
  const word = lang === "en" ? "English" : "Vietnamese";

  return {
    slug: "guide",
    title: `${word} title`,
    tagline: `${word} tagline`,
    icon: "🛠️",
    accent: "#147efb",
    tags: ["Xcode"],
    readingTime: `${word} 10`,
    effectiveDate: "2026-01-01",
    lastUpdated: "2026-01-01",
    intro: [`${word} intro`],
    sections: [
      {
        id: "signing",
        title: `${word} signing`,
        blocks: [{ type: "text", body: [`${word} body`] }],
      },
    ],
  };
}

const versions: Record<Lang, ResolvedDoc> = { en: version("en"), vi: version("vi") };

let container: HTMLDivElement;
let root: Root;

function render() {
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    root = createRoot(container);
    root.render(<DocArticle versions={versions} />);
  });
  return container;
}

function switchTo(label: string) {
  const button = [...container.querySelectorAll("button")].find(
    (candidate) => candidate.textContent === label,
  );
  if (!button) throw new Error(`no ${label} button`);

  act(() => button.click());
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("DocArticle", () => {
  it("starts in English, which is what the prerendered HTML contains", () => {
    expect(render().textContent).toContain("English body");
  });

  it("swaps every string when the language is switched", () => {
    const page = render();

    switchTo("vi");

    expect(page.textContent).toContain("Vietnamese body");
    expect(page.textContent).toContain("Vietnamese title");
    expect(page.textContent).not.toContain("English body");
  });

  it("keeps the section anchors, so switching does not lose your place", () => {
    const page = render();
    const before = page.querySelector("section")?.id;

    switchTo("vi");

    expect(page.querySelector("section")?.id).toBe(before);
    expect(before).toBe("signing");
  });

  it("numbers the section and its contents entry the same way", () => {
    const page = render();

    expect(page.querySelector("h2")?.textContent).toBe("1.English signing");
    expect(page.querySelector("ol a")?.textContent).toBe("1English signing");
  });

  it("marks the body with the language it is written in", () => {
    const page = render();

    expect(page.querySelector("main")?.lang).toBe("en");

    switchTo("vi");

    expect(page.querySelector("main")?.lang).toBe("vi");
  });

  it("remembers the choice for the next guide and the next visit", () => {
    render();

    switchTo("vi");

    expect(window.localStorage.getItem("docs-language")).toBe("vi");
  });

  it("shows the reader which language is active", () => {
    const page = render();
    const pressed = () =>
      [...page.querySelectorAll("button")]
        .filter((button) => button.getAttribute("aria-pressed") === "true")
        .map((button) => button.textContent);

    expect(pressed()).toEqual(["en"]);

    switchTo("vi");

    expect(pressed()).toEqual(["vi"]);
  });
});
