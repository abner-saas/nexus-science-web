# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See also `../CLAUDE.md` for workspace-level context (this is one of two repos in a local workspace folder).

## Stack

Next.js 14.2 (App Router) + React 18 + TypeScript + Tailwind CSS 3 + Zustand (client state, `src/store/auth.ts`) + TanStack Query (server state).

## Commands

- `npm run dev` — Next dev server
- `npm run build` — production build
- `npm run lint` — `next lint` (`next/core-web-vitals` + `next/typescript`, no custom rules)
- CI runs `npm run lint` then `npm run build` — no separate typecheck step (build covers it).

## Testing — no automated suite

No Jest/Vitest/Playwright/etc. Verification bar is `npm run lint` + `npm run build` passing, plus manual exercise of the affected pages in the browser.

## Conventions

- Path alias `@/*` → `./src/*`.
- Pages live under `src/app/{aluno,avaliacao,biofeedback,configuracoes,crm,dashboard,financeiro,ia,login,pagamentos,planos,retencao,treinos}/page.tsx` (App Router).
- Custom brand theme in `tailwind.config.ts` (colors `navy #002060`, `maroon #800000`; brand/title/display/body/impact font families) — use existing tokens rather than ad hoc colors.

## Environment variables

`NEXT_PUBLIC_API_URL` — points at the API base URL (`http://localhost:3333` locally).

## Cross-domain auth gotcha

Auth cookies are HttpOnly/Secure/SameSite=Strict, issued by the API. If the frontend (Vercel) and API (KVM1) end up on different root domains, cross-site cookies need `SameSite=None; Secure` on the API side — the recommended fix instead is putting both under the same root domain (`app.` + `api.`) with `COOKIE_DOMAIN=.domain.com`. See `DEPLOY.md` for details.

## Deploy

Vercel's native GitHub integration deploys on push to `main` — no dedicated GitHub Actions deploy workflow for this repo (unlike the API).

## Git workflow

Currently committing directly to `main`. Once moved to a service-account setup, this becomes feature branches merged to `main` via service-account-approved PRs — check current practice if unsure which phase you're in.
