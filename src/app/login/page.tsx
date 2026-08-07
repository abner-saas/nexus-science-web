"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState("admin@nexusscience.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-surface px-4">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 420px at 12% -8%, rgba(0,32,96,0.10), transparent 55%), radial-gradient(700px 360px at 100% 0%, rgba(128,0,0,0.07), transparent 50%)",
        }}
      />
      <div className="relative w-full max-w-md ns-card p-8">
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
        <p className="mt-5 text-sm text-black/55">
          Acesse o painel da consultoria
        </p>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <label className="block">
            <span className="ns-label">E-mail</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ns-input"
              autoComplete="username"
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
      </div>
    </div>
  );
}
