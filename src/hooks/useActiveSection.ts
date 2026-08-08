"use client";

import { useEffect, useState } from "react";

/**
 * Id of the section currently in view, for highlighting a table of contents.
 *
 * The observer margins ignore the band under the sticky header and only count a
 * section once it reaches the upper third of the viewport.
 */
export function useActiveSection(ids: string[], fallback = "") {
  const [active, setActive] = useState(ids[0] ?? fallback);

  // Depend on the joined key so a new array with the same ids does not re-run.
  const key = ids.join("|");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -65% 0px" },
    );

    for (const id of key.split("|")) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [key]);

  return active;
}
