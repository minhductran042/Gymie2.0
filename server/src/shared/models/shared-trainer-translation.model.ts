import z from "zod";

// Zod schema for specialties (must match PrismaJson.Specialties type)
export const SpecialtiesSchema = z.array(z.string())


export const TrainerTranslationSchema = z.object({
    id: z.number(),
    trainerId: z.number(),
    languageId: z.string(),  // String in schema (VarChar)
    bio: z.string().nullable(),
    specialties: SpecialtiesSchema.nullable(),  // Json type - array of strings (PrismaJson.Specialties)
    certifications: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedById: z.number().nullable(),
})

export type TrainerTranslationType = z.infer<typeof TrainerTranslationSchema>
export type SpecialtiesType = z.infer<typeof SpecialtiesSchema>