"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { api, type Routine } from "@/lib/api";

type ExerciseDraft = {
  name: string;
  group: string;
  sets: number;
  reps: string;
  load?: number;
  rest?: string;
};

export default function TreinosPage() {
  const qc = useQueryClient();
  const { data: students } = useQuery({ queryKey: ["students"], queryFn: () => api.students.list() });
  const { data, isLoading } = useQuery({ queryKey: ["routines"], queryFn: () => api.routines.list() });
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [editingTrainingId, setEditingTrainingId] = useState<string | null>(null);
  const [exercises, setExercises] = useState<ExerciseDraft[]>([]);
  const [form, setForm] = useState({
    studentId: "",
    name: "",
    objective: "",
    frequency: 3,
  });

  const create = useMutation({
    mutationFn: () =>
      api.routines.create({
        studentId: form.studentId,
        name: form.name,
        objective: form.objective || null,
        frequency: form.frequency,
        trainings: [
          {
            code: "A",
            name: "Treino A",
            focus: "Full body",
            dayOfWeek: "Segunda",
            duration: "45 min",
            exercises: [
              { name: "Agachamento", group: "Quadríceps", sets: 4, reps: "12", load: 40, rest: "60s" },
              { name: "Supino", group: "Peitoral", sets: 4, reps: "10", load: 40, rest: "90s" },
            ],
          },
        ],
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["routines"] });
      setOpen(false);
    },
  });

  const saveExercises = useMutation({
    mutationFn: () =>
      api.routines.updateTraining(editingTrainingId!, {
        exercises: exercises.map((ex) => ({
          name: ex.name,
          group: ex.group,
          sets: Number(ex.sets),
          reps: ex.reps,
          load: ex.load ? Number(ex.load) : undefined,
          rest: ex.rest || undefined,
        })),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["routines"] });
      setEditOpen(false);
      setEditingTrainingId(null);
    },
  });

  const addTraining = useMutation({
    mutationFn: (routineId: string) => {
      const codes = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const routine = (data?.data ?? []).find((r) => r.id === routineId);
      const nextCode = codes[routine?.trainings.length ?? 0] ?? "X";
      return api.routines.addTraining(routineId, {
        code: nextCode,
        name: `Treino ${nextCode}`,
        focus: "Geral",
        dayOfWeek: null,
        duration: "45 min",
        exercises: [{ name: "Exercício 1", group: "Geral", sets: 3, reps: "10", rest: "60s" }],
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["routines"] }),
  });

  const removeRoutine = useMutation({
    mutationFn: (id: string) => api.routines.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["routines"] });
      setSelected(null);
    },
  });

  const selectedRoutine = useMemo(
    () => (data?.data ?? []).find((r) => r.id === selected) ?? data?.data?.[0] ?? null,
    [data, selected],
  );

  useEffect(() => {
    if (selectedRoutine && !selected) setSelected(selectedRoutine.id);
  }, [selectedRoutine, selected]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    create.mutate();
  }

  function openEditor(training: Routine["trainings"][number]) {
    setEditingTrainingId(training.id);
    setExercises(
      training.exercises.map((ex) => ({
        name: ex.name,
        group: ex.group,
        sets: ex.sets,
        reps: ex.reps,
        load: ex.load,
        rest: ex.rest,
      })),
    );
    setEditOpen(true);
  }

  function onSaveExercises(e: FormEvent) {
    e.preventDefault();
    saveExercises.mutate();
  }

  return (
    <AppShell
      title="Acompanhamento de Treinos"
      subtitle="Rotinas → treinos → exercícios"
      actions={
        <button type="button" className="ns-btn-primary" onClick={() => setOpen(true)}>
          Nova rotina
        </button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="ns-card overflow-hidden">
          <div className="border-b border-line bg-surface px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-black/45">
            Rotinas
          </div>
          {isLoading ? (
            <p className="p-4 text-sm text-black/45">Carregando...</p>
          ) : (
            <ul>
              {(data?.data ?? []).map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(r.id)}
                    className={`w-full border-b border-line/70 px-4 py-3 text-left text-sm transition hover:bg-input ${
                      (selected ?? data?.data?.[0]?.id) === r.id ? "bg-navy/5 font-semibold text-navy" : ""
                    }`}
                  >
                    <p>{r.name}</p>
                    <p className="text-xs font-normal text-black/45">{r.studentName}</p>
                  </button>
                </li>
              ))}
              {(data?.data ?? []).length === 0 ? (
                <li className="p-4 text-sm text-black/45">Nenhuma rotina ainda</li>
              ) : null}
            </ul>
          )}
        </div>

        <div className="ns-card p-5">
          {!selectedRoutine ? (
            <p className="text-sm text-black/50">Selecione ou crie uma rotina</p>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-title text-xl font-bold text-navy">{selectedRoutine.name}</h2>
                  <p className="text-sm text-black/50">
                    {selectedRoutine.studentName} · {selectedRoutine.frequency}x/semana ·{" "}
                    {selectedRoutine.completedSessions ?? 0}/{selectedRoutine.totalSessions ?? 0} sessões
                  </p>
                  {selectedRoutine.objective ? (
                    <p className="mt-2 text-sm text-black/60">{selectedRoutine.objective}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="ns-btn-secondary text-xs"
                    disabled={addTraining.isPending}
                    onClick={() => addTraining.mutate(selectedRoutine.id)}
                  >
                    + Treino
                  </button>
                  <button
                    type="button"
                    className="ns-btn-ghost text-xs text-danger"
                    onClick={() => {
                      if (confirm("Excluir esta rotina?")) removeRoutine.mutate(selectedRoutine.id);
                    }}
                  >
                    Excluir rotina
                  </button>
                  <span className="rounded-full bg-navy/10 px-2.5 py-0.5 text-xs font-semibold text-navy">
                    {selectedRoutine.status}
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {selectedRoutine.trainings.map((t) => (
                  <div key={t.id} className="rounded-xl border border-line bg-input/60 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-ink">
                        {t.code} — {t.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-black/45">
                          {[t.dayOfWeek, t.focus, t.duration].filter(Boolean).join(" · ")}
                        </p>
                        <button
                          type="button"
                          className="ns-btn-ghost text-xs"
                          onClick={() => openEditor(t)}
                        >
                          Editar exercícios
                        </button>
                      </div>
                    </div>
                    <table className="mt-3 w-full text-left text-sm">
                      <thead className="text-[11px] uppercase tracking-wider text-black/40">
                        <tr>
                          <th className="py-1">Exercício</th>
                          <th className="py-1">Séries</th>
                          <th className="py-1">Reps</th>
                          <th className="py-1">Carga</th>
                        </tr>
                      </thead>
                      <tbody>
                        {t.exercises.map((ex, i) => (
                          <tr key={i} className="border-t border-line/60">
                            <td className="py-2">
                              <p className="font-medium">{ex.name}</p>
                              <p className="text-xs text-black/40">{ex.group}</p>
                            </td>
                            <td className="py-2">{ex.sets}</td>
                            <td className="py-2">{ex.reps}</td>
                            <td className="py-2">{ex.load ? `${ex.load} kg` : "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={onSubmit} className="ns-card w-full max-w-md p-6">
            <h2 className="font-title text-xl font-bold text-navy">Nova rotina</h2>
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
                  {(students?.data ?? []).map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="ns-label">Nome da rotina</span>
                <input required className="ns-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label className="block">
                <span className="ns-label">Objetivo</span>
                <input className="ns-input" value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} />
              </label>
              <label className="block">
                <span className="ns-label">Frequência semanal</span>
                <input
                  type="number"
                  min={1}
                  max={7}
                  className="ns-input"
                  value={form.frequency}
                  onChange={(e) => setForm({ ...form, frequency: Number(e.target.value) })}
                />
              </label>
            </div>
            <p className="mt-3 text-xs text-black/45">
              Será criado um Treino A inicial — edite os exercícios depois.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="ns-btn-ghost" onClick={() => setOpen(false)}>Cancelar</button>
              <button type="submit" className="ns-btn-primary" disabled={create.isPending}>
                {create.isPending ? "Salvando..." : "Criar"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {editOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={onSaveExercises} className="ns-card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6">
            <h2 className="font-title text-xl font-bold text-navy">Editar exercícios</h2>
            <div className="mt-4 space-y-3">
              {exercises.map((ex, idx) => (
                <div key={idx} className="grid gap-2 rounded-xl border border-line bg-input/50 p-3 sm:grid-cols-6">
                  <label className="block sm:col-span-2">
                    <span className="ns-label">Nome</span>
                    <input
                      required
                      className="ns-input"
                      value={ex.name}
                      onChange={(e) => {
                        const next = [...exercises];
                        next[idx] = { ...ex, name: e.target.value };
                        setExercises(next);
                      }}
                    />
                  </label>
                  <label className="block">
                    <span className="ns-label">Grupo</span>
                    <input
                      required
                      className="ns-input"
                      value={ex.group}
                      onChange={(e) => {
                        const next = [...exercises];
                        next[idx] = { ...ex, group: e.target.value };
                        setExercises(next);
                      }}
                    />
                  </label>
                  <label className="block">
                    <span className="ns-label">Séries</span>
                    <input
                      type="number"
                      min={1}
                      className="ns-input"
                      value={ex.sets}
                      onChange={(e) => {
                        const next = [...exercises];
                        next[idx] = { ...ex, sets: Number(e.target.value) };
                        setExercises(next);
                      }}
                    />
                  </label>
                  <label className="block">
                    <span className="ns-label">Reps</span>
                    <input
                      className="ns-input"
                      value={ex.reps}
                      onChange={(e) => {
                        const next = [...exercises];
                        next[idx] = { ...ex, reps: e.target.value };
                        setExercises(next);
                      }}
                    />
                  </label>
                  <label className="block">
                    <span className="ns-label">Carga</span>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        className="ns-input"
                        value={ex.load ?? ""}
                        onChange={(e) => {
                          const next = [...exercises];
                          next[idx] = {
                            ...ex,
                            load: e.target.value ? Number(e.target.value) : undefined,
                          };
                          setExercises(next);
                        }}
                      />
                      <button
                        type="button"
                        className="ns-btn-ghost shrink-0 px-2 text-danger"
                        onClick={() => setExercises(exercises.filter((_, i) => i !== idx))}
                      >
                        ×
                      </button>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="ns-btn-secondary mt-3 text-xs"
              onClick={() =>
                setExercises([
                  ...exercises,
                  { name: "", group: "Geral", sets: 3, reps: "10", rest: "60s" },
                ])
              }
            >
              + Exercício
            </button>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="ns-btn-ghost" onClick={() => setEditOpen(false)}>
                Cancelar
              </button>
              <button type="submit" className="ns-btn-primary" disabled={saveExercises.isPending}>
                {saveExercises.isPending ? "Salvando..." : "Salvar exercícios"}
              </button>
            </div>
            {saveExercises.isError ? (
              <p className="mt-3 text-sm text-danger">{(saveExercises.error as Error).message}</p>
            ) : null}
          </form>
        </div>
      ) : null}
    </AppShell>
  );
}
