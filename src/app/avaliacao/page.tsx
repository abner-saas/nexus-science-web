"use client";

import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { MiniLine } from "@/components/ui/charts";
import { api } from "@/lib/api";

export default function AvaliacaoPage() {
  const qc = useQueryClient();
  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: () => api.students.list(),
  });
  const [studentId, setStudentId] = useState("");
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    weight: "",
    heightCm: "",
    bodyFat: "",
    muscle: "",
    waist: "",
  });

  useEffect(() => {
    if (!studentId && students?.data?.[0]) setStudentId(students.data[0].id);
  }, [students, studentId]);

  const { data, isLoading } = useQuery({
    queryKey: ["assessments", studentId],
    queryFn: () => api.assessments.list(studentId),
    enabled: !!studentId,
  });

  const create = useMutation({
    mutationFn: () =>
      api.assessments.create({
        studentId,
        date: form.date,
        weight: form.weight || null,
        heightCm: form.heightCm ? Number(form.heightCm) : null,
        bodyFat: form.bodyFat || null,
        muscle: form.muscle || null,
        waist: form.waist || null,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["assessments", studentId] }),
  });

  const rows = data?.data ?? [];
  const weightSeries = [...rows].reverse().map((r) => Number(r.weight ?? 0));

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    create.mutate();
  }

  return (
    <AppShell title="Avaliação Física" subtitle="Evolução corporal e composição">
      <div className="mb-4 max-w-sm">
        <span className="ns-label">Aluno</span>
        <select
          className="ns-input bg-white"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        >
          {(students?.data ?? []).map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="ns-card p-5">
          <p className="ns-kpi-label">Evolução de peso</p>
          <div className="mt-3">
            <MiniLine values={weightSeries} color="#800000" height={100} />
          </div>
          {isLoading ? (
            <p className="mt-4 text-sm text-black/45">Carregando...</p>
          ) : (
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-[11px] uppercase text-black/40">
                <tr>
                  <th className="py-1">Data</th>
                  <th>Peso</th>
                  <th>IMC</th>
                  <th>% Gordura</th>
                  <th>Músculo</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-line/70">
                    <td className="py-2">{r.date}</td>
                    <td>{r.weight ?? "—"}</td>
                    <td>{r.bmi ?? "—"}</td>
                    <td>{r.bodyFat ?? "—"}</td>
                    <td>{r.muscle ?? "—"}</td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-black/45">
                      Sem avaliações
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          )}
        </div>

        <form onSubmit={onSubmit} className="ns-card h-fit p-5">
          <p className="ns-kpi-label">Nova avaliação</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="col-span-2 block">
              <span className="ns-label">Data</span>
              <input
                type="date"
                className="ns-input"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="ns-label">Peso (kg)</span>
              <input
                className="ns-input"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="ns-label">Altura (cm)</span>
              <input
                className="ns-input"
                value={form.heightCm}
                onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="ns-label">% Gordura</span>
              <input
                className="ns-input"
                value={form.bodyFat}
                onChange={(e) => setForm({ ...form, bodyFat: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="ns-label">Músculo (kg)</span>
              <input
                className="ns-input"
                value={form.muscle}
                onChange={(e) => setForm({ ...form, muscle: e.target.value })}
              />
            </label>
            <label className="col-span-2 block">
              <span className="ns-label">Cintura (cm)</span>
              <input
                className="ns-input"
                value={form.waist}
                onChange={(e) => setForm({ ...form, waist: e.target.value })}
              />
            </label>
          </div>
          <button
            type="submit"
            className="ns-btn-primary mt-4"
            disabled={create.isPending || !studentId}
          >
            {create.isPending ? "Salvando..." : "Salvar avaliação"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}
