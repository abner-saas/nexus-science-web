import type { Metadata } from "next";
import Link from "next/link";
import { PreviewGoogleButton } from "@/components/site/preview-google-button";
import { ScrollDepth } from "@/components/site/scroll-depth";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { StudentAppPreview } from "@/components/site/student-app-preview";
import { TrackedLink } from "@/components/site/tracked-link";
import { accessRequestMessage, TRAINER_NAME, trainerWhatsApp } from "@/lib/contact";
import { BUSINESS_CITY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Consultoria Abner Lucas — treino no app",
  description:
    "Consultoria fitness online em Recife. Treino prescrito, biofeedback, avaliação e mensalidade no app do aluno, liberado após o combinado com o Abner.",
};

const DAY_TO_DAY = [
  {
    title: "Treino prescrito",
    body: "A rotina que o Abner montou aparece com exercícios, séries, carga e descanso. Você marca o dia em que treinou — isso confirma a sessão no painel dele.",
  },
  {
    title: "Biofeedback do dia",
    body: "Energia, humor, estresse, sono, hidratação e dor muscular. Sem registro por uma semana, o painel avisa. Os números entram na leitura de carga e recuperação.",
  },
  {
    title: "Avaliação e evolução",
    body: "Peso, % de gordura, circunferências e o histórico das avaliações. Fotos de progresso ficam em armazenamento de arquivos, não no banco — regra de dado de saúde.",
  },
  {
    title: "Mensalidade no mesmo login",
    body: "Pix, cartão ou boleto. Pago, o acesso permanece; vencido, o treino pode ser restringido depois da tolerância combinada. Você não vê outros alunos nem o financeiro da consultoria.",
  },
];

const ACCESS_STEPS = [
  {
    n: "1",
    title: "Conversa com o Abner",
    body: "Objetivo, rotina e valor do plano saem do combinado com ele — WhatsApp, não um checkout aberto neste site.",
  },
  {
    n: "2",
    title: "Pagamento da consultoria",
    body: "A cobrança entra na plataforma (Asaas). Confirmação atualiza o cadastro. Este site não vende plano sozinho.",
  },
  {
    n: "3",
    title: "Login no app do aluno",
    body: "Com o e-mail cadastrado (ou Google do mesmo e-mail), você passa a registrar treino e bio. Google sem cadastro só abre a prévia do app — não cria matrícula.",
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
          <div className="mx-auto grid max-w-5xl items-start gap-10 px-4 py-10 md:grid-cols-[1.05fr_0.95fr] md:px-6 md:py-14">
            <div>
              <p className="text-sm text-black/50">
                {TRAINER_NAME} · {BUSINESS_CITY}
              </p>
              <h1 className="mt-2 font-title text-[32px] font-bold leading-tight tracking-tight text-navy md:text-[40px]">
                Consultoria de treino com o dia a dia no app
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-black/65">
                Você treina com prescrição, registra o que fez e como chegou, e acompanha avaliação
                e mensalidade no mesmo login. O Abner vê isso no painel da consultoria. Acesso ao
                app só depois que vocês fecham o plano — não há matrícula automática neste site.
              </p>
              <div className="mt-7 flex max-w-sm flex-col gap-3">
                {wa ? (
                  <TrackedLink
                    href={wa}
                    kind="whatsapp"
                    location="hero"
                    className="ns-btn-primary h-11 justify-center no-underline"
                  >
                    Falar com o {TRAINER_NAME.split(" ")[0]}
                  </TrackedLink>
                ) : null}
                <Link
                  href="/conhecer"
                  className="ns-btn-secondary h-11 justify-center no-underline"
                >
                  Ver o app do aluno
                </Link>
                <PreviewGoogleButton label="Abrir prévia com o Google" />
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-line shadow-card">
              <StudentAppPreview greeting="Prévia do app do aluno" sourcePage="homepage" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 md:px-6">
          <h2 className="font-title text-xl font-bold text-navy">O que você faz no app</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/60">
            A tela à direita (e a prévia completa) replica o app do aluno: as quatro seções de baixo
            são as mesmas do produto. Os números são de demonstração — a ficha real é a que o Abner
            atribuir ao seu cadastro.
          </p>
          <dl className="mt-8 divide-y divide-line border-y border-line bg-white">
            {DAY_TO_DAY.map((item) => (
              <div
                key={item.title}
                className="grid gap-2 px-4 py-5 md:grid-cols-[200px_1fr] md:gap-8"
              >
                <dt className="font-title text-sm font-bold text-navy">{item.title}</dt>
                <dd className="text-sm leading-relaxed text-black/65">{item.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="border-y border-line bg-white">
          <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
            <h2 className="font-title text-xl font-bold text-navy">Como o acesso abre</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/60">
              A plataforma é da consultoria, não uma loja de software. Cadastro, plano e liberação
              passam pelo Abner.
            </p>
            <ol className="mt-8 divide-y divide-line border-y border-line">
              {ACCESS_STEPS.map((step) => (
                <li key={step.n} className="grid gap-2 py-5 sm:grid-cols-[3rem_1fr] sm:gap-6">
                  <p className="font-brand text-3xl leading-none text-navy">{step.n}</p>
                  <div>
                    <h3 className="font-title text-base font-bold text-ink">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-black/60">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 md:px-6">
          <div className="ns-card p-6 md:p-8">
            <h2 className="font-title text-xl font-bold text-navy">Já treina com o Abner?</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-black/60">
              Entre com o e-mail do cadastro ou Google do mesmo endereço. Equipe da consultoria usa
              o painel (CRM, treinos, financeiro) — não esta página.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <TrackedLink
                href="/login?as=aluno"
                kind="aluno"
                surface="home"
                className="ns-btn-primary no-underline"
              >
                Entrar no app do aluno
              </TrackedLink>
              <TrackedLink
                href="/login"
                kind="equipe"
                surface="home"
                className="ns-btn-secondary no-underline"
              >
                Painel da equipe
              </TrackedLink>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
