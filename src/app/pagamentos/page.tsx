"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

const REGUA = [
  { day: "D-7", label: "7 dias antes", action: "Notificação preventiva", channels: ["WhatsApp", "E-mail"] },
  { day: "D-3", label: "3 dias antes", action: "Segundo aviso", channels: ["WhatsApp", "E-mail"] },
  { day: "D-0", label: "Dia do vencimento", action: "Cobrança / PIX", channels: ["E-mail", "Push"] },
  { day: "D+1", label: "1 dia após", action: "Inadimplência", channels: ["WhatsApp", "E-mail"] },
  { day: "D+7", label: "7 dias após", action: "Bloqueio do app", channels: ["E-mail"] },
  { day: "D+15", label: "15 dias após", action: "Cancelamento (configurável)", channels: ["E-mail"] },
];

export default function PagamentosPage() {
  const qc = useQueryClient();
  const role = useAuthStore((s) => s.user?.role);
  const canWrite = role === "ADMIN" || role === "FINANCE";
  const [tab, setTab] = useState<"links" | "payments" | "regua">("payments");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    studentId: "",
    amount: "",
    method: "PIX",
    dueDate: new Date().toISOString().slice(0, 10),
    checkoutUrl: "",
  });

  const plans = useQuery({ queryKey: ["plans"], queryFn: () => api.plans.list() });
  const payments = useQuery({ queryKey: ["payments"], queryFn: () => api.payments.list() });
  const students = useQuery({
    queryKey: ["students"],
    queryFn: () => api.students.list(),
    enabled: canWrite,
  });

  const create = useMutation({
    mutationFn: () =>
      api.payments.create({
        studentId: form.studentId,
        amount: form.amount,
        method: form.method,
        dueDate: form.dueDate,
        checkoutUrl: form.checkoutUrl || null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payments"] });
      setOpen(false);
      setForm({
        studentId: "",
        amount: "",
        method: "PIX",
        dueDate: new Date().toISOString().slice(0, 10),
        checkoutUrl: "",
      });
    },
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    create.mutate();
  }

  return (
    <AppShell
      title="Pagamentos"
      subtitle="Links, métodos e régua de cobrança"
      actions={
        canWrite ? (
          <button type="button" className="ns-btn-primary" onClick={() => setOpen(true)}>
            Nova cobrança
          </button>
        ) : undefined
      }
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          ["payments", "Cobranças"],
          ["links", "Links / Planos"],
          ["regua", "Régua"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id as typeof tab)}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              tab === id ? "bg-navy text-white" : "border border-line bg-white text-navy"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "links" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(plans.data?.data ?? []).map((p) => (
            <div key={p.id} className="ns-card p-5">
              <h3 className="font-display text-lg font-bold">{p.name}</h3>
              <p className="mt-2 font-impact text-3xl text-navy">{formatCurrency(p.value)}</p>
              <div className="mt-4 rounded-lg bg-input px-3 py-2 font-mono text-[11px] text-black/55">
                {p.checkoutUrl ?? `patitor.dev/checkout/${p.tier.toLowerCase()}`}
              </div>
              <p className="mt-2 text-xs text-black/45">Métodos: Pix · Cartão · Boleto (Asaas)</p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "payments" ? (
        <div className="ns-card overflow-hidden">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface text-[11px] uppercase text-black/45">
              <tr>
                <th className="px-4 py-3">Vencimento</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Método</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Link</th>
              </tr>
            </thead>
            <tbody>
              {(payments.data?.data ?? []).map((p) => (
                <tr key={p.id} className="border-t border-line/70">
                  <td className="px-4 py-2">{p.dueDate}</td>
                  <td className="px-4 py-2">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-2">{p.method ?? "—"}</td>
                  <td className="px-4 py-2">{p.status}</td>
                  <td className="px-4 py-2">
                    {p.checkoutUrl ? (
                      <a
                        href={p.checkoutUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-navy"
                      >
                        Abrir
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
              {(payments.data?.data ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-black/45">
                    Nenhuma cobrança — registre manualmente ou aguarde o webhook Asaas
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}

      {tab === "regua" ? (
        <div className="ns-card p-5">
          <p className="font-display text-base font-bold">Régua automática de cobrança</p>
          <p className="mt-1 text-sm text-black/50">
            Referência operacional — automação Asaas ainda não dispara da plataforma
          </p>
          <div className="mt-5 space-y-3">
            {REGUA.map((item) => (
              <div key={item.day} className="flex gap-3 rounded-xl bg-input p-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy/10 font-mono text-xs font-bold text-navy">
                  {item.day}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{item.action}</p>
                  <p className="text-xs text-black/45">{item.label}</p>
                  <p className="mt-1 text-[11px] text-navy">{item.channels.join(" · ")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={onSubmit} className="ns-card w-full max-w-md p-6">
            <h2 className="font-title text-xl font-bold text-navy">Nova cobrança</h2>
            <p className="mt-1 text-xs text-black/45">
              Registra cobrança local. Emissão automática no Asaas ainda não está ligada.
            </p>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="ns-label">Aluno</span>
                <select
                  required
                  className="ns-input"
                  value={form.studentId}
                  onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                >
                  <option value="">Selecione</option>
                  {(students.data?.data ?? []).map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="ns-label">Valor (ex: 297.00)</span>
                <input
                  required
                  className="ns-input"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="ns-label">Método</span>
                <select
                  className="ns-input"
                  value={form.method}
                  onChange={(e) => setForm({ ...form, method: e.target.value })}
                >
                  <option value="PIX">Pix</option>
                  <option value="CREDIT_CARD">Cartão</option>
                  <option value="BOLETO">Boleto</option>
                </select>
              </label>
              <label className="block">
                <span className="ns-label">Vencimento</span>
                <input
                  type="date"
                  required
                  className="ns-input"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="ns-label">Checkout URL (opcional)</span>
                <input
                  className="ns-input"
                  value={form.checkoutUrl}
                  onChange={(e) => setForm({ ...form, checkoutUrl: e.target.value })}
                />
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="ns-btn-ghost" onClick={() => setOpen(false)}>
                Cancelar
              </button>
              <button type="submit" className="ns-btn-primary" disabled={create.isPending}>
                {create.isPending ? "Salvando..." : "Registrar"}
              </button>
            </div>
            {create.isError ? (
              <p className="mt-3 text-sm text-danger">{(create.error as Error).message}</p>
            ) : null}
          </form>
        </div>
      ) : null}
    </AppShell>
  );
}
