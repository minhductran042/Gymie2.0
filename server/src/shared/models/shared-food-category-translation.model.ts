import z from "zod";

export const FoodCategoryTranslationSchema = z.object({
    id: z.number(),
    categoryId: z.number(),
    languageId: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedById: z.number().nullable(),
})

export type FoodCategoryTranslationType = z.infer<typeof FoodCategoryTranslationSchema>;
