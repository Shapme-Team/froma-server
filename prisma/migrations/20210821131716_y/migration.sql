/*
  Warnings:

  - You are about to drop the column `cartId` on the `User` table. All the data in the column will be lost.
  - Made the column `title` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weight` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "User_cartId_unique";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SubCategories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "categoryid" TEXT,
    FOREIGN KEY ("categoryid") REFERENCES "Categorie" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SubCategories" ("categoryid", "id", "name") SELECT "categoryid", "id", "name" FROM "SubCategories";
DROP TABLE "SubCategories";
ALTER TABLE "new_SubCategories" RENAME TO "SubCategories";
CREATE TABLE "new_Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "city" TEXT NOT NULL,
    "phoneNumber" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" INTEGER NOT NULL,
    "nearBy" TEXT,
    "mainAddress" TEXT NOT NULL,
    "userId" TEXT,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Address" ("city", "id", "mainAddress", "nearBy", "phoneNumber", "pincode", "state", "userId") SELECT "city", "id", "mainAddress", "nearBy", "phoneNumber", "pincode", "state", "userId" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
CREATE TABLE "new_Cart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Cart" ("id") SELECT "id" FROM "Cart";
DROP TABLE "Cart";
ALTER TABLE "new_Cart" RENAME TO "Cart";
CREATE UNIQUE INDEX "Cart_userId_unique" ON "Cart"("userId");
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'gm',
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "weight" TEXT NOT NULL,
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
INSERT INTO "new_Product" ("availability", "categorieId", "createdAt", "description", "id", "imageUrl", "quantity", "sellerId", "stockQuantity", "subCategoriesId", "title", "unit", "updatedAt", "viewCount", "weight") SELECT "availability", "categorieId", "createdAt", "description", "id", "imageUrl", "quantity", "sellerId", "stockQuantity", "subCategoriesId", "title", coalesce("unit", 'gm') AS "unit", "updatedAt", "viewCount", "weight" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" INTEGER
);
INSERT INTO "new_User" ("email", "id", "name", "phoneNumber") SELECT "email", "id", "name", "phoneNumber" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
