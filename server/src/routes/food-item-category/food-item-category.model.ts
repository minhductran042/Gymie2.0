
import { FoodCategoryTranslationSchema } from "src/shared/models/shared-food-category-translation.model";
import { FoodCategorySchema } from "src/shared/models/shared-food-category.model";
import z from "zod";

export const CreateFoodCategoryBodySchema = FoodCategorySchema.pick({
    code: true,
}).strict();

export const UpdateFoodCategoryBodySchema = CreateFoodCategoryBodySchema;

export const FoodCategoryParamsSchema = z.object({
    foodCategoryId: z.coerce.number().int().positive(),
});

export const GetFoodCategoriesResSchema = z.object({
    data: z.array(
        FoodCategorySchema.extend({
            translations: z.array(FoodCategoryTranslationSchema),
        })
    ),
    totalItems: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
});

export const GetFoodCategoryDetailSchema = FoodCategorySchema.extend({
    translations: z.array(FoodCategoryTranslationSchema),
});

export type CreateFoodCategoryBodyType = z.infer<typeof CreateFoodCategoryBodySchema>;
export type UpdateFoodCategoryBodyType = z.infer<typeof UpdateFoodCategoryBodySchema>;
export type FoodCategoryParamsType = z.infer<typeof FoodCategoryParamsSchema>;
export type GetFoodCategoriesResType = z.infer<typeof GetFoodCategoriesResSchema>;
export type GetFoodCategoryDetailType = z.infer<typeof GetFoodCategoryDetailSchema>;
