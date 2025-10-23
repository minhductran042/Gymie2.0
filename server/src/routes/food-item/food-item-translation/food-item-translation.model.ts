import { FoodItemTranslationSchema } from 'src/shared/models/shared-food-item-translation.model';
import z from 'zod';



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


export type FoodItemTranslationParamsType = z.infer<typeof FoodItemTranslationParamsSchema>;
export type CreateFoodItemTranslationType = z.infer<typeof CreateFoodItemTranslationBodySchema>;
export type UpdateFoodItemTranslationType = z.infer<typeof UpdateFoodItemTranslationBodySchema>;
export type GetFoodItemTranslationDetailResType = z.infer<typeof GetFoodItemTranslationDetailSchema>;
