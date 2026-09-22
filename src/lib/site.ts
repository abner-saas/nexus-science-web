const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? vercelUrl ?? "http://localhost:3000";

export const BUSINESS_CITY = "Recife/PE";
export const BRAND_NAME = "Nexus Science";
export const BUSINESS_LINE = "Consultoria fitness online";
