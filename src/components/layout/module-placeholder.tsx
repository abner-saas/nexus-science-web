"use client";

import { AppShell } from "./app-shell";

const PHASE_COPY: Record<string, string[]> = {
  "Sprint 2": [
    "Biblioteca de exercícios e rotinas A/B/C",
    "Registro de sessões pelo aluno",
    "Avaliação física com fotos em storage",
  ],
  "Sprint 3": [
    "Transações, fluxo de caixa e carteira",
    "Integração Asaas (Pix / cartão / boleto)",
    "Régua de cobrança automática",
  ],
  "Sprint 4": [
    "Histórico de biofeedback com gráficos",
    "IA interpretativa (análise científica)",
    "Score de retenção & churn preditivo",
  ],
  "Sprint 1–2": [
    "CRUD de planos Bronze / Silver / Gold",
    "Links de checkout e vínculo com CRM",
  ],
};

export function ModulePlaceholder({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase: string;
}) {
  const items = PHASE_COPY[phase] ?? [];

  return (
    <AppShell title={title} subtitle={description}>
      <div className="ns-card p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[rgba(128,0,0,0.08)] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-maroon">
            {phase}
          </span>
          <span className="rounded-full bg-[rgba(0,32,96,0.08)] px-2.5 py-0.5 text-[11px] font-semibold text-navy">
            Em construção
          </span>
        </div>
        <h2 className="mt-4 font-title text-2xl font-extrabold text-navy">{title}</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-black/55">
          Navegação e identidade visual já alinhadas ao protótipo. Este módulo
          será conectado à API com dados reais persistidos no PostgreSQL.
        </p>
        {items.length > 0 ? (
          <ul className="mt-5 space-y-2 border-t border-line pt-5">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-black/65">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </AppShell>
  );
}
