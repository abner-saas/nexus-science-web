import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PreviewGoogleButton } from "@/components/site/preview-google-button";
import { ScrollDepth } from "@/components/site/scroll-depth";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { StudentAppPreview, type PreviewTab } from "@/components/site/student-app-preview";
import { TrackedLink } from "@/components/site/tracked-link";
import { accessRequestMessage, trainerWhatsApp } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Consultoria Abner Lucas | Treino no app",
  description:
    "Consultoria fitness online em Recife. Treino prescrito, biofeedback, avaliação e mensalidade no app do aluno, liberado após o combinado com o Abner.",
};

const APP_BANDS: Array<{
  tab: PreviewTab;
  title: string;
  notice?: string;
  body: string;
}> = [
  {
    tab: "treino",
    title: "Treino",
    body: "Você abre exercícios, séries, carga e descanso. “Fiz hoje” confirma a sessão. Essa confirmação entra na frequência que o Abner vê.",
  },
  {
    tab: "bio",
    title: "Bio",
    body: "Você registra energia, humor, estresse, sono, hidratação e dor muscular. Uma semana sem registro avisa no painel. Os números entram na leitura de carga e recuperação.",
  },
  {
    tab: "avaliacao",
    title: "Avaliação",
    body: "Você acompanha peso, % de gordura, circunferências e o histórico. As fotos de progresso ficam em armazenamento de arquivos. O Abner lê essas medições na sua ficha.",
  },
  {
    tab: "pagamentos",
    title: "Pagamentos",
    body: "Você paga a mensalidade por Pix, cartão ou boleto. Pago, o acesso permanece. Vencido, o treino pode ser restringido depois da tolerância que o Abner definir. Você não vê outros alunos nem o financeiro da consultoria.",
  },
];

const ACCESS_STEPS = [
  {
    n: "1",
    title: "Conversa no WhatsApp",
    body: "Objetivo, rotina e valor saem dessa conversa.",
  },
  {
    n: "2",
    title: "Pagamento da consultoria",
    body: "Você paga na plataforma (Asaas); este site não vende plano sozinho.",
  },
  {
    n: "3",
    title: "Login no e-mail cadastrado",
    body: "Você entra com esse e-mail ou com a conta Google dele, e o app abre na sua rotina.",
  },
];

export default function HomePage() {
  const wa = trainerWhatsApp(accessRequestMessage());

  return (
    <div className="min-h-screen bg-surface">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-navy"
      >
        Ir para o conteúdo
      </a>
      <SiteHeader />
      <ScrollDepth />

      <main id="conteudo">
        <section className="border-b border-line bg-white">
          {/*
            A prévia do hero carrega a casca inteira do app (topo + abas), então só cabe
            em duas colunas a partir de lg; em tablet retrato ela empilha.
          */}
          <div className="mx-auto grid max-w-5xl items-start gap-10 px-4 py-10 md:px-6 md:py-16 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <p className="text-sm text-black/60">Abner Lucas · Recife/PE</p>
              <h1 className="mt-2 text-balance font-title text-[30px] font-bold leading-[1.12] tracking-tight text-navy sm:text-[34px] md:text-[38px]">
                Você vê a rotina prescrita, marca o dia e registra como chegou.
              </h1>
              <p className="mt-4 text-[15px] leading-relaxed text-black/65">
                Consultoria de treino online, em Recife. No mesmo login, o Abner vê a sua frequência
                e o seu bio no painel.
              </p>
              <div className="mt-7">
                {wa ? (
                  <TrackedLink
                    href={wa}
                    kind="whatsapp"
                    location="hero"
                    className="ns-btn-primary h-11 w-full justify-center no-underline"
                  >
                    Falar com o Abner
                  </TrackedLink>
                ) : (
                  // Sem número configurado não há link de WhatsApp para inventar:
                  // a prévia assume o lugar da ação principal.
                  <Link
                    href="/conhecer"
                    className="ns-btn-primary h-11 w-full justify-center no-underline"
                  >
                    Ver o app do aluno
                  </Link>
                )}
              </div>
            </div>

            <div>
              <div className="overflow-hidden rounded-2xl border border-line shadow-card">
                <StudentAppPreview
                  tab="treino"
                  mode="full"
                  greeting="Prévia do app do aluno"
                  sourcePage="homepage"
                />
              </div>
              <div className="mt-5">
                <PreviewGoogleButton label="Abrir prévia com o Google" />
                {wa ? (
                  <Link
                    href="/conhecer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy no-underline transition-all hover:gap-2.5"
                  >
                    Percorrer o app do aluno
                    <ArrowRight size={16} aria-hidden />
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
            <h2 className="font-title text-xl font-bold text-navy md:text-2xl">O que você faz no app</h2>
            <div className="mt-8 divide-y divide-line border-y border-line">
              {APP_BANDS.map((band) => (
                <article
                  key={band.tab}
                  className="grid items-start gap-6 py-8 md:grid-cols-2 md:gap-12 md:py-10"
                >
                  {/* No desktop o pt casa o título da faixa com o título dentro do card. */}
                  <div className="md:pt-4">
                    <h3 className="font-title text-base font-bold text-navy">{band.title}</h3>
                    {band.notice ? (
                      <p className="mt-3 text-sm font-semibold text-maroon">{band.notice}</p>
                    ) : null}
                    <p className="mt-3 max-w-prose text-sm leading-relaxed text-black/65">
                      {band.body}
                    </p>
                  </div>
                  <StudentAppPreview tab={band.tab} mode="screen-only" sourcePage="homepage" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-line bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-14">
            <h2 className="font-title text-xl font-bold text-navy md:text-2xl">
              Prescrição, sessão, bio e mensalidade
            </h2>
            <div className="ns-card mt-6 grid divide-y divide-line overflow-hidden md:mt-8 md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="p-6 md:p-8">
                <h3 className="font-title text-base font-bold text-ink">
                  Conversas, planilha e app do banco
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-black/65">
                  A prescrição vai na conversa. A sessão fica na planilha. A mensalidade vai no app
                  do banco.
                </p>
              </div>
              <div className="bg-input p-6 md:p-8">
                <h3 className="font-title text-base font-bold text-navy">O mesmo login</h3>
                <p className="mt-3 text-sm leading-relaxed text-black/65">
                  Você marca a sessão. O bio entra no painel. A cobrança fica ao lado da frequência.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          {/*
            A ordem no DOM é título, passos e depois a chamada. No desktop a grade
            recoloca a chamada embaixo do título, sem mexer na leitura no mobile.
          */}
          <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16 lg:grid lg:grid-cols-[minmax(0,19rem)_1fr] lg:grid-rows-[auto_1fr] lg:gap-x-16">
            <div className="lg:col-start-1 lg:row-start-1">
              <h2 className="font-title text-xl font-bold text-navy md:text-2xl">
                Como o acesso abre
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-black/60">
                A plataforma é da consultoria do Abner.
              </p>
            </div>

            <ol className="mt-8 divide-y divide-line border-y border-line lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:border-t-0 lg:pt-0">
              {ACCESS_STEPS.map((step) => (
                <li key={step.n} className="flex items-start gap-4 py-5 lg:py-6">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy font-title text-[13px] font-bold text-white">
                    {step.n}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-title text-base font-bold text-ink">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-black/60">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 lg:col-start-1 lg:row-start-2 lg:mt-6 lg:self-start">
              {wa ? (
                <TrackedLink
                  href={wa}
                  kind="whatsapp"
                  location="acesso_steps"
                  className="ns-btn-primary h-11 w-full justify-center no-underline sm:w-auto sm:px-8"
                >
                  Falar com o Abner
                </TrackedLink>
              ) : null}
              <p className={`text-sm leading-relaxed text-black/60 ${wa ? "mt-3" : ""}`}>
                Plano e valor saem da conversa, não desta página.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
            <div className="grid divide-y divide-line md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="pb-8 md:pb-0 md:pr-12">
                <h2 className="font-title text-xl font-bold text-navy md:text-2xl">Já treina com o Abner?</h2>
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-black/65">
                  Entre com o e-mail cadastrado.
                </p>
                <TrackedLink
                  href="/login?as=aluno"
                  kind="aluno"
                  surface="home"
                  className="ns-btn-primary mt-5 h-11 w-full justify-center no-underline sm:w-auto sm:px-6"
                >
                  Entrar no app do aluno
                </TrackedLink>
              </div>
              <div className="pt-8 md:pl-12 md:pt-0">
                <h2 className="font-title text-xl font-bold text-navy md:text-2xl">Equipe</h2>
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-black/65">
                  A equipe abre o painel da consultoria.
                </p>
                <TrackedLink
                  href="/login"
                  kind="equipe"
                  surface="home"
                  className="ns-btn-secondary mt-5 h-11 w-full justify-center no-underline sm:w-auto sm:px-6"
                >
                  Painel da equipe
                </TrackedLink>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
