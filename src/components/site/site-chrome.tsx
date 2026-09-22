import type { ReactNode } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/site/brand-mark";
import { TrackedLink } from "@/components/site/tracked-link";
import { BUSINESS_CITY, BUSINESS_LINE, BRAND_NAME } from "@/lib/site";
import { TRAINER_NAME, trainerInstagram, trainerWhatsApp } from "@/lib/contact";

const LEGAL = [
  ["/politica-de-privacidade", "Política de privacidade"],
  ["/termos-de-uso", "Termos de uso"],
  ["/politica-de-cookies", "Política de cookies"],
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex h-18 max-w-5xl items-center justify-between gap-2 px-4 sm:h-20.5 sm:gap-3 md:px-6">
        <Link
          href="/"
          className="min-w-0 shrink text-ink no-underline"
          aria-label={`${BRAND_NAME}, ir para o início`}
        >
          <BrandMark />
        </Link>
        <nav className="flex shrink-0 items-center gap-1 text-sm sm:gap-2" aria-label="Acesso">
          <TrackedLink
            href="/login?as=aluno"
            kind="aluno"
            surface="header"
            className="whitespace-nowrap px-1 text-navy/70 no-underline hover:text-navy sm:px-2"
            ariaLabel="Já sou aluno"
          >
            <span className="sm:hidden">Aluno</span>
            <span className="hidden sm:inline">Já sou aluno</span>
          </TrackedLink>
          <TrackedLink
            href="/login"
            kind="equipe"
            surface="header"
            className="ns-btn-secondary whitespace-nowrap"
          >
            Equipe
          </TrackedLink>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const wa = trainerWhatsApp();
  const ig = trainerInstagram();

  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <BrandMark markClassName="h-8 w-8 bg-maroon" />
            <p className="mt-3 max-w-sm text-sm text-black/60">
              {BUSINESS_LINE} de {TRAINER_NAME}, em {BUSINESS_CITY}. O app do aluno reúne o treino
              prescrito, o biofeedback, as avaliações e a mensalidade de quem faz a consultoria.
            </p>
          </div>
          <nav
            className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm sm:shrink-0"
            aria-label="Links do rodapé"
          >
            <ul className="space-y-2">
              <li>
                <Link href="/conhecer" className="text-navy no-underline hover:underline">
                  App do aluno (prévia)
                </Link>
              </li>
              <li>
                <TrackedLink
                  href="/login?as=aluno"
                  kind="aluno"
                  surface="footer"
                  className="text-navy no-underline hover:underline"
                >
                  Entrar como aluno
                </TrackedLink>
              </li>
              {wa ? (
                <li>
                  <TrackedLink
                    href={wa}
                    kind="whatsapp"
                    location="footer"
                    className="text-navy no-underline hover:underline"
                  >
                    WhatsApp
                  </TrackedLink>
                </li>
              ) : null}
              {ig ? (
                <li>
                  <a href={ig} className="text-navy no-underline hover:underline">
                    Instagram
                  </a>
                </li>
              ) : null}
            </ul>
            <ul className="space-y-2">
              {LEGAL.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-navy no-underline hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-8 border-t border-line pt-6 text-xs text-black/60">
          © {new Date().getFullYear()} {TRAINER_NAME}. {BRAND_NAME}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export function LegalArticle({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <h1 className="font-title text-[26px] font-bold leading-tight text-navy md:text-3xl">
          {title}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-black/70">{intro}</p>
        <p className="mt-4 text-xs text-black/60">Versão em vigor desde {updated}.</p>
        <div className="ns-card mt-8 divide-y divide-line p-0 text-sm leading-relaxed text-ink">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

/** Bloco numerado das páginas legais, para as três manterem o mesmo ritmo. */
export function LegalSection({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="p-6 md:px-8">
      <h2 className="font-title text-base font-bold text-navy">
        <span className="mr-2 tabular-nums text-black/60">{index}.</span>
        {title}
      </h2>
      <div className="mt-3 space-y-3 [&_li]:leading-relaxed [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
