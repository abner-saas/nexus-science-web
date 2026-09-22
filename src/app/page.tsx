import type { Metadata } from "next";
import Link from "next/link";
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
    notice: "Números da prévia são demonstração.",
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
    body: "Você entra com esse e-mail ou com o Google dele; sem cadastro, o Google só abre a prévia e não cria matrícula.",
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
          <div className="mx-auto grid max-w-5xl items-start gap-10 px-4 py-10 md:px-6 md:py-16 lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="text-sm text-black/60">Abner Lucas · Recife/PE</p>
              <h1 className="mt-2 text-balance font-title text-[30px] font-bold leading-[1.12] tracking-tight text-navy sm:text-[34px] md:text-[38px]">
                Você vê a rotina prescrita, marca o dia e registra como chegou.
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-black/65">
                Consultoria de treino online, em Recife. No mesmo login, o Abner vê a sua frequência
                e o seu bio no painel.
              </p>
              <p className="mt-6 inline-block rounded-lg border border-line bg-input px-3 py-1.5 text-[13px] leading-relaxed text-navy">
                Acesso só depois do combinado. A prévia não é matrícula.
              </p>
              <div className="mt-7 max-w-sm">
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
              {/* max-w-lg casa com a largura interna da casca: empilhada, o card não estica. */}
              <div className="max-w-lg overflow-hidden rounded-2xl border border-line shadow-card lg:max-w-none">
                <StudentAppPreview
                  tab="treino"
                  mode="full"
                  greeting="Prévia do app do aluno"
                  sourcePage="homepage"
                />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-black/60">
                Números da prévia são demonstração. Nada aqui grava treino, bio ou pagamento.
              </p>
              <div className="mt-5 flex max-w-sm flex-col gap-3">
                {wa ? (
                  <Link href="/conhecer" className="ns-btn-secondary h-11 justify-center no-underline">
                    Ver o app do aluno
                  </Link>
                ) : null}
                <PreviewGoogleButton label="Abrir prévia com o Google" />
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
          <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
            <h2 className="font-title text-xl font-bold text-navy md:text-2xl">
              Prescrição, sessão, bio e mensalidade
            </h2>
            <div className="mt-6 grid divide-y divide-line md:mt-8 md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="py-6 md:py-0 md:pr-12">
                <h3 className="font-title text-base font-bold text-ink">
                  Conversas, planilha e app do banco
                </h3>
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-black/65">
                  A prescrição vai na conversa. A sessão fica na planilha. A mensalidade vai no app
                  do banco.
                </p>
              </div>
              <div className="py-6 md:py-0 md:pl-12">
                <h3 className="font-title text-base font-bold text-ink">O mesmo login</h3>
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-black/65">
                  Você marca a sessão. O bio entra no painel. A cobrança fica ao lado da frequência.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
            <h2 className="font-title text-xl font-bold text-navy md:text-2xl">Como o acesso abre</h2>
            <p className="mt-2 text-sm leading-relaxed text-black/60">
              A plataforma é da consultoria do Abner.
            </p>
            <ol className="mt-8 divide-y divide-line border-y border-line">
              {ACCESS_STEPS.map((step) => (
                <li key={step.n} className="grid gap-1 py-5 sm:grid-cols-[2.5rem_1fr] sm:gap-4">
                  <p className="font-brand text-[28px] leading-none text-navy sm:pt-0.5">
                    {step.n}
                  </p>
                  <div>
                    <h3 className="font-title text-base font-bold text-ink">{step.title}</h3>
                    <p className="mt-1 max-w-prose text-sm leading-relaxed text-black/60">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            {wa ? (
              <div className="mt-8 max-w-sm">
                <TrackedLink
                  href={wa}
                  kind="whatsapp"
                  location="acesso_steps"
                  className="ns-btn-primary h-11 w-full justify-center no-underline"
                >
                  Falar com o Abner
                </TrackedLink>
              </div>
            ) : null}
            <p className={`text-sm text-black/60 ${wa ? "mt-3" : "mt-8"}`}>
              Plano e valor saem da conversa, não desta página.
            </p>
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
