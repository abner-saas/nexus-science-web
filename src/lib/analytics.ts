import { track } from "@vercel/analytics";

const CONSENT_STORAGE_KEY = "ns.analytics-consent";

export const ANALYTICS_CONSENT_EVENT = "ns-analytics-consent";

const WHATSAPP_LOCATIONS = [
  "hero",
  "sticky_nav",
  "acesso_steps",
  "floating_cta",
  "footer",
  "conhecer",
] as const;

const PREVIEW_TABS = ["treino", "bio", "avaliacao", "pagamentos"] as const;
const PREVIEW_SOURCES = ["homepage", "/conhecer"] as const;
const LOGIN_SURFACES = ["header", "footer", "home"] as const;
const SCROLL_DEPTHS = [50, 90] as const;

/**
 * Páginas públicas sem formulário. /login fica de fora: o campo de e-mail
 * não pode seguir para o Google se a medição avançada estiver ligada no GA4.
 */
const MEASURED_PATHS = new Set([
  "/",
  "/conhecer",
  "/politica-de-cookies",
  "/politica-de-privacidade",
  "/termos-de-uso",
]);

export type AnalyticsConsent = "granted" | "denied";
export type WhatsAppLocation = (typeof WHATSAPP_LOCATIONS)[number];
export type PreviewTabName = (typeof PREVIEW_TABS)[number];
export type PreviewSourcePage = (typeof PREVIEW_SOURCES)[number];
export type LoginSurface = (typeof LOGIN_SURFACES)[number];
export type ScrollDepth = (typeof SCROLL_DEPTHS)[number];

export type AnalyticsEventMap = {
  whatsapp_click: { location: WhatsAppLocation };
  preview_tab_switch: { tab_name: PreviewTabName; source_page: PreviewSourcePage };
  preview_cta_whatsapp: { source_page: PreviewSourcePage };
  aluno_login_click: { surface: LoginSurface };
  equipe_login_click: { surface: LoginSurface };
  google_preview_click: undefined;
  scroll_depth_reached: { depth: ScrollDepth };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

type AnalyticsPayload = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: "google_preview_click"): void;
export function trackEvent(
  eventName: "whatsapp_click",
  properties: AnalyticsEventMap["whatsapp_click"],
): void;
export function trackEvent(
  eventName: "preview_tab_switch",
  properties: AnalyticsEventMap["preview_tab_switch"],
): void;
export function trackEvent(
  eventName: "preview_cta_whatsapp",
  properties: AnalyticsEventMap["preview_cta_whatsapp"],
): void;
export function trackEvent(
  eventName: "aluno_login_click",
  properties: AnalyticsEventMap["aluno_login_click"],
): void;
export function trackEvent(
  eventName: "equipe_login_click",
  properties: AnalyticsEventMap["equipe_login_click"],
): void;
export function trackEvent(
  eventName: "scroll_depth_reached",
  properties: AnalyticsEventMap["scroll_depth_reached"],
): void;
export function trackEvent(eventName: AnalyticsEventName, properties?: object): void {
  try {
    if (typeof window === "undefined") return;
    const payload = normalizeEvent(eventName, properties);
    if (!payload) {
      if (isDebug()) console.info(`[Analytics Event] ${eventName}: descartado`);
      return;
    }
    if (isDebug()) {
      console.info(`[Analytics Event] ${eventName}:`, payload, { ga4: canSendGa() });
    }
    try {
      sendVercel(eventName, payload);
    } catch {
      /* a Vercel não pode impedir o GA nem o clique */
    }
    try {
      sendGa(eventName, payload);
    } catch {
      /* o GA não pode impedir a navegação */
    }
  } catch {
    /* telemetria nunca quebra a UI */
  }
}

/** O CTA da prévia também é a conversão primária da consultoria. */
export function trackPreviewWhatsAppClick(): void {
  trackEvent("preview_cta_whatsapp", { source_page: "/conhecer" });
  trackEvent("whatsapp_click", { location: "conhecer" });
}

export function readAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (value === "granted" || value === "denied") return value;
    return null;
  } catch {
    return null;
  }
}

export function writeAnalyticsConsent(value: AnalyticsConsent): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
    applyGaConsent(value);
    window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT));
  } catch {
    /* modo privado: sem persistir, o GA continua desligado */
  }
}

export function googleMeasurementId(): string | null {
  const raw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
  if (!/^G-[A-Z0-9]+$/.test(raw)) return null;
  return raw;
}

export function isMeasuredPath(pathname: string): boolean {
  return MEASURED_PATHS.has(pathname);
}

/** Páginas públicas. O painel e o app logado ficam fora da audiência de marketing. */
export function isPublicTelemetryPath(pathname: string): boolean {
  return isMeasuredPath(pathname) || pathname === "/login" || pathname === "/login/oauth";
}

/** Liga a coleta só na página medida e só com aceite. Fora isso, o tag fica mudo. */
export function syncGaForPath(pathname: string): void {
  const allowed = readAnalyticsConsent() === "granted" && isMeasuredPath(pathname);
  applyGaConsent(allowed ? "granted" : "denied");
}

function normalizeEvent(
  eventName: AnalyticsEventName,
  properties: unknown,
): AnalyticsPayload | null {
  const props = asRecord(properties);
  switch (eventName) {
    case "whatsapp_click":
      return whatsappPayload(props.location);
    case "preview_tab_switch":
      return tabPayload(props.tab_name, props.source_page);
    case "preview_cta_whatsapp":
      return isOneOf(props.source_page, PREVIEW_SOURCES)
        ? { source_page: props.source_page }
        : null;
    case "aluno_login_click":
    case "equipe_login_click":
      return isOneOf(props.surface, LOGIN_SURFACES) ? { surface: props.surface } : null;
    case "google_preview_click":
      return {};
    case "scroll_depth_reached":
      return isScrollDepth(props.depth) ? { depth: props.depth } : null;
    default:
      return null;
  }
}

function whatsappPayload(location: unknown): AnalyticsPayload | null {
  if (!isOneOf(location, WHATSAPP_LOCATIONS)) return null;
  return { location, device_type: currentDeviceType() };
}

function tabPayload(tabName: unknown, sourcePage: unknown): AnalyticsPayload | null {
  if (!isOneOf(tabName, PREVIEW_TABS) || !isOneOf(sourcePage, PREVIEW_SOURCES)) return null;
  return { tab_name: tabName, source_page: sourcePage };
}

function sendVercel(eventName: string, payload: AnalyticsPayload): void {
  ensureVercelQueue();
  if (Object.keys(payload).length === 0) {
    track(eventName);
    return;
  }
  track(eventName, payload);
}

function ensureVercelQueue(): void {
  if (typeof window.va === "function") return;
  window.va = ((...params: unknown[]) => {
    window.vaq = window.vaq ?? [];
    window.vaq.push(params as [string, unknown?]);
  }) as NonNullable<Window["va"]>;
}

function sendGa(eventName: string, payload: AnalyticsPayload): void {
  if (!canSendGa() || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, { ...payload, transport_type: "beacon" });
}

function canSendGa(): boolean {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return false;
  if (readAnalyticsConsent() !== "granted" || !googleMeasurementId()) return false;
  return isMeasuredPath(window.location.pathname);
}

function applyGaConsent(value: AnalyticsConsent): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage: value,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function currentDeviceType(): "mobile" | "desktop" {
  if (typeof window.matchMedia !== "function") return "desktop";
  return window.matchMedia("(min-width: 768px)").matches ? "desktop" : "mobile";
}

function asRecord(properties: unknown): Record<string, unknown> {
  if (!properties || typeof properties !== "object") return {};
  return properties as Record<string, unknown>;
}

function isOneOf<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value);
}

function isScrollDepth(value: unknown): value is ScrollDepth {
  return typeof value === "number" && (SCROLL_DEPTHS as readonly number[]).includes(value);
}

function isDebug(): boolean {
  return process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "1";
}
