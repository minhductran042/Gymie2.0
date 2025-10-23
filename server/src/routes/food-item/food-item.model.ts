import { FoodItemTranslationSchema } from "src/shared/models/shared-food-item-translation.model"
import { FoodItemSchema } from "src/shared/models/shared-food-item.model"
import z from "zod"


export const CreateFoodItemBodySchema = FoodItemSchema.pick({
    categoryId: true,
    brand: true,
    name: true,
    servingSize: true,
    caloriesPer100g: true,
    servingSizeGrams: true,
    proteinPer100g: true,
    carbsPer100g: true,
    fatPer100g: true,
    fiberPer100g: true,
    sugarPer100g: true,
    sodiumPer100g: true,
    tags: true,
    barcode: true,
}).strict()

export const UpdateFoodItemBodySchema = CreateFoodItemBodySchema

export const FoodItemParamsSchema = z.object({
    foodItemId: z.coerce.number().int().positive(),
})

export const GetFoodItemsResSchema = z.object({
    data: z.array(FoodItemSchema.extend({
        foodItemTranslations: z.array(FoodItemTranslationSchema)
    })),
    totalItems: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
})

export const GetFoodItemDetailSchema = FoodItemSchema.extend({
    foodItemTranslations: z.array(FoodItemTranslationSchema)
})


export type CreateFoodItemBodyType = z.infer<typeof CreateFoodItemBodySchema>
export type UpdateFoodItemBodyType = z.infer<typeof UpdateFoodItemBodySchema>
export type FoodItemParamsType = z.infer<typeof FoodItemParamsSchema>
export type GetFoodItemsResType = z.infer<typeof GetFoodItemsResSchema>
export type GetFoodItemDetailType = z.infer<typeof GetFoodItemDetailSchema>

