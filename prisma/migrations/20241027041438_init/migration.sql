-- CreateTable
CREATE TABLE "Consumer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publicId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "PlanBenefits" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "planId" INTEGER NOT NULL,
    CONSTRAINT "PlanBenefits_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Consumer_publicId_key" ON "Consumer"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "Consumer_email_key" ON "Consumer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_publicId_key" ON "Plan"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "PlanBenefits_publicId_key" ON "PlanBenefits"("publicId");
