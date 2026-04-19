/*
  Warnings:

  - You are about to drop the column `cardId` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Favorite` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[categoryId,order]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Favorite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_cardId_fkey";

-- DropIndex
DROP INDEX "Favorite_cardId_type_externalId_key";

-- DropIndex
DROP INDEX "Favorite_cardId_type_order_key";

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "cardId",
DROP COLUMN "type",
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CardCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FavoriteType" NOT NULL,
    "order" INTEGER NOT NULL,
    "cardId" TEXT NOT NULL,

    CONSTRAINT "CardCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CardCategory_cardId_order_key" ON "CardCategory"("cardId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_categoryId_order_key" ON "Favorite"("categoryId", "order");

-- AddForeignKey
ALTER TABLE "CardCategory" ADD CONSTRAINT "CardCategory_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CardCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
