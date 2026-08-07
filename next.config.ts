import type { NextConfig } from "next";

// GitHub Pages project sites are served from /<repo>, so the CI build sets this.
// Local dev leaves it empty and everything stays at the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // GitHub Pages only serves plain files — no Node server.
  output: "export",
  // Emits /app/privacy_policy/index.html instead of privacy_policy.html, which is
  // what Pages resolves reliably for extensionless URLs.
  trailingSlash: true,
  basePath,
};

export default nextConfig;
