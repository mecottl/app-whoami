# Despliegue

La app son **tres piezas**: frontend (Angular, estático), backend (NestJS, servidor)
y Postgres. Vercel hospeda bien las dos primeras; para la base de datos hace falta
un Postgres gestionado.

## Recomendado

| Pieza | Dónde | Por qué |
|---|---|---|
| Postgres | **Neon** (free tier) | integración nativa con Vercel, sin tarjeta |
| Backend | **Railway** o **Render** | NestJS + Prisma corre mejor en un servicio *always-on* (sin cold starts); un solo `Dockerfile`/comando |
| Frontend | **Vercel** | estático, deploy en cada push |

(Todo en Vercel también se puede: el backend iría como *serverless function*. Cold
starts de ~1-2 s y algún ajuste extra en el bootstrap de Nest.)

## Pasos

### 0. Antes de nada
- **Merge la rama**: `git checkout main && git merge rework/overhaul-fases-a-f && git push`
- **Rota la API key de TMDB** (estuvo en el repo público).

### 1. Postgres (Neon)
1. Crea un proyecto en neon.tech → copia el `DATABASE_URL` (con `?sslmode=require`).
2. Desde tu máquina, apunta `backend/.env` a esa URL y corre:
   `cd backend && bun --bun run prisma migrate deploy`

### 2. Backend (Railway)
1. Nuevo proyecto → deploy desde el repo, **root = `backend`**.
2. Build: `bun install && bun --bun run prisma generate && bun run build`
   Start: `bun run start:prod`
3. Variables de entorno:
   ```
   DATABASE_URL      = (de Neon)
   JWT_SECRET        = (genera uno nuevo)
   TMDB_API_KEY      = (rotada)
   RAWG_API_KEY      = (opcional, rawg.io/apikey)
   SPORTSDB_API_KEY  = 3
   CORS_ORIGIN       = https://TU-APP.vercel.app
   PORT              = 3000
   ```
4. Copia la URL pública del backend (p. ej. `https://whoami-api.up.railway.app`).

### 3. Frontend (Vercel)
1. Import del repo → **root = `frontend`**, framework Angular (autodetectado).
2. En `frontend/src/index.html`, dentro de `<head>`, añade:
   ```html
   <script>window.__WHOAMI_API__ = 'https://whoami-api.up.railway.app';</script>
   ```
   (o deja que use `mismo-origen/api` si montas el backend en Vercel bajo `/api`).
3. Deploy.

### 4. Cerrar el círculo
- Pon `CORS_ORIGIN` del backend = dominio final de Vercel y redeploy el backend.
