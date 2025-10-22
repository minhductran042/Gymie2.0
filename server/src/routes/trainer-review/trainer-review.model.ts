import { create } from 'domain';
import e from 'express';
import { MediaType } from 'src/shared/constants/media.const';
import { UserSchema } from 'src/shared/models/shared-user.model';
import z from 'zod';


export const ReviewMediaSchema = z.object({
    id: z.number(),
    url: z.string(),
    type: z.enum([MediaType.IMAGE, MediaType.VIDEO]),
    reviewId: z.number(),
    createdAt: z.date(),
})

export const TrainerReviewSchema = z.object({
    id: z.number(),
    trainerId: z.number(),
    clientId: z.number(),
    rating: z.number().min(1).max(5),
    content: z.string(),
    helpfulCount: z.number().int().min(0),
    createdAt: z.date(),
    updatedAt: z.date()
})

export const CreateTrainerReviewBodySchema = TrainerReviewSchema.pick({
    content: true,
    rating: true,
    trainerId: true,
}).extend({
    medias: z.array(ReviewMediaSchema.pick({
        url: true,
        type: true,
    }))
})

export const CreateTrainerReviewResSchema = TrainerReviewSchema.extend({
    medias: z.array(ReviewMediaSchema),
    client: UserSchema.pick({
        id: true,
        name: true,
        avatar: true
    })
})

export const GetReviewsSchema = z.object({
    data: z.array(CreateTrainerReviewResSchema),
    page: z.number(),
    limit: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
})

export const UpdateTrainerReviewBodySchema = CreateTrainerReviewBodySchema

export const UpdateTrainerReviewResSchema = CreateTrainerReviewResSchema

export const GetTrainerReviewsParamsSchema = z.object({
    trainerId: z.coerce.number().int().positive()
})

export const GetTrainerReviewDetailParamsSchema = z.object({
    reviewId: z.coerce.number().int().positive()
})

export type TrainerReviewType = z.infer<typeof TrainerReviewSchema>
export type ReviewMediaType = z.infer<typeof ReviewMediaSchema>
export type CreateTrainerReviewBodyType = z.infer<typeof CreateTrainerReviewBodySchema>
export type UpdateTrainerReviewBodyType = z.infer<typeof UpdateTrainerReviewBodySchema>
export type GetTrainerReviewsParamsType = z.infer<typeof GetTrainerReviewsParamsSchema>
export type GetTrainerReviewDetailParamsType = z.infer<typeof GetTrainerReviewDetailParamsSchema>
export type CreateTrainerReviewResType = z.infer<typeof CreateTrainerReviewResSchema>
export type UpdateTrainerReviewResType = z.infer<typeof UpdateTrainerReviewResSchema>
export type GetTrainerReviewsType = z.infer<typeof GetReviewsSchema>
