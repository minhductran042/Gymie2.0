import { createZodDto } from "nestjs-zod";
import { 
    CreateFoodItemTranslationBodySchema, 
    FoodItemTranslationParamsSchema, 
    GetFoodItemTranslationDetailSchema, 
    UpdateFoodItemTranslationBodySchema 
} from "./food-item-translation.model";

export class FoodItemTranslationParamsDTO extends createZodDto(FoodItemTranslationParamsSchema) {}

export class GetFoodItemTranslationDetailDTO extends createZodDto(GetFoodItemTranslationDetailSchema) {}

export class CreateFoodItemTranslationBodyDTO extends createZodDto(CreateFoodItemTranslationBodySchema) {}

export class UpdateFoodItemTranslationBodyDTO extends createZodDto(UpdateFoodItemTranslationBodySchema) {}
