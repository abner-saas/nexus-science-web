import { TrackedLink } from "@/components/site/tracked-link";
import { TRAINER_NAME, trainerWhatsApp } from "@/lib/contact";

/**
 * Canal de atendimento citado nas páginas legais. Sem número configurado, a
 * frase segue válida apontando para o atendimento da consultoria.
 */
export function SupportChannel({ action }: { action: string }) {
  const wa = trainerWhatsApp();

  if (!wa) {
    return (
      <p>
        {action}, fale com {TRAINER_NAME} pelos canais de atendimento da consultoria.
      </p>
    );
  }

  return (
    <p>
      {action}, fale com {TRAINER_NAME}{" "}
      <TrackedLink
        href={wa}
        kind="whatsapp"
        location="legal"
        className="font-semibold text-navy underline"
      >
        pelo WhatsApp da consultoria
      </TrackedLink>
      . O prazo legal de resposta é de até 15 dias.
    </p>
  );
}
