import { UnprocessableEntityException } from "@nestjs/common";

export const FoodItemHasAlreadyExistsError = new UnprocessableEntityException({
    message: 'ERROR.FOOD_ITEM_ALREADY_EXISTS',
    path: 'name'
})