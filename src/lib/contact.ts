import { whatsappLink } from "./utils";

export const TRAINER_NAME = process.env.NEXT_PUBLIC_TRAINER_NAME ?? "Abner Lucas";

export function trainerWhatsApp(message?: string) {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP?.trim();
  if (!raw) return null;
  const base = whatsappLink(raw);
  if (!base) return null;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function trainerInstagram() {
  const handle = process.env.NEXT_PUBLIC_INSTAGRAM?.trim().replace(/^@/, "");
  if (!handle) return null;
  return `https://instagram.com/${handle}`;
}

export function accessRequestMessage(name?: string, email?: string) {
  const who = [name, email].filter(Boolean).join(" · ");
  const prefix = who ? `Olá, sou ${who}.` : "Olá.";
  return `${prefix} Quero conversar sobre a consultoria de treino (${TRAINER_NAME}) e o acompanhamento no app.`;
}
