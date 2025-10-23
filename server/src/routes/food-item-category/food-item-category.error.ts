import { UnprocessableEntityException } from "@nestjs/common";

export const FoodCategoryHasAlreadyExistsError = new UnprocessableEntityException({
    message: 'ERROR.FOOD_CATEGORY_ALREADY_EXISTS',
    path: 'code'
})