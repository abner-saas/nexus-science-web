"use client";

import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="ns-card p-5">
      <p className="ns-kpi-label">{label}</p>
      <p className="mt-2 font-impact text-3xl text-navy">{value}</p>
      {hint ? <p className="mt-1 text-xs text-black/42">{hint}</p> : null}
    </div>
  );
}

type SeriesKey = "revenue" | "expenses" | "profit";

const SERIES: { key: SeriesKey; label: string; color: string }[] = [
  { key: "revenue", label: "Receitas", color: "#002060" },
  { key: "expenses", label: "Despesas", color: "#800000" },
  { key: "profit", label: "Lucro", color: "#10b981" },
];

export default function FinanceiroPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"visao" | "tx">("visao");
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [visible, setVisible] = useState<Record<SeriesKey, boolean>>({
    revenue: true,
    expenses: true,
    profit: true,
  });
  const summary = useQuery({ queryKey: ["finance-summary"], queryFn: () => api.finance.summary() });
  const txs = useQuery({ queryKey: ["finance-txs"], queryFn: () => api.finance.transactions() });
  const [form, setForm] = useState({
    type: "DESPESA",
    category: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    description: "",
    method: "",
  });

  const create = useMutation({
    mutationFn: () =>
      api.finance.createTx({
        ...form,
        method: form.type === "RECEITA" && form.method ? form.method : null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["finance-summary"] });
      qc.invalidateQueries({ queryKey: ["finance-txs"] });
    },
  });

  const d = summary.data?.data;
  const chartData = useMemo(
    () =>
      (d?.series ?? []).map((s) => ({
        month: s.month.slice(5),
        revenue: s.revenue,
        expenses: s.expenses,
        profit: s.profit,
      })),
    [d?.series],
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    create.mutate();
  }

  const ChartCmp = chartType === "line" ? LineChart : BarChart;

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
              tab === id ? "bg-navy text-white" : "border border-line bg-white text-navy"
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
            <Kpi
              label="Inadimplência"
              value={formatCurrency(d?.overdueAmount ?? 0)}
              hint={`${d?.overdueCount ?? 0} aluno(s)`}
            />
          </div>

          <div className="ns-card mt-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="ns-kpi-label">Evolução conjunta</p>
              <div className="flex flex-wrap gap-2">
                {(["line", "bar"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setChartType(t)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      chartType === t ? "bg-navy text-white" : "border border-line bg-white text-navy"
                    }`}
                  >
                    {t === "line" ? "Linha" : "Coluna"}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs">
              {SERIES.map((s) => (
                <label key={s.key} className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={visible[s.key]}
                    onChange={() => setVisible((v) => ({ ...v, [s.key]: !v[s.key] }))}
                  />
                  <span style={{ color: s.color }}>{s.label}</span>
                </label>
              ))}
            </div>
            <div className="mt-4 h-64">
              {chartData.length === 0 ? (
                <p className="text-sm text-black/45">Sem dados no período</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ChartCmp data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e3e6ea" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
                    <Legend />
                    {SERIES.filter((s) => visible[s.key]).map((s) =>
                      chartType === "line" ? (
                        <Line
                          key={s.key}
                          type="monotone"
                          dataKey={s.key}
                          name={s.label}
                          stroke={s.color}
                          strokeWidth={2}
                          dot={false}
                        />
                      ) : (
                        <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} />
                      ),
                    )}
                  </ChartCmp>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="ns-card p-5">
              <p className="ns-kpi-label">Receita por categoria</p>
              <CategoryBars rows={d?.revenueByCategory ?? []} color="#002060" />
            </div>
            <div className="ns-card p-5">
              <p className="ns-kpi-label">Despesa por categoria</p>
              <CategoryBars rows={d?.expenseByCategory ?? []} color="#800000" />
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <form onSubmit={onSubmit} className="ns-card p-5">
            <p className="ns-kpi-label">Nova transação</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <select className="ns-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
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
              {form.type === "RECEITA" ? (
                <select
                  className="ns-input"
                  value={form.method}
                  onChange={(e) => setForm({ ...form, method: e.target.value })}
                >
                  <option value="">Método</option>
                  <option value="PIX">Pix</option>
                  <option value="CREDIT_CARD">Cartão</option>
                  <option value="BOLETO">Boleto</option>
                </select>
              ) : (
                <input
                  placeholder="Descrição"
                  className="ns-input"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              )}
              <button type="submit" className="ns-btn-primary justify-center" disabled={create.isPending}>
                Lançar
              </button>
            </div>
            {form.type === "RECEITA" ? (
              <input
                placeholder="Descrição"
                className="ns-input mt-3"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            ) : null}
          </form>

          <div className="ns-card overflow-hidden">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface text-[11px] uppercase tracking-wider text-black/45">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Método</th>
                  <th className="px-4 py-3">Valor</th>
                </tr>
              </thead>
              <tbody>
                {(txs.data?.data ?? []).map((t) => (
                  <tr key={t.id} className="border-t border-line/70">
                    <td className="px-4 py-2">{t.date}</td>
                    <td className="px-4 py-2">
                      <span className={t.type === "RECEITA" ? "text-success" : "text-danger"}>{t.type}</span>
                    </td>
                    <td className="px-4 py-2">{t.category}</td>
                    <td className="px-4 py-2">{t.method ?? "—"}</td>
                    <td className="px-4 py-2 font-medium">{formatCurrency(t.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function CategoryBars({ rows, color }: { rows: Array<{ category: string; total: number }>; color: string }) {
  if (!rows.length) {
    return <p className="mt-4 text-sm text-black/45">Sem lançamentos nesta categoria</p>;
  }
  const max = Math.max(...rows.map((r) => r.total), 1);
  return (
    <div className="mt-4 space-y-3">
      {rows.map((r) => (
        <div key={r.category}>
          <div className="flex justify-between text-xs text-black/55">
            <span>{r.category}</span>
            <span>{formatCurrency(r.total)}</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-input">
            <div
              className="h-2 rounded-full"
              style={{ width: `${Math.max(6, (r.total / max) * 100)}%`, background: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
