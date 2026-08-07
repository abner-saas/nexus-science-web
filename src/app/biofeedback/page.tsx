"use client";

import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { MiniLine } from "@/components/ui/charts";
import { api } from "@/lib/api";

export default function BiofeedbackPage() {
  const qc = useQueryClient();
  const { data: students } = useQuery({ queryKey: ["students"], queryFn: () => api.students.list() });
  const [studentId, setStudentId] = useState("");
  const [insight, setInsight] = useState<string | null>(null);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    energy: 7,
    mood: 7,
    stress: 4,
    sleep: 7,
    musclePain: 3,
    hydration: "2.5",
    weight: "",
  });

  useEffect(() => {
    if (!studentId && students?.data?.[0]) setStudentId(students.data[0].id);
  }, [students, studentId]);

  const { data, isLoading } = useQuery({
    queryKey: ["bio", studentId],
    queryFn: () => api.biofeedback.list(studentId, 30),
    enabled: !!studentId,
  });

  const create = useMutation({
    mutationFn: () =>
      api.biofeedback.create({
        studentId,
        date: form.date,
        energy: form.energy,
        mood: form.mood,
        stress: form.stress,
        sleep: form.sleep,
        musclePain: form.musclePain,
        hydration: form.hydration,
        weight: form.weight || null,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bio", studentId] }),
  });

  const generate = useMutation({
    mutationFn: () => api.biofeedback.insight(studentId),
    onSuccess: (res) => setInsight(res.data.insight),
  });

  const rows = data?.data ?? [];
  const energySeries = [...rows].reverse().map((r) => r.energy ?? 0);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    create.mutate();
  }

  return (
    <AppShell
      title="Biofeedback"
      subtitle="Indicadores de bem-estar, recuperação e performance"
      actions={
        <button
          type="button"
          className="ns-btn-primary"
          disabled={!studentId || generate.isPending}
          onClick={() => generate.mutate()}
        >
          {generate.isPending ? "Gerando..." : "Gerar Análise IA"}
        </button>
      }
    >
      <div className="mb-4">
        <label className="block max-w-sm">
          <span className="ns-label">Aluno</span>
          <select className="ns-input bg-white" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
            {(students?.data ?? []).map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="ns-card p-5">
          <p className="ns-kpi-label">Energia (30 dias)</p>
          <div className="mt-3">
            <MiniLine values={energySeries} color="#002060" height={100} />
          </div>
          {isLoading ? (
            <p className="mt-4 text-sm text-black/45">Carregando...</p>
          ) : (
            <div className="mt-4 max-h-56 overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-[11px] uppercase text-black/40">
                  <tr>
                    <th className="py-1">Data</th>
                    <th>Energia</th>
                    <th>Sono</th>
                    <th>Estresse</th>
                    <th>Dor</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-t border-line/70">
                      <td className="py-1.5">{r.date}</td>
                      <td>{r.energy ?? "—"}</td>
                      <td>{r.sleep ?? "—"}</td>
                      <td>{r.stress ?? "—"}</td>
                      <td>{r.musclePain ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <form onSubmit={onSubmit} className="ns-card p-5">
            <p className="ns-kpi-label">Registrar dia</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="col-span-2 block">
                <span className="ns-label">Data</span>
                <input type="date" className="ns-input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </label>
              {(["energy", "mood", "stress", "sleep", "musclePain"] as const).map((key) => (
                <label key={key} className="block">
                  <span className="ns-label capitalize">{key === "musclePain" ? "Dor muscular" : key}</span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    className="ns-input"
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
                  />
                </label>
              ))}
              <label className="block">
                <span className="ns-label">Hidratação (L)</span>
                <input className="ns-input" value={form.hydration} onChange={(e) => setForm({ ...form, hydration: e.target.value })} />
              </label>
              <label className="block">
                <span className="ns-label">Peso (kg)</span>
                <input className="ns-input" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
              </label>
            </div>
            <button type="submit" className="ns-btn-primary mt-4" disabled={create.isPending || !studentId}>
              {create.isPending ? "Salvando..." : "Salvar biofeedback"}
            </button>
          </form>

          <div className="ns-card border-l-4 border-l-maroon p-5">
            <p className="ns-kpi-label text-maroon">Insight científico</p>
            {insight ? (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-black/70">{insight}</p>
            ) : (
              <p className="mt-3 text-sm text-black/45">
                Clique em &quot;Gerar Análise IA&quot; para cruzar os últimos 7 dias com o objetivo do aluno.
              </p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
