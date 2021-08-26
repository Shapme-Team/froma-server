/*
  Warnings:

  - Added the required column `quantity` to the `CartProduct` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CartProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT,
    "orderId" TEXT,
    "cartId" TEXT,
    "quantity" INTEGER NOT NULL,
    FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CartProduct" ("cartId", "id", "orderId", "productId") SELECT "cartId", "id", "orderId", "productId" FROM "CartProduct";
DROP TABLE "CartProduct";
ALTER TABLE "new_CartProduct" RENAME TO "CartProduct";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
