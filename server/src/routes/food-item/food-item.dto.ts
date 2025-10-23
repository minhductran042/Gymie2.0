import { createZodDto } from "nestjs-zod";
import { 
    CreateFoodItemBodySchema, 
    FoodItemParamsSchema, 
    GetFoodItemDetailSchema, 
    GetFoodItemsResSchema, 
    UpdateFoodItemBodySchema, 
} from "./food-item.model";

export class CreateFoodItemBodyDTO extends createZodDto(CreateFoodItemBodySchema) {}
export class UpdateFoodItemBodyDTO extends createZodDto(UpdateFoodItemBodySchema) {}
export class FoodItemParamsDTO extends createZodDto(FoodItemParamsSchema) {}
export class GetFoodItemsResDTO extends createZodDto(GetFoodItemsResSchema) {}
export class GetFoodItemDetailDTO extends createZodDto(GetFoodItemDetailSchema) {}

