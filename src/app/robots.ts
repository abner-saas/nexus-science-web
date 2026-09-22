import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/aluno",
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
        "/login/oauth",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
