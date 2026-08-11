"use client";

import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Mail, MessageCircle, Plus, Search, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/badge";
import { api, type Student } from "@/lib/api";
import { formatCurrency, whatsappLink } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

const STATUSES = ["", "Ativo", "Pausado", "Inadimplente", "Cancelado"] as const;

export default function CrmPage() {
  const qc = useQueryClient();
  const authUser = useAuthStore((s) => s.user);
  const isAdmin = authUser?.role === "ADMIN";
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [accessStudent, setAccessStudent] = useState<Student | null>(null);
  const [accessForm, setAccessForm] = useState({ email: "", password: "", name: "" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    goal: "",
    value: "",
    status: "Ativo",
    entryDate: new Date().toISOString().slice(0, 10),
    restrictions: "",
    trainerId: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["students", q, status],
    queryFn: () => api.students.list({ q: q || undefined, status: status || undefined }),
  });

  const trainers = useQuery({
    queryKey: ["users"],
    queryFn: () => api.users.list(),
    enabled: isAdmin,
  });

  const save = useMutation({
    mutationFn: () => {
      const body = {
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        city: form.city || null,
        state: form.state || null,
        goal: form.goal || null,
        value: form.value || null,
        status: form.status,
        entryDate: form.entryDate,
        restrictions: form.restrictions || null,
        trainerId: form.trainerId || null,
      };
      return editingId ? api.students.update(editingId, body) : api.students.create(body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      setOpen(false);
      setEditingId(null);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.students.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      setOpen(false);
      setEditingId(null);
    },
  });

  const createAccess = useMutation({
    mutationFn: () =>
      api.users.createStudentAccess({
        studentId: accessStudent!.id,
        email: accessForm.email,
        password: accessForm.password,
        name: accessForm.name || accessStudent!.name,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      setAccessOpen(false);
      setAccessStudent(null);
    },
  });

  const students = useMemo(() => data?.data ?? [], [data?.data]);
  const counts = useMemo(() => {
    return {
      total: students.length,
      ativos: students.filter((s) => s.status === "Ativo").length,
    };
  }, [students]);

  const trainerOptions = (trainers.data?.data ?? []).filter(
    (u) => u.active && (u.role === "TRAINER" || u.role === "ADMIN"),
  );

  function openCreate() {
    setEditingId(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      goal: "",
      value: "",
      status: "Ativo",
      entryDate: new Date().toISOString().slice(0, 10),
      restrictions: "",
      trainerId: "",
    });
    setOpen(true);
  }

  function openEdit(s: Student) {
    setEditingId(s.id);
    setForm({
      name: s.name,
      email: s.email ?? "",
      phone: s.phone ?? "",
      city: s.city ?? "",
      state: s.state ?? "",
      goal: s.goal ?? "",
      value: s.value ?? "",
      status: s.status,
      entryDate: s.entryDate,
      restrictions: s.restrictions ?? "",
      trainerId: s.trainerId ?? "",
    });
    setOpen(true);
  }

  function openAccess(s: Student) {
    setAccessStudent(s);
    setAccessForm({
      email: s.email ?? "",
      password: "",
      name: s.name,
    });
    setAccessOpen(true);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    save.mutate();
  }

  function onAccessSubmit(e: FormEvent) {
    e.preventDefault();
    createAccess.mutate();
  }

  return (
    <AppShell
      title="CRM de Alunos"
      subtitle={`Gestão completa da sua base · ${counts.ativos} ativos · ${counts.total} total`}
      actions={
        <button type="button" onClick={openCreate} className="ns-btn-primary">
          <Plus size={14} />
          Novo Aluno
        </button>
      }
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35" size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome ou e-mail"
            className="ns-input bg-white pl-9"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="ns-input bg-white sm:w-48"
        >
          {STATUSES.map((s) => (
            <option key={s || "all"} value={s}>
              {s || "Todos os status"}
            </option>
          ))}
        </select>
      </div>

      <div className="ns-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface text-[11px] font-semibold uppercase tracking-wider text-black/45">
              <tr>
                <th className="px-4 py-3">Aluno</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Engaj.</th>
                <th className="px-4 py-3">Risco</th>
                <th className="px-4 py-3">App</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-black/45">
                    Carregando alunos...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-black/45">
                    Nenhum aluno encontrado
                  </td>
                </tr>
              ) : (
                students.map((s: Student) => {
                  const wa = whatsappLink(s.phone);
                  return (
                    <tr
                      key={s.id}
                      className="cursor-pointer border-t border-line/80 hover:bg-input/80"
                      onClick={() => openEdit(s)}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink">{s.name}</p>
                        <p className="text-xs text-black/45">
                          {[s.city, s.state].filter(Boolean).join(" / ") || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="px-4 py-3">{formatCurrency(s.value)}</td>
                      <td className="px-4 py-3">{s.engagement ?? 0}%</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            (s.risk ?? 0) >= 60 ? "font-semibold text-danger" : "text-black/70"
                          }
                        >
                          {s.risk ?? 0}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={s.appAccess ? "text-success" : "text-black/40"}>
                          {s.appAccess ? "Sim" : "Não"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          {wa ? (
                            <a
                              href={wa}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg border border-line p-1.5 text-success hover:bg-surface"
                              title="WhatsApp"
                            >
                              <MessageCircle size={16} />
                            </a>
                          ) : null}
                          {s.email ? (
                            <a
                              href={`mailto:${s.email}`}
                              className="rounded-lg border border-line p-1.5 text-navy hover:bg-surface"
                              title="E-mail"
                            >
                              <Mail size={16} />
                            </a>
                          ) : null}
                          {isAdmin ? (
                            <button
                              type="button"
                              className="rounded-lg border border-line p-1.5 text-navy hover:bg-surface"
                              title="Criar acesso ao app"
                              onClick={() => openAccess(s)}
                            >
                              <KeyRound size={16} />
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={onSubmit}
            className="ns-card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6"
          >
            <h2 className="font-title text-xl font-bold text-navy">
              {editingId ? "Editar aluno" : "Novo Aluno"}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["name", "Nome", "text", true],
                  ["email", "E-mail", "email", false],
                  ["phone", "Telefone", "tel", false],
                  ["city", "Cidade", "text", false],
                  ["state", "UF", "text", false],
                  ["goal", "Objetivo", "text", false],
                  ["value", "Valor (ex: 297.00)", "text", false],
                  ["entryDate", "Data de entrada", "date", true],
                ] as const
              ).map(([key, label, type, required]) => (
                <label key={key} className="block sm:col-span-1">
                  <span className="ns-label">{label}</span>
                  <input
                    required={required}
                    type={type}
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="ns-input"
                  />
                </label>
              ))}
              <label className="block sm:col-span-2">
                <span className="ns-label">Status</span>
                <select
                  className="ns-input"
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                >
                  {["Ativo", "Pausado", "Inadimplente", "Cancelado"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              {isAdmin ? (
                <label className="block sm:col-span-2">
                  <span className="ns-label">Treinador responsável</span>
                  <select
                    className="ns-input"
                    value={form.trainerId}
                    onChange={(e) => setForm((f) => ({ ...f, trainerId: e.target.value }))}
                  >
                    <option value="">Sem treinador</option>
                    {trainerOptions.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.role})
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
              <label className="block sm:col-span-2">
                <span className="ns-label">Restrições / lesões</span>
                <textarea
                  value={form.restrictions}
                  onChange={(e) => setForm((f) => ({ ...f, restrictions: e.target.value }))}
                  className="ns-input"
                  rows={2}
                />
              </label>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
              {isAdmin && editingId ? (
                <button
                  type="button"
                  className="ns-btn-ghost text-danger"
                  disabled={remove.isPending}
                  onClick={() => {
                    if (confirm("Excluir este aluno permanentemente?")) {
                      remove.mutate(editingId);
                    }
                  }}
                >
                  <Trash2 size={14} />
                  Excluir
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setEditingId(null);
                  }}
                  className="ns-btn-ghost"
                >
                  Cancelar
                </button>
                <button type="submit" disabled={save.isPending} className="ns-btn-primary">
                  {save.isPending ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
            {save.isError ? (
              <p className="mt-3 text-sm text-danger">{(save.error as Error).message}</p>
            ) : null}
          </form>
        </div>
      ) : null}

      {accessOpen && accessStudent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={onAccessSubmit} className="ns-card w-full max-w-md p-6">
            <h2 className="font-title text-xl font-bold text-navy">Acesso ao app</h2>
            <p className="mt-1 text-sm text-black/55">
              Cria login STUDENT para <strong>{accessStudent.name}</strong>
            </p>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="ns-label">Nome no app</span>
                <input
                  required
                  className="ns-input"
                  value={accessForm.name}
                  onChange={(e) => setAccessForm({ ...accessForm, name: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="ns-label">E-mail de login</span>
                <input
                  required
                  type="email"
                  className="ns-input"
                  value={accessForm.email}
                  onChange={(e) => setAccessForm({ ...accessForm, email: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="ns-label">Senha temporária</span>
                <input
                  required
                  minLength={8}
                  type="password"
                  className="ns-input"
                  value={accessForm.password}
                  onChange={(e) => setAccessForm({ ...accessForm, password: e.target.value })}
                />
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="ns-btn-ghost"
                onClick={() => {
                  setAccessOpen(false);
                  setAccessStudent(null);
                }}
              >
                Cancelar
              </button>
              <button type="submit" className="ns-btn-primary" disabled={createAccess.isPending}>
                {createAccess.isPending ? "Criando..." : "Criar acesso"}
              </button>
            </div>
            {createAccess.isError ? (
              <p className="mt-3 text-sm text-danger">{(createAccess.error as Error).message}</p>
            ) : null}
          </form>
        </div>
      ) : null}
    </AppShell>
  );
}
