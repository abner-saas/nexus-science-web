"use client";

import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dumbbell, HeartPulse, LogOut, Ruler, Wallet } from "lucide-react";
import { ApiError, api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Tab = "treino" | "bio" | "pagamentos" | "avaliacao";

export default function AlunoAppPage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const studentId = user?.studentId;
  const router = useRouter();
  const qc = useQueryClient();
  const [hydrated, setHydrated] = useState(false);
  const [tab, setTab] = useState<Tab>("treino");
  const [bio, setBio] = useState({
    energy: 7,
    mood: 7,
    stress: 4,
    sleep: 7,
    musclePain: 3,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.me();
        if (!cancelled) setUser(res.user);
      } catch (err) {
        if (!cancelled) {
          setUser(null);
          if (err instanceof ApiError && err.code === "LEAD") {
            router.replace("/conhecer");
            return;
          }
        }
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router, setUser]);

  const routines = useQuery({
    queryKey: ["aluno-routines", studentId],
    queryFn: () => api.routines.list(studentId!),
    enabled: !!studentId,
  });
  const payments = useQuery({
    queryKey: ["aluno-payments", studentId],
    queryFn: () => api.payments.list(studentId ?? undefined),
    enabled: !!studentId,
  });
  const assessments = useQuery({
    queryKey: ["aluno-assessments", studentId],
    queryFn: () => api.assessments.list(studentId!),
    enabled: !!studentId && tab === "avaliacao",
  });
  const bioHistory = useQuery({
    queryKey: ["aluno-bio", studentId],
    queryFn: () => api.biofeedback.list(studentId!, 14),
    enabled: !!studentId && tab === "bio",
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
    onSuccess: () => qc.invalidateQueries({ queryKey: ["aluno-bio"] }),
  });

  async function logout() {
    try {
      await api.logout();
    } finally {
      setUser(null);
      router.replace("/login?as=aluno");
    }
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-sm text-black/50">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-4">
        <div className="ns-card max-w-sm p-6 text-center">
          <p className="font-brand text-2xl text-navy">Nexus Science</p>
          <p className="mt-2 text-sm text-black/55">App do aluno — treino, bio e pagamentos</p>
          <Link href="/login?as=aluno" className="ns-btn-primary mt-4 inline-flex">
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
            Esta tela é o app do aluno. Entre com um login STUDENT (demo:{" "}
            <strong>oliver@email.com</strong> / <strong>AlunoDemo123!</strong> após o seed) ou Google
            com e-mail já no CRM.
          </p>
          <div className="mt-4 flex gap-2">
            <Link href="/login?as=aluno" className="ns-btn-primary inline-flex">
              Login aluno
            </Link>
            <Link href="/dashboard" className="ns-btn-secondary inline-flex">
              Painel
            </Link>
          </div>
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
    <div className="min-h-screen bg-input pb-24">
      <header className="border-b border-line bg-white px-4 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div>
            <p className="font-brand text-xl tracking-wide text-navy">Nexus Science</p>
            <p className="text-sm text-black/50">Olá, {user.name}</p>
          </div>
          <button type="button" onClick={logout} className="ns-btn-ghost text-xs" aria-label="Sair">
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-4 py-5">
        {tab === "treino" ? (
          <section className="ns-card p-4">
            <h2 className="font-title text-base font-bold text-ink">Meu treino</h2>
            {!routine ? (
              <p className="mt-2 text-sm text-black/50">Nenhuma rotina atribuída ainda</p>
            ) : (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-black/55">
                  {routine.name} · {routine.completedSessions ?? 0} sessões feitas
                </p>
                {routine.trainings.map((t) => (
                  <div key={t.id} className="rounded-xl border border-line bg-input p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold">
                          {t.code} — {t.name}
                        </p>
                        <p className="text-xs text-black/45">{[t.focus, t.dayOfWeek].filter(Boolean).join(" · ")}</p>
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
                      {t.exercises.map((ex, i) => (
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
        ) : null}

        {tab === "bio" ? (
          <>
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
              <button
                type="submit"
                className="ns-btn-primary mt-4 w-full justify-center"
                disabled={saveBio.isPending}
              >
                {saveBio.isPending ? "Salvando..." : saveBio.isSuccess ? "Salvo!" : "Registrar"}
              </button>
            </form>
            <section className="ns-card p-4">
              <p className="ns-kpi-label">Últimos 14 dias</p>
              <ul className="mt-3 space-y-2 text-sm">
                {(bioHistory.data?.data ?? []).map((r) => (
                  <li key={r.id} className="flex justify-between border-b border-line/70 py-1">
                    <span className="text-black/50">{r.date}</span>
                    <span>E{r.energy} · S{r.sleep} · D{r.musclePain}</span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : null}

        {tab === "pagamentos" ? (
          <section className="ns-card overflow-hidden">
            <div className="border-b border-line px-4 py-3">
              <h2 className="font-title text-base font-bold text-ink">Pagamentos</h2>
            </div>
            <table className="min-w-full text-left text-sm">
              <thead className="text-[11px] uppercase text-black/40">
                <tr>
                  <th className="px-4 py-2">Vencimento</th>
                  <th className="px-4 py-2">Valor</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {(payments.data?.data ?? []).map((p) => (
                  <tr key={p.id} className="border-t border-line/70">
                    <td className="px-4 py-2">{p.dueDate}</td>
                    <td className="px-4 py-2">{formatCurrency(p.amount)}</td>
                    <td className="px-4 py-2">{p.status}</td>
                  </tr>
                ))}
                {(payments.data?.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-black/45">
                      Nenhuma cobrança em aberto
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </section>
        ) : null}

        {tab === "avaliacao" ? (
          <section className="ns-card p-4">
            <h2 className="font-title text-base font-bold text-ink">Avaliações</h2>
            <table className="mt-3 w-full text-left text-sm">
              <thead className="text-[11px] uppercase text-black/40">
                <tr>
                  <th className="py-1">Data</th>
                  <th>Peso</th>
                  <th>IMC</th>
                  <th>% Gordura</th>
                </tr>
              </thead>
              <tbody>
                {(assessments.data?.data ?? []).map((r) => (
                  <tr key={r.id} className="border-t border-line/70">
                    <td className="py-2">{r.date}</td>
                    <td>{r.weight ?? "—"}</td>
                    <td>{r.bmi ?? "—"}</td>
                    <td>{r.bodyFat ?? "—"}</td>
                  </tr>
                ))}
                {(assessments.data?.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-black/45">
                      Sem avaliações ainda
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </section>
        ) : null}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white">
        <div className="mx-auto grid max-w-lg grid-cols-4">
          {(
            [
              ["treino", "Treino", Dumbbell],
              ["bio", "Bio", HeartPulse],
              ["pagamentos", "Pagar", Wallet],
              ["avaliacao", "Avaliação", Ruler],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold ${
                tab === id ? "text-navy" : "text-black/40"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
