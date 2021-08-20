/*
  Warnings:

  - The primary key for the `Seller` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `gender` on the `Seller` table. All the data in the column will be lost.
  - Added the required column `phoneNumber` to the `Seller` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Categorie.id_unique";

-- DropIndex
DROP INDEX "Product.id_unique";

-- DropIndex
DROP INDEX "SubCategories.id_unique";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "phoneNumber" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paymentMethod" TEXT NOT NULL,
    "addresId" TEXT,
    FOREIGN KEY ("addresId") REFERENCES "Address" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "city" TEXT NOT NULL,
    "phoneNumber" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" INTEGER NOT NULL,
    "nearBy" TEXT NOT NULL,
    "mainAddress" TEXT NOT NULL,
    "userId" TEXT,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

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
    "stock_quantity" INTEGER NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "sellerId" TEXT,
    "cartId" TEXT,
    "orderId" TEXT,
    FOREIGN KEY ("categorieId") REFERENCES "Categorie" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("subCategoriesId") REFERENCES "SubCategories" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("sellerId") REFERENCES "Seller" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("availability", "categorieId", "createdAt", "description", "id", "imageUrl", "quantity", "sellerId", "stock_quantity", "subCategoriesId", "title", "unit", "updatedAt", "viewCount", "weight") SELECT "availability", "categorieId", "createdAt", "description", "id", "imageUrl", "quantity", "sellerId", "stock_quantity", "subCategoriesId", "title", "unit", "updatedAt", "viewCount", "weight" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_Seller" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phoneNumber" INTEGER NOT NULL
);
INSERT INTO "new_Seller" ("email", "id", "name") SELECT "email", "id", "name" FROM "Seller";
DROP TABLE "Seller";
ALTER TABLE "new_Seller" RENAME TO "Seller";
CREATE UNIQUE INDEX "Seller.email_unique" ON "Seller"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_unique" ON "Cart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_addresId_unique" ON "Order"("addresId");
