# WhoAmI Studio

Crea cards visuales de identidad (nombre, edad, gustos) y expórtalas como PNG para compartir.

- **Frontend** — Angular 21 (standalone, signals), CSS vanilla. `frontend/`
- **Backend** — NestJS 11 + Prisma 7 + PostgreSQL. `backend/`
- **Gestor de paquetes** — [Bun](https://bun.sh). Un solo lockfile (`bun.lock`) por paquete.

## Puesta en marcha

### Base de datos

Necesitas un PostgreSQL local. Crea la base y ajusta `DATABASE_URL`.

### Backend

```bash
cd backend
cp .env.example .env      # y rellena los valores (ver abajo)
bun install
bun --bun run prisma migrate deploy
bun --bun run prisma generate
bun run start:dev         # http://localhost:3000
```

### Frontend

```bash
cd frontend
bun install
bun run start             # http://localhost:4200
```

## Variables de entorno (`backend/.env`)

| Variable | Para qué | Obligatoria |
|---|---|---|
| `DATABASE_URL` | Conexión a Postgres | sí |
| `JWT_SECRET` | Firma de tokens (`node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`) | sí |
| `TMDB_API_KEY` | Búsqueda de **películas** y **series** ([themoviedb.org](https://www.themoviedb.org/settings/api)) | sí |
| `RAWG_API_KEY` | Búsqueda de **juegos** ([rawg.io/apikey](https://rawg.io/apikey)) | no (sin ella la categoría GAME responde 503) |
| `SPORTSDB_API_KEY` | Búsqueda de **deportes** (`"3"` es la key pública de pruebas) | no |
| `PORT` / `CORS_ORIGIN` | Puerto y origen permitido | no |

## Tests

```bash
cd backend && bun run test      # vitest
cd frontend && bun run test     # @angular/build:unit-test (vitest)
```
