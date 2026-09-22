import { LegalArticle } from "@/components/site/site-chrome";
import { TRAINER_NAME } from "@/lib/contact";
import { BUSINESS_CITY, BRAND_NAME } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: `Como o ${BRAND_NAME} trata dados da consultoria de ${TRAINER_NAME}.`,
};

export default function PrivacidadePage() {
  return (
    <LegalArticle title="Política de privacidade" updated="22/09/2026">
      <p>
        Esta página descreve o tratamento de dados pessoais no {BRAND_NAME}, plataforma de gestão
        da consultoria de {TRAINER_NAME} ({BUSINESS_CITY}). Não inventamos CNPJ nem endereço:
        quando o cliente publicar identificação fiscal, ela entra no rodapé e aqui.
      </p>
      <h2 className="font-title text-base font-bold text-navy">Quem trata os dados</h2>
      <p>
        O responsável pela consultoria é {TRAINER_NAME}. A plataforma é de uso interno dessa
        consultoria (equipe e alunos). Não é um produto vendido a outros profissionais.
      </p>
      <h2 className="font-title text-base font-bold text-navy">O que coletamos</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          Equipe e alunos matriculados: nome, e-mail, senha (hash) ou login Google, telefone,
          dados de treino, biofeedback, avaliação física e pagamentos.
        </li>
        <li>
          Restrições/lesões e demais campos de saúde: criptografados em repouso. Fotos de avaliação
          ficam em armazenamento de arquivos (URL), não em Base64 no banco.
        </li>
        <li>
          Prévia com Google (visitante sem cadastro): nome e e-mail da conta Google, só para a
          sessão da prévia. Isso não cria aluno no CRM nem cobrança.
        </li>
      </ul>
      <h2 className="font-title text-base font-bold text-navy">Para que usamos</h2>
      <p>
        Operar a consultoria: prescrição, registro de treino, biofeedback, avaliação, cobrança
        (Asaas) e login. Não usamos esses dados para anúncio de terceiros neste site — não há
        pixel de marketing instalado neste momento.
      </p>
      <h2 className="font-title text-base font-bold text-navy">Com quem compartilhamos</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Google, se você entra com OAuth (autenticação).</li>
        <li>Asaas, quando há cobrança de aluno matriculado (Pix, cartão, boleto).</li>
        <li>Hospedagem do site (Vercel) e da API (servidor da consultoria).</li>
      </ul>
      <h2 className="font-title text-base font-bold text-navy">Seus direitos (LGPD)</h2>
      <p>
        Acesso, correção, exclusão e informação sobre o tratamento. Pedidos: fale com{" "}
        {TRAINER_NAME} pelos canais do rodapé. Alunos matriculados podem pedir a exclusão do
        cadastro ao responsável da consultoria.
      </p>
    </LegalArticle>
  );
}
