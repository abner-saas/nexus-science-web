"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ANALYTICS_CONSENT_EVENT,
  googleMeasurementId,
  readAnalyticsConsent,
  writeAnalyticsConsent,
  type AnalyticsConsent,
} from "@/lib/analytics";

type Choice = "pending" | AnalyticsConsent;

function subscribeToAnalyticsChoice(onChange: () => void) {
  window.addEventListener(ANALYTICS_CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(ANALYTICS_CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useAnalyticsChoice(): Choice | null {
  return useSyncExternalStore(
    subscribeToAnalyticsChoice,
    () => readAnalyticsConsent() ?? "pending",
    () => null,
  );
}

/**
 * Faixa discreta no rodapé. Não escurece a página, não trava o scroll e some
 * depois da escolha. Quem ignora continua sem o script do Google.
 */
export function CookieConsentBanner() {
  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 py-3 backdrop-blur-sm"
      aria-label="Cookies"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="max-w-xl text-[13px] leading-relaxed text-black/70">
        Usamos dados para melhorar sua experiência. Você pode recusar a qualquer momento. <br />
          <Link href="/politica-de-cookies" className="text-navy underline">
            Política de cookies
          </Link>
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="ns-btn-ghost px-3 py-1.5 text-[13px]"
            onClick={() => writeAnalyticsConsent("denied")}
          >
            Recusar
          </button>
          <button
            type="button"
            className="ns-btn-primary px-3 py-1.5 text-[13px]"
            onClick={() => writeAnalyticsConsent("granted")}
          >
            Aceitar
          </button>
        </div>
      </div>
    </aside>
  );
}

export function CookiePreferences() {
  const choice = useAnalyticsChoice();
  const measurementId = googleMeasurementId();

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

function preferenceLabel(choice: Choice | null, hasMeasurementId: boolean): string {
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
