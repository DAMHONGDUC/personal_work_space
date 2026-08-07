import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4 px-6 py-24">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">Policy not found</h1>
      <p className="max-w-md text-base leading-7 text-muted">
        There is no app at this address. It may have been renamed or removed from the
        stores.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-lg border border-border-soft px-4 py-2 text-sm transition-colors hover:border-foreground/25"
      >
        Browse all privacy policies
      </Link>
    </main>
  );
}
