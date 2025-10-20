import z from "zod";

// Zod schema for specialties (must match PrismaJson.Specialties type)
export const SpecialtiesSchema = z.array(z.string())
export const TrainerSchema =  z.object({
    id: z.number(),
    userId: z.number(),
    specialties: SpecialtiesSchema,  // Json type - array of strings (PrismaJson.Specialties)
    experienceYears: z.number().nullable(),
    certifications: z.string().nullable(),
    hourlyRate: z.number().nullable(),
    maxClients: z.number(),
    isAvailable: z.boolean(),
    district: z.string().nullable(),
    city: z.string().nullable(),
    address: z.string().nullable(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedById: z.number().nullable(),
})

export type TrainerType = z.infer<typeof TrainerSchema>

export type SpecialtiesType = z.infer<typeof SpecialtiesSchema>