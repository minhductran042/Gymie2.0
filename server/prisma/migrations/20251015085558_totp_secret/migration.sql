/*
  Warnings:

  - You are about to alter the column `totpSecret` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "totpSecret" SET DATA TYPE VARCHAR(1000);
