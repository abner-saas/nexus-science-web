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
type Period = "this_month" | "prev_month" | "12m" | "ytd" | "custom";
type TxType = "RECEITA" | "DESPESA";

const SERIES: { key: SeriesKey; label: string; color: string }[] = [
  { key: "revenue", label: "Receitas", color: "#002060" },
  { key: "expenses", label: "Despesas", color: "#800000" },
  { key: "profit", label: "Lucro", color: "#10b981" },
];

const PERIODS: { id: Period; label: string }[] = [
  { id: "this_month", label: "Este mês" },
  { id: "prev_month", label: "Mês anterior" },
  { id: "12m", label: "12M" },
  { id: "ytd", label: "YTD" },
  { id: "custom", label: "Personalizado" },
];

const emptyTx = {
  type: "DESPESA" as TxType,
  category: "",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  description: "",
  method: "",
};

export default function FinanceiroPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"visao" | "tx">("visao");
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [visible, setVisible] = useState<Record<SeriesKey, boolean>>({
    revenue: true,
    expenses: true,
    profit: true,
  });
  const [period, setPeriod] = useState<Period>("this_month");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const customReady = period !== "custom" || (Boolean(from) && Boolean(to) && from <= to);
  const summary = useQuery({
    queryKey: ["finance-summary", period, from, to],
    queryFn: () => api.finance.summary(period === "custom" ? { period, from, to } : { period }),
    enabled: customReady,
  });
  const txs = useQuery({ queryKey: ["finance-txs"], queryFn: () => api.finance.transactions() });
  const categories = useQuery({
    queryKey: ["finance-categories"],
    queryFn: () => api.finance.categories(),
  });
  const [form, setForm] = useState(emptyTx);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    type: "DESPESA" as TxType,
    matchTerms: "",
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["finance-summary"] });
    qc.invalidateQueries({ queryKey: ["finance-txs"] });
    qc.invalidateQueries({ queryKey: ["finance-categories"] });
  };

  const saveTx = useMutation({
    mutationFn: () => {
      const body = {
        ...form,
        category: form.category || null,
        method: form.type === "RECEITA" && form.method ? form.method : null,
      };
      return editingId ? api.finance.updateTx(editingId, body) : api.finance.createTx(body);
    },
    onSuccess: () => {
      refresh();
      setForm(emptyTx);
      setEditingId(null);
    },
  });

  const removeTx = useMutation({
    mutationFn: (id: string) => api.finance.removeTx(id),
    onSuccess: refresh,
  });

  const createCategory = useMutation({
    mutationFn: () => api.finance.createCategory(categoryForm),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["finance-categories"] });
      setCategoryForm({ name: "", type: "DESPESA", matchTerms: "" });
    },
  });

  const removeCategory = useMutation({
    mutationFn: (id: string) => api.finance.removeCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["finance-categories"] }),
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
  const categoryOptions = (categories.data?.data ?? []).filter((item) => item.type === form.type);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    saveTx.mutate();
  }

  async function classifyDescription(description: string) {
    if (!description.trim() || form.category) return;
    const match = await api.finance.matchCategory(form.type, description);
    if (match.data.category)
      setForm((current) => ({ ...current, category: match.data.category ?? "" }));
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
          <div className="mb-4 flex flex-wrap items-end gap-2">
            {PERIODS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPeriod(item.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  period === item.id
                    ? "bg-navy text-white"
                    : "border border-line bg-white text-navy"
                }`}
              >
                {item.label}
              </button>
            ))}
            {period === "custom" ? (
              <>
                <label className="text-xs text-black/50">
                  De
                  <input
                    type="date"
                    className="ns-input ml-2"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                </label>
                <label className="text-xs text-black/50">
                  Até
                  <input
                    type="date"
                    className="ns-input ml-2"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </label>
              </>
            ) : null}
          </div>
          {d?.from && d?.to ? (
            <p className="mb-4 text-xs text-black/45">
              Período {d.from} até {d.to}. MRR e inadimplência continuam o retrato atual da
              carteira.
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi label="Receita" value={formatCurrency(d?.revenue ?? 0)} />
            <Kpi label="Despesas" value={formatCurrency(d?.expenses ?? 0)} />
            <Kpi label="Lucro" value={formatCurrency(d?.profit ?? 0)} />
            <Kpi label="Margem" value={`${d?.margin ?? 0}%`} />
            <Kpi label="MRR" value={formatCurrency(d?.mrr ?? 0)} hint="Carteira atual" />
            <Kpi label="ARR" value={formatCurrency(d?.arr ?? 0)} hint="Carteira atual" />
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
                      chartType === t
                        ? "bg-navy text-white"
                        : "border border-line bg-white text-navy"
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createCategory.mutate();
            }}
            className="ns-card p-5"
          >
            <p className="ns-kpi-label">Nova categoria</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-4">
              <input
                required
                placeholder="Nome"
                className="ns-input"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              />
              <select
                className="ns-input"
                value={categoryForm.type}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, type: e.target.value as TxType })
                }
              >
                <option value="DESPESA">Despesa</option>
                <option value="RECEITA">Receita</option>
              </select>
              <input
                placeholder="Termos: internet, fibra"
                className="ns-input"
                value={categoryForm.matchTerms}
                onChange={(e) => setCategoryForm({ ...categoryForm, matchTerms: e.target.value })}
              />
              <button
                type="submit"
                className="ns-btn-primary justify-center"
                disabled={createCategory.isPending}
              >
                Criar categoria
              </button>
            </div>
            <p className="mt-2 text-xs text-black/45">
              Uma descrição com esses termos classifica o lançamento sozinha. A conexão direta com o
              banco fica para quando a operação escolher a conta.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(categories.data?.data ?? []).map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className="rounded-full border border-line px-2 py-1 text-xs"
                  onClick={() => {
                    if (
                      confirm(
                        `Excluir a categoria ${category.name}? Os lançamentos antigos permanecem.`,
                      )
                    ) {
                      removeCategory.mutate(category.id);
                    }
                  }}
                >
                  {category.name}
                  {category.matchTerms ? ` · ${category.matchTerms}` : ""} ×
                </button>
              ))}
            </div>
          </form>

          <form onSubmit={onSubmit} className="ns-card p-5">
            <p className="ns-kpi-label">{editingId ? "Editar lançamento" : "Nova transação"}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <select
                className="ns-input"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as TxType, category: "" })}
              >
                <option value="RECEITA">Receita</option>
                <option value="DESPESA">Despesa</option>
              </select>
              <select
                className="ns-input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Classificar pela descrição</option>
                {form.category &&
                !categoryOptions.some((category) => category.name === form.category) ? (
                  <option value={form.category}>{form.category}</option>
                ) : null}
                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
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
                  placeholder="Descrição do banco"
                  className="ns-input"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  onBlur={(e) => void classifyDescription(e.target.value)}
                />
              )}
              <button
                type="submit"
                className="ns-btn-primary justify-center"
                disabled={saveTx.isPending}
              >
                {editingId ? "Salvar" : "Lançar"}
              </button>
            </div>
            {form.type === "RECEITA" ? (
              <input
                placeholder="Descrição"
                className="ns-input mt-3"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                onBlur={(e) => void classifyDescription(e.target.value)}
              />
            ) : null}
            {editingId ? (
              <button
                type="button"
                className="ns-btn-ghost mt-3"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyTx);
                }}
              >
                Cancelar edição
              </button>
            ) : null}
            {saveTx.isError ? (
              <p className="mt-3 text-sm text-danger">{(saveTx.error as Error).message}</p>
            ) : null}
          </form>

          <div className="ns-card overflow-hidden">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface text-[11px] uppercase tracking-wider text-black/45">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {(txs.data?.data ?? []).map((tx) => (
                  <tr key={tx.id} className="border-t border-line/70">
                    <td className="px-4 py-2">{tx.date}</td>
                    <td className="px-4 py-2">
                      <span className={tx.type === "RECEITA" ? "text-success" : "text-danger"}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-2">{tx.category}</td>
                    <td className="px-4 py-2">{tx.description ?? "—"}</td>
                    <td className="px-4 py-2 font-medium">{formatCurrency(tx.amount)}</td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        className="ns-btn-ghost text-xs"
                        onClick={() => {
                          setEditingId(tx.id);
                          setForm({
                            type: tx.type,
                            category: tx.category,
                            amount: tx.amount,
                            date: tx.date,
                            description: tx.description ?? "",
                            method: tx.method ?? "",
                          });
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="ns-btn-ghost text-xs text-danger"
                        onClick={() => {
                          if (confirm("Excluir este lançamento?")) removeTx.mutate(tx.id);
                        }}
                      >
                        Excluir
                      </button>
                    </td>
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

function CategoryBars({
  rows,
  color,
}: {
  rows: Array<{ category: string; total: number }>;
  color: string;
}) {
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
