/*
  Warnings:

  - A unique constraint covering the columns `[email,type]` on the table `VerificationCode` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."VerificationCode_email_type_idx";

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCode_email_type_key" ON "VerificationCode"("email", "type");
