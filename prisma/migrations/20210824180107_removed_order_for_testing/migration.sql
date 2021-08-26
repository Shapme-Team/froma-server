/*
  Warnings:

  - You are about to drop the column `orderId` on the `CartProduct` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CartProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT,
    "cartId" TEXT,
    "quantity" INTEGER DEFAULT 1,
    FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CartProduct" ("cartId", "id", "productId", "quantity") SELECT "cartId", "id", "productId", "quantity" FROM "CartProduct";
DROP TABLE "CartProduct";
ALTER TABLE "new_CartProduct" RENAME TO "CartProduct";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
