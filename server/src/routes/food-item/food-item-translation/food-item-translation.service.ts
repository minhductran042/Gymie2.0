import { Injectable, NotFoundException } from '@nestjs/common';
import { FoodItemTranslationRepository } from './food-item-translation.repo';
import { CreateFoodItemTranslationType, UpdateFoodItemTranslationType } from './food-item-translation.model';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helper';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class FoodItemTranslationService {
    constructor(private readonly foodItemTranslationRepo: FoodItemTranslationRepository) {}

    async findById(foodItemTranslationId: number) {
        const translation = await this.foodItemTranslationRepo.findById(foodItemTranslationId);
        if (!translation) {
            throw new NotFoundException('Food item translation not found');
        }
        return translation;
    }

    async create({data, createdById}: {data: CreateFoodItemTranslationType, createdById: number}) {
        try {
            return await this.foodItemTranslationRepo.create({data, createdById});
        } catch (error) {
            if (isUniqueConstraintPrismaError(error)) {
                throw new BadRequestException('Food item translation already exists for this language');
            }
            throw error;
        }
    }

    async update({
        data, 
        foodItemTranslationId, 
        updatedById
    }: {
        data: UpdateFoodItemTranslationType, 
        foodItemTranslationId: number, 
        updatedById: number
    }) {
        try {
            const translation = await this.foodItemTranslationRepo.update({
                foodItemTranslationId, 
                data, 
                updatedById
            });
            return translation;
        } catch (error) {
            if (isUniqueConstraintPrismaError(error)) {
                throw new BadRequestException('Food item translation already exists for this language');
            }
            if (isNotFoundPrismaError(error)) {
                throw new NotFoundException('Food item translation not found');
            }
            throw error;
        }
    }

    async delete({
        foodItemTranslationId, 
        deletedById
    }: {
        foodItemTranslationId: number, 
        deletedById: number
    }) {
        try {
            await this.foodItemTranslationRepo.delete({foodItemTranslationId, deletedById});
        } catch (error) {
            if (isNotFoundPrismaError(error)) {
                throw new NotFoundException('Food item translation not found');
            }
            throw error;
        }
    }
}
