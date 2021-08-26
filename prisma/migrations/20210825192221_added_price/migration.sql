-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    "price" INTEGER NOT NULL DEFAULT 10,
    "categoryId" TEXT,
    "subCategoryId" TEXT,
    "availability" BOOLEAN DEFAULT true,
    "stockQuantity" INTEGER NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "sellerId" TEXT,
    FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("sellerId") REFERENCES "Seller" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("availability", "categoryId", "createdAt", "description", "id", "imageUrl", "quantity", "sellerId", "stockQuantity", "subCategoryId", "title", "unit", "updatedAt", "viewCount", "weight") SELECT "availability", "categoryId", "createdAt", "description", "id", "imageUrl", "quantity", "sellerId", "stockQuantity", "subCategoryId", "title", "unit", "updatedAt", "viewCount", "weight" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;