"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";

const PRIORITY_STYLE: Record<string, string> = {
  high: "border-l-danger bg-red-50/50",
  medium: "border-l-warning bg-amber-50/40",
  low: "border-l-success bg-emerald-50/40",
  info: "border-l-navy bg-navy/5",
};

export default function AIPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["ai-insights"],
    queryFn: () => api.ai.insights(),
  });

  return (
    <AppShell title="IA & Insights" subtitle="Recomendações estratégicas baseadas nos dados">
      {isLoading ? (
        <p className="text-sm text-black/50">Gerando insights...</p>
      ) : (
        <>
          <div className="ns-card border-l-4 border-l-maroon p-5">
            <p className="ns-kpi-label text-maroon">Resumo executivo</p>
            <p className="mt-2 text-sm leading-relaxed text-black/70">
              {data?.data.executiveSummary}
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {(data?.data.insights ?? []).map((item) => (
              <div
                key={item.title}
                className={`ns-card border-l-4 p-5 ${PRIORITY_STYLE[item.priority] ?? PRIORITY_STYLE.info}`}
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-black/40">
                  {item.type}
                </p>
                <h3 className="mt-1 font-title text-base font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm text-black/60">{item.body}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
