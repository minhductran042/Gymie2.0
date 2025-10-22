import z from 'zod';

export const FoodItemTranslationSchema = z.object({
    id: z.number(),
    foodItemId: z.number(),
    languageId: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
    createdById: z.number().int().positive().nullable(),
    updatedById: z.number().int().positive().nullable(),
    deletedById: z.number().int().positive().nullable(),
});

export const FoodItemTranslationParamsSchema = z.object({
    foodItemTranslationId: z.coerce.number().int().positive()
}).strict();

export const GetFoodItemTranslationDetailSchema = FoodItemTranslationSchema;

export const CreateFoodItemTranslationBodySchema = FoodItemTranslationSchema.pick({
    foodItemId: true,
    languageId: true,
    name: true,
    description: true,
});

export const UpdateFoodItemTranslationBodySchema = CreateFoodItemTranslationBodySchema;

export type FoodItemTranslationType = z.infer<typeof FoodItemTranslationSchema>;
export type FoodItemTranslationParamsType = z.infer<typeof FoodItemTranslationParamsSchema>;
export type CreateFoodItemTranslationType = z.infer<typeof CreateFoodItemTranslationBodySchema>;
export type UpdateFoodItemTranslationType = z.infer<typeof UpdateFoodItemTranslationBodySchema>;
export type GetFoodItemTranslationDetailResType = z.infer<typeof GetFoodItemTranslationDetailSchema>;
