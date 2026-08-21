"use client";

import { DocCard } from "@/components/docs/DocCard";
import { LanguageSwitch } from "@/components/docs/LanguageSwitch";
import { useDocLanguage } from "@/hooks/useDocLanguage";
import type { Lang, ResolvedDoc } from "@/lib/doc-model";

/** Accent for the switch on the index, where no single guide owns the page. */
const ACCENT = "#a855f7";

/**
 * The guide list, in the reader's language. The choice is shared with the guide
 * pages, so picking a language here is still in force after opening one.
 */
export function DocIndex({ versions }: { versions: Record<Lang, ResolvedDoc[]> }) {
  const [lang, setLang] = useDocLanguage();

  return (
    <>
      <div className="flex justify-end pb-6">
        <LanguageSwitch lang={lang} onChange={setLang} accent={ACCENT} />
      </div>

      <div className="flex flex-col gap-4">
        {versions[lang].map((doc) => (
          <DocCard key={doc.slug} doc={doc} lang={lang} />
        ))}
      </div>
    </>
  );
}
