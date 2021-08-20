/*
  Warnings:

  - You are about to drop the column `stock_quantity` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Cart` table. All the data in the column will be lost.
  - Added the required column `stockQuantity` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cartId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Cart_userId_unique";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "unit" TEXT DEFAULT 'gm',
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "weight" TEXT,
    "categorieId" TEXT,
    "subCategoriesId" TEXT,
    "availability" BOOLEAN DEFAULT true,
    "stockQuantity" INTEGER NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "sellerId" TEXT,
    FOREIGN KEY ("categorieId") REFERENCES "Categorie" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("subCategoriesId") REFERENCES "SubCategories" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("sellerId") REFERENCES "Seller" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("availability", "categorieId", "createdAt", "description", "id", "imageUrl", "quantity", "sellerId", "subCategoriesId", "title", "unit", "updatedAt", "viewCount", "weight") SELECT "availability", "categorieId", "createdAt", "description", "id", "imageUrl", "quantity", "sellerId", "subCategoriesId", "title", "unit", "updatedAt", "viewCount", "weight" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_Cart" (
    "id" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_Cart" ("id") SELECT "id" FROM "Cart";
DROP TABLE "Cart";
ALTER TABLE "new_Cart" RENAME TO "Cart";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" INTEGER,
    "cartId" TEXT NOT NULL,
    FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("email", "id", "name", "phoneNumber") SELECT "email", "id", "name", "phoneNumber" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");
CREATE UNIQUE INDEX "User_cartId_unique" ON "User"("cartId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
