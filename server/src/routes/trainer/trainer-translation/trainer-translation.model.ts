
import { TrainerTranslationSchema } from 'src/shared/models/shared-trainer-translation.model'
import z from 'zod'
import {  GetTrainerParamsSchema } from '../trainer.model'

export const TrainerTranslationParamsSchema = z.object({
    trainerTranslationId: z.coerce.number().int().positive()
}).strict()

export const GetTrainerTranslationDetailSchema = TrainerTranslationSchema

export const CreateTrainerTranslationSchema = TrainerTranslationSchema.pick({
    trainerId: true,
    languageId: true,
    bio: true,
    specialties: true,
    certifications: true,
})

export const UpdateTrainerTranslationSchema = CreateTrainerTranslationSchema 

export const DeleteTrainerParamsSchema = GetTrainerParamsSchema

export const TrainerTranslationQuerySchema = z.object({
    languageId: z.string()
})

export type TrainerTranslationQueryType = z.infer<typeof TrainerTranslationQuerySchema>
export type TrainerTranslationParamsType = z.infer<typeof TrainerTranslationParamsSchema>
export type CreateTrainerTranslationType = z.infer<typeof CreateTrainerTranslationSchema>
export type UpdateTrainerTranslationType = z.infer<typeof UpdateTrainerTranslationSchema>
export type DeleteTrainerTranslationType = z.infer<typeof DeleteTrainerParamsSchema>
export type GetTrainerTranslationDetailResType = z.infer<typeof GetTrainerTranslationDetailSchema>
