import type { Metadata } from "next";
import { LegalArticle, LegalSection } from "@/components/site/site-chrome";
import { SupportChannel } from "@/components/site/support-channel";
import { TRAINER_NAME } from "@/lib/contact";
import { BUSINESS_CITY, BRAND_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Termos de uso",
  description: `Condições de uso da plataforma ${BRAND_NAME}: contas, liberação de acesso, mensalidade, conteúdo da prévia e responsabilidades de cada lado.`,
};

export default function TermosPage() {
  return (
    <LegalArticle
      title="Termos de uso"
      intro={`Estes termos regem o uso do site e do app ${BRAND_NAME}, a plataforma da consultoria de treino de ${TRAINER_NAME}, em ${BUSINESS_CITY}. Ao navegar no site ou entrar no app, você concorda com as condições abaixo.`}
      updated="22 de setembro de 2026"
    >
      <LegalSection index={1} title="O que a plataforma é">
        <p>
          O {BRAND_NAME} é a ferramenta de trabalho da consultoria: ela entrega ao aluno o treino
          prescrito, recebe o biofeedback diário, guarda as avaliações físicas e organiza a
          mensalidade. O site público apresenta a consultoria e uma prévia navegável do app.
        </p>
        <p>
          A plataforma não vende plano de forma automática. O acesso completo é liberado depois que
          o acompanhamento é combinado direto com {TRAINER_NAME} e a primeira mensalidade é paga.
        </p>
      </LegalSection>

      <LegalSection index={2} title="Contas e permissões">
        <ul>
          <li>
            <strong>Aluno:</strong> acessa os próprios treinos, registros de biofeedback,
            avaliações e cobranças. Não acessa dados de outros alunos nem o financeiro da
            consultoria.
          </li>
          <li>
            <strong>Equipe:</strong> recebe login criado pela administração, com permissão limitada
            ao papel que exerce no atendimento.
          </li>
          <li>
            <strong>Visitante:</strong> entra com a conta Google apenas na prévia, que usa dados de
            demonstração e não equivale a matrícula.
          </li>
        </ul>
        <p>
          A conta é pessoal. Você é responsável por manter suas credenciais em sigilo e por tudo
          que for feito com o seu login.
        </p>
      </LegalSection>

      <LegalSection index={3} title="Mensalidade e continuidade do acesso">
        <p>
          A mensalidade do aluno é cobrada por Pix, cartão ou boleto, emitidos pela plataforma de
          pagamento Asaas. O valor e a periodicidade são os combinados na contratação do
          acompanhamento.
        </p>
        <p>
          Com o pagamento em dia, o acesso permanece liberado. Em caso de atraso, o acesso ao treino
          pode ser restringido após o prazo de tolerância definido pela consultoria, e volta a ser
          liberado com a regularização.
        </p>
      </LegalSection>

      <LegalSection index={4} title="Encerramento">
        <p>
          Você pode encerrar o acompanhamento quando quiser, avisando a consultoria. A consultoria
          também pode encerrar o acesso em caso de descumprimento destes termos. O encerramento não
          afeta cobranças de períodos já usados, e o tratamento dos dados após a saída segue o que
          está na política de privacidade.
        </p>
      </LegalSection>

      <LegalSection index={5} title="Conteúdo da prévia">
        <p>
          Exercícios, cargas, medições e valores exibidos na prévia do app são de demonstração,
          criados apenas para mostrar o layout das telas. Eles não são prescrição, não são resultado
          de ninguém e não representam a tabela de preços vigente. Nenhuma ação feita na prévia é
          gravada.
        </p>
      </LegalSection>

      <LegalSection index={6} title="Uso aceitável">
        <ul>
          <li>Não tente acessar dados de outros alunos, da equipe ou do negócio.</li>
          <li>
            Não use a plataforma para distribuir a prescrição de outra pessoa nem para revender o
            conteúdo da consultoria.
          </li>
          <li>
            Não tente contornar limites técnicos, automatizar requisições em massa ou interferir na
            disponibilidade do serviço.
          </li>
        </ul>
      </LegalSection>

      <LegalSection index={7} title="Saúde e limites do acompanhamento">
        <p>
          A consultoria prescreve treino físico a partir das informações que você declara. Ela não
          substitui diagnóstico, tratamento ou liberação médica. Informe restrições, lesões e
          condições de saúde antes de começar e mantenha esses dados atualizados. Diante de dor,
          sintoma novo ou orientação médica em contrário, interrompa o treino e procure um
          profissional de saúde.
        </p>
      </LegalSection>

      <LegalSection index={8} title="Propriedade do conteúdo">
        <p>
          As rotinas, os materiais e a identidade visual do {BRAND_NAME} pertencem à consultoria de{" "}
          {TRAINER_NAME}. Você recebe permissão de uso pessoal enquanto for aluno. Os dados que você
          registra continuam sendo seus, e você pode solicitar cópia deles a qualquer momento.
        </p>
      </LegalSection>

      <LegalSection index={9} title="Disponibilidade">
        <p>
          Trabalhamos para manter a plataforma no ar, mas ela pode ficar indisponível por
          manutenção, falha de fornecedores de hospedagem ou pagamento, ou outros eventos fora do
          nosso controle. Indisponibilidade temporária não interrompe o acompanhamento, que segue
          pelos canais de atendimento da consultoria.
        </p>
      </LegalSection>

      <LegalSection index={10} title="Mudanças nos termos e contato">
        <p>
          Estes termos podem ser atualizados, e a data de vigência no topo da página indica a versão
          em uso. Mudanças relevantes são comunicadas antes de passarem a valer. Aplica-se a
          legislação brasileira, incluindo o Código de Defesa do Consumidor quando cabível.
        </p>
        <SupportChannel action="Em caso de dúvida sobre estes termos" />
      </LegalSection>
    </LegalArticle>
  );
}
