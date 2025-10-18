/*
  Warnings:

  - Made the column `categoryId` on table `Exercise` required. This step will fail if there are existing NULL values in that column.
  - Made the column `primaryMuscleId` on table `Exercise` required. This step will fail if there are existing NULL values in that column.
  - Made the column `difficultyLevel` on table `Exercise` required. This step will fail if there are existing NULL values in that column.
  - Made the column `servingSizeGrams` on table `FoodItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `proteinPer100g` on table `FoodItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `carbsPer100g` on table `FoodItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fatPer100g` on table `FoodItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `specialties` on table `Trainer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sessionType` on table `TrainerBooking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `TrainerBooking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startDate` on table `TrainerClient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalSessions` on table `TrainerClient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `packageType` on table `TrainerClient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `packagePrice` on table `TrainerClient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content` on table `TrainerReview` required. This step will fail if there are existing NULL values in that column.
  - Made the column `specialties` on table `TrainerTranslation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `height` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weight` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `activityLevel` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fitnessGoal` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Exercise" DROP CONSTRAINT "Exercise_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Exercise" DROP CONSTRAINT "Exercise_primaryMuscleId_fkey";

-- AlterTable
ALTER TABLE "Exercise" ALTER COLUMN "categoryId" SET NOT NULL,
ALTER COLUMN "primaryMuscleId" SET NOT NULL,
ALTER COLUMN "difficultyLevel" SET NOT NULL;

-- AlterTable
ALTER TABLE "FoodItem" ALTER COLUMN "servingSizeGrams" SET NOT NULL,
ALTER COLUMN "proteinPer100g" SET NOT NULL,
ALTER COLUMN "carbsPer100g" SET NOT NULL,
ALTER COLUMN "fatPer100g" SET NOT NULL;

-- AlterTable
ALTER TABLE "Trainer" ALTER COLUMN "specialties" SET NOT NULL;

-- AlterTable
ALTER TABLE "TrainerBooking" ALTER COLUMN "sessionType" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL;

-- AlterTable
ALTER TABLE "TrainerClient" ALTER COLUMN "startDate" SET NOT NULL,
ALTER COLUMN "totalSessions" SET NOT NULL,
ALTER COLUMN "packageType" SET NOT NULL,
ALTER COLUMN "packagePrice" SET NOT NULL;

-- AlterTable
ALTER TABLE "TrainerReview" ALTER COLUMN "content" SET NOT NULL;

-- AlterTable
ALTER TABLE "TrainerTranslation" ALTER COLUMN "specialties" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserProfile" ALTER COLUMN "height" SET NOT NULL,
ALTER COLUMN "weight" SET NOT NULL,
ALTER COLUMN "activityLevel" SET NOT NULL,
ALTER COLUMN "fitnessGoal" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ExerciseCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_primaryMuscleId_fkey" FOREIGN KEY ("primaryMuscleId") REFERENCES "MuscleGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
