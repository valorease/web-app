/*
  Warnings:

  - Added the required column `description` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publicId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "lastSearch" DATETIME,
    "average" REAL,
    "consumerId" INTEGER NOT NULL,
    CONSTRAINT "Product_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "Consumer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("average", "consumerId", "createdAt", "id", "lastSearch", "name", "publicId", "slug", "target", "updatedAt") SELECT "average", "consumerId", "createdAt", "id", "lastSearch", "name", "publicId", "slug", "target", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_publicId_key" ON "Product"("publicId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
