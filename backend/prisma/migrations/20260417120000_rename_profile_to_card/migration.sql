-- Rename table Profile -> Card
ALTER TABLE "Profile" RENAME TO "Card";

-- Rename Favorite.profileId -> Favorite.cardId
ALTER TABLE "Favorite" RENAME COLUMN "profileId" TO "cardId";

-- Rename primary key and foreign key constraint names
ALTER INDEX "Profile_pkey" RENAME TO "Card_pkey";
ALTER TABLE "Card" RENAME CONSTRAINT "Profile_userId_fkey" TO "Card_userId_fkey";
ALTER TABLE "Favorite" RENAME CONSTRAINT "Favorite_profileId_fkey" TO "Favorite_cardId_fkey";

-- Rename index names to match the new column name
ALTER INDEX "Favorite_profileId_type_order_key" RENAME TO "Favorite_cardId_type_order_key";
ALTER INDEX "Favorite_profileId_type_externalId_key" RENAME TO "Favorite_cardId_type_externalId_key";
