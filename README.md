# Nexus Science Web

Frontend Next.js 14 (App Router) do painel Nexus Science.

## Stack

- Next.js 14 + TypeScript + Tailwind
- Zustand + TanStack Query
- Deploy: **Vercel**

## Desenvolvimento

```bash
cp .env.example .env.local
npm install
npm run dev
```

`NEXT_PUBLIC_API_URL` deve apontar para a API local (`http://localhost:3333`) ou produção.

## Deploy

Ver [DEPLOY.md](./DEPLOY.md) — push em `main` → Vercel.
