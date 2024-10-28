/*
  Warnings:

  - You are about to drop the column `relatoryType` on the `Plan` table. All the data in the column will be lost.
  - Added the required column `reportType` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Plan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "productQuantityLimit" INTEGER NOT NULL,
    "viewHistoryLimitInMonths" INTEGER NOT NULL,
    "updateProductTimeWindowInDays" INTEGER NOT NULL,
    "reportType" INTEGER NOT NULL
);
INSERT INTO "new_Plan" ("description", "id", "name", "price", "productQuantityLimit", "publicId", "updateProductTimeWindowInDays", "viewHistoryLimitInMonths") SELECT "description", "id", "name", "price", "productQuantityLimit", "publicId", "updateProductTimeWindowInDays", "viewHistoryLimitInMonths" FROM "Plan";
DROP TABLE "Plan";
ALTER TABLE "new_Plan" RENAME TO "Plan";
CREATE UNIQUE INDEX "Plan_publicId_key" ON "Plan"("publicId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
