/*
  Warnings:

  - You are about to drop the column `equipmentIds` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryMuscles` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `categoryIds` on the `WorkoutTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `equipmentRequired` on the `WorkoutTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "equipmentIds",
DROP COLUMN "secondaryMuscles";

-- AlterTable
ALTER TABLE "WorkoutTemplate" DROP COLUMN "categoryIds",
DROP COLUMN "equipmentRequired";

-- CreateTable
CREATE TABLE "_ExerciseCategoryToWorkoutTemplate" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ExerciseCategoryToWorkoutTemplate_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EquipmentToExercise" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EquipmentToExercise_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EquipmentToWorkoutTemplate" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EquipmentToWorkoutTemplate_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ExerciseSecondaryMuscles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ExerciseSecondaryMuscles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ExerciseCategoryToWorkoutTemplate_B_index" ON "_ExerciseCategoryToWorkoutTemplate"("B");

-- CreateIndex
CREATE INDEX "_EquipmentToExercise_B_index" ON "_EquipmentToExercise"("B");

-- CreateIndex
CREATE INDEX "_EquipmentToWorkoutTemplate_B_index" ON "_EquipmentToWorkoutTemplate"("B");

-- CreateIndex
CREATE INDEX "_ExerciseSecondaryMuscles_B_index" ON "_ExerciseSecondaryMuscles"("B");

-- AddForeignKey
ALTER TABLE "_ExerciseCategoryToWorkoutTemplate" ADD CONSTRAINT "_ExerciseCategoryToWorkoutTemplate_A_fkey" FOREIGN KEY ("A") REFERENCES "ExerciseCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseCategoryToWorkoutTemplate" ADD CONSTRAINT "_ExerciseCategoryToWorkoutTemplate_B_fkey" FOREIGN KEY ("B") REFERENCES "WorkoutTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentToExercise" ADD CONSTRAINT "_EquipmentToExercise_A_fkey" FOREIGN KEY ("A") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentToExercise" ADD CONSTRAINT "_EquipmentToExercise_B_fkey" FOREIGN KEY ("B") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentToWorkoutTemplate" ADD CONSTRAINT "_EquipmentToWorkoutTemplate_A_fkey" FOREIGN KEY ("A") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentToWorkoutTemplate" ADD CONSTRAINT "_EquipmentToWorkoutTemplate_B_fkey" FOREIGN KEY ("B") REFERENCES "WorkoutTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseSecondaryMuscles" ADD CONSTRAINT "_ExerciseSecondaryMuscles_A_fkey" FOREIGN KEY ("A") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseSecondaryMuscles" ADD CONSTRAINT "_ExerciseSecondaryMuscles_B_fkey" FOREIGN KEY ("B") REFERENCES "MuscleGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
