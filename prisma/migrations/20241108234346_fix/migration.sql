-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Consumer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publicId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "planId" INTEGER NOT NULL,
    CONSTRAINT "Consumer_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Consumer" ("createdAt", "email", "id", "name", "password", "planId", "publicId", "updatedAt") SELECT "createdAt", "email", "id", "name", "password", "planId", "publicId", "updatedAt" FROM "Consumer";
DROP TABLE "Consumer";
ALTER TABLE "new_Consumer" RENAME TO "Consumer";
CREATE UNIQUE INDEX "Consumer_publicId_key" ON "Consumer"("publicId");
CREATE UNIQUE INDEX "Consumer_email_key" ON "Consumer"("email");
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publicId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "lastSearch" DATETIME,
    "average" REAL,
    "consumerId" INTEGER NOT NULL,
    CONSTRAINT "Product_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "Consumer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("average", "consumerId", "createdAt", "description", "id", "lastSearch", "name", "publicId", "slug", "target", "updatedAt") SELECT "average", "consumerId", "createdAt", "description", "id", "lastSearch", "name", "publicId", "slug", "target", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_publicId_key" ON "Product"("publicId");
CREATE TABLE "new_ProductHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publicId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" REAL NOT NULL,
    "url" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "ProductHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductHistory" ("id", "price", "productId", "publicId", "url") SELECT "id", "price", "productId", "publicId", "url" FROM "ProductHistory";
DROP TABLE "ProductHistory";
ALTER TABLE "new_ProductHistory" RENAME TO "ProductHistory";
CREATE UNIQUE INDEX "ProductHistory_publicId_key" ON "ProductHistory"("publicId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
