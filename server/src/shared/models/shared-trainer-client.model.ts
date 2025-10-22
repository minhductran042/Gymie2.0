import { PaymentStatus, TrainerClientStatus } from "@prisma/client";
import z from "zod";



// Base TrainerClient schema matching Prisma model
export const TrainerClientSchema = z.object({
    id: z.number(),
    trainerId: z.number(),
    clientId: z.number(),
    status: z.enum([TrainerClientStatus.PENDING, TrainerClientStatus.ACTIVE, TrainerClientStatus.COMPLETED, TrainerClientStatus.CANCELLED]),
    startDate: z.date(),
    endDate: z.date().nullable(),
    sessionCount: z.number(),
    totalSessions: z.number(),
    packageType: z.string(),
    packagePrice: z.number(),
    packageExpiresAt: z.date().nullable(),
    paymentStatus: z.enum([PaymentStatus.PENDING, PaymentStatus.SUCCESS, PaymentStatus.FAILED]),
    notes: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedById: z.number().nullable(),
})

export type TrainerClientType = z.infer<typeof TrainerClientSchema>