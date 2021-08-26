/*
  Warnings:

  - You are about to drop the `_CartToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_CartToProduct_B_index";

-- DropIndex
DROP INDEX "_CartToProduct_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CartToProduct";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CartProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT,
    "orderId" TEXT,
    "cartId" TEXT,
    FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CartProduct" ("id", "orderId", "productId") SELECT "id", "orderId", "productId" FROM "CartProduct";
DROP TABLE "CartProduct";
ALTER TABLE "new_CartProduct" RENAME TO "CartProduct";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
