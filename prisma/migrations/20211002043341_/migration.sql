-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Seller" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phoneNumber" TEXT
);
INSERT INTO "new_Seller" ("email", "id", "name", "phoneNumber") SELECT "email", "id", "name", "phoneNumber" FROM "Seller";
DROP TABLE "Seller";
ALTER TABLE "new_Seller" RENAME TO "Seller";
CREATE UNIQUE INDEX "Seller.email_unique" ON "Seller"("email");
CREATE TABLE "new_Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "city" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" INTEGER NOT NULL,
    "landmark" TEXT,
    "houseNumber" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "userId" TEXT,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Address" ("area", "city", "fullName", "houseNumber", "id", "landmark", "phoneNumber", "pincode", "state", "userId") SELECT "area", "city", "fullName", "houseNumber", "id", "landmark", "phoneNumber", "pincode", "state", "userId" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT
);
INSERT INTO "new_User" ("email", "id", "name", "phoneNumber") SELECT "email", "id", "name", "phoneNumber" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
