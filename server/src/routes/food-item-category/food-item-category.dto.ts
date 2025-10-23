import { createZodDto } from "nestjs-zod";
import {
    CreateFoodCategoryBodySchema,
    FoodCategoryParamsSchema,
    GetFoodCategoriesResSchema,
    GetFoodCategoryDetailSchema,
    UpdateFoodCategoryBodySchema,
} from "./food-item-category.model";

export class CreateFoodCategoryBodyDTO extends createZodDto(CreateFoodCategoryBodySchema) {}
export class UpdateFoodCategoryBodyDTO extends createZodDto(UpdateFoodCategoryBodySchema) {}
export class FoodCategoryParamsDTO extends createZodDto(FoodCategoryParamsSchema) {}
export class GetFoodCategoriesResDTO extends createZodDto(GetFoodCategoriesResSchema) {}
export class GetFoodCategoryDetailDTO extends createZodDto(GetFoodCategoryDetailSchema) {}
