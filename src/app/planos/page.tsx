"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { api, type Plan } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

const TIER_COLOR: Record<string, string> = {
  Bronze: "#B45309",
  Silver: "#6B7280",
  Gold: "#D97706",
  Custom: "#002060",
};

const emptyForm = {
  name: "",
  tier: "Custom",
  value: "",
  benefits: "",
  checkoutUrl: "",
  active: true,
};

export default function PlansPage() {
  const qc = useQueryClient();
  const role = useAuthStore((s) => s.user?.role);
  const canWrite = role === "ADMIN" || role === "FINANCE";
  const isAdmin = role === "ADMIN";
  const { data, isLoading } = useQuery({ queryKey: ["plans"], queryFn: () => api.plans.list() });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState(emptyForm);

  const save = useMutation({
    mutationFn: () => {
      const body = {
        name: form.name,
        tier: form.tier,
        value: form.value,
        benefits: form.benefits
          .split(",")
          .map((b) => b.trim())
          .filter(Boolean),
        checkoutUrl: form.checkoutUrl || null,
        active: form.active,
      };
      return editing ? api.plans.update(editing.id, body) : api.plans.create(body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plans"] });
      setOpen(false);
      setEditing(null);
    },
  });

  const toggleActive = useMutation({
    mutationFn: (plan: Plan) => api.plans.update(plan.id, { active: !plan.active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["plans"] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.plans.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["plans"] }),
  });

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(plan: Plan) {
    setEditing(plan);
    setForm({
      name: plan.name,
      tier: plan.tier,
      value: plan.value,
      benefits: (plan.benefits ?? []).join(", "),
      checkoutUrl: plan.checkoutUrl ?? "",
      active: plan.active,
    });
    setOpen(true);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    save.mutate();
  }

  return (
    <AppShell
      title="Planos dos Alunos"
      subtitle="Gerencie os planos oferecidos e os links de checkout"
      actions={
        canWrite ? (
          <button type="button" className="ns-btn-primary" onClick={openCreate}>
            Criar Plano
          </button>
        ) : undefined
      }
    >
      {isLoading ? (
        <p className="text-sm text-black/50">Carregando...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(data?.data ?? []).map((plan) => {
            const color = TIER_COLOR[plan.tier] ?? "#002060";
            return (
              <div key={plan.id} className="ns-card p-5" style={{ borderTop: `4px solid ${color}` }}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                    <h3 className="font-display text-lg font-bold text-ink">{plan.name}</h3>
                  </div>
                  <span className={`text-xs font-semibold ${plan.active ? "text-success" : "text-danger"}`}>
                    {plan.active ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <p className="mt-3 font-impact text-3xl text-navy">
                  {formatCurrency(plan.value)}
                  <span className="text-sm font-normal text-black/45">/mês</span>
                </p>
                <p className="mt-2 text-xs text-black/50">
                  {plan.activeStudents ?? 0} aluno(s) ativo(s)
                </p>
                <ul className="mt-4 space-y-1.5">
                  {(plan.benefits ?? []).map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-black/65">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
                      {b}
                    </li>
                  ))}
                </ul>
                {plan.checkoutUrl ? (
                  <div className="mt-4 rounded-lg border border-line bg-input px-3 py-2 font-mono text-[11px] text-black/55">
                    {plan.checkoutUrl}
                  </div>
                ) : null}
                {canWrite ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" className="ns-btn-ghost text-xs" onClick={() => openEdit(plan)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="ns-btn-secondary text-xs"
                      onClick={() => toggleActive.mutate(plan)}
                    >
                      {plan.active ? "Desativar" : "Reativar"}
                    </button>
                    {isAdmin ? (
                      <button
                        type="button"
                        className="ns-btn-ghost text-xs text-danger"
                        onClick={() => {
                          if (confirm(`Excluir o plano "${plan.name}"?`)) remove.mutate(plan.id);
                        }}
                      >
                        Excluir
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={onSubmit} className="ns-card w-full max-w-md p-6">
            <h2 className="font-title text-xl font-bold text-navy">
              {editing ? "Editar plano" : "Novo plano"}
            </h2>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="ns-label">Nome</span>
                <input required className="ns-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label className="block">
                <span className="ns-label">Tier</span>
                <select className="ns-input" value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>
                  {["Bronze", "Silver", "Gold", "Custom"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="ns-label">Valor (ex: 297.00)</span>
                <input required className="ns-input" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
              </label>
              <label className="block">
                <span className="ns-label">Benefícios (separados por vírgula)</span>
                <input className="ns-input" value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} />
              </label>
              <label className="block">
                <span className="ns-label">Checkout URL</span>
                <input className="ns-input" value={form.checkoutUrl} onChange={(e) => setForm({ ...form, checkoutUrl: e.target.value })} />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />
                Plano ativo
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="ns-btn-ghost" onClick={() => setOpen(false)}>Cancelar</button>
              <button type="submit" className="ns-btn-primary" disabled={save.isPending}>
                {save.isPending ? "Salvando..." : "Salvar"}
              </button>
            </div>
            {save.isError ? (
              <p className="mt-3 text-sm text-danger">{(save.error as Error).message}</p>
            ) : null}
          </form>
        </div>
      ) : null}
    </AppShell>
  );
}
