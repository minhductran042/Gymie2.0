/*
  Warnings:

  - A unique constraint covering the columns `[trainerId,clientId]` on the table `TrainerClient` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TrainerClient_trainerId_clientId_key" ON "TrainerClient"("trainerId", "clientId");
