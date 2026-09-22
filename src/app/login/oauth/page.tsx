"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleMark } from "@/components/ui/google-sign-in-button";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

function OAuthBusy() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="relative w-full max-w-sm ns-card p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#dadce0] bg-white">
          <GoogleMark />
        </div>
        <p className="mt-4 font-title text-base font-semibold text-navy">Concluindo acesso</p>
        <p className="mt-1 text-sm text-black/50">Validando sua conta Google…</p>
        <div className="mx-auto mt-5 h-1.5 w-28 overflow-hidden rounded-full bg-[#f1f3f4]">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-navy/70" />
        </div>
      </div>
    </div>
  );
}

function OAuthCallbackInner() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.whoami();
        if (cancelled) return;
        if (data.kind === "member") {
          setUser(data.user);
          router.replace(data.user.role === "STUDENT" ? "/aluno" : "/dashboard");
          return;
        }
        if (data.kind === "lead") {
          setUser(null);
          router.replace("/conhecer");
          return;
        }
        router.replace("/login?error=google");
      } catch {
        router.replace("/login?error=google");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router, setUser]);

  return <OAuthBusy />;
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<OAuthBusy />}>
      <OAuthCallbackInner />
    </Suspense>
  );
}
