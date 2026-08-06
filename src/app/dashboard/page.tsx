"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

function Kpi({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="ns-card p-5">
      <p className="ns-kpi-label">{label}</p>
      <p className="mt-2 font-impact text-4xl tracking-wide text-navy">{value}</p>
      {hint ? <p className="mt-1 text-xs text-black/42">{hint}</p> : null}
    </div>
  );
}

export default function DashboardPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => api.dashboard.summary(),
  });

  const recompute = useMutation({
    mutationFn: () => api.dashboard.recompute(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dashboard-summary"] }),
  });

  const s = data?.data.students;
  const m = data?.data.metrics as
    | { mrr?: string; avgTicket?: string; overdueCount?: number; atRiskCount?: number }
    | null
    | undefined;

  return (
    <AppShell
      title="Dashboard Executivo"
      subtitle="Visão geral da sua consultoria"
      actions={
        <button
          type="button"
          onClick={() => recompute.mutate()}
          className="ns-btn-primary"
        >
          {recompute.isPending ? "Atualizando..." : "Recalcular KPIs"}
        </button>
      }
    >
      {isLoading ? (
        <p className="text-sm text-black/50">Carregando indicadores...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi label="Alunos Ativos" value={String(s?.active ?? 0)} />
          <Kpi
            label="MRR"
            value={formatCurrency(m?.mrr ?? 0)}
            hint="Soma dos valores dos alunos ativos"
          />
          <Kpi label="Inadimplentes" value={String(s?.overdue ?? m?.overdueCount ?? 0)} />
          <Kpi
            label="Ticket Médio"
            value={formatCurrency(m?.avgTicket ?? 0)}
            hint="Média dos planos ativos"
          />
          <Kpi label="Pausados" value={String(s?.paused ?? 0)} />
          <Kpi label="Cancelados" value={String(s?.cancelled ?? 0)} />
          <Kpi label="Total CRM" value={String(s?.total ?? 0)} />
          <Kpi label="Em risco" value={String(m?.atRiskCount ?? 0)} hint="Score ≥ 60" />
        </div>
      )}

      <div className="mt-4 ns-card border-dashed p-5">
        <p className="ns-kpi-label text-maroon">Próximas entregas neste módulo</p>
        <p className="mt-2 text-sm text-black/55">
          Gráficos de Receita × Despesa × Lucro, filtro de período global e alertas
          de engajamento (sem biofeedback / ausentes) — conforme protótipo e reunião.
        </p>
      </div>
    </AppShell>
  );
}
