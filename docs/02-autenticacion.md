# 📊 WhoAmI Studio — Estado del Proyecto

## ✅ Fase actual: FASE 2 COMPLETADA (Autenticación)

El backend ya cuenta con un sistema de autenticación funcional y correctamente estructurado usando NestJS, Prisma y JWT bajo un entorno ESM.

---

## 🧱 Infraestructura

- NestJS + TypeScript funcionando en modo ESM
- Bun como runtime y gestor de paquetes
- Prisma 7 con adapter `@prisma/adapter-pg`
- PostgreSQL conectado y operativo
- Variables de entorno configuradas correctamente

---

## 🗄️ Base de datos

Modelos implementados:

- `User`
- `Profile`
- `Favorite`

✔ Migraciones aplicadas  
✔ Prisma Client funcionando  

---

## 🔐 Autenticación (COMPLETA)

Implementado:

- Registro de usuario (`POST /auth/register`)
- Login (`POST /auth/login`)
- Hash de contraseñas con bcrypt
- Generación de JWT
- Validación de JWT con Passport
- Guard (`JwtAuthGuard`) funcional
- Inyección de usuario en request (`req.user`)

✔ Probado con endpoints reales  
✔ Flujo completo validado  

---

## 🧪 Validaciones realizadas

- Registro devuelve `access_token`
- Login funciona correctamente
- Ruta protegida (`GET /test/me`) responde con usuario autenticado
- Sin token → `401 Unauthorized`
- Con token → `200 OK`

---

## 🧠 Estado arquitectónico

- Estructura modular correcta (`auth`, `users`)
- Separación de responsabilidades aplicada
- DTOs implementados
- Servicios desacoplados
- Backend listo para escalar

---

# 🚀 Siguiente fase: FASE 3 — Profiles (CRUD + Ownership)

## 🎯 Objetivo

Implementar el sistema de perfiles ligado al usuario autenticado.

---

## 📦 Funcionalidades a desarrollar

### Endpoints

- `POST   /profiles`
- `GET    /profiles`
- `GET    /profiles/:id`
- `PATCH  /profiles/:id`
- `DELETE /profiles/:id`

---

## 🔐 Reglas clave

- Todas las rutas deben usar `JwtAuthGuard`
- Cada perfil debe pertenecer a un usuario (`userId`)
- Un usuario SOLO puede:
  - ver sus perfiles
  - editar sus perfiles
  - eliminar sus perfiles

❌ No debe poder acceder a perfiles de otros usuarios

---

## 🧠 Lógica crítica

### Crear perfil

```ts
userId = req.user.userId