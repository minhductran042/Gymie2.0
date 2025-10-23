import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FoodItemCategoryRepository } from './food-item-category.repo';
import { CreateFoodCategoryBodyType } from './food-item-category.model';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { I18nContext } from 'nestjs-i18n';
import { NotFoundRecordException } from 'src/shared/error';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helper';
import { FoodCategoryHasAlreadyExistsError } from './food-item-category.error';

@Injectable()
export class FoodItemCategoryService {
    constructor(private readonly foodCategoryRepo: FoodItemCategoryRepository) {}

    async list(pagination: PaginationQueryType) {
        const languageId = I18nContext.current()?.lang as string
        return await this.foodCategoryRepo.list(pagination, languageId);
    }

    async getById(foodCategoryId: number) {
        try {
            const languageId = I18nContext.current()?.lang as string
            const category = await this.foodCategoryRepo.findById(foodCategoryId, languageId);
            return category;
        } catch (error) {
            if(isNotFoundPrismaError(error)) {
                throw NotFoundRecordException;
            }
            throw error;
        }
    
    }

    async create(body: CreateFoodCategoryBodyType, createdById: number) {
        try {
            return await this.foodCategoryRepo.create(body, createdById);
        } catch (error) {
            if(isUniqueConstraintPrismaError(error)) {
                throw  FoodCategoryHasAlreadyExistsError
            }
            throw error;
        }
        
    }

    async update(foodCategoryId: number, body: CreateFoodCategoryBodyType, updatedById: number) {
        try {
            return await this.foodCategoryRepo.update(foodCategoryId, body, updatedById);
        } catch (error) {
            if(isNotFoundPrismaError(error)) {
                throw NotFoundRecordException;
            }
            if(isUniqueConstraintPrismaError(error)) {
                throw  FoodCategoryHasAlreadyExistsError
            }
            throw error;
        }
    }

    async delete(foodCategoryId: number, deletedById: number) {
        try {
            await this.foodCategoryRepo.delete(foodCategoryId, deletedById);
            return "Food category deleted successfully";
        } catch(error) {
            if(isNotFoundPrismaError(error)) {
                throw NotFoundRecordException;
            }
            throw error;
        }

        
    }
}
