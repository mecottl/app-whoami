-- User.birthDate (para pedir la fecha en el registro)
ALTER TABLE "User" ADD COLUMN "birthDate" TIMESTAMP(3);

-- Una sola categoría por tipo en cada card
CREATE UNIQUE INDEX "CardCategory_cardId_type_key" ON "CardCategory"("cardId", "type");
