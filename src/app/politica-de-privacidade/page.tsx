import type { Metadata } from "next";
import { LegalArticle, LegalSection } from "@/components/site/site-chrome";
import { SupportChannel } from "@/components/site/support-channel";
import { TRAINER_NAME } from "@/lib/contact";
import { BUSINESS_CITY, BRAND_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: `Quais dados a plataforma ${BRAND_NAME} coleta, por que trata cada um deles e como exercer os seus direitos previstos na LGPD.`,
};

export default function PrivacidadePage() {
  return (
    <LegalArticle
      title="Política de privacidade"
      intro={`Esta política explica quais dados pessoais o ${BRAND_NAME} coleta, com que finalidade, por quanto tempo e quais direitos você tem sobre eles. Ela vale para o site público, para a prévia do app e para o app usado por quem faz a consultoria de ${TRAINER_NAME}.`}
      updated="22 de setembro de 2026"
    >
      <LegalSection index={1} title="Quem é o responsável pelos dados">
        <p>
          Os dados tratados na plataforma são de responsabilidade da consultoria de {TRAINER_NAME},
          sediada em {BUSINESS_CITY}. É a consultoria que decide quais dados são coletados e para
          que servem, na condição de controladora nos termos da Lei Geral de Proteção de Dados (Lei
          13.709/2018).
        </p>
      </LegalSection>

      <LegalSection index={2} title="Dados que coletamos">
        <ul>
          <li>
            <strong>Cadastro do aluno:</strong> nome, e-mail, telefone e cidade, informados na
            entrada da consultoria.
          </li>
          <li>
            <strong>Acompanhamento do treino:</strong> rotina prescrita, exercícios, cargas e as
            sessões que você confirma no app.
          </li>
          <li>
            <strong>Biofeedback:</strong> energia, humor, estresse, sono, hidratação e dor muscular
            registrados por você.
          </li>
          <li>
            <strong>Avaliação física:</strong> peso, circunferências, composição corporal, além de
            restrições e histórico de lesões que você relatar.
          </li>
          <li>
            <strong>Fotos de progresso:</strong> apenas as que você mesmo enviar para acompanhar a
            evolução.
          </li>
          <li>
            <strong>Pagamentos:</strong> valor, vencimento e situação da mensalidade. Os dados do
            cartão e das chaves Pix ficam com o provedor de pagamento, nunca com a consultoria.
          </li>
          <li>
            <strong>Acesso:</strong> credenciais de login. Se você entra com o Google, recebemos
            nome e e-mail da conta usada, e nenhuma senha.
          </li>
        </ul>
      </LegalSection>

      <LegalSection index={3} title="Dados de saúde">
        <p>
          Restrições, lesões e demais informações de saúde são dados pessoais sensíveis. Eles são
          usados exclusivamente para adaptar a prescrição do treino, ficam criptografados no banco
          de dados e são acessíveis apenas a {TRAINER_NAME} e à equipe da consultoria que atua no
          seu acompanhamento.
        </p>
      </LegalSection>

      <LegalSection index={4} title="Por que tratamos cada dado">
        <ul>
          <li>
            Executar o contrato de consultoria: prescrever o treino, ler o seu biofeedback,
            registrar avaliações e emitir a mensalidade.
          </li>
          <li>Autenticar o seu acesso e manter a conta segura.</li>
          <li>Cumprir obrigações fiscais e contábeis ligadas às cobranças emitidas.</li>
          <li>
            Medir o uso do site público, com base no seu consentimento, para entender quais páginas
            ajudam quem procura a consultoria.
          </li>
        </ul>
        <p>
          Dados de aluno não alimentam publicidade. A plataforma não tem pixel de anúncio e não
          vende, aluga nem cede sua base de dados a terceiros.
        </p>
      </LegalSection>

      <LegalSection index={5} title="Visitantes que entram com o Google">
        <p>
          Quem entra com o Google sem ser aluno recebe apenas a prévia do app, preenchida com dados
          de demonstração. Nesse caso guardamos nome e e-mail da conta Google enquanto a sessão
          durar, para identificar quem pediu contato. Essa entrada não cria matrícula, não gera
          cobrança e não coloca você na base de alunos.
        </p>
      </LegalSection>

      <LegalSection index={6} title="Com quem os dados são compartilhados">
        <ul>
          <li>
            <strong>Google:</strong> autenticação, quando você escolhe entrar com a conta Google.
          </li>
          <li>
            <strong>Asaas:</strong> emissão e conciliação das cobranças por Pix, cartão ou boleto.
          </li>
          <li>
            <strong>Vercel:</strong> hospedagem do site e métricas de desempenho das páginas.
          </li>
          <li>
            <strong>Google Analytics:</strong> medição do site público, somente se você aceitar.
          </li>
        </ul>
        <p>
          Cada um desses fornecedores recebe apenas o necessário para a função que executa e está
          sujeito às próprias políticas de privacidade.
        </p>
      </LegalSection>

      <LegalSection index={7} title="Medição do site">
        <p>
          A medição cobre a página inicial, a prévia do app e as páginas legais. O painel da equipe
          e as telas do aluno não enviam dados a ferramentas de análise. Os eventos medidos são
          cliques e navegação, sem nome, e-mail, telefone ou o texto das mensagens de WhatsApp. O
          detalhamento e a troca da sua escolha estão na política de cookies.
        </p>
      </LegalSection>

      <LegalSection index={8} title="Por quanto tempo guardamos">
        <p>
          Os dados do acompanhamento ficam guardados enquanto a consultoria estiver ativa, porque é
          o histórico que sustenta a progressão do treino. Encerrado o acompanhamento, mantemos
          apenas o que a legislação fiscal exige sobre as cobranças emitidas e eliminamos o
          restante. Você pode pedir a exclusão antes disso a qualquer momento.
        </p>
      </LegalSection>

      <LegalSection index={9} title="Segurança">
        <p>
          O acesso é individual e controlado por permissão: o aluno vê somente os próprios dados, e
          a equipe vê apenas o que o seu papel permite. O tráfego é criptografado em trânsito, os
          campos de saúde são criptografados no banco e as senhas são guardadas com algoritmo de
          hash, sem possibilidade de leitura reversa.
        </p>
      </LegalSection>

      <LegalSection index={10} title="Seus direitos">
        <p>
          A LGPD garante a você confirmar a existência do tratamento, acessar seus dados, corrigir
          informações incompletas ou desatualizadas, solicitar anonimização, bloqueio ou eliminação,
          pedir a portabilidade e revogar o consentimento dado à medição do site.
        </p>
        <SupportChannel action="Para exercer qualquer um desses direitos" />
      </LegalSection>

      <LegalSection index={11} title="Menores de idade">
        <p>
          O acompanhamento de menores de 18 anos só começa com autorização de quem detém a guarda,
          que responde pelos dados informados e pode exercer os direitos acima em nome do aluno.
        </p>
      </LegalSection>

      <LegalSection index={12} title="Mudanças nesta política">
        <p>
          Quando a política mudar, a data de vigência no topo da página é atualizada. Alterações que
          afetem a forma de tratar os seus dados são comunicadas pelos canais de atendimento da
          consultoria antes de passarem a valer.
        </p>
      </LegalSection>
    </LegalArticle>
  );
}
