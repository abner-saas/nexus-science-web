"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";

export default function AlunoAppPage() {
  const user = useAuthStore((s) => s.user);
  const studentId = user?.studentId;
  const qc = useQueryClient();
  const [bio, setBio] = useState({
    energy: 7,
    mood: 7,
    stress: 4,
    sleep: 7,
    musclePain: 3,
  });

  const routines = useQuery({
    queryKey: ["aluno-routines", studentId],
    queryFn: () => api.routines.list(studentId!),
    enabled: !!studentId,
  });

  const session = useMutation({
    mutationFn: (trainingId: string) =>
      api.sessions.create({
        studentId,
        trainingId,
        routineId: routines.data?.data?.[0]?.id,
        date: new Date().toISOString().slice(0, 10),
        status: "COMPLETED",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["aluno-routines"] }),
  });

  const saveBio = useMutation({
    mutationFn: () =>
      api.biofeedback.create({
        studentId,
        date: new Date().toISOString().slice(0, 10),
        ...bio,
      }),
  });

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-4">
        <div className="ns-card max-w-sm p-6 text-center">
          <p className="font-brand text-2xl text-navy">Nexus Science</p>
          <p className="mt-2 text-sm text-black/55">Faça login no app do aluno</p>
          <Link href="/login" className="ns-btn-primary mt-4 inline-flex">
            Entrar
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== "STUDENT" || !studentId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-4">
        <div className="ns-card max-w-md p-6">
          <p className="font-title text-lg font-bold text-navy">App do Aluno</p>
          <p className="mt-2 text-sm text-black/55">
            Você está logado como <strong>{user.role}</strong>. O app do aluno
            exige papel STUDENT vinculado a um aluno no CRM.
          </p>
          <Link href="/dashboard" className="ns-btn-secondary mt-4 inline-flex">
            Ir ao painel
          </Link>
        </div>
      </div>
    );
  }

  const routine = routines.data?.data?.[0];

  function onBio(e: FormEvent) {
    e.preventDefault();
    saveBio.mutate();
  }

  return (
    <div className="min-h-screen bg-input pb-10">
      <header className="border-b border-line bg-white px-4 py-4">
        <p className="font-brand text-xl tracking-wide text-navy">Nexus Science</p>
        <p className="text-sm text-black/50">Olá, {user.name}</p>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-4 py-5">
        <section className="ns-card p-4">
          <h2 className="font-title text-base font-bold text-ink">Meu treino</h2>
          {!routine ? (
            <p className="mt-2 text-sm text-black/50">Nenhuma rotina atribuída ainda</p>
          ) : (
            <div className="mt-3 space-y-3">
              <p className="text-sm text-black/55">{routine.name}</p>
              {routine.trainings.map((t) => (
                <div key={t.id} className="rounded-xl border border-line bg-input p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold">{t.code} — {t.name}</p>
                      <p className="text-xs text-black/45">{t.focus}</p>
                    </div>
                    <button
                      type="button"
                      className="ns-btn-primary text-xs"
                      disabled={session.isPending}
                      onClick={() => session.mutate(t.id)}
                    >
                      Fiz hoje
                    </button>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-black/60">
                    {t.exercises.slice(0, 4).map((ex, i) => (
                      <li key={i}>
                        {ex.name} · {ex.sets}x{ex.reps}
                        {ex.load ? ` · ${ex.load}kg` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        <form onSubmit={onBio} className="ns-card p-4">
          <h2 className="font-title text-base font-bold text-ink">Biofeedback de hoje</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(
              [
                ["energy", "Energia"],
                ["mood", "Humor"],
                ["stress", "Estresse"],
                ["sleep", "Sono"],
                ["musclePain", "Dor"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block">
                <span className="ns-label">{label}</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  className="ns-input"
                  value={bio[key]}
                  onChange={(e) => setBio({ ...bio, [key]: Number(e.target.value) })}
                />
              </label>
            ))}
          </div>
          <button type="submit" className="ns-btn-primary mt-4 w-full justify-center" disabled={saveBio.isPending}>
            {saveBio.isPending ? "Salvando..." : saveBio.isSuccess ? "Salvo!" : "Registrar"}
          </button>
        </form>
      </main>
    </div>
  );
}
