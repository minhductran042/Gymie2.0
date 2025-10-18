
/**
 * Global TypeScript declarations for Prisma JSON fields
 * These types are used by prisma-json-types-generator to provide type safety for Json columns
 */
declare global {
  namespace PrismaJson {
    /**
     * Specialties - Array of specialty strings
     * Used in: Trainer.specialties, TrainerTranslation.specialties
     * Example: ["boxing", "weight_loss", "strength_training", "cardio"]
     */
    type Specialties = string[]
    
    /**
     * PreferredDistricts - Array of district strings
     * Used in: UserProfile.preferredDistricts
     * Example: ["Quận 1", "Quận 3", "Quận 10"]
     */
    type PreferredDistricts = string[]
  }
}

export {};