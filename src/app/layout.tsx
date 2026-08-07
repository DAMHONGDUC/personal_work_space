import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/lib/apps";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Privacy Policies — ${site.publisher}`,
    template: `%s — ${site.publisher}`,
  },
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <header className="sticky top-0 z-20 border-b border-border-soft bg-background/80 backdrop-blur">
          <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-sm font-semibold tracking-tight"
            >
              <span
                aria-hidden
                className="flex size-7 items-center justify-center rounded-lg bg-foreground text-xs font-bold text-background"
              >
                P
              </span>
              {site.publisher}
            </Link>
            <a
              href={`mailto:${site.contactEmail}`}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Contact
            </a>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="border-t border-border-soft">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {site.publisher}. All rights reserved.
            </p>
            <Link href="/" className="transition-colors hover:text-foreground">
              All privacy policies
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
