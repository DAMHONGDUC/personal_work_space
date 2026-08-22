"use client";

import { DocCard } from "@/components/docs/DocCard";
import { LanguageSwitch } from "@/components/docs/LanguageSwitch";
import { useDocLanguage } from "@/hooks/useDocLanguage";
import { DOCS_ACCENT, type Lang, type Doc } from "@/lib/doc-model";

/**
 * The guide list, in the reader's language. The choice is shared with the guide
 * pages, so picking a language here is still in force after opening one.
 */
export function DocIndex({ versions }: { versions: Record<Lang, Doc[]> }) {
  const [lang, setLang] = useDocLanguage();

  return (
    <>
      <div className="flex justify-end pb-6">
        <LanguageSwitch lang={lang} onChange={setLang} accent={DOCS_ACCENT} />
      </div>

      <div className="flex flex-col gap-4">
        {versions[lang].map((doc) => (
          <DocCard key={doc.slug} doc={doc} lang={lang} />
        ))}
      </div>
    </>
  );
}
