/** Design tokens — fonte da verdade visual do protótipo Nexus Science */
export const theme = {
  bg: "#F4F5F7",
  bgCard: "#FFFFFF",
  bgCardHover: "#F0F2F5",
  bgInput: "#F1F3F6",
  bgSidebar: "#FFFFFF",
  border: "#E3E6EA",
  borderLight: "#EDEFF2",
  primary: "#002060",
  primaryDim: "rgba(0,32,96,0.08)",
  primaryGlow: "rgba(0,32,96,0.20)",
  accent: "#800000",
  secondary: "#475569",
  success: "#10B981",
  successDim: "rgba(16,185,129,0.10)",
  danger: "#DC2626",
  dangerDim: "rgba(220,38,38,0.10)",
  warning: "#D97706",
  warningDim: "rgba(217,119,6,0.10)",
  info: "#2563EB",
  ink: "#1A1F2B",
  textSecondary: "rgba(0,0,0,0.60)",
  textMuted: "rgba(0,0,0,0.42)",
} as const;

export const STATUS_META = {
  Ativo: { color: theme.success, bg: theme.successDim },
  Pausado: { color: theme.warning, bg: theme.warningDim },
  Inadimplente: { color: theme.danger, bg: theme.dangerDim },
  Cancelado: { color: "#6B7280", bg: "rgba(107,114,128,0.15)" },
} as const;
