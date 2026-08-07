"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { formatCurrency, whatsappLink } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="ns-card p-5">
      <p className="ns-kpi-label">{label}</p>
      <p className="mt-2 font-impact text-3xl text-navy">{value}</p>
    </div>
  );
}

export default function RetentionPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["retention"],
    queryFn: () => api.retention.get(),
  });
  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: () => api.students.list(),
  });

  const d = data?.data;
  const phoneById = new Map((students?.data ?? []).map((s) => [s.id, s.phone]));

  return (
    <AppShell title="Retenção & Churn" subtitle="Score preditivo e análise de risco">
      {isLoading ? (
        <p className="text-sm text-black/50">Carregando...</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi label="Retenção" value={`${d?.retentionRate ?? 0}%`} />
            <Kpi label="Churn" value={`${d?.churnRate ?? 0}%`} />
            <Kpi label="LTV médio" value={formatCurrency(d?.avgLtv ?? 0)} />
            <Kpi label="Receita em risco" value={formatCurrency(d?.revenueAtRisk ?? 0)} />
          </div>

          <div className="ns-card mt-4 overflow-hidden">
            <div className="border-b border-line bg-surface px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-black/45">
              Alunos prioritários
            </div>
            <table className="min-w-full text-left text-sm">
              <thead className="text-[11px] uppercase text-black/40">
                <tr>
                  <th className="px-4 py-2">Aluno</th>
                  <th className="px-4 py-2">Score</th>
                  <th className="px-4 py-2">Motivos</th>
                  <th className="px-4 py-2">Ação</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {(d?.atRisk ?? []).map((s) => {
                  const wa = whatsappLink(phoneById.get(s.id));
                  return (
                    <tr key={s.id} className="border-t border-line/70">
                      <td className="px-4 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3">
                        <span className={s.score >= 70 ? "font-bold text-danger" : "text-warning"}>
                          {s.score}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-black/55">{s.reasons.join(" · ")}</td>
                      <td className="px-4 py-3 text-xs">{s.action}</td>
                      <td className="px-4 py-3">
                        {wa ? (
                          <a href={wa} target="_blank" rel="noreferrer" className="text-success">
                            <MessageCircle size={16} />
                          </a>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
                {(d?.atRisk ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-black/45">
                      Nenhum aluno em risco no momento
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AppShell>
  );
}
