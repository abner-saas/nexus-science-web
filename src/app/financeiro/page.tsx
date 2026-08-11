"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { MiniBars } from "@/components/ui/charts";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="ns-card p-5">
      <p className="ns-kpi-label">{label}</p>
      <p className="mt-2 font-impact text-3xl text-navy">{value}</p>
    </div>
  );
}

export default function FinanceiroPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"visao" | "tx">("visao");
  const summary = useQuery({ queryKey: ["finance-summary"], queryFn: () => api.finance.summary() });
  const txs = useQuery({ queryKey: ["finance-txs"], queryFn: () => api.finance.transactions() });
  const [form, setForm] = useState({
    type: "DESPESA",
    category: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    description: "",
  });

  const create = useMutation({
    mutationFn: () => api.finance.createTx(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["finance-summary"] });
      qc.invalidateQueries({ queryKey: ["finance-txs"] });
    },
  });

  const d = summary.data?.data;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    create.mutate();
  }

  return (
    <AppShell title="Gestão Financeira" subtitle="Visão geral, transações e fluxo de caixa">
      <div className="mb-4 flex gap-2">
        {[
          ["visao", "Visão Geral"],
          ["tx", "Transações"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id as "visao" | "tx")}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              tab === id ? "bg-navy text-white" : "bg-white text-navy border border-line"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "visao" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi label="Receita" value={formatCurrency(d?.revenue ?? 0)} />
            <Kpi label="Despesas" value={formatCurrency(d?.expenses ?? 0)} />
            <Kpi label="Lucro" value={formatCurrency(d?.profit ?? 0)} />
            <Kpi label="Margem" value={`${d?.margin ?? 0}%`} />
            <Kpi label="MRR" value={formatCurrency(d?.mrr ?? 0)} />
            <Kpi label="ARR" value={formatCurrency(d?.arr ?? 0)} />
          </div>
          <div className="ns-card mt-4 p-5">
            <p className="ns-kpi-label">Receita × Despesa</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-xs text-black/45">Receita</p>
                <MiniBars
                  values={(d?.series ?? []).map((s) => s.revenue)}
                  color="#002060"
                  height={100}
                />
              </div>
              <div>
                <p className="mb-2 text-xs text-black/45">Despesas</p>
                <MiniBars
                  values={(d?.series ?? []).map((s) => s.expenses)}
                  color="#800000"
                  height={100}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="ns-card overflow-hidden">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface text-[11px] uppercase tracking-wider text-black/45">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Valor</th>
                </tr>
              </thead>
              <tbody>
                {(txs.data?.data ?? []).map((t) => (
                  <tr key={t.id} className="border-t border-line/70">
                    <td className="px-4 py-2">{t.date}</td>
                    <td className="px-4 py-2">
                      <span className={t.type === "RECEITA" ? "text-success" : "text-danger"}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-4 py-2">{t.category}</td>
                    <td className="px-4 py-2 font-medium">{formatCurrency(t.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <form onSubmit={onSubmit} className="ns-card h-fit p-5">
            <p className="ns-kpi-label">Nova transação</p>
            <div className="mt-3 space-y-3">
              <select
                className="ns-input"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="RECEITA">Receita</option>
                <option value="DESPESA">Despesa</option>
              </select>
              <input
                required
                placeholder="Categoria"
                className="ns-input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <input
                required
                placeholder="Valor"
                className="ns-input"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
              <input
                type="date"
                className="ns-input"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <input
                placeholder="Descrição"
                className="ns-input"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <button
                type="submit"
                className="ns-btn-primary w-full justify-center"
                disabled={create.isPending}
              >
                Lançar
              </button>
            </div>
          </form>
        </div>
      )}
    </AppShell>
  );
}
