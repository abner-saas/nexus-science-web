"use client";

import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/badge";
import { api, type Routine } from "@/lib/api";

type ExerciseDraft = {
  name: string;
  group: string;
  sets: number;
  reps: string;
  load?: number;
  rest?: string;
};

const ROUTINE_STATUSES = ["Em digitação", "A liberar", "Em andamento", "Concluída"] as const;

export default function TreinosPage() {
  const qc = useQueryClient();
  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: () => api.students.list(),
  });
  const [studentId, setStudentId] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["routines", studentId],
    queryFn: () => api.routines.list(studentId),
    enabled: Boolean(studentId),
  });
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [editingTrainingId, setEditingTrainingId] = useState<string | null>(null);
  const [exercises, setExercises] = useState<ExerciseDraft[]>([]);
  const [form, setForm] = useState({
    name: "",
    objective: "",
    frequency: 3,
    status: "Em digitação",
  });

  const routines = useMemo(() => data?.data ?? [], [data?.data]);
  const selectedRoutine = useMemo(
    () => routines.find((routine) => routine.id === selected) ?? routines[0] ?? null,
    [routines, selected],
  );

  const create = useMutation({
    mutationFn: () =>
      api.routines.create({
        studentId,
        name: form.name,
        objective: form.objective || null,
        frequency: form.frequency,
        status: form.status,
      }),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ["routines", studentId] });
      setSelected(result.data.id);
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
      qc.invalidateQueries({ queryKey: ["routines", studentId] });
      setEditOpen(false);
      setEditingTrainingId(null);
    },
  });

  const addTraining = useMutation({
    mutationFn: (routineId: string) => {
      const codes = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const routine = routines.find((item) => item.id === routineId);
      const nextCode = codes[routine?.trainings.length ?? 0] ?? "X";
      return api.routines.addTraining(routineId, {
        code: nextCode,
        name: `Treino ${nextCode}`,
        focus: null,
        dayOfWeek: null,
        duration: null,
        exercises: [],
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["routines", studentId] }),
  });

  const removeRoutine = useMutation({
    mutationFn: (id: string) => api.routines.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["routines", studentId] });
      setSelected(null);
    },
  });

  const removeTraining = useMutation({
    mutationFn: (id: string) => api.routines.removeTraining(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["routines", studentId] }),
  });

  const setStatus = useMutation({
    mutationFn: (status: string) => api.routines.update(selectedRoutine!.id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["routines", studentId] }),
  });

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
      subtitle="Aluno, depois a rotina, depois o treino e os exercícios"
      actions={
        <button
          type="button"
          className="ns-btn-primary"
          disabled={!studentId}
          onClick={() => setOpen(true)}
        >
          Nova rotina
        </button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[220px_260px_1fr]">
        <div className="ns-card overflow-hidden">
          <div className="border-b border-line bg-surface px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-black/45">
            Aluno
          </div>
          <ul>
            {(students?.data ?? []).map((student) => (
              <li key={student.id}>
                <button
                  type="button"
                  onClick={() => {
                    setStudentId(student.id);
                    setSelected(null);
                  }}
                  className={`w-full border-b border-line/70 px-4 py-3 text-left text-sm hover:bg-input ${
                    studentId === student.id ? "bg-navy/5 font-semibold text-navy" : ""
                  }`}
                >
                  {student.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="ns-card overflow-hidden">
          <div className="border-b border-line bg-surface px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-black/45">
            Rotinas
          </div>
          {!studentId ? (
            <p className="p-4 text-sm text-black/45">
              Selecione um aluno para ver as rotinas dele.
            </p>
          ) : isLoading ? (
            <p className="p-4 text-sm text-black/45">Carregando...</p>
          ) : routines.length === 0 ? (
            <p className="p-4 text-sm text-black/45">Este aluno ainda não tem rotina.</p>
          ) : (
            <ul>
              {routines.map((routine) => (
                <li key={routine.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(routine.id)}
                    className={`w-full border-b border-line/70 px-4 py-3 text-left text-sm hover:bg-input ${
                      selectedRoutine?.id === routine.id ? "bg-navy/5 font-semibold text-navy" : ""
                    }`}
                  >
                    <p>{routine.name}</p>
                    <p className="text-xs font-normal text-black/45">{routine.status}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="ns-card p-5">
          {!selectedRoutine ? (
            <p className="text-sm text-black/50">
              {studentId ? "Crie ou selecione uma rotina." : "Comece escolhendo o aluno."}
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-title text-xl font-bold text-navy">{selectedRoutine.name}</h2>
                  <p className="text-sm text-black/50">
                    {selectedRoutine.frequency}x/semana · {selectedRoutine.completedSessions ?? 0}/
                    {selectedRoutine.totalSessions ?? 0} sessões
                  </p>
                  {selectedRoutine.objective ? (
                    <p className="mt-2 text-sm text-black/60">{selectedRoutine.objective}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="text-xs text-black/50">
                    Status
                    <select
                      className="ns-input ml-2 inline-block w-auto"
                      value={selectedRoutine.status}
                      disabled={setStatus.isPending}
                      onChange={(e) => setStatus.mutate(e.target.value)}
                    >
                      {ROUTINE_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                      {ROUTINE_STATUSES.includes(
                        selectedRoutine.status as (typeof ROUTINE_STATUSES)[number],
                      ) ? null : (
                        <option value={selectedRoutine.status}>{selectedRoutine.status}</option>
                      )}
                    </select>
                  </label>
                  <StatusBadge status={selectedRoutine.status} />
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
                </div>
              </div>
              <p className="mt-3 text-xs text-black/45">
                Ao concluir a rotina em andamento, a próxima marcada como &quot;A liberar&quot;
                passa a ser a rotina em andamento. O app do aluno mostra só essa.
              </p>

              <div className="mt-5 space-y-4">
                {selectedRoutine.trainings.length === 0 ? (
                  <p className="text-sm text-black/45">
                    Nenhum treino nesta rotina. Crie o Treino A.
                  </p>
                ) : null}
                {selectedRoutine.trainings.map((training) => (
                  <div key={training.id} className="rounded-xl border border-line bg-input/60 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-ink">
                        {training.code} — {training.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="ns-btn-ghost text-xs"
                          onClick={() => openEditor(training)}
                        >
                          {training.exercises.length ? "Editar exercícios" : "Incluir exercício"}
                        </button>
                        <button
                          type="button"
                          className="ns-btn-ghost text-xs text-danger"
                          onClick={() => {
                            if (confirm(`Excluir ${training.name}?`))
                              removeTraining.mutate(training.id);
                          }}
                        >
                          Excluir treino
                        </button>
                      </div>
                    </div>
                    {training.exercises.length === 0 ? (
                      <p className="mt-3 text-sm text-black/45">Nenhum exercício neste treino.</p>
                    ) : (
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
                          {training.exercises.map((ex, index) => (
                            <tr key={`${ex.name}-${index}`} className="border-t border-line/60">
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
                    )}
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
                <span className="ns-label">Nome da rotina</span>
                <input
                  required
                  className="ns-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="ns-label">Objetivo</span>
                <input
                  className="ns-input"
                  value={form.objective}
                  onChange={(e) => setForm({ ...form, objective: e.target.value })}
                />
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
              <label className="block">
                <span className="ns-label">Status inicial</span>
                <select
                  className="ns-input"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {ROUTINE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="mt-3 text-xs text-black/45">
              A rotina nasce sem treino. O próximo passo é criar Treino A, B ou C e incluir os
              exercícios.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="ns-btn-ghost" onClick={() => setOpen(false)}>
                Cancelar
              </button>
              <button type="submit" className="ns-btn-primary" disabled={create.isPending}>
                {create.isPending ? "Salvando..." : "Criar"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {editOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={onSaveExercises}
            className="ns-card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6"
          >
            <h2 className="font-title text-xl font-bold text-navy">Exercícios do treino</h2>
            <div className="mt-4 space-y-3">
              {exercises.map((ex, idx) => (
                <div
                  key={idx}
                  className="grid gap-2 rounded-xl border border-line bg-input/50 p-3 sm:grid-cols-6"
                >
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
