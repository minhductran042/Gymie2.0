
/**
 * Global TypeScript declarations for Prisma JSON fields
 * These types are used by prisma-json-types-generator to provide type safety for Json columns
 */
declare global {
  namespace PrismaJson {

    type Specialties = string[]
    
 
    type PreferredDistricts = string[]

    type Tags = string[] // E.g., ["high_protein", "low_carb", "gluten_free"]
  }
}

export {};