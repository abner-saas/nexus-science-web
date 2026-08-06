import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#002060",
        maroon: "#800000",
        surface: "#F4F5F7",
        input: "#F1F3F6",
        card: "#FFFFFF",
        line: "#E3E6EA",
        "line-light": "#EDEFF2",
        ink: "#1A1F2B",
        muted: "#6B7280",
        success: "#10B981",
        danger: "#DC2626",
        warning: "#D97706",
        info: "#2563EB",
        secondary: "#475569",
      },
      fontFamily: {
        brand: ["var(--font-bebas)", "sans-serif"],
        title: ["var(--font-montserrat)", "sans-serif"],
        display: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        impact: ["var(--font-bebas)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.04), 0 8px 24px rgba(16,24,40,0.04)",
        nav: "0 2px 12px rgba(0,32,96,0.25)",
        btn: "0 3px 14px rgba(0,32,96,0.30)",
      },
      borderRadius: {
        nav: "9px",
      },
    },
  },
  plugins: [],
};
export default config;
