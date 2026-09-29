const LEGACY_HOST = "nexus-science-web.vercel.app";

function canonicalSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!raw) return null;
  return new URL(raw).host === LEGACY_HOST ? null : raw;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    const siteUrl = canonicalSiteUrl();
    if (!siteUrl) return [];
    // Login só funciona no domínio canônico: lá os cookies da API são same-site.
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: LEGACY_HOST }],
        destination: `${siteUrl}/:path*`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
