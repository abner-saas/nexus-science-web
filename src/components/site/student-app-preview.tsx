"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Dumbbell, HeartPulse, Ruler, Wallet } from "lucide-react";
import { trackEvent, type PreviewSourcePage, type PreviewTabName } from "@/lib/analytics";

export type PreviewTab = PreviewTabName;
export type PreviewMode = "full" | "screen-only";

const TABS = [
  ["treino", "Treino", Dumbbell],
  ["bio", "Bio", HeartPulse],
  ["pagamentos", "Pagar", Wallet],
  ["avaliacao", "Avaliação", Ruler],
] as const;

const TAB_ORDER = TABS.map(([id]) => id);

/** Tempo que cada aba fica visível na rotação automática. */
const ROTATION_MS = 4500;

/**
 * A tela tem altura fixa para a casca não pular de tamanho entre abas. O valor
 * cobre a aba mais alta (bio) em cada faixa de largura, então nada corta.
 */
const SCREEN_HEIGHT = "h-[436px] min-[375px]:h-[372px]";

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
  ["Hidratação", 8],
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

/** mt-auto encosta o aviso na base quando o card está com altura fixa. */
function DemoHint({ children }: { children: string }) {
  return <p className="mt-auto pt-3 text-xs leading-relaxed text-maroon">{children}</p>;
}

/**
 * A prévia é uma maquete de tela, não estrutura do documento: os títulos internos
 * saem como texto para não furar a ordem de headings da página que a embute.
 */
function PaneTitle({ children }: { children: string }) {
  return <p className="font-title text-base font-bold text-ink">{children}</p>;
}

function TreinoPane() {
  return (
    <section className="ns-card flex h-full flex-col p-4">
      <PaneTitle>Meu treino</PaneTitle>
      <p className="mt-2 text-sm text-black/60">
        {DEMO_TRAINING.routine} · {DEMO_TRAINING.sessions}
      </p>
      <div className="mt-3 rounded-xl border border-line bg-input p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold">{DEMO_TRAINING.name}</p>
            <p className="text-xs leading-relaxed text-black/60">{DEMO_TRAINING.meta}</p>
          </div>
          <button
            type="button"
            className="ns-btn-primary shrink-0 whitespace-nowrap text-xs"
            disabled
          >
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
    <section className="ns-card flex h-full flex-col p-4">
      <PaneTitle>Biofeedback de hoje</PaneTitle>
      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
        {DEMO_BIO.map(([label, value]) => (
          <label key={label} className="block">
            <span className="ns-label mb-1 truncate text-[13px]">{label}</span>
            <input
              className="ns-input py-1.5 text-[13px]"
              readOnly
              tabIndex={-1}
              value={`${value} / 10`}
            />
          </label>
        ))}
      </div>
      <button type="button" className="ns-btn-primary mt-3 w-full justify-center" disabled>
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
    <section className="ns-card flex h-full flex-col overflow-hidden">
      <div className="border-b border-line px-4 py-3">
        <PaneTitle>Pagamentos</PaneTitle>
      </div>
      <table className="w-full table-fixed text-left text-sm">
        <thead className="text-[11px] uppercase text-black/60">
          <tr>
            <th className="px-4 py-2 font-semibold">Vencimento</th>
            <th className="px-2 py-2 font-semibold">Valor</th>
            <th className="px-4 py-2 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {DEMO_PAYMENTS.map((p) => (
            <tr key={p.due} className="border-t border-line/70">
              <td className="px-4 py-2 tabular-nums">{p.due}</td>
              <td className="px-2 py-2 tabular-nums">{p.amount}</td>
              <td className="px-4 py-2">{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-auto border-t border-line px-4 py-3 text-xs leading-relaxed text-maroon">
        Valores de demonstração. A cobrança real usa Pix, cartão ou boleto pelo Asaas, depois que o
        plano é combinado com o Abner.
      </p>
    </section>
  );
}

function AvaliacaoPane() {
  return (
    <section className="ns-card flex h-full flex-col p-4">
      <PaneTitle>Avaliações</PaneTitle>
      <table className="mt-3 w-full table-fixed text-left text-sm [&_td]:pr-2 [&_th]:pr-2">
        <thead className="text-[11px] uppercase text-black/60">
          <tr>
            <th className="w-[32%] py-1 font-semibold">Data</th>
            <th className="font-semibold">Peso</th>
            <th className="w-[16%] font-semibold">IMC</th>
            <th className="font-semibold">% Gord.</th>
          </tr>
        </thead>
        <tbody>
          {DEMO_ASSESSMENTS.map((r) => (
            <tr key={r.date} className="border-t border-line/70">
              <td className="py-2 tabular-nums">{r.date}</td>
              <td className="tabular-nums">{r.weight}</td>
              <td className="tabular-nums">{r.bmi}</td>
              <td className="tabular-nums">{r.fat}</td>
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

function PreviewScreen({ tab }: { tab: PreviewTab }) {
  if (tab === "treino") return <TreinoPane />;
  if (tab === "bio") return <BioPane />;
  if (tab === "avaliacao") return <AvaliacaoPane />;
  return <PagamentosPane />;
}

/**
 * Rotação automática das abas. Ela só roda quando a prévia está visível na tela
 * e para de vez no primeiro toque do visitante numa aba, que a partir daí manda
 * na navegação. Também não roda para quem pediu menos movimento no sistema.
 */
function useTabRotation(enabled: boolean, onTick: () => void) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const running = enabled && onScreen && !hovered && !reducedMotion;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(onTick, ROTATION_MS);
    return () => window.clearInterval(timer);
  }, [running, onTick]);

  return {
    containerRef,
    running,
    pause: () => setHovered(true),
    resume: () => setHovered(false),
  };
}

export function StudentAppPreview({
  greeting = "Olá, aluno",
  tab: initialTab = "treino",
  mode = "full",
  sourcePage = "homepage",
}: {
  greeting?: string;
  tab?: PreviewTab;
  mode?: PreviewMode;
  sourcePage?: PreviewSourcePage;
}) {
  const [tab, setTab] = useState<PreviewTab>(initialTab);
  const [takenOver, setTakenOver] = useState(false);

  const advance = useCallback(() => {
    setTab((current) => {
      const next = TAB_ORDER[(TAB_ORDER.indexOf(current) + 1) % TAB_ORDER.length];
      return next;
    });
  }, []);

  const rotation = useTabRotation(mode === "full" && !takenOver, advance);

  function onSelect(next: PreviewTab) {
    setTakenOver(true);
    if (next === tab) return;
    setTab(next);
    trackEvent("preview_tab_switch", { tab_name: next, source_page: sourcePage });
  }

  if (mode === "screen-only") {
    return <PreviewScreen tab={initialTab} />;
  }

  return (
    <div
      ref={rotation.containerRef}
      className="bg-input"
      onMouseEnter={rotation.pause}
      onMouseLeave={rotation.resume}
      onFocusCapture={rotation.pause}
    >
      <header className="border-b border-line bg-white px-4 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-brand text-xl leading-none tracking-wide text-navy">Nexus Science</p>
            <p className="mt-1 truncate text-sm text-black/60">{greeting}</p>
          </div>
          <span className="shrink-0 rounded-lg border border-line bg-input px-2 py-1 text-[11px] font-semibold text-maroon">
            Demonstração
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-5">
        <div className={SCREEN_HEIGHT}>
          <PreviewScreen tab={tab} />
        </div>
      </div>

      <nav className="border-t border-line bg-white" aria-label="Seções do app do aluno">
        <div className="mx-auto grid max-w-lg grid-cols-4">
          {TABS.map(([id, label, Icon]) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelect(id)}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-col items-center gap-0.5 border-t-2 py-2.5 text-[11px] font-semibold transition-colors ${
                  active
                    ? "border-navy text-navy"
                    : "border-transparent text-black/60 hover:text-navy/70"
                }`}
              >
                {active && !takenOver ? (
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 -top-0.5 h-0.5 origin-left animate-[preview-tab_4500ms_linear] bg-maroon ${
                      rotation.running ? "" : "[animation-play-state:paused]"
                    }`}
                  />
                ) : null}
                <Icon size={18} strokeWidth={active ? 2.25 : 1.8} aria-hidden />
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
