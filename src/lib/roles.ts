import type { AuthUser } from "@/lib/api";

/** Espelho da matriz do backend — controla menu lateral */
export const ROLE_NAV: Record<AuthUser["role"], string[]> = {
  ADMIN: [
    "/dashboard",
    "/crm",
    "/financeiro",
    "/retencao",
    "/treinos",
    "/biofeedback",
    "/avaliacao",
    "/pagamentos",
    "/planos",
    "/ia",
    "/configuracoes",
    "/aluno",
  ],
  TRAINER: [
    "/dashboard",
    "/crm",
    "/retencao",
    "/treinos",
    "/biofeedback",
    "/avaliacao",
    "/ia",
    "/configuracoes",
  ],
  FINANCE: [
    "/dashboard",
    "/crm",
    "/financeiro",
    "/pagamentos",
    "/planos",
    "/retencao",
    "/configuracoes",
  ],
  RECEPTION: ["/dashboard", "/crm", "/configuracoes"],
  STUDENT: ["/aluno"],
};

export const ROLE_LABELS: Record<AuthUser["role"], string> = {
  ADMIN: "Administrador",
  TRAINER: "Treinador",
  FINANCE: "Financeiro",
  RECEPTION: "Recepção",
  STUDENT: "Aluno",
};

export const ROLE_DESCRIPTIONS: Record<Exclude<AuthUser["role"], "STUDENT">, string> = {
  ADMIN: "Acesso total: equipe, financeiro, CRM, treinos e configurações.",
  TRAINER: "Só alunos atribuídos: CRM, treinos, biofeedback e avaliação. Sem financeiro.",
  FINANCE: "Financeiro, pagamentos, planos e CRM. Sem editar treinos.",
  RECEPTION: "Leitura do CRM e contatos. Sem dados financeiros.",
};

export function canAccess(role: AuthUser["role"] | undefined, href: string) {
  if (!role) return false;
  const allowed = ROLE_NAV[role] ?? [];
  return allowed.some((path) => href === path || href.startsWith(`${path}/`));
}
