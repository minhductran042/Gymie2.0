import z from "zod";
import { TrainerClientSchema} from "src/shared/models/shared-trainer-client.model";
import { TrainerClientStatus } from "@prisma/client";
import { PaymentStatus } from "src/shared/constants/payment.constant";
import { SpecialtiesSchema } from "src/shared/models/shared-trainer-translation.model";


export const RequestTrainerBodySchema = z.object({
    trainerId: z.number().int().positive(),
    packageType: z.string(),
    packagePrice: z.number().min(0),
    totalSessions: z.number().int().positive(),
    startDate: z.string().datetime(), 
    notes: z.string().max(500).optional(),
}).strict()



export const UpdateRelationshipBodySchema = z.object({
    packageType: z.string().min(1).max(100).optional(),
    packagePrice: z.number().min(0).optional(),
    totalSessions: z.number().int().positive().optional(),
    endDate: z.string().datetime().optional(),
    notes: z.string().max(500).optional(),
}).strict()


export const UpdateRelationshipParamsSchema = z.object({
    relationshipId: z.coerce.number().int().positive(),
})


export const AcceptRequestParamsSchema = z.object({
    relationshipId: z.coerce.number().int().positive(),
})

export const RejectRequestParamsSchema = z.object({
    relationshipId: z.coerce.number().int().positive(),
})

export const CancelRelationshipParamsSchema = z.object({
    relationshipId: z.coerce.number().int().positive(),
})

export const CompleteRelationshipParamsSchema = z.object({
    relationshipId: z.coerce.number().int().positive(),
})


export const GetMyTrainersQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    status: z.enum([TrainerClientStatus.PENDING, TrainerClientStatus.ACTIVE, TrainerClientStatus.COMPLETED, TrainerClientStatus.CANCELLED]).optional(),
}).strict()

export const GetMyClientsQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    status: z.enum([TrainerClientStatus.PENDING, TrainerClientStatus.ACTIVE, TrainerClientStatus.COMPLETED, TrainerClientStatus.CANCELLED]).optional(),
}).strict()



export const GetRelationshipDetailParamsSchema = z.object({
    relationshipId: z.coerce.number().int().positive(),
})


export const UpdatePaymentStatusBodySchema = z.object({
    paymentStatus: z.enum([PaymentStatus.PENDING, PaymentStatus.SUCCESS, PaymentStatus.FAILED]),
}).strict()

export const UpdatePaymentStatusParamsSchema = z.object({
    relationshipId: z.coerce.number().int().positive(),
})


export const TrainerClientDetailResSchema = TrainerClientSchema.extend({
    trainer: z.object({
        id: z.number(),
        userId: z.number(),
        user: z.object({
            id: z.number(),
            name: z.string(),
            email: z.string(),
            avatar: z.string().nullable(),
            phoneNumber: z.string(),
        }),
        specialties: SpecialtiesSchema, // JSON field from Prisma
        experienceYears: z.number().nullable(),
        hourlyRate: z.number().nullable(),
    }),
    client: z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        avatar: z.string().nullable(),
        phoneNumber: z.string(),
    }),
})

export const TrainerClientListItemSchema = TrainerClientSchema.extend({
    trainer: z.object({
        id: z.number(),
        userId: z.number(),
        user: z.object({
            id: z.number(),
            name: z.string(),
            avatar: z.string().nullable(),
        }),
        hourlyRate: z.number().nullable(),
        specialties: SpecialtiesSchema, // JSON field from Prisma
    }).optional(),
    client: z.object({
        id: z.number(),
        name: z.string(),
        avatar: z.string().nullable(),
    }).optional(),
})

export const GetTrainerClientsResSchema = z.object({
    data: z.array(TrainerClientListItemSchema),
    totalItems: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
})

export type TrainerClientDetailResType = z.infer<typeof TrainerClientDetailResSchema>
export type TrainerClientListItemType = z.infer<typeof TrainerClientListItemSchema>
export type GetTrainerClientsResType = z.infer<typeof GetTrainerClientsResSchema>
export type RequestTrainerBodyType = z.infer<typeof RequestTrainerBodySchema>
export type UpdateRelationshipBodyType = z.infer<typeof UpdateRelationshipBodySchema>
export type UpdateRelationshipParamsType = z.infer<typeof UpdateRelationshipParamsSchema>

export type AcceptRequestParamsType = z.infer<typeof AcceptRequestParamsSchema>
export type RejectRequestParamsType = z.infer<typeof RejectRequestParamsSchema>
export type CancelRelationshipParamsType = z.infer<typeof CancelRelationshipParamsSchema>
export type CompleteRelationshipParamsType = z.infer<typeof CompleteRelationshipParamsSchema>
export type GetMyClientsQueryType = z.infer<typeof GetMyClientsQuerySchema>

export type UpdatePaymentStatusBodyType = z.infer<typeof UpdatePaymentStatusBodySchema>
export type UpdatePaymentStatusParamsType = z.infer<typeof UpdatePaymentStatusParamsSchema>
export type GetRelationshipDetailParamsType = z.infer<typeof GetRelationshipDetailParamsSchema>
export type GetMyTrainersQueryType = z.infer<typeof GetMyTrainersQuerySchema>