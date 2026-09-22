"use client";

import { useEffect } from "react";
import { trackEvent, type ScrollDepth } from "@/lib/analytics";

const reachedDepths = new Set<ScrollDepth>();

export function ScrollDepth() {
  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const height = document.documentElement.scrollHeight;
      if (height <= 0) return;
      const seen = (window.scrollY + window.innerHeight) / height;
      for (const depth of [50, 90] as const) {
        if (seen < depth / 100 || reachedDepths.has(depth)) continue;
        reachedDepths.add(depth);
        trackEvent("scroll_depth_reached", { depth });
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
