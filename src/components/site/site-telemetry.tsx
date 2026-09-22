"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { CookieConsentBanner, useAnalyticsChoice } from "@/components/site/cookie-consent";
import {
  googleMeasurementId,
  isMeasuredPath,
  readAnalyticsConsent,
  syncGaForPath,
} from "@/lib/analytics";

export function SiteTelemetry() {
  const pathname = usePathname();
  const measurementId = googleMeasurementId();
  const choice = useAnalyticsChoice();
  const showBanner = choice === "pending" && isMeasuredPath(pathname);
  const loadGa = choice === "granted" && Boolean(measurementId);

  return (
    <>
      {loadGa && measurementId ? <GoogleAnalytics measurementId={measurementId} /> : null}
      {showBanner ? <CookieConsentBanner /> : null}
    </>
  );
}

function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const sentPath = useRef<string | null>(null);

  useEffect(() => {
    syncGaForPath(pathname);
    sendMeasuredPageView(pathname, sentPath);
  }, [pathname]);

  return (
    <Script
      id="ga4-init"
      strategy="afterInteractive"
      onReady={() => sendMeasuredPageView(window.location.pathname, sentPath)}
    >
      {gaBootstrap(measurementId)}
    </Script>
  );
}

function sendMeasuredPageView(path: string, sentPath: { current: string | null }): void {
  if (!isMeasuredPath(path) || readAnalyticsConsent() !== "granted") return;
  if (typeof window.gtag !== "function" || sentPath.current === path) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    transport_type: "beacon",
  });
  sentPath.current = path;
}

function gaBootstrap(measurementId: string): string {
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'granted',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      security_storage: 'granted'
    });
    gtag('set', 'ads_data_redaction', true);
    gtag('js', new Date());
    gtag('config', '${measurementId}', {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      send_page_view: false
    });
    if (!document.querySelector('script[data-ns-ga4]')) {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=${measurementId}';
      s.setAttribute('data-ns-ga4', '1');
      document.head.appendChild(s);
    }
  `;
}
