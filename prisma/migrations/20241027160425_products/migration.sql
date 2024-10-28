/*
  Warnings:

  - Added the required column `planId` to the `Consumer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productQuantityLimit` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relatoryType` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateProductTimeWindowInDays` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viewHistoryLimitInMonths` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publicId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "lastSearch" DATETIME NOT NULL,
    "average" REAL NOT NULL,
    "consumerId" INTEGER NOT NULL,
    CONSTRAINT "Product_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "Consumer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publicId" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "url" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "ProductHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Consumer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publicId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "planId" INTEGER NOT NULL,
    CONSTRAINT "Consumer_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Consumer" ("createdAt", "email", "id", "name", "password", "publicId", "updatedAt") SELECT "createdAt", "email", "id", "name", "password", "publicId", "updatedAt" FROM "Consumer";
DROP TABLE "Consumer";
ALTER TABLE "new_Consumer" RENAME TO "Consumer";
CREATE UNIQUE INDEX "Consumer_publicId_key" ON "Consumer"("publicId");
CREATE UNIQUE INDEX "Consumer_email_key" ON "Consumer"("email");
CREATE TABLE "new_Plan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "productQuantityLimit" INTEGER NOT NULL,
    "viewHistoryLimitInMonths" INTEGER NOT NULL,
    "updateProductTimeWindowInDays" INTEGER NOT NULL,
    "relatoryType" INTEGER NOT NULL
);
INSERT INTO "new_Plan" ("description", "id", "name", "price", "publicId") SELECT "description", "id", "name", "price", "publicId" FROM "Plan";
DROP TABLE "Plan";
ALTER TABLE "new_Plan" RENAME TO "Plan";
CREATE UNIQUE INDEX "Plan_publicId_key" ON "Plan"("publicId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Product_publicId_key" ON "Product"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductHistory_publicId_key" ON "ProductHistory"("publicId");
