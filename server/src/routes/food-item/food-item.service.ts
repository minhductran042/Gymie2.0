import { Injectable } from '@nestjs/common';
import { FoodItemRepository } from './food-item.repo';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { I18nContext } from 'nestjs-i18n';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helper';
import { CreateFoodItemBodyType, UpdateFoodItemBodyType } from './food-item.model';
import { FoodItemHasAlreadyExistsError } from './food-item.error';
import { NotFoundRecordException } from 'src/shared/error';

@Injectable()
export class FoodItemService {
    constructor(private readonly foodItemRepository : FoodItemRepository) {}

    async list(body : PaginationQueryType) {
        const languageId = I18nContext.current()?.lang as string
        return this.foodItemRepository.list(body, languageId);
    }

    async getDetails(foodItemId: number) {
        try {
            const languageId = I18nContext.current()?.lang as string
            const foodItem = await this.foodItemRepository.findById(foodItemId, languageId);
            
            if (!foodItem) {
                throw NotFoundRecordException;
            }
            
            return foodItem;
        } catch (error) {
            if(isNotFoundPrismaError(error)) {
                throw NotFoundRecordException;
            }
            throw error;
        }
    }

    async create({data, createdById}: {data: CreateFoodItemBodyType, createdById: number}) {
        try {
            return this.foodItemRepository.create(data, createdById);
        } catch (error) {
            if(isUniqueConstraintPrismaError(error)) {
                throw FoodItemHasAlreadyExistsError;
            }
            throw error;
        }
    }

    async update({data , foodItemId, updatedById}: {data: UpdateFoodItemBodyType, foodItemId: number, updatedById: number}) {
        try {
            return this.foodItemRepository.update({body: data, foodItemId, updatedById});
        } catch (error) {
            if(isNotFoundPrismaError(error)) {
                throw NotFoundRecordException;
            }
            if(isUniqueConstraintPrismaError(error)) {
                throw FoodItemHasAlreadyExistsError;
            }
            throw error;
        }
    }

    async delete({foodItemId, deletedById}: {foodItemId: number, deletedById: number}) {
        try {
            return this.foodItemRepository.delete({foodItemId, deletedById});
        } catch (error) {
            if(isNotFoundPrismaError(error)) {
                throw NotFoundRecordException;
            }
            throw error;
        }
    }

}
