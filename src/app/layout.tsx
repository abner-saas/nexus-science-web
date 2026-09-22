import type { Metadata } from "next";
import { Syne, DM_Sans, Bebas_Neue, Montserrat } from "next/font/google";
import { Providers } from "@/components/providers";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: "400",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Consultoria Abner Lucas — treino no app",
    template: "%s · Nexus Science",
  },
  description:
    "Consultoria fitness online em Recife. Treino prescrito, biofeedback, avaliação e mensalidade no app do aluno.",
  icons: {
    icon: "/favicon.ico",
    apple: "/nexus-mark.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Nexus Science",
    title: "Consultoria Abner Lucas — treino no app",
    description:
      "Consultoria fitness online em Recife. Treino, biofeedback, avaliação e mensalidade no app do aluno.",
    images: [{ url: "/nexus-mark.png", alt: "Marca Nexus Science" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${syne.variable} ${dmSans.variable} ${bebas.variable} ${montserrat.variable} font-body antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
