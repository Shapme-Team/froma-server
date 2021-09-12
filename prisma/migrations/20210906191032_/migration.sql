/*
  Warnings:

  - You are about to drop the column `mainAddress` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `nearBy` on the `Address` table. All the data in the column will be lost.
  - Added the required column `area` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `houseNumber` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "city" TEXT NOT NULL,
    "phoneNumber" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" INTEGER NOT NULL,
    "landmark" TEXT,
    "houseNumber" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "userId" TEXT,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Address" ("city", "id", "phoneNumber", "pincode", "state", "userId") SELECT "city", "id", "phoneNumber", "pincode", "state", "userId" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
