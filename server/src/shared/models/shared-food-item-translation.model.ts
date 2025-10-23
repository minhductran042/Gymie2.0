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

export type FoodItemTranslationType = z.infer<typeof FoodItemTranslationSchema>;