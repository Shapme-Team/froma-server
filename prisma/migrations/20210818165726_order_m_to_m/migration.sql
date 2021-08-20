/*
  Warnings:

  - You are about to drop the column `orderId` on the `Product` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_OrderToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    FOREIGN KEY ("categorieId") REFERENCES "Categorie" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("subCategoriesId") REFERENCES "SubCategories" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("sellerId") REFERENCES "Seller" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("availability", "categorieId", "createdAt", "description", "id", "imageUrl", "quantity", "sellerId", "stock_quantity", "subCategoriesId", "title", "unit", "updatedAt", "viewCount", "weight") SELECT "availability", "categorieId", "createdAt", "description", "id", "imageUrl", "quantity", "sellerId", "stock_quantity", "subCategoriesId", "title", "unit", "updatedAt", "viewCount", "weight" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_OrderToProduct_AB_unique" ON "_OrderToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderToProduct_B_index" ON "_OrderToProduct"("B");
