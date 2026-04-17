/*
  Warnings:

  - A unique constraint covering the columns `[profileId,type,externalId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Favorite_profileId_type_externalId_key" ON "Favorite"("profileId", "type", "externalId");
