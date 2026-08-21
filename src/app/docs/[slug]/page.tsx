import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocArticle } from "@/components/docs/DocArticle";
import { resolveDocs } from "@/lib/doc-model";
import { getDoc, getDocs } from "@/lib/docs";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";

export function generateStaticParams() {
  return getDocs().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata(
  props: PageProps<"/docs/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const doc = getDoc(slug);

  if (!doc) {
    return { title: "Not found" };
  }

  // The page carries both languages and picks one in the browser, so there is
  // one URL to index — described in English, like the rest of the site.
  const description = `${doc.tagline.en} Last updated ${formatDate(doc.lastUpdated)}.`;

  return {
    title: doc.title.en,
    description,
    alternates: { canonical: `${routes.doc(doc.slug)}/` },
    openGraph: { title: doc.title.en, description, type: "article" },
  };
}

export default async function DocPage(props: PageProps<"/docs/[slug]">) {
  const { slug } = await props.params;
  const doc = getDoc(slug);

  if (!doc) {
    notFound();
  }

  return <DocArticle versions={resolveDocs(doc)} />;
}
