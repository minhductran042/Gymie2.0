import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { 
    CreateFoodItemTranslationType, 
    GetFoodItemTranslationDetailResType, 
    UpdateFoodItemTranslationType 
} from "./food-item-translation.model";

@Injectable()
export class FoodItemTranslationRepository { 
    constructor(private readonly prismaService: PrismaService) {}
    
    findById(foodItemTranslationId: number): Promise<GetFoodItemTranslationDetailResType | null> {
        return this.prismaService.foodItemTranslation.findUnique({
            where: {
                id: foodItemTranslationId,
                deletedAt: null
            }
        });
    }

    create({
        data,
        createdById
    }: {
        data: CreateFoodItemTranslationType,
        createdById: number
    }): Promise<GetFoodItemTranslationDetailResType> {
        return this.prismaService.foodItemTranslation.create({
            data: {
                ...data,
                createdById
            }
        });
    }

    update({
        foodItemTranslationId,
        data,
        updatedById
    }: {
        foodItemTranslationId: number,
        data: UpdateFoodItemTranslationType,
        updatedById: number
    }): Promise<GetFoodItemTranslationDetailResType> {
        return this.prismaService.foodItemTranslation.update({
            where: {
                id: foodItemTranslationId,
                deletedAt: null
            },
            data: {
                ...data,
                updatedById
            }
        });
    }

    delete({
        foodItemTranslationId,
        deletedById
    }: {
        foodItemTranslationId: number,
        deletedById: number
    }, isHard?: boolean): Promise<GetFoodItemTranslationDetailResType> {
        return isHard ? 
            this.prismaService.foodItemTranslation.delete({
                where: {
                    id: foodItemTranslationId
                }
            }) : 
            this.prismaService.foodItemTranslation.update({
                where: {
                    id: foodItemTranslationId
                },
                data: {
                    deletedAt: new Date(),
                    deletedById
                }
            });
    }
}