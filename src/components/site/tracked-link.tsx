"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { trackEvent, type LoginSurface, type WhatsAppLocation } from "@/lib/analytics";

type Common = {
  href: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
};

type TrackSpec =
  | { kind: "whatsapp"; location: WhatsAppLocation }
  | { kind: "aluno" | "equipe"; surface: LoginSurface };

export function TrackedLink({
  href,
  className,
  children,
  ariaLabel,
  ...track
}: Common & TrackSpec) {
  const onClick = () => trackClick(track);

  if (track.kind === "whatsapp") {
    return (
      <a href={href} className={className} aria-label={ariaLabel} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </Link>
  );
}

function trackClick(track: TrackSpec): void {
  if (track.kind === "whatsapp") {
    trackEvent("whatsapp_click", { location: track.location });
    return;
  }
  if (track.kind === "aluno") {
    trackEvent("aluno_login_click", { surface: track.surface });
    return;
  }
  trackEvent("equipe_login_click", { surface: track.surface });
}
