"use client";

import { useEffect, useState } from "react";

/** Thin accent bar across the top showing how far through the policy you are. */
export function ReadingProgress({ accent }: { accent: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      // Which element reports the scroll offset depends on the html/body height
      // rules in play, so take whichever one is actually moving.
      const top = Math.max(window.scrollY, doc.scrollTop, document.body.scrollTop);
      const max = Math.max(doc.scrollHeight, document.body.scrollHeight) - window.innerHeight;

      setProgress(max > 0 ? Math.min(1, top / max) : 0);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    document.addEventListener("scroll", update, { passive: true, capture: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      document.removeEventListener("scroll", update, { capture: true });
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-30 h-0.5">
      <div
        className="h-full origin-left"
        style={{ transform: `scaleX(${progress})`, backgroundColor: accent }}
      />
    </div>
  );
}
