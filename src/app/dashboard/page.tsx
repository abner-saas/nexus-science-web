"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { MiniBars } from "@/components/ui/charts";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
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
  const finance = useQuery({
    queryKey: ["finance-summary"],
    queryFn: () => api.finance.summary(),
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
  const series = finance.data?.data.series ?? [];

  return (
    <AppShell
      title="Dashboard Executivo"
      subtitle="Visão geral da sua consultoria"
      actions={
        <button type="button" onClick={() => recompute.mutate()} className="ns-btn-primary">
          {recompute.isPending ? "Atualizando..." : "Recalcular KPIs"}
        </button>
      }
    >
      {isLoading ? (
        <p className="text-sm text-black/50">Carregando indicadores...</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi label="Alunos Ativos" value={String(s?.active ?? 0)} />
            <Kpi label="MRR" value={formatCurrency(m?.mrr ?? s?.mrr ?? 0)} hint="Receita recorrente" />
            <Kpi label="Ticket Médio" value={formatCurrency(m?.avgTicket ?? s?.avgTicket ?? 0)} />
            <Kpi label="Inadimplentes" value={String(s?.overdue ?? m?.overdueCount ?? 0)} />
            <Kpi label="Em risco" value={String(s?.atRisk ?? m?.atRiskCount ?? 0)} hint="Score ≥ 60" />
            <Kpi label="Sem bio 7d" value={String(s?.noBio7d ?? 0)} />
            <Kpi label="Ausentes 14d" value={String(s?.absent14d ?? 0)} />
            <Kpi label="Total CRM" value={String(s?.total ?? 0)} />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="ns-card p-5">
              <p className="ns-kpi-label">Evolução financeira</p>
              <p className="mt-1 text-sm text-black/50">Receita mensal (R$)</p>
              <div className="mt-4">
                <MiniBars
                  values={series.map((x) => x.revenue)}
                  color="#002060"
                  height={120}
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-black/45">
                {series.map((x) => (
                  <span key={x.month}>{x.month.slice(5)}</span>
                ))}
              </div>
            </div>

            <div className="ns-card p-5">
              <p className="ns-kpi-label">Alertas de engajamento</p>
              <ul className="mt-3 max-h-[180px] space-y-2 overflow-y-auto">
                {(data?.data.alerts ?? []).length === 0 ? (
                  <li className="text-sm text-black/45">Nenhum alerta no momento</li>
                ) : (
                  (data?.data.alerts ?? []).map((a) => (
                    <li
                      key={a.id}
                      className="flex items-start justify-between gap-2 rounded-xl bg-input px-3 py-2 text-sm"
                    >
                      <div>
                        <p className="font-medium text-ink">{a.name}</p>
                        <p className="text-xs text-black/50">{a.message}</p>
                      </div>
                      <Link href="/crm" className="text-xs font-semibold text-navy">
                        CRM
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
