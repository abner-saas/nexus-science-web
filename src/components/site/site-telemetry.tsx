"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Script from "next/script";
import {
  ANALYTICS_CONSENT_EVENT,
  googleMeasurementId,
  isMeasuredPath,
  readAnalyticsConsent,
  syncGaForPath,
  writeAnalyticsConsent,
  type AnalyticsConsent,
} from "@/lib/analytics";

type Choice = "unknown" | "pending" | AnalyticsConsent;

export function SiteTelemetry() {
  const pathname = usePathname();
  const measurementId = googleMeasurementId();
  const [choice, setChoice] = useState<Choice>("unknown");

  useEffect(() => {
    const sync = () => setChoice(readAnalyticsConsent() ?? "pending");
    sync();
    window.addEventListener(ANALYTICS_CONSENT_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const showBanner = choice === "pending" && Boolean(measurementId) && isMeasuredPath(pathname);
  const loadGa = choice === "granted" && Boolean(measurementId);

  return (
    <>
      {loadGa && measurementId ? <GoogleAnalytics measurementId={measurementId} /> : null}
      {showBanner ? <ConsentBanner /> : null}
    </>
  );
}

export function CookiePreferences() {
  const [choice, setChoice] = useState<Choice>("unknown");
  const measurementId = googleMeasurementId();

  useEffect(() => {
    const sync = () => setChoice(readAnalyticsConsent() ?? "pending");
    sync();
    window.addEventListener(ANALYTICS_CONSENT_EVENT, sync);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, sync);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="ns-btn-primary"
          onClick={() => writeAnalyticsConsent("granted")}
        >
          Aceitar medição
        </button>
        <button
          type="button"
          className="ns-btn-secondary"
          onClick={() => writeAnalyticsConsent("denied")}
        >
          Recusar medição
        </button>
      </div>
      <p className="text-xs text-black/60">{preferenceLabel(choice, Boolean(measurementId))}</p>
    </div>
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

function ConsentBanner() {
  return (
    <aside
      className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-xl rounded-2xl border border-line bg-white p-4 shadow-card"
      aria-label="Medição de visitas"
    >
      <p className="text-sm leading-relaxed text-black/70">
        O Google Analytics mede visitas e cliques neste site, sem nome, e-mail ou telefone. O
        script só carrega se você aceitar. A Vercel já recebe desempenho anônimo, sem cookie.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="ns-btn-primary"
          onClick={() => writeAnalyticsConsent("granted")}
        >
          Aceitar
        </button>
        <button
          type="button"
          className="ns-btn-secondary"
          onClick={() => writeAnalyticsConsent("denied")}
        >
          Recusar
        </button>
        <Link
          href="/politica-de-cookies"
          className="px-2 text-sm text-navy no-underline hover:underline"
        >
          Política de cookies
        </Link>
      </div>
    </aside>
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

function preferenceLabel(choice: Choice, hasMeasurementId: boolean): string {
  const status =
    choice === "granted"
      ? "Medição do Google aceita neste navegador."
      : choice === "denied"
        ? "Medição do Google recusada neste navegador."
        : choice === "pending"
          ? "Nenhuma escolha salva ainda."
          : "Lendo a escolha deste navegador…";
  if (hasMeasurementId) return status;
  return `${status} Neste ambiente o identificador do Google não está configurado, então o script continua desligado.`;
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
