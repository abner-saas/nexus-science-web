"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { isPublicTelemetryPath } from "@/lib/analytics";

function stripQuery<T extends { url: string }>(event: T): T | null {
  try {
    const url = new URL(event.url);
    url.search = "";
    url.hash = "";
    return { ...event, url: url.toString() };
  } catch {
    return null;
  }
}

function publicAnalytics(event: BeforeSendEvent): BeforeSendEvent | null {
  try {
    const url = new URL(event.url);
    if (!isPublicTelemetryPath(url.pathname)) return null;
    return stripQuery(event);
  } catch {
    return null;
  }
}

export function VercelMetrics() {
  const debug =
    process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "1";

  return (
    <>
      <Analytics debug={debug} beforeSend={publicAnalytics} />
      <SpeedInsights debug={debug} beforeSend={stripQuery} />
    </>
  );
}
