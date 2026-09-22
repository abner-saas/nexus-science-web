import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App do aluno (prévia)",
  description:
    "Prévia do app do aluno da consultoria Abner Lucas: treino, biofeedback, avaliação e pagamentos com dados de demonstração.",
};

export default function ConhecerLayout({ children }: { children: ReactNode }) {
  return children;
}
