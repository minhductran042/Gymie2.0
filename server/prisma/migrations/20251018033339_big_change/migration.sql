/*
  Warnings:

  - The `specialties` column on the `Trainer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `specialties` column on the `TrainerTranslation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- AlterTable
ALTER TABLE "Trainer" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "district" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
DROP COLUMN "specialties",
ADD COLUMN     "specialties" JSONB;

-- AlterTable
ALTER TABLE "TrainerClient" ADD COLUMN     "packageExpiresAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "TrainerTranslation" DROP COLUMN "specialties",
ADD COLUMN     "specialties" JSONB;

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "city" TEXT,
ADD COLUMN     "homeLatitude" DOUBLE PRECISION,
ADD COLUMN     "homeLongitude" DOUBLE PRECISION,
ADD COLUMN     "preferredDistricts" JSONB;

-- CreateTable
CREATE TABLE "TrainerSchedule" (
    "id" SERIAL NOT NULL,
    "trainerId" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TrainerSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainerBooking" (
    "id" SERIAL NOT NULL,
    "trainerId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "trainerClientId" INTEGER,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "sessionType" TEXT,
    "sessionNumber" INTEGER,
    "completedAt" TIMESTAMP(3),
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrenceRule" TEXT,
    "parentBookingId" INTEGER,
    "location" TEXT,
    "locationAddress" TEXT,
    "meetingLink" TEXT,
    "cancelledBy" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "cancellationFee" DOUBLE PRECISION,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3),
    "paymentMethod" TEXT,
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "reminderSentAt" TIMESTAMP(3),
    "notes" TEXT,
    "price" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TrainerBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrainerSchedule_trainerId_dayOfWeek_idx" ON "TrainerSchedule"("trainerId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "TrainerSchedule_deletedAt_idx" ON "TrainerSchedule"("deletedAt");

-- CreateIndex
CREATE INDEX "TrainerBooking_trainerId_startTime_idx" ON "TrainerBooking"("trainerId", "startTime");

-- CreateIndex
CREATE INDEX "TrainerBooking_clientId_startTime_idx" ON "TrainerBooking"("clientId", "startTime");

-- CreateIndex
CREATE INDEX "TrainerBooking_trainerClientId_sessionNumber_idx" ON "TrainerBooking"("trainerClientId", "sessionNumber");

-- CreateIndex
CREATE INDEX "TrainerBooking_status_startTime_idx" ON "TrainerBooking"("status", "startTime");

-- CreateIndex
CREATE INDEX "TrainerBooking_parentBookingId_idx" ON "TrainerBooking"("parentBookingId");

-- CreateIndex
CREATE INDEX "TrainerBooking_completedAt_idx" ON "TrainerBooking"("completedAt");

-- CreateIndex
CREATE INDEX "TrainerBooking_deletedAt_idx" ON "TrainerBooking"("deletedAt");

-- CreateIndex
CREATE INDEX "Trainer_district_city_idx" ON "Trainer"("district", "city");

-- CreateIndex
CREATE INDEX "Trainer_isAvailable_deletedAt_idx" ON "Trainer"("isAvailable", "deletedAt");

-- AddForeignKey
ALTER TABLE "TrainerSchedule" ADD CONSTRAINT "TrainerSchedule_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerBooking" ADD CONSTRAINT "TrainerBooking_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerBooking" ADD CONSTRAINT "TrainerBooking_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerBooking" ADD CONSTRAINT "TrainerBooking_trainerClientId_fkey" FOREIGN KEY ("trainerClientId") REFERENCES "TrainerClient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerBooking" ADD CONSTRAINT "TrainerBooking_parentBookingId_fkey" FOREIGN KEY ("parentBookingId") REFERENCES "TrainerBooking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
