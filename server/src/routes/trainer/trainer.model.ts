import { TrainerTranslationSchema } from "src/shared/models/shared-trainer-translation.model";
import { TrainerSchema } from "src/shared/models/shared-trainer.model";
import z from "zod";

// ==================== GET TRAINERS ====================

export const GetTrainersResSchema = z.object({
    data: z.array(
        TrainerSchema.extend({
            trainerTranslations: z.array(TrainerTranslationSchema),
        })
    ),
    totalItems: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number()
})



export const GetTrainerQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    isAvailable: z.coerce.boolean().optional(),
    minHourlyRate: z.coerce.number().min(0).optional(),
    maxHourlyRate: z.coerce.number().min(0).optional(),
    minExperienceYears: z.coerce.number().int().min(0).optional(),
    maxExperienceYears: z.coerce.number().int().min(0).max(50).optional(),
}).strict()



export const GetTrainerParamsSchema = z.object({
    trainerId: z.coerce.number().int().positive()
})



export const CreateTrainerBodySchema = TrainerSchema.pick({
    specialties: true,
    certifications: true,
    experienceYears: true,
    hourlyRate: true,
    isAvailable: true,
    maxClients: true,
}).extend({
    userId: z.number().int().positive() // userId của user sẽ trở thành trainer
})



export const UpdateTrainerBodySchema = TrainerSchema.pick({
    specialties: true,
    certifications: true,
    experienceYears: true,
    hourlyRate: true,
    isAvailable: true,
    maxClients: true,
}) 

export const UpdateTrainerParamsSchema = z.object({
    trainerId: z.coerce.number().int().positive()
})


export const DeleteTrainerParamsSchema = z.object({
    trainerId: z.coerce.number().int().positive()
})


export const GetTrainerClientsParamsSchema = z.object({
    trainerId: z.coerce.number().int().positive()
})

export const GetTrainerClientsQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    status: z.enum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
}).strict()



export const GetTrainerReviewsParamsSchema = z.object({
    trainerId: z.coerce.number().int().positive()
})

export const GetTrainerReviewsQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
}).strict()


export const UpdateTrainerAvailabilityBodySchema = z.object({
    isAvailable: z.boolean(),
}).strict()



export const TrainerDetailResSchema = TrainerSchema.extend({
    user: z.object({
        id: z.number(),
        email: z.string(),
        name: z.string(),
        avatar: z.string().nullable(),
        phoneNumber: z.string(),
    }),
    trainerTranslations: z.array(TrainerTranslationSchema)
})

export type TrainerDetailResType = z.infer<typeof TrainerDetailResSchema>
export type CreateTrainerBodyType = z.infer<typeof CreateTrainerBodySchema>
export type UpdateTrainerBodyType = z.infer<typeof UpdateTrainerBodySchema>
export type GetTrainerClientsQueryType = z.infer<typeof GetTrainerClientsQuerySchema>
export type GetTrainerReviewsQueryType = z.infer<typeof GetTrainerReviewsQuerySchema>
export type GetTrainerQueryType = z.infer<typeof GetTrainerQuerySchema>
export type GetTrainersResType = z.infer<typeof GetTrainersResSchema>