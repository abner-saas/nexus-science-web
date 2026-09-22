import type { ReactNode } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/site/brand-mark";
import { TrackedLink } from "@/components/site/tracked-link";
import { BUSINESS_CITY, BUSINESS_LINE, BRAND_NAME } from "@/lib/site";
import { TRAINER_NAME, trainerInstagram, trainerWhatsApp } from "@/lib/contact";

const LEGAL = [
  ["/politica-de-privacidade", "Privacidade"],
  ["/termos-de-uso", "Termos"],
  ["/politica-de-cookies", "Cookies"],
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex h-[82px] max-w-5xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="min-w-0 text-ink no-underline"
          aria-label={`${BRAND_NAME} — início`}
        >
          <BrandMark />
        </Link>
        <nav className="flex items-center gap-2 text-sm" aria-label="Acesso">
          <TrackedLink
            href="/login?as=aluno"
            kind="aluno"
            surface="header"
            className="px-2 text-navy/70 no-underline hover:text-navy"
            ariaLabel="Já sou aluno"
          >
            <span className="sm:hidden">Aluno</span>
            <span className="hidden sm:inline">Já sou aluno</span>
          </TrackedLink>
          <TrackedLink href="/login" kind="equipe" surface="header" className="ns-btn-secondary">
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
            <p className="mt-3 max-w-sm text-sm text-black/55">
              {BUSINESS_LINE} de {TRAINER_NAME}, {BUSINESS_CITY}. Uso interno da consultoria — o app
              do aluno é o canal de treino, biofeedback e mensalidade de quem já treina com ele.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
            <Link href="/conhecer" className="text-navy no-underline hover:underline">
              App do aluno (prévia)
            </Link>
            <TrackedLink
              href="/login?as=aluno"
              kind="aluno"
              surface="footer"
              className="text-navy no-underline hover:underline"
            >
              Entrar como aluno
            </TrackedLink>
            {wa ? (
              <TrackedLink
                href={wa}
                kind="whatsapp"
                location="footer"
                className="text-navy no-underline hover:underline"
              >
                WhatsApp
              </TrackedLink>
            ) : null}
            {ig ? (
              <a href={ig} className="text-navy no-underline hover:underline">
                Instagram
              </a>
            ) : null}
            {LEGAL.map(([href, label]) => (
              <Link key={href} href={href} className="text-navy no-underline hover:underline">
                {label}
              </Link>
            ))}
          </div>
        </div>
        <p className="mt-8 text-xs leading-relaxed text-black/45">
          {TRAINER_NAME} · {BUSINESS_CITY} · {BRAND_NAME}. CNPJ, razão social e endereço comercial
          ainda não foram publicados neste site — entram no rodapé assim que o cliente
          disponibilizar.
        </p>
      </div>
    </footer>
  );
}

export function LegalArticle({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <h1 className="font-title text-2xl font-bold text-navy">{title}</h1>
        <p className="mt-1 text-sm text-black/45">Atualizado em {updated}</p>
        <div className="ns-card mt-6 space-y-4 p-6 text-sm leading-relaxed text-ink">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
