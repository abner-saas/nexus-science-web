"use client";

import { FormEvent, Suspense, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleSignInButton } from "@/components/ui/google-sign-in-button";
import { api } from "@/lib/api";
import { startGoogleSignIn } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth";

function LoginCardChrome({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-surface px-4">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 420px at 12% -8%, rgba(0,32,96,0.10), transparent 55%), radial-gradient(700px 360px at 100% 0%, rgba(128,0,0,0.07), transparent 50%)",
        }}
      />
      <div className="relative w-full max-w-md ns-card p-8">{children}</div>
    </div>
  );
}

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div
        aria-hidden
        className="h-12 w-12 shrink-0 bg-maroon"
        style={{
          WebkitMaskImage: "url(/nexus-mark.png)",
          maskImage: "url(/nexus-mark.png)",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
      <div>
        <p className="font-brand text-[28px] leading-none tracking-[0.04em] text-navy">
          Nexus Science
        </p>
        <p className="mt-1 text-[10px] font-extrabold tracking-[0.08em] text-[#9CA3AF]">
          CONSULTORIA ONLINE
        </p>
      </div>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);
  const asAluno = params.get("as") === "aluno";
  const [mode, setMode] = useState<"equipe" | "aluno">(asAluno ? "aluno" : "equipe");
  const [email, setEmail] = useState(asAluno ? "" : "admin@nexusscience.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    params.get("error") ? "Não foi possível entrar com o Google. Tente de novo." : null,
  );
  const [loading, setLoading] = useState(false);
  const [googleStatus, setGoogleStatus] = useState<"loading" | "ready" | "off">("loading");
  const [googleBusy, setGoogleBusy] = useState(false);

  useEffect(() => {
    const ac = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333"}/auth/providers`, {
      credentials: "include",
      signal: ac.signal,
    })
      .then((r) => r.json())
      .then((body) => setGoogleStatus(body?.data?.google ? "ready" : "off"))
      .catch(() => setGoogleStatus("off"));
    return () => ac.abort();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(email, password);
      setUser(res.user);
      router.replace(res.user.role === "STUDENT" ? "/aluno" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no login");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setError(null);
    setGoogleBusy(true);
    try {
      await startGoogleSignIn();
    } catch {
      setGoogleBusy(false);
      setError("Não foi possível iniciar o login com o Google.");
    }
  }

  return (
    <LoginCardChrome>
      <BrandMark />

      <div className="mt-5 flex gap-2">
        {(
          [
            ["equipe", "Equipe"],
            ["aluno", "Aluno"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setMode(id);
              setEmail(id === "equipe" ? "admin@nexusscience.local" : "");
            }}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${
              mode === id ? "bg-navy text-white" : "border border-line bg-white text-navy"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

        <p className="mt-4 text-sm text-black/55">
          {mode === "aluno"
            ? "Acesse seu treino, biofeedback e pagamentos"
            : "Acesse o painel da consultoria"}
        </p>
        <p className="mt-2 text-xs">
          <Link href="/" className="text-navy/70 no-underline hover:text-navy">
            ← Página inicial
          </Link>
        </p>

      <GoogleSignInButton status={googleStatus} busy={googleBusy} onClick={onGoogle} />

      {googleStatus !== "off" ? (
        <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-black/35">
          <span className="h-px flex-1 bg-line" />
          ou e-mail
          <span className="h-px flex-1 bg-line" />
        </div>
      ) : (
        <div className="h-5" />
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="ns-label">E-mail</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="ns-input"
            autoComplete="username"
            placeholder={mode === "aluno" ? "oliver@email.com" : undefined}
          />
        </label>
        <label className="block">
          <span className="ns-label">Senha</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="ns-input"
            autoComplete="current-password"
          />
        </label>

        {error ? (
          <p
            className="rounded-xl px-3 py-2 text-sm text-danger"
            style={{ background: "rgba(220,38,38,0.10)" }}
          >
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={loading} className="ns-btn-primary w-full justify-center py-3">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </LoginCardChrome>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <LoginCardChrome>
          <BrandMark />
          <div className="mt-5 h-10 w-full animate-pulse rounded-lg bg-[#f1f3f4]" />
          <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-[#f1f3f4]" />
          <div className="mt-5 h-11 w-full animate-pulse rounded-lg bg-[#f1f3f4]" />
        </LoginCardChrome>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
