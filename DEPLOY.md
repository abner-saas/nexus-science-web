# Deploy — Nexus Science Web (Vercel)

## Fluxo automático

```
GitHub (main) → Vercel (Git Integration) → produção
              → GitHub Actions CI (lint + build) em PRs/push
```

Não precisa de Action de deploy: a integração nativa da Vercel com GitHub já faz o deploy a cada push.

## 1. Conectar o repositório

1. Acesse [https://vercel.com/new](https://vercel.com/new)
2. Importe `nexus-science-web`
3. Framework: **Next.js** (detectado automaticamente)
4. Root Directory: `.` (raiz do repo)
5. Adicione a variável de ambiente:

| Name | Value (produção) |
|------|------------------|
| `NEXT_PUBLIC_API_URL` | `https://api.seudominio.com` |

6. Deploy

## 2. Domínio

Em **Project → Settings → Domains**, aponte o domínio (ex.: `app.nexusscience.com.br`) ou use o `*.vercel.app`.

## 3. CORS no backend

No `.env` da API (KVM1), configure:

```env
CORS_ORIGIN=https://seu-app.vercel.app,https://app.seudominio.com
COOKIE_SECURE=true
COOKIE_DOMAIN=.seudominio.com
```

> Cookies cross-site entre `vercel.app` e API em outro domínio exigem `SameSite=None; Secure` **ou** preferencialmente o mesmo domínio raiz (ex.: `app.` + `api.`).

Recomendação: `app.seudominio.com` (Vercel) + `api.seudominio.com` (KVM1) com `COOKIE_DOMAIN=.seudominio.com`.

## 4. Preview deployments

PRs abertos no GitHub geram URLs de preview na Vercel automaticamente — use staging da API se for testar login com cookies.
