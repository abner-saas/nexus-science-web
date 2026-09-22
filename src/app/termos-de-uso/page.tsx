import { LegalArticle } from "@/components/site/site-chrome";
import { TRAINER_NAME } from "@/lib/contact";
import { BUSINESS_CITY, BRAND_NAME } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de uso",
  description: `Condições de uso do ${BRAND_NAME}, plataforma da consultoria de ${TRAINER_NAME}.`,
};

export default function TermosPage() {
  return (
    <LegalArticle title="Termos de uso" updated="22/09/2026">
      <p>
        O {BRAND_NAME} é a plataforma da consultoria de {TRAINER_NAME} ({BUSINESS_CITY}). O site
        público apresenta a consultoria e uma prévia do app do aluno. O acesso completo depende
        de cadastro e pagamento combinados com o personal — não de um plano vendido automaticamente
        nesta página.
      </p>
      <h2 className="font-title text-base font-bold text-navy">Contas</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Equipe: logins criados pelo administrador, com permissão por papel.</li>
        <li>
          Aluno: vê só os próprios treinos, biofeedback, avaliações e cobranças. Não vê outros
          alunos nem o financeiro da consultoria.
        </li>
        <li>
          Visitante com Google: vê a prévia com dados fictícios. A sessão não equivale a matrícula.
        </li>
      </ul>
      <h2 className="font-title text-base font-bold text-navy">Pagamento e acesso</h2>
      <p>
        Cobrança de aluno matriculado: Pix, cartão ou boleto via Asaas. Confirmação pode manter o
        acesso; atraso pode restringir o treino após o prazo que o Abner definir. Valores de
        demonstração na prévia não são preços vigentes.
      </p>
      <h2 className="font-title text-base font-bold text-navy">Conteúdo da prévia</h2>
      <p>
        Exercícios, pesos e status de pagamento da prévia são ilustração. A rotina real é a
        prescrita no cadastro do aluno.
      </p>
      <h2 className="font-title text-base font-bold text-navy">Uso aceitável</h2>
      <p>
        Não tente acessar dados de outros alunos, da equipe ou do negócio. Saúde e treino aqui
        não substituem avaliação médica presencial quando ela for necessária.
      </p>
    </LegalArticle>
  );
}
