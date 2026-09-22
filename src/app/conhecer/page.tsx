"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PreviewGoogleButton } from "@/components/site/preview-google-button";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { StudentAppPreview } from "@/components/site/student-app-preview";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { accessRequestMessage, TRAINER_NAME, trainerWhatsApp } from "@/lib/contact";
import { trackPreviewWhatsAppClick } from "@/lib/analytics";

export default function TourPage() {
  const router = useRouter();
  const [lead, setLead] = useState<{ name: string; email: string } | null>(null);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.whoami();
        if (cancelled) return;
        if (data.kind === "member") {
          router.replace(data.user.role === "STUDENT" ? "/aluno" : "/dashboard");
          return;
        }
        if (data.kind === "lead") setLead({ name: data.name, email: data.email });
      } catch {
        /* guest: prévia aberta */
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const firstName = lead?.name?.split(" ")[0];
  const msg = accessRequestMessage(lead?.name, lead?.email);
  const wa = trainerWhatsApp(msg);

  async function copyMsg() {
    await navigator.clipboard.writeText(msg);
    setCopied(true);
  }

  async function leavePreview() {
    try {
      await authClient.signOut();
    } catch {
      /* sem sessão Google */
    }
    router.replace("/");
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-sm text-black/50">
        Abrindo o app do aluno…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />
      <div className="border-b border-line bg-white px-4 py-2 text-center text-[12px] text-maroon">
        Dados de demonstração. Nada aqui grava treino, bio ou pagamento.
      </div>

      <div className="mx-auto max-w-lg px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-black/55">
            {firstName ? `Oi, ${firstName}. Esta é a cara do app.` : "App do aluno — prévia."}
          </p>
          <button type="button" onClick={leavePreview} className="ns-btn-ghost text-xs">
            Encerrar prévia
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-lg overflow-hidden rounded-2xl border border-line shadow-card">
        <StudentAppPreview
          greeting={firstName ? `Olá, ${firstName}` : "Olá, aluno"}
          sourcePage="/conhecer"
        />
      </div>

      <section className="border-t border-line bg-white px-4 py-10">
        <div className="mx-auto max-w-lg">
          <h1 className="font-title text-lg font-bold text-navy">Até aqui é só a interface</h1>
          <p className="mt-2 text-sm leading-relaxed text-black/60">
            A consultoria começa quando o {TRAINER_NAME} cadastra você, o pagamento confirma e o
            login passa a apontar para a sua rotina. Use o contato abaixo se quiser treinar com ele.
          </p>
          {lead ? (
            <p className="mt-3 rounded-xl bg-input px-3 py-2 text-xs text-black/55">
              E-mail Google nesta sessão: {lead.email}
            </p>
          ) : (
            <div className="mt-4">
              <PreviewGoogleButton label="Identificar com o Google" />
            </div>
          )}
          {wa ? (
            <a
              href={wa}
              className="ns-btn-primary mt-5 w-full justify-center py-3 no-underline"
              onClick={() => trackPreviewWhatsAppClick()}
            >
              Falar com o {TRAINER_NAME.split(" ")[0]} no WhatsApp
            </a>
          ) : (
            <button
              type="button"
              onClick={copyMsg}
              className="ns-btn-primary mt-5 w-full justify-center py-3"
            >
              {copied ? "Mensagem copiada" : "Copiar mensagem para o Abner"}
            </button>
          )}
          <Link href="/" className="mt-4 block text-center text-sm text-navy">
            Voltar à página inicial
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
