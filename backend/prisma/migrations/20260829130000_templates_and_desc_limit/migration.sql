-- 7 plantillas nuevas
ALTER TYPE "Template" ADD VALUE 'GLASS';
ALTER TYPE "Template" ADD VALUE 'VECTOR';
ALTER TYPE "Template" ADD VALUE 'RETRO';
ALTER TYPE "Template" ADD VALUE 'PIXEL';
ALTER TYPE "Template" ADD VALUE 'Y2K';
ALTER TYPE "Template" ADD VALUE 'SWISS';
ALTER TYPE "Template" ADD VALUE 'GRAFFITI';

-- descripción: límite duro alineado con el editor y el DTO
ALTER TABLE "Card" ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);
