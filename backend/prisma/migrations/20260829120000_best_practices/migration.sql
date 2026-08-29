-- Buenas prácticas: índice en la FK, updatedAt, timestamptz/date, passwordHash,
-- límites de longitud, y se quita la fecha de nacimiento denormalizada de Card.

-- User -----------------------------------------------------------------------
-- renombrar (no dropear) para conservar los hashes existentes
ALTER TABLE "User" RENAME COLUMN "password" TO "passwordHash";
ALTER TABLE "User"
  ALTER COLUMN "passwordHash" SET DATA TYPE VARCHAR(255),
  ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
  ALTER COLUMN "name" SET DATA TYPE VARCHAR(80),
  ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3),
  ALTER COLUMN "birthDate" SET DATA TYPE DATE;
ALTER TABLE "User" ADD COLUMN "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Card ---------------------------------------------------------------------
ALTER TABLE "Card" DROP COLUMN "birthDate";
ALTER TABLE "Card"
  ALTER COLUMN "name" SET DATA TYPE VARCHAR(80),
  ALTER COLUMN "description" SET DATA TYPE VARCHAR(700),
  ALTER COLUMN "favoriteColor" SET DATA TYPE VARCHAR(9),
  ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3),
  ALTER COLUMN "handle" SET DATA TYPE VARCHAR(30),
  ALTER COLUMN "location" SET DATA TYPE VARCHAR(40);
ALTER TABLE "Card" ADD COLUMN "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX "Card_userId_idx" ON "Card"("userId");

-- CardCategory -----------------------------------------------------------
ALTER TABLE "CardCategory" ALTER COLUMN "name" SET DATA TYPE VARCHAR(40);

-- Favorite -------------------------------------------------------------
ALTER TABLE "Favorite"
  ALTER COLUMN "title" SET DATA TYPE VARCHAR(200),
  ALTER COLUMN "externalId" SET DATA TYPE VARCHAR(64);
