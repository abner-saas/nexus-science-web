import { LegalArticle } from "@/components/site/site-chrome";
import { BRAND_NAME } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: `Cookies de sessão usados no ${BRAND_NAME}. Sem scripts de marketing neste momento.`,
};

export default function CookiesPage() {
  return (
    <LegalArticle title="Política de cookies" updated="22/09/2026">
      <p>
        O {BRAND_NAME} usa cookies e armazenamento equivalentes só para sessão de login (JWT da
        API e sessão do Google via Better Auth). São cookies necessários ao funcionamento:
        entrar, permanecer autenticado e abrir a prévia.
      </p>
      <h2 className="font-title text-base font-bold text-navy">O que não está instalado</h2>
      <p>
        Neste momento não há Google Analytics, pixel de anúncio nem scripts de marketing de
        terceiros. Por isso não há banner pedindo consentimento para cookies não essenciais —
        não há o que desbloquear.
      </p>
      <h2 className="font-title text-base font-bold text-navy">Se isso mudar</h2>
      <p>
        Qualquer script analítico ou de anúncio só entra depois de consentimento explícito, com
        bloqueio até a permissão, e esta página será atualizada.
      </p>
      <p>
        Você pode apagar cookies do site nas configurações do navegador; isso encerra o login.
      </p>
    </LegalArticle>
  );
}
