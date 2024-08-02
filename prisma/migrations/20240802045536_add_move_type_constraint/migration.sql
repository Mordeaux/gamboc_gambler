-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Bet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "betAmount" INTEGER NOT NULL,
    "betValue" INTEGER NOT NULL,
    "rolledValue" INTEGER NOT NULL,
    "gameStateId" TEXT NOT NULL,
    CONSTRAINT "Bet_gameStateId_fkey" FOREIGN KEY ("gameStateId") REFERENCES "GameState" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GameState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playerId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "moveType" TEXT NOT NULL,
    CONSTRAINT "GameState_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Bet_gameStateId_key" ON "Bet"("gameStateId");

--Add Check Constraint
ALTER TABLE "GameState" ADD CONSTRAINT "moveTypeConstraint" CHECK ("moveType" IN ('StartGame', 'Bet', 'Withdrawal', 'Bankruptcy'))
