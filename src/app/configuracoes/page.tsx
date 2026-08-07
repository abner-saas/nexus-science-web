"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { api, type StaffUser } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/roles";

type StaffRole = "ADMIN" | "TRAINER" | "FINANCE" | "RECEPTION";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "ADMIN";
  const qc = useQueryClient();
  const [tab, setTab] = useState<"perfil" | "equipe">(isAdmin ? "equipe" : "perfil");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<StaffUser | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "TRAINER" as StaffRole,
  });

  const team = useQuery({
    queryKey: ["users"],
    queryFn: () => api.users.list(),
    enabled: isAdmin,
  });

  const save = useMutation({
    mutationFn: () => {
      if (editing) {
        return api.users.update(editing.id, {
          name: form.name,
          email: form.email,
          role: form.role,
          ...(form.password ? { password: form.password } : {}),
        });
      }
      return api.users.create({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      setOpen(false);
      setEditing(null);
    },
  });

  const toggleActive = useMutation({
    mutationFn: (u: StaffUser) => api.users.update(u.id, { active: !u.active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });

  function openCreate() {
    setEditing(null);
    setForm({ name: "", email: "", password: "", role: "TRAINER" });
    setOpen(true);
  }

  function openEdit(u: StaffUser) {
    setEditing(u);
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: (u.role === "STUDENT" ? "TRAINER" : u.role) as StaffRole,
    });
    setOpen(true);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    save.mutate();
  }

  return (
    <AppShell title="Configurações" subtitle="Perfil, equipe e permissões de acesso">
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("perfil")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${
            tab === "perfil" ? "bg-navy text-white" : "border border-line bg-white text-navy"
          }`}
        >
          Perfil
        </button>
        {isAdmin ? (
          <button
            type="button"
            onClick={() => setTab("equipe")}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              tab === "equipe" ? "bg-navy text-white" : "border border-line bg-white text-navy"
            }`}
          >
            Equipe & Acessos
          </button>
        ) : null}
      </div>

      {tab === "perfil" ? (
        <div className="ns-card p-6">
          <h2 className="font-display text-base font-bold text-ink">Perfil Profissional</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ["Nome", user?.name ?? "—"],
              ["E-mail", user?.email ?? "—"],
              ["Papel", user?.role ? ROLE_LABELS[user.role] : "—"],
            ].map(([label, value]) => (
              <label key={label} className="block">
                <span className="ns-label uppercase tracking-[0.06em] !text-[11px] !text-black/42">
                  {label}
                </span>
                <input className="ns-input" defaultValue={value} readOnly />
              </label>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {(Object.keys(ROLE_DESCRIPTIONS) as StaffRole[]).map((role) => (
              <div key={role} className="ns-card p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-navy">
                  {ROLE_LABELS[role]}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-black/55">
                  {ROLE_DESCRIPTIONS[role]}
                </p>
              </div>
            ))}
          </div>

          <div className="ns-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-black/45">
                Funcionários
              </p>
              <button type="button" className="ns-btn-primary text-xs" onClick={openCreate}>
                Novo acesso
              </button>
            </div>
            <table className="min-w-full text-left text-sm">
              <thead className="text-[11px] uppercase text-black/40">
                <tr>
                  <th className="px-4 py-2">Nome</th>
                  <th className="px-4 py-2">E-mail</th>
                  <th className="px-4 py-2">Papel</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {(team.data?.data ?? []).map((u) => (
                  <tr key={u.id} className="border-t border-line/70">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-black/60">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-navy/10 px-2 py-0.5 text-xs font-semibold text-navy">
                        {ROLE_LABELS[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={u.active ? "text-success" : "text-danger"}>
                        {u.active ? "Ativo" : "Desativado"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button type="button" className="ns-btn-ghost text-xs" onClick={() => openEdit(u)}>
                          Editar
                        </button>
                        {u.id !== user?.id ? (
                          <button
                            type="button"
                            className="ns-btn-secondary text-xs"
                            onClick={() => toggleActive.mutate(u)}
                          >
                            {u.active ? "Desativar" : "Reativar"}
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
                {(team.data?.data ?? []).length === 0 && !team.isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-black/45">
                      Nenhum funcionário além do admin
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-black/45">
            Treinadores só enxergam alunos com <code className="rounded bg-input px-1">trainerId</code>{" "}
            igual ao próprio usuário. Ao desativar, o login é revogado na hora.
          </p>
        </>
      )}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={onSubmit} className="ns-card w-full max-w-md p-6">
            <h2 className="font-title text-xl font-bold text-navy">
              {editing ? "Editar acesso" : "Novo funcionário"}
            </h2>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="ns-label">Nome</span>
                <input required className="ns-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label className="block">
                <span className="ns-label">E-mail</span>
                <input required type="email" className="ns-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label className="block">
                <span className="ns-label">{editing ? "Nova senha (opcional)" : "Senha temporária"}</span>
                <input
                  required={!editing}
                  minLength={8}
                  type="password"
                  className="ns-input"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="ns-label">Papel / tier de acesso</span>
                <select
                  className="ns-input"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as StaffRole })}
                >
                  {(Object.keys(ROLE_DESCRIPTIONS) as StaffRole[]).map((role) => (
                    <option key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-black/45">{ROLE_DESCRIPTIONS[form.role]}</p>
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="ns-btn-ghost" onClick={() => setOpen(false)}>
                Cancelar
              </button>
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
