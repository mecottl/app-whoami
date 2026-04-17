# Cambio de naming: antes y despues

## Dominio

- `Profile` -> `Card`
- `Profiles` -> `Cards`
- `profile` -> `card`
- `profiles` -> `cards`
- `perfil` -> `card`
- `perfiles` -> `cards`
- `profile card` -> `card`

## Rutas API

- `/profiles` -> `/cards`
- `/profiles/:id` -> `/cards/:id`
- `/profiles/:profileId/favorites` -> `/cards/:cardId/favorites`

## Backend

- `ProfilesModule` -> `CardsModule`
- `ProfilesController` -> `CardsController`
- `ProfilesService` -> `CardsService`
- `CreateProfileDto` -> `CreateCardDto`
- `UpdateProfileDto` -> `UpdateCardDto`
- `backend/src/profiles/` -> `backend/src/cards/`
- `profiles.controller.ts` -> `cards.controller.ts`
- `profiles.module.ts` -> `cards.module.ts`
- `profiles.service.ts` -> `cards.service.ts`
- `create-profile.dto.ts` -> `create-card.dto.ts`
- `update-profile.dto.ts` -> `update-card.dto.ts`

## Prisma

- `User.profiles` -> `User.cards`
- `model Profile` -> `model Card`
- `Favorite.profileId` -> `Favorite.cardId`
- `Favorite.profile` -> `Favorite.card`
- `prisma.profile.*` -> `prisma.card.*`

## Documentacion

- `docs/03-profiles.md` -> `docs/03-cards.md`
- referencias textuales a `profile/profiles/perfil/perfiles` -> `card/cards`

## Nota

- Se creo una nueva migracion para renombrar fisicamente `Profile` -> `Card` y `profileId` -> `cardId`.
- Las migraciones historicas anteriores se conservan como registro; el cambio real de naming queda resuelto en la nueva migracion.
