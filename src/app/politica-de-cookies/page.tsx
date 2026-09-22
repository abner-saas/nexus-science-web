import type { Metadata } from "next";
import { CookiePreferences } from "@/components/site/site-telemetry";
import { LegalArticle, LegalSection } from "@/components/site/site-chrome";
import { BRAND_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: `Quais cookies o ${BRAND_NAME} usa, o que cada um faz e como mudar a sua escolha sobre a medição de audiência.`,
};

export default function CookiesPage() {
  return (
    <LegalArticle
      title="Política de cookies"
      intro={`O ${BRAND_NAME} usa o mínimo de cookies necessário para manter o seu login e, se você autorizar, para medir o uso do site público. Esta página lista o que é usado em cada caso e onde trocar a sua escolha.`}
      updated="22 de setembro de 2026"
    >
      <LegalSection index={1} title="Cookies necessários">
        <p>
          São os cookies que mantêm a sessão de quem entra na plataforma: um guarda o token de
          autenticação da nossa API e outro guarda a sessão criada quando o login é feito com o
          Google. Sem eles não é possível entrar nem permanecer autenticado, então não dependem de
          autorização.
        </p>
        <p>
          Eles expiram ao fim da sessão ou no prazo definido no login, e são apagados quando você
          sai da conta.
        </p>
      </LegalSection>

      <LegalSection index={2} title="Medição de desempenho, sem cookie">
        <p>
          O site envia à Vercel, que o hospeda, a página visitada e as métricas de carregamento
          conhecidas como Core Web Vitals. Essa medição não grava cookie no seu navegador e não
          recebe nome, e-mail, telefone ou o texto de mensagens.
        </p>
      </LegalSection>

      <LegalSection index={3} title="Medição de audiência, só com a sua autorização">
        <p>
          O Google Analytics só é carregado depois que você aceita no aviso exibido na primeira
          visita. Se você recusar, o script não entra na página.
        </p>
        <p>Autorizada a medição, o Google recebe:</p>
        <ul>
          <li>o caminho da página visitada;</li>
          <li>cliques nos botões de contato e de login;</li>
          <li>a troca de abas na prévia do app;</li>
          <li>a profundidade da rolagem na página inicial.</li>
        </ul>
        <p>
          O endereço de IP é anonimizado, os recursos de publicidade ficam desligados e nenhum dado
          de cadastro é enviado. A medição cobre apenas as páginas públicas: o painel da equipe e as
          telas do aluno ficam de fora.
        </p>
      </LegalSection>

      <LegalSection index={4} title="Sua escolha">
        <p>
          A preferência é guardada neste navegador e vale para as próximas visitas. Você pode
          mudá-la quando quiser:
        </p>
        <CookiePreferences />
        <p>
          Apagar os dados do site no navegador encerra a sessão de login e também esquece essa
          escolha, que volta a ser perguntada na visita seguinte.
        </p>
      </LegalSection>
    </LegalArticle>
  );
}
