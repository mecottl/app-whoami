-- Reconstruida 2026-08-28: la carpeta de esta migración se perdió del repo,
-- pero ya estaba aplicada en la base de datos de desarrollo.

-- AlterTable
ALTER TABLE "Card" ADD COLUMN "avatarUrl" TEXT DEFAULT '';
