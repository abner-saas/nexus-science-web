"use client";

import { useEffect, useState } from "react";
import { GoogleSignInButton } from "@/components/ui/google-sign-in-button";
import { trackEvent } from "@/lib/analytics";
import { startGoogleSignIn } from "@/lib/auth-client";
import { TRAINER_NAME } from "@/lib/contact";

export function PreviewGoogleButton({ label }: { label: string }) {
  const [status, setStatus] = useState<"loading" | "ready" | "off">("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const ac = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333"}/auth/providers`, {
      credentials: "include",
      signal: ac.signal,
    })
      .then((r) => r.json())
      .then((body) => setStatus(body?.data?.google ? "ready" : "off"))
      .catch(() => setStatus("off"));
    return () => ac.abort();
  }, []);

  async function onGoogle() {
    trackEvent("google_preview_click");
    setBusy(true);
    try {
      await startGoogleSignIn();
    } catch {
      setBusy(false);
    }
  }

  return (
    <div>
      <GoogleSignInButton
        status={status}
        busy={busy}
        onClick={onGoogle}
        label={label}
        className="w-full"
      />
      {status === "ready" ? (
        <p className="mt-2 text-xs text-black/45">
          O Google só identifica o e-mail. Não abre matrícula nem cobrança — isso o{" "}
          {TRAINER_NAME.split(" ")[0]} libera depois do combinado.
        </p>
      ) : null}
    </div>
  );
}
