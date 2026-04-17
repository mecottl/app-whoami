# 📊 WhoAmI Studio — Estado del Proyecto

## ✅ Estado actual: FASE 4 COMPLETADA (Favorites Module)

El backend ya cuenta con un módulo funcional para gestionar contenido personalizado dentro de los perfiles, enfocado en la lógica de “Top 3 por categoría”.

---

## 🧱 Infraestructura actual

- Backend: NestJS (TypeScript, ESM)
- ORM: Prisma
- Base de datos: PostgreSQL
- Validación: class-validator + ValidationPipe
- Arquitectura: modular por features (`auth`, `profiles`, `favorites`)

---

## 📦 Módulos implementados

### 🔐 Auth Module
- Registro y login
- Autenticación con JWT
- Protección de rutas

---

### 👤 Profiles Module
- CRUD de perfiles
- Relación 1:N (User → Profiles)
- Configuración visual (template, layout, etc.)

---

### ⭐ Favorites Module (FASE 4)
Sistema de contenido curado por perfil:

#### Funcionalidades:
- Crear favoritos (`POST`)
- Obtener favoritos por perfil (`GET`)
- Eliminar favoritos (`DELETE`)
- Actualizar orden (`PATCH`)

#### Reglas de negocio implementadas:
- Máximo 3 elementos por categoría (`type`)
- Orden limitado a posiciones 1–3
- No duplicar posiciones dentro de una categoría
- No duplicar contenido (`externalId`) por categoría

#### Estructura: