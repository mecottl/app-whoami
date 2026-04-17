WhoAmI Studio es una aplicación web que permite a los usuarios crear tarjetas visuales personalizadas (“cards”) que representan su identidad, gustos y estilo personal, listas para compartirse en redes sociales.

La plataforma combina datos personales (como nombre, edad y descripción) con contenido cultural relevante —como películas, música o intereses— para generar composiciones visuales atractivas en formatos optimizados (por ejemplo, 1080x1920 tipo story).

Cada usuario puede crear múltiples cards, experimentar con distintos estilos (dark, neon, minimal, etc.) y organizar sus favoritos en rankings visuales. Todo esto se construye a través de un editor interactivo con preview en tiempo real y exportación a imagen (PNG).

A nivel técnico, WhoAmI Studio está diseñado como una aplicación fullstack moderna, con un backend robusto que gestiona autenticación, lógica de negocio e integración con APIs externas, y un frontend enfocado en experiencia visual y edición dinámica.

Prompt General:

Quiero crear una aplicación web llamada WhoAmI Studio con el siguiente stack:

Frontend:

* Angular
* CSS vanilla (sin frameworks)

Backend:

* NestJS (Node.js con TypeScript)
* Prisma como ORM

Base de datos:

* PostgreSQL

Objetivo de la app:
Crear tarjetas visuales personalizadas (“cards”) que representen a un usuario, incluyendo su identidad y gustos, y que puedan exportarse como imagen (PNG) para compartir en redes sociales.

Funcionalidades principales (MVP):

Autenticación:

* Registro y login con JWT

Cards:

* Crear, editar, eliminar cards
* Cada usuario puede tener múltiples cards (historial de cartas)
* Las cards son privadas (no hay vista pública)

Campos de la card:

* Nombre
* Fecha de nacimiento (calcular edad)
* Descripción
* Template (dark, light, neon)
* Layout (inicialmente vertical tipo IG story)

Favoritos:

* Top 3 películas (usando TMDb API)
* Top 3 discos (usando Spotify API, sin OAuth en MVP)
* Guardar title, imageUrl y externalId

UI/UX:

* Editor con preview en tiempo real
* Selector de templates
* Layout vertical (1080x1920)
* Diseño minimalista (principalmente dark mode)

Integraciones:

* Backend consume APIs externas (TMDb, Spotify)
* Frontend nunca expone API keys

Exportación:

* Generar imagen PNG usando html2canvas

Estructura esperada:

Backend (NestJS):

* módulos: auth, cards, external
* uso de DTOs, services y controllers
* conexión con PostgreSQL vía Prisma

Frontend (Angular):

* páginas: dashboard, editor
* componentes: form, preview-card, search, favorites

Requisitos técnicos:

* Código limpio y escalable
* Separación clara de responsabilidades
* Buen manejo de estado en frontend
* Manejo de errores en API

El objetivo es construir un proyecto de portafolio bien estructurado, no un prototipo rápido.
dame 50 nombres posibles para esta app 

# ⚡ WhoAmI Studio — Workflow de desarrollo

## 🧠 Estrategia general

Primero construyes **core backend sólido + dominio**, luego integraciones, y al final UI.

👉 Regla: *no toques frontend hasta que el backend esté estable.*

---

# 🧱 FASE 0 — Setup base

```bash
bun create nest backend
bun create angular frontend
```

Backend:

```bash
cd backend
bun add @prisma/client prisma
bun add class-validator class-transformer
bun add @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
bun add @nestjs/config
```

Frontend:

```bash
cd frontend
bun install
```

---

# 🗄️ FASE 1 — Base de datos (PRIMERO)

👉 Define tu dominio antes de escribir lógica.

* Diseñar schema Prisma:

  * User
  * Card
  * Favorite

```bash
bunx prisma init
bunx prisma migrate dev
```

✔ Resultado:

* DB lista
* Tipos generados

---

# 🔐 FASE 2 — Autenticación (CORE)

Implementa:

* Register
* Login
* JWT guard

Endpoints:

```
POST /auth/register
POST /auth/login
```

✔ Resultado:

* Usuarios autenticados
* Base para proteger todo lo demás

---

# 👤 FASE 3 — Cards (CRUD completo)

👉 Primera feature real

Implementa:

```
POST   /cards
GET    /cards
GET    /cards/:id
PATCH  /cards/:id
DELETE /cards/:id
```

IMPORTANTE:

* Validar ownership (userId)
* DTOs desde el inicio

✔ Resultado:

* Sistema usable sin UI

---

# ⭐ FASE 4 — Favorites

Agrega relación:

* Card → Favorites

Tipos:

* MOVIE
* ALBUM

✔ Backend ya modela toda la lógica de negocio

---

# 🌐 FASE 5 — External APIs (clave)

👉 Aquí tu app se vuelve interesante

Crear módulo:

```
/external
```

Endpoints:

```
GET /external/movies/search?q=
GET /external/albums/search?q=
```

Integraciones:

* The Movie Database
* Spotify

IMPORTANTE:

* Normalizar respuesta
* Nunca exponer API keys

✔ Resultado:

* Backend actúa como proxy limpio

---

# 🧪 FASE 6 — Hardening backend

Antes del frontend:

* Exception filters
* Validation global
* Logging interceptor
* Guards bien definidos

✔ Esto te sube nivel de portafolio

---

# 🎨 FASE 7 — Frontend base

Ahora sí frontend.

Implementa:

* Auth (login/register)
* Guard de rutas
* Servicio API centralizado

✔ Solo consume endpoints ya existentes

---

# 📊 FASE 8 — Dashboard

* Lista de cards
* Crear / editar / eliminar
* Navegación a editor

---

# ✏️ FASE 9 — Editor + Preview

👉 Feature principal

* Form reactivo
* Preview en tiempo real
* Templates (dark, light, neon)

✔ Aquí se ve el valor visual

---

# 🔎 FASE 10 — Búsqueda externa

* Buscar películas / álbumes
* Seleccionar favoritos
* Guardar en card

---

# 🖼️ FASE 11 — Export PNG

* html2canvas
* Resolución 1080x1920
* Optimizar calidad

---

# 🎯 FASE 12 — Polish

* UI consistente
* Animaciones ligeras
* Estados de carga / error
* UX limpio

---

# 🚀 Orden resumido (TL;DR)

1. DB (Prisma)
2. Auth
3. Cards CRUD
4. Favorites
5. External APIs
6. Hardening backend
7. Frontend base
8. Dashboard
9. Editor + preview
10. Search + favorites UI
11. Export PNG
12. Polish

---

# ⚠️ Reglas clave

* Backend manda, frontend consume
* No mezclar lógica con UI
* Todo tipado desde el inicio
* DTOs obligatorios
* Nada de “quick hacks”

---

# 🧠 Mentalidad correcta

Este proyecto no es:

❌ “hacer una app bonita”

Es:

✅ “demostrar arquitectura, decisiones y escalabilidad”

Tu prompt:

