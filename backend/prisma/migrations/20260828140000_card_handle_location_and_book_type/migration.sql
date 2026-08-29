-- Campos opcionales para la card
ALTER TABLE "Card" ADD COLUMN "handle" TEXT;
ALTER TABLE "Card" ADD COLUMN "location" TEXT;

-- Nueva categoría: libros (Open Library, sin API key)
ALTER TYPE "FavoriteType" ADD VALUE 'BOOK';
