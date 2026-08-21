/**
 * Date formatting shared by the app policies and the guides.
 *
 * It lives on its own rather than in a loader because the guides render inside a
 * client component — importing it from `@/lib/apps` would drag `node:fs` into
 * the browser bundle.
 */
export function formatDate(value: string): string {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
