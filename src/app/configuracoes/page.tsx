"use client";

import { AppShell } from "@/components/layout/app-shell";
import { useAuthStore } from "@/store/auth";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <AppShell title="Configurações" subtitle="Perfil e preferências">
      <div className="ns-card p-6">
        <h2 className="font-display text-base font-bold text-ink">Perfil Profissional</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ["Nome", user?.name ?? "—"],
            ["E-mail", user?.email ?? "—"],
            ["Papel", user?.role ?? "—"],
            ["Especialidade", "Personal Trainer — CREF (preencher)"],
            ["Cidade", "Recife, PE"],
            ["Instagram", "@seuinstagram"],
          ].map(([label, value]) => (
            <label key={label} className="block">
              <span className="ns-label uppercase tracking-[0.06em] !text-[11px] !text-black/42">
                {label}
              </span>
              <input className="ns-input" defaultValue={value} readOnly={label === "Papel"} />
            </label>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className="ns-btn-primary" disabled>
            Salvar Alterações
          </button>
          <p className="self-center text-xs text-black/45">
            Persistência de perfil e Asaas entram nas próximas sprints.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
