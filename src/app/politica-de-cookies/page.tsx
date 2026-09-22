import { CookiePreferences } from "@/components/site/site-telemetry";
import { LegalArticle } from "@/components/site/site-chrome";
import { BRAND_NAME } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: `Cookies de sessão e medição opcional do Google Analytics no ${BRAND_NAME}.`,
};

export default function CookiesPage() {
  return (
    <LegalArticle title="Política de cookies" updated="22/09/2026">
      <p>
        O {BRAND_NAME} usa cookies e armazenamento equivalentes só para sessão de login (JWT da API
        e sessão do Google via Better Auth). São cookies necessários ao funcionamento: entrar,
        permanecer autenticado e abrir a prévia.
      </p>
      <h2 className="font-title text-base font-bold text-navy">Medição sem cookie</h2>
      <p>
        O site envia Core Web Vitals (LCP, INP, CLS) e a página visitada para a Vercel, que hospeda
        o {BRAND_NAME}. Essa medição não grava cookie e não recebe nome, e-mail, telefone nem o
        texto da mensagem de WhatsApp.
      </p>
      <h2 className="font-title text-base font-bold text-navy">Google Analytics, só com aceite</h2>
      <p>
        O script do Google Analytics 4 não é carregado até você aceitar no aviso do site. Recusar
        deixa o script de fora. O Google recebe o caminho da página e eventos de interesse (clique
        no WhatsApp, abas da prévia, login e profundidade de rolagem) — sem dados de cadastro, com
        anonimização de IP. Publicidade e sinais do Google ficam desligados. Não há pixel de
        anúncio.
      </p>
      <p>A escolha fica neste navegador. Você pode mudá-la aqui:</p>
      <CookiePreferences />
      <p>Apagar os dados do site no navegador encerra o login e também esquece essa escolha.</p>
    </LegalArticle>
  );
}
