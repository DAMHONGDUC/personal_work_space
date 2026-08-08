import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
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
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      {/* min-h-screen (not h-full on <html>) keeps the sticky footer without
          pinning <html> to the viewport height, which would break the document
          scroll the sticky header and reading progress depend on. */}
      <body className="flex min-h-screen flex-col font-sans">
        <SiteHeader publisher={site.publisher} contactEmail={site.contactEmail} />

        <div className="flex-1">{children}</div>

        <SiteFooter publisher={site.publisher} />
      </body>
    </html>
  );
}
