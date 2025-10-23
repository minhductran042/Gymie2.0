import z from "zod"

const TagsSchema = z.array(z.string())

export const FoodItemSchema = z.object({
    id: z.number(),
    brand: z.string().nullable(),
    categoryId: z.number().nullable(),
    name: z.string(),
    servingSize: z.string(),
    servingSizeGrams: z.number(),
    caloriesPer100g: z.number(),
    proteinPer100g: z.number(),
    carbsPer100g: z.number(),
    fatPer100g: z.number(),
    fiberPer100g: z.number().nullable(),
    sugarPer100g: z.number().nullable(),
    sodiumPer100g: z.number().nullable(),
    tags: TagsSchema.nullable(),
    barcode: z.string().nullable(),
    isCustom: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedById: z.number().nullable(),
})

export type FoodItemType = z.infer<typeof FoodItemSchema>
export type TagsType = z.infer<typeof TagsSchema>