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
