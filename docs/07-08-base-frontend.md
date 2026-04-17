# 📊 WhoAmI — FASE 7–8: Frontend + Cards (Estado actual)

## ✅ Estado actual: FUNCIONAL (Auth + Dashboard + Create)

El frontend ya permite autenticación, visualización de cards y creación de nuevas cards conectadas al backend.

---

## 🧱 Stack y arquitectura

* Angular 21 (Standalone API)
* pnpm como gestor de paquetes
* Arquitectura basada en:

  * Components standalone
  * Services (API + lógica)
  * Guards para protección

---

## 🔐 Autenticación

### ✔ Login funcional

* Request:

  ```
  POST /auth/login
  ```
* Recepción de `access_token`
* Almacenamiento en `localStorage`

### ✔ AuthGuard

* Protege rutas privadas
* Redirige a `/login` si no hay token

---

## 🌐 API Layer

### `ApiService`

* Manejo centralizado de requests HTTP
* Inserta automáticamente:

  ```
  Authorization: Bearer <token>
  ```

---

## 🧠 Cards Module

### ✔ `CardsService`

* `GET /cards`
* `POST /cards`

---

## 📊 Dashboard

### ✔ Funcionalidades

* Obtiene cards del usuario
* Renderiza lista de cards
* Navegación hacia creación

### ⚠️ Problemas resueltos

* Cache HTTP (304 → 200)
* Problemas de render con Angular standalone
* Change detection no disparado automáticamente

### ✔ Solución aplicada

```ts
this.cdr.detectChanges()
```

---

## ➕ Crear Card

### ✔ Ruta

```
/create-card
```

### ✔ Formulario funcional

Campos:

* name
* description
* birthDate
* layout
* template

### ✔ Request

```
POST /cards
```

### ✔ Flujo

1. Usuario llena formulario
2. Se envía request
3. Se redirige a dashboard
4. Nueva card aparece

---

## 🧭 Routing

Rutas actuales:

```ts
/login
/register
/dashboard (protegida)
/create-card (protegida)
/ → redirect a dashboard
```

---

## ⚙️ Problemas clave resueltos

### 🔧 1. CORS

```ts
app.enableCors()
```

---

### 🔧 2. Cache (304 Not Modified)

```ts
app.set('etag', false)
```

---

### 🔧 3. Angular Standalone Issues

* Imports explícitos requeridos
* RouterLink necesario en componentes
* Control flow (`@for`) no habilitado correctamente

---

### 🔧 4. Change Detection

Problema:

* Datos llegaban pero no renderizaban

Solución:

```ts
this.cdr.detectChanges()
```

---

### 🔧 5. Routing errors

Error:

```
Cannot match any routes
```

Solución:

* Definir rutas correctamente (`create-card`)

---

## 🧪 Estado funcional actual

✔ Login
✔ Protección de rutas
✔ Fetch de cards
✔ Render de cards
✔ Crear card
✔ Navegación entre vistas

---

## 🚀 Siguiente fase

### 👉 Card Detail + Favorites

Lo que sigue:

* Ruta:

  ```
  /cards/:id
  ```
* Vista individual de card
* Integración con favoritos:

  * música
  * películas
  * videojuegos

---

## 🧭 Conclusión

El proyecto ya cuenta con:

* Base frontend sólida
* Integración completa con backend
* Flujo de usuario funcional
* Estructura escalable

👉 A partir de aquí inicia el desarrollo del **core real del producto (favoritos y visualización de identidad)**.
