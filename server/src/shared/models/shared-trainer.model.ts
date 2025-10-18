import z from "zod";

// Zod schema for specialties (must match PrismaJson.Specialties type)
export const SpecialtiesSchema = z.array(z.string())
export const TrainerSchema =  z.object({
    id: z.number(),
    userId: z.number(),
    specialties: SpecialtiesSchema.nullable(),  // Json type - array of strings (PrismaJson.Specialties)
    experienceYears: z.number().nullable(),
    certifications: z.string().nullable(),
    hourlyRate: z.number().nullable(),
    isAvailable: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
    createdById: z.string().nullable(),
    updatedById: z.string().nullable(),
    deletedById: z.string().nullable(),
})

export type TrainerType = z.infer<typeof TrainerSchema>

export type SpecialtiesType = z.infer<typeof SpecialtiesSchema>