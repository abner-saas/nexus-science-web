import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="font-brand text-5xl text-navy">404</p>
        <h1 className="mt-2 font-title text-xl font-bold text-ink">Página não encontrada</h1>
        <p className="mt-3 text-sm text-black/60">
          O endereço não existe neste site. Volte à consultoria ou entre no app se você já é aluno.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="ns-btn-primary no-underline">
            Página inicial
          </Link>
          <Link href="/login?as=aluno" className="ns-btn-secondary no-underline">
            App do aluno
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
