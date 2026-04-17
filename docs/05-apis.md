# 📊 WhoAmI Studio — Estado del Proyecto (Backend)

## ✅ Estado actual

El backend ha completado exitosamente:

* FASE 1 — Base de datos
* FASE 2 — Autenticación
* FASE 3 — Cards (CRUD)
* FASE 4 — Favorites
* FASE 5 — External APIs

---

## 🧱 Arquitectura implementada

### 🔹 Stack

* NestJS (TypeScript)
* Prisma ORM
* PostgreSQL
* APIs externas (TMDB, Deezer)

---

## 🗄️ Base de datos

Se definieron los modelos principales:

* `User`
* `Card`
* `Favorite`

Relaciones:

* Un usuario → múltiples cards
* Una card → múltiples favorites

---

## 🔐 Autenticación

Implementado:

* Registro de usuario
* Login
* JWT
* Protección de rutas

Endpoints:

```
POST /auth/register
POST /auth/login
```

---

## 👤 Cards (core del dominio)

CRUD completo:

```
POST   /cards
GET    /cards
GET    /cards/:id
PATCH  /cards/:id
DELETE /cards/:id
```

Características:

* Ownership por usuario
* Validación con DTOs

---

## ⭐ Favorites

Sistema completo implementado:

### Funcionalidad:

* Crear favoritos por card
* Obtener favoritos por card
* Eliminar favoritos
* Reordenar favoritos

### Reglas de negocio:

* Máximo 3 favoritos por tipo (MOVIE / ALBUM)
* Orden obligatorio (1–3)
* No duplicar posiciones
* Validación de consistencia

### Endpoint base:

```
/cards/:cardId/favorites
```

---

## 🌐 External APIs

Módulo independiente para consumo de APIs externas:

### Endpoints:

```
GET /external/movies/search?q=
GET /external/albums/search?q=
```

### Integraciones:

* TMDB → películas
* Deezer → álbumes

### Características:

* Respuesta normalizada:

```ts
{
  id: string
  title: string
  imageUrl: string
}
```

* Backend actúa como proxy
* No se exponen API keys

---

## 🔗 Flujo completo implementado

1. Buscar contenido externo:

```
/external/*
```

2. Seleccionar resultado en frontend

3. Guardar como favorito:

```
/cards/:cardId/favorites
```

4. Persistencia en base de datos

---

## 📌 Decisiones de arquitectura clave

* Separación clara de módulos:

  * external ≠ favorites
* Backend como única fuente de verdad
* DTOs desde el inicio
* Validaciones en capa de servicio
* Diseño REST correcto (`cardId` en URL)

---

## 🧪 Estado técnico

✔ Backend funcional
✔ Endpoints probados
✔ Integraciones externas activas
✔ Lógica de negocio sólida

---

## 🚀 Siguiente fase

### 🎨 FASE 7 — Frontend base

Implementar:

* Autenticación (login/register)
* Guard de rutas
* Servicio API centralizado

---

## 🧠 Conclusión

El backend ya no es un prototipo:

Es una base sólida, escalable y lista para consumir desde frontend, con:

* arquitectura limpia
* separación de responsabilidades
* integraciones reales
* reglas de negocio bien definidas

---
