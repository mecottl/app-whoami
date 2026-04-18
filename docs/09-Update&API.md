# 📊 Reporte de Progreso — Card Builder App

## 🧭 Contexto General

Durante esta sesión se trabajó en la transición del proyecto desde una base funcional (CRUD + backend) hacia un **MVP interactivo con integración externa y lógica de dominio real**.

El enfoque no fue solo implementar features, sino **estructurar correctamente el flujo completo de datos y estado**.

---

# 🏗️ Arquitectura General Alcanzada

## Flujo completo implementado

```
UI (Angular)
  ↓
Signals (estado reactivo)
  ↓
Services (CardsService / ApiService)
  ↓
Backend (NestJS)
  ↓
External APIs (TMDB, Deezer)
```

---

# 🔧 Backend — Estado Final

## 📦 Módulos implementados

### 1. Cards

* CRUD completo
* DTOs definidos
* Update parcial (PATCH)

### 2. Favorites

* Crear favorito
* Eliminar favorito
* Obtener favoritos por card
* Actualizar orden

### 3. Validaciones de negocio

* Máximo **3 favoritos por tipo**
* Orden válido: `1–3`
* Orden único por tipo
* Validación con DTO + lógica adicional

### 4. External APIs

* `/external/movies/search` → TMDB
* `/external/albums/search` → Deezer
* Providers desacoplados

---

## 🧠 Decisiones clave backend

* Uso de `enum` para `type`
* Validación estricta (`whitelist + forbidNonWhitelisted`)
* Separación por módulos (clean architecture)
* Control del orden como dominio (no UI)

---

# 💻 Frontend — Estado Final

## 🧱 Base Angular

* Standalone components ✔
* Control flow moderno (`@if`, `@for`) ✔
* Signals ✔
* Routing dinámico ✔

---

## 🧠 Migración importante: Signals

### Antes:

```ts
card: any
loading: boolean
```

### Después:

```ts
card = signal<any>(null)
loading = signal(true)
```

### Beneficios:

* Eliminación de `ChangeDetectorRef`
* Reactividad automática
* Código más predecible
* Mejor integración con Angular moderno

---

## 📡 Consumo de APIs

### ApiService

* GET
* POST
* PATCH
* DELETE

Con headers de autorización.

---

## 📦 CardsService

### Funciones implementadas:

* `getCards()`
* `createCard()`
* `getCardById()`
* `updateCard()`
* `getFavorites()`
* `addFavorite()`
* `deleteFavorite()`
* `searchMovies()`
* `searchAlbums()`

---

# 🧩 Card Editor — Feature Principal

## ✅ Funcionalidades logradas

### 1. Carga de card

* Lectura por ID
* Render dinámico

---

### 2. Edición de datos

* Inputs básicos
* Actualización en tiempo real
* Persistencia con PATCH

---

### 3. Manejo de favoritos

#### ✔ Obtener favoritos

```ts
getFavorites(cardId)
```

#### ✔ Eliminar favorito

* UI reactiva
* Sync con backend

#### ✔ Agregar favorito

Incluye:

* Validación de máximo 3
* Cálculo correcto de orden
* Manejo de huecos (slots libres)

---

## 🔥 Lógica clave implementada

### Problema resuelto: orden incorrecto

Antes:

```ts
order = current.length + 1 ❌
```

Después:

```ts
const order = [1,2,3].find(n => !current.some(f => f.order === n))
```

👉 Esto convierte la lista en **sistema de slots**

---

# 🔍 Búsqueda externa

## Implementación

* Input de búsqueda
* Selector de tipo
* Resultados dinámicos
* Integración con backend

---

## Refactor importante

### Antes:

```ts
type === 'movies' ? ...
```

### Después:

```ts
const handler = searchHandlers[type]
```

---

## Map de handlers

```ts
private searchHandlers = {
  MOVIE: (q) => this.cardsService.searchMovies(q),
  MUSIC: (q) => this.cardsService.searchAlbums(q)
}
```

👉 Escalable y limpio

---

# 🧠 Manejo de Tipos (Crítico)

## Problema inicial

* `'movie'` vs `'MOVIE'`
* Strings inconsistentes

---

## Solución

### Centralización:

```ts
export const FAVORITE_TYPES = {
  MOVIE: 'MOVIE',
  MUSIC: 'MUSIC'
} as const
```

---

## Beneficios

* Consistencia frontend-backend
* Escalabilidad
* Evita bugs de enums

---

# 🧩 Problemas Resueltos

## ⚠️ 1. Change Detection

* Uso incorrecto de Angular moderno
* Solución: signals

---

## ⚠️ 2. Payload incorrecto

* Envío de entidad completa
* Solución: DTO limpio

---

## ⚠️ 3. Errores 400

* Campos no permitidos
* Enum inválido

---

## ⚠️ 4. Error 500

* `externalId = undefined`
* Solución: map correcto de API externa

---

## ⚠️ 5. Orden duplicado

* Error backend esperado
* Solución: algoritmo de slots

---

## ⚠️ 6. Duplicated keys Angular

* Track incorrecto
* Solución: track seguro

---

# 🧠 Conceptos avanzados aplicados

* Estado reactivo con signals
* Separación de capas
* DTO vs entidad
* Mapeo de APIs externas
* Validaciones de dominio
* Refactor a configuración (handlers)
* Arquitectura escalable

---

# 📊 Estado actual del producto

## ✔ MVP funcional completo

Incluye:

* Gestión de cards
* Edición en tiempo real
* Favoritos con reglas
* Integración con APIs reales
* Estado reactivo moderno

---

## 🧭 Nivel del proyecto

```txt
CRUD básico ❌
App con dominio real ✔
```

---

# 🚀 Próximos pasos

## 1. UI tipo Top 3 (en progreso)

* Slots visuales
* Separación por tipo

---

## 2. UX avanzada

* Bloqueo de slots
* Feedback visual

---

## 3. Drag & Drop

* Reordenamiento
* updateOrder backend

---

## 4. Mejora de búsqueda

* Debounce
* Loading states

---

## 5. Preview real de card

* Layout final
* Visualización completa

---

# 🎯 Conclusión

## ✔ Objetivo de la sesión

**Cumplido y superado**

## ✔ Logros clave

* Arquitectura sólida
* Integración real
* Lógica de negocio avanzada
* Base escalable

## 🧠 Insight importante

El proyecto ya no es:

```
una app CRUD
```

Ahora es:

```
un editor de identidad con lógica de dominio
```

---

# 📌 Estado final

```txt
Backend: sólido ✔
Frontend: funcional ✔
Integración externa: completa ✔
UX: siguiente fase
```

---

**Siguiente foco:**
👉 Transformar funcionalidad en experiencia visual (Top 3 + interacción)
