"use client";

import { useRef, useState } from "react";
import { Dumbbell, HeartPulse, Ruler, Wallet } from "lucide-react";
import { trackEvent, type PreviewSourcePage, type PreviewTabName } from "@/lib/analytics";

export type PreviewTab = PreviewTabName;

const TABS = [
  ["treino", "Treino", Dumbbell],
  ["bio", "Bio", HeartPulse],
  ["pagamentos", "Pagar", Wallet],
  ["avaliacao", "Avaliação", Ruler],
] as const;

const DEMO_TRAINING = {
  routine: "Rotina intermediária · hipertrofia",
  sessions: "14 sessões feitas",
  code: "A",
  name: "Treino A",
  meta: "Membros inferiores · Segunda · 65 min",
  exercises: [
    { name: "Levantamento terra romeno", detail: "4 × 10 · 40 kg · 90s" },
    { name: "Agachamento goblet", detail: "4 × 12 · 20 kg · 75s" },
    { name: "Afundo búlgaro", detail: "3 × 10 · 12 kg · por lado" },
    { name: "Hip thrust", detail: "4 × 15 · 40 kg · isometria 2s" },
  ],
};

const DEMO_BIO = [
  ["Energia", 8],
  ["Humor", 7],
  ["Estresse", 3],
  ["Sono", 7],
  ["Dor muscular", 4],
] as const;

const DEMO_PAYMENTS = [
  { due: "05/09/2026", amount: "R$ 297,00", status: "Pago" },
  { due: "05/10/2026", amount: "R$ 297,00", status: "Pendente" },
];

const DEMO_ASSESSMENTS = [
  { date: "01/05/2026", weight: "68,5 kg", bmi: "25,2", fat: "24,1%" },
  { date: "01/04/2026", weight: "70,2 kg", bmi: "25,8", fat: "25,8%" },
];

function DemoHint({ children }: { children: string }) {
  return <p className="mt-2 text-xs text-maroon">{children}</p>;
}

function TreinoPane() {
  return (
    <section className="ns-card p-4">
      <h2 className="font-title text-base font-bold text-ink">Meu treino</h2>
      <p className="mt-3 text-sm text-black/55">
        {DEMO_TRAINING.routine} · {DEMO_TRAINING.sessions}
      </p>
      <div className="mt-3 rounded-xl border border-line bg-input p-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-semibold">
              {DEMO_TRAINING.code} — {DEMO_TRAINING.name}
            </p>
            <p className="text-xs text-black/45">{DEMO_TRAINING.meta}</p>
          </div>
          <button type="button" className="ns-btn-primary text-xs" disabled>
            Fiz hoje
          </button>
        </div>
        <ul className="mt-2 space-y-1 text-xs text-black/60">
          {DEMO_TRAINING.exercises.map((ex) => (
            <li key={ex.name}>
              {ex.name} · {ex.detail}
            </li>
          ))}
        </ul>
      </div>
      <DemoHint>
        Prévia: o botão não confirma sessão. No app real, isso conta frequência no painel.
      </DemoHint>
    </section>
  );
}

function BioPane() {
  return (
    <section className="ns-card p-4">
      <h2 className="font-title text-base font-bold text-ink">Biofeedback de hoje</h2>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {DEMO_BIO.map(([label, value]) => (
          <label key={label} className="block">
            <span className="ns-label">{label}</span>
            <input className="ns-input" readOnly value={`${value} / 10`} aria-readonly />
          </label>
        ))}
      </div>
      <button type="button" className="ns-btn-primary mt-4 w-full justify-center" disabled>
        Registrar
      </button>
      <DemoHint>
        Prévia: valores de exemplo. No app, energia, sono e dor alimentam o alerta de 7 dias sem
        registro.
      </DemoHint>
    </section>
  );
}

function PagamentosPane() {
  return (
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
          {DEMO_PAYMENTS.map((p) => (
            <tr key={p.due} className="border-t border-line/70">
              <td className="px-4 py-2">{p.due}</td>
              <td className="px-4 py-2">{p.amount}</td>
              <td className="px-4 py-2">{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-4 py-3 text-xs text-maroon">
        Números inventados para layout. Cobrança real usa Pix, cartão ou boleto (Asaas), depois que
        o plano é combinado com o Abner.
      </p>
    </section>
  );
}

function AvaliacaoPane() {
  return (
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
          {DEMO_ASSESSMENTS.map((r) => (
            <tr key={r.date} className="border-t border-line/70">
              <td className="py-2">{r.date}</td>
              <td>{r.weight}</td>
              <td>{r.bmi}</td>
              <td>{r.fat}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <DemoHint>
        Prévia: série fictícia. No app entram as medições e fotos de progresso da consultoria.
      </DemoHint>
    </section>
  );
}

export function StudentAppPreview({
  greeting = "Olá, aluno",
  variant = "embedded",
  sourcePage = "homepage",
}: {
  greeting?: string;
  variant?: "embedded" | "page";
  sourcePage?: PreviewSourcePage;
}) {
  const [tab, setTab] = useState<PreviewTab>("treino");
  const tabRef = useRef(tab);
  const shell = variant === "page" ? "min-h-[calc(100vh-8rem)] bg-input pb-24" : "bg-input pb-16";

  function onSelect(next: PreviewTab) {
    if (tabRef.current === next) return;
    tabRef.current = next;
    setTab(next);
    trackEvent("preview_tab_switch", { tab_name: next, source_page: sourcePage });
  }

  return (
    <div className={shell}>
      <header className="border-b border-line bg-white px-4 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div>
            <p className="font-brand text-xl tracking-wide text-navy">Nexus Science</p>
            <p className="text-sm text-black/50">{greeting}</p>
          </div>
          <span className="rounded-lg border border-line bg-input px-2 py-1 text-[11px] font-semibold text-maroon">
            Demonstração
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-lg space-y-4 px-4 py-5">
        {tab === "treino" ? <TreinoPane /> : null}
        {tab === "bio" ? <BioPane /> : null}
        {tab === "pagamentos" ? <PagamentosPane /> : null}
        {tab === "avaliacao" ? <AvaliacaoPane /> : null}
      </div>

      <nav
        className={
          variant === "page"
            ? "fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white"
            : "border-t border-line bg-white"
        }
        aria-label="Seções do app do aluno"
      >
        <div className="mx-auto grid max-w-lg grid-cols-4">
          {TABS.map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              aria-current={tab === id ? "page" : undefined}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold ${
                tab === id ? "text-navy" : "text-black/40"
              }`}
            >
              <Icon size={18} aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
