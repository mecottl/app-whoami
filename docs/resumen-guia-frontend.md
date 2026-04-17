# WhoAmI Studio - Resumen Maestro del Proyecto

Este documento resume el estado actual de la aplicacion para reutilizarlo en futuros prompts con otras IAs. La idea es tener una guia unica, clara y actualizada del producto, del backend ya construido y de lo que falta para continuar con la siguiente fase real del proyecto.

## 1. Que es WhoAmI Studio

WhoAmI Studio es una aplicacion web para crear tarjetas visuales personalizadas tipo "card" que representen la identidad de una persona.

Cada usuario puede:

- registrarse e iniciar sesion
- crear varias cards
- definir datos personales y esteticos de la card
- organizar favoritos por categoria en formato Top 3
- preparar informacion lista para una futura vista previa visual y exportacion como imagen

La idea del producto es mezclar identidad personal con gustos culturales para generar una pieza visual compartible, por ejemplo estilo story vertical.

## 2. Stack del proyecto

### Backend

- NestJS
- TypeScript
- Prisma
- PostgreSQL
- JWT + Passport
- class-validator
- Bun como runtime y gestor de paquetes
- APIs externas: TMDB y Deezer

### Frontend actual

- Angular
- CSS vanilla
- Angular 21 con Standalone API
- enrutamiento con `loadComponent`
- estructura por `core`, `shared` y `features`

## 3. Modelo de datos actual

Segun la documentacion y el schema actual, las entidades principales son:

### User

- `id`
- `email`
- `name`
- `password`
- `createdAt`

Relacion:

- un usuario tiene muchas cards

### Card

- `id`
- `name`
- `birthDate`
- `description`
- `favoriteColor`
- `template`
- `layout`
- `createAt`
- `userId`

Relacion:

- una card pertenece a un usuario
- una card tiene muchos favoritos

### Favorite

- `id`
- `title`
- `imageUrl`
- `externalId`
- `type`
- `order`
- `cardId`

Restricciones importantes:

- no se puede repetir `order` dentro del mismo `cardId + type`
- no se puede repetir `externalId` dentro del mismo `cardId + type`

### Enums actuales

`Template`

- `DARK`
- `LIGHT`
- `NEON`
- `MINIMAL`

`Layout`

- `VERTICAL`
- `HORIZONTAL`
- `SQUARE`

`FavoriteType`

- `MOVIE`
- `MUSIC`
- `GAME`
- `SERIES`
- `SPORT`

## 4. Estado real del backend

El backend esta bastante avanzado y funcional. A nivel practico, ya existe una base solida para conectar el frontend.

### Ya esta hecho

#### Base de datos y Prisma

- schema definido y migraciones funcionando
- Prisma Client generado en `backend/generated/prisma`
- conexion a PostgreSQL ya operativa

#### Autenticacion

- registro de usuario
- login
- hash de contrasenas con bcrypt
- emision de JWT
- estrategia JWT con Passport
- guard de autenticacion disponible

#### Cards

- CRUD completo de cards
- cada card pertenece a un usuario autenticado
- aislamiento por `userId`
- validaciones con DTOs
- uso de enums para configuracion visual

#### Favorites

- crear favoritos dentro de una card
- listar favoritos de una card
- eliminar favoritos
- actualizar orden
- regla de maximo 3 elementos por categoria
- control de posiciones 1 a 3
- control de duplicados por posicion
- control de duplicados por `externalId`

#### External APIs

- modulo external implementado
- busqueda de peliculas por TMDB
- busqueda de albums por Deezer
- respuestas normalizadas para consumo del frontend
- backend como proxy para no exponer API keys

## 5. Punto importante sobre seguridad

Aunque la documentacion de fases marca Favorites como completado, el codigo actual muestra que este modulo todavia no esta endurecido al mismo nivel que Cards.

### Estado actual de Favorites

- la logica de negocio principal existe
- pero conviene revisar proteccion con JWT y ownership de card/favorite

Esto significa que, para documentacion futura, conviene tratar Favorites como:

- funcional a nivel CRUD y reglas de negocio
- probablemente pendiente de hardening de seguridad antes de considerarlo totalmente cerrado

## 6. Que significa esto para la siguiente fase

El frontend ya puede empezar sin problema en las areas principales del producto porque el backend cubre el flujo base:

- autenticacion
- gestion de cards
- lectura y edicion de datos principales
- busqueda de contenido real desde APIs externas
- guardado de favoritos a partir de resultados externos

Con esto, la prioridad actual pasa a ser frontend.

## 7. Estado funcional resumido

### Backend listo o casi listo

- Auth: listo
- Cards: listo
- Favorites: listo en logica, con posible hardening pendiente
- External APIs: listo

### Backend no implementado todavia

- exportacion PNG
- capa de hardening general adicional si se quiere nivel portafolio mas pulido

## 8. Lo que sigue ahora

Dado que Auth, Cards, Favorites y External APIs ya existen, la siguiente etapa prioritaria es el frontend.

### Base frontend ya construida en fases 7 y 8

Actualmente el frontend ya no esta en cero. Ya existe una base funcional conectada al backend con:

- landing publica
- login funcional
- register funcional
- dashboard de usuario
- vista para crear cards
- `AuthGuard`
- `ApiService` con header Bearer
- `AuthService` y `CardsService`
- componentes standalone cargados con lazy routes

### Estructura recomendada a futuro

Para que el proyecto escale sin mezclar responsabilidades, la organizacion recomendada queda asi:

```text
src/app/
  core/
    guards/
    services/
  shared/
    models/
    ui/
  features/
    home/
      pages/
    auth/
      data-access/
      pages/
    cards/
      data-access/
      pages/
      components/
    favorites/
      data-access/
      pages/
      components/
    external-search/
      data-access/
      components/
```

Regla practica:

- `core`: piezas globales y transversales
- `shared`: modelos y UI reutilizable sin logica de dominio
- `features`: cada dominio con sus paginas, componentes y acceso a datos

### Objetivo inmediato

Construir el frontend sobre un backend ya funcional, conectando autenticacion, cards, favoritos y busqueda externa real.

### Orden recomendado

1. autenticacion en Angular
2. guard de rutas y manejo de token
3. servicio API centralizado
4. dashboard de cards
5. formulario para crear y editar cards
6. preview card inicial
7. UI de favoritos
8. UI de busqueda externa
9. integracion completa editor + favoritos + external search
10. exportacion PNG

### Resultado esperado de esta fase

- login y register funcionales
- consumo de endpoints ya existentes
- cards editables desde UI
- favoritos conectados a resultados reales de TMDB y Deezer
- base visual lista para iterar despues

## 9. Alcance sugerido del frontend MVP

### Pantallas

- landing
- login
- register
- dashboard
- editor de card

### Componentes utiles

- formulario de auth
- lista de cards
- card form
- preview card
- favorites manager
- external search
- selector de template
- selector de layout

### Pantallas/modulos ya preparados como base

- `LandingPage`
- `LoginPage`
- `RegisterPage`
- `DashboardPage`
- `CreateCardPage`

Cada una con su propio archivo `ts`, `html` y `css`, listas para crecer hacia componentes internos mas pequenos.

### Estado minimo a manejar

- usuario autenticado
- token JWT
- lista de cards del usuario
- card activa en edicion
- favoritos de la card activa
- resultados de busqueda externa

## 10. Decisiones de producto ya definidas

Estas ideas ya aparecen repetidamente en la documentacion y sirven como base para futuros prompts:

- la app no es una red social publica
- las cards son privadas
- un usuario puede tener multiples cards
- el valor principal del producto es visual + identidad + gustos
- el layout inicial importante es el vertical tipo story
- el frontend no debe exponer API keys
- la arquitectura busca calidad de portafolio, no solo un prototipo rapido

## 11. Riesgos o puntos a vigilar

- Favorites necesita revisar validacion de ownership y proteccion por JWT
- hay una mezcla entre estado historico y estado actual en los docs antiguos, por eso este archivo debe tomarse como referencia principal
- exportar PNG sigue siendo una fase futura, no una capacidad ya disponible

## 12. Prompt base reutilizable para futuras IAs

Puedes reutilizar algo como esto:

```text
Estoy trabajando en una app llamada WhoAmI Studio.

Resumen del producto:
- Es una aplicacion web para crear cards visuales personalizadas que representan identidad y gustos del usuario.
- Cada usuario puede registrarse, iniciar sesion y crear multiples cards privadas.
- Cada card incluye datos personales, configuracion visual y favoritos por categoria en formato Top 3.

Stack:
- Backend: NestJS + TypeScript + Prisma + PostgreSQL + JWT
- Frontend: Angular + CSS vanilla

Estado actual:
- El backend base ya esta construido.
- Auth esta listo: register, login, JWT.
- Cards esta listo: CRUD completo con ownership por usuario.
- Favorites ya existe con reglas de negocio (maximo 3 por categoria, orden 1-3, sin duplicados).
- External APIs ya existe con busqueda real y respuestas normalizadas.
- La fase actual ahora es frontend.

Lo que necesito ahora:
- continuar con el frontend
- conectar autenticacion, cards, favoritos y external search
- priorizar arquitectura clara, componentes reutilizables y buena UX
- evitar rehacer el backend salvo que sea necesario para seguridad

Quiero que me ayudes a avanzar desde este contexto sin asumir que el backend esta vacio.
```

## 13. Conclusion

WhoAmI Studio ya no esta en fase de arranque. La base del backend esta construida y el proyecto ya tiene dominio, autenticacion, CRUD principal e integraciones externas.

La prioridad correcta ahora es iterar el frontend sobre esa base, teniendo presente que:

- Cards ya esta listo para consumirse
- Auth ya esta listo para consumirse
- Favorites ya puede integrarse
- External APIs ya esta listo para consumirse
- exportacion sigue siendo una fase posterior
- el frontend ya tiene una arquitectura base mas clara por features y paginas principales creadas

Este archivo debe usarse como referencia principal para los siguientes prompts.
