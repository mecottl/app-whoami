# Despliegue

Tres piezas:

| Pieza | Dónde | Config en el repo |
|---|---|---|
| Base de datos | **Supabase** (Postgres free) | — |
| Backend (NestJS) | **Render** (web service free) | `render.yaml` |
| Frontend (Angular) | **Vercel** (estático) | `frontend/vercel.json` |
| Keep-alive de la DB | **GitHub Actions** (cron) | `.github/workflows/db-keepalive.yml` |

El frontend llama siempre a `/api/...` (mismo origen); Vercel reescribe `/api/*`
hacia el backend de Render, así que **no hay CORS entre navegador y API** y las
cookies/orígenes no se cruzan.

> Notas del plan free:
> - **Render** duerme el servicio tras 15 min sin tráfico; el primer request
>   después tarda ~50 s en responder.
> - **Supabase** pausa el proyecto tras ~7 días sin actividad. El cron de
>   keep-alive lo evita.

---

## 0. Antes de nada

- **Merge la rama:** `git checkout main && git merge rework/overhaul-fases-a-f && git push`
- **Rota la `TMDB_API_KEY`** (estuvo en el repo público en un commit antiguo).
- (Opcional) consigue una `RAWG_API_KEY` en <https://rawg.io/apikey> para la
  categoría *Juegos* (sin ella responde 503, el resto funciona).

---

## 1. Base de datos — Supabase

1. <https://supabase.com> → **New project**. Guarda la contraseña de la base.
2. Botón **Connect** (arriba del dashboard) → pestaña **ORMs** o **Prisma**.
   Verás dos cadenas:
   ```
   DATABASE_URL  = ...pooler.supabase.com:6543/postgres?pgbouncer=true   (transaction)
   DIRECT_URL    = ...pooler.supabase.com:5432/postgres                  (session)
   ```
3. **Usa la de puerto `5432` (la que Supabase llama `DIRECT_URL`)** como tu
   `DATABASE_URL` en Render. El backend es un proceso Node persistente: el
   session pooler le va mejor que el transaction pooler y soporta migraciones.
   - Sustituye `[YOUR-PASSWORD]` por la contraseña del paso 1.
   - Añade `?sslmode=require` al final.
   - Queda algo así:
     `postgresql://postgres.abcd:TU_PASS@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require`
4. Las migraciones corren solas en cada deploy de Render
   (`prisma migrate deploy` en el `startCommand`).

---

## 2. Backend — Render

1. <https://render.com> → **New → Blueprint** → elige este repo. Render lee
   `render.yaml` y crea el servicio `whoami-api`.
2. Rellena las variables marcadas (se piden en el panel):

   | Variable | Valor |
   |---|---|
   | `DATABASE_URL` | la cadena de puerto 5432 de Supabase + `?sslmode=require` |
   | `CORS_ORIGIN` | tu dominio final de Vercel, p. ej. `https://whoami.vercel.app` |
   | `TMDB_API_KEY` | tu key (rotada) |
   | `RAWG_API_KEY` | opcional |

   `JWT_SECRET` se genera solo; `SPORTSDB_API_KEY` ya viene con `3`.
3. Deploy. Cuando termine, copia la URL pública
   (p. ej. `https://whoami-api.onrender.com`) y verifica:
   `curl https://whoami-api.onrender.com/health` → `{"ok":true,"db":true,...}`

> Si Render no detecta Bun automáticamente, en el panel del servicio pon
> Build Command: `npm i -g bun && bun install && bunx prisma generate && bun run build`

---

## 3. Frontend — Vercel

1. Edita **`frontend/vercel.json`** y cambia la URL del primer rewrite por la de
   tu backend en Render:
   ```json
   { "source": "/api/(.*)", "destination": "https://TU-BACKEND.onrender.com/$1" }
   ```
   Commit + push.
2. <https://vercel.com> → **Add New → Project** → importa el repo.
   - **Root Directory: `frontend`**
   - Framework Preset: **Other** (lo demás lo pone `vercel.json`)
3. Deploy. Copia el dominio final.
4. Vuelve a Render y pon `CORS_ORIGIN` = ese dominio. Redeploy del backend.

---

## 4. Keep-alive de la base de datos

Ya está el workflow `.github/workflows/db-keepalive.yml` (cada 3 días pega a
`/health`, que hace un `SELECT 1`).

1. En GitHub: **Settings → Secrets and variables → Actions → New repository secret**
   - `KEEPALIVE_URL` = `https://TU-BACKEND.onrender.com/health`
2. **Actions → db-keepalive → Run workflow** una vez para comprobar que pasa.

(Alternativa: un *Cron Job* en Render, pero requiere plan de pago.)

---

## Local

`backend/.env` (copia de `.env.example`) sigue apuntando a tu Postgres local
por Docker. Nada de esto cambia el desarrollo local.
