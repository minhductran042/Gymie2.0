import { Injectable } from "@nestjs/common";
import { PaginationQueryType } from "src/shared/models/request.model";
import { PrismaService } from "src/shared/services/prisma.service";
import {  CreateFoodItemBodyType, GetFoodItemDetailType, GetFoodItemsResType, UpdateFoodItemBodyType,  } from "./food-item.model";
import { ALL_LANGUAGE_CODE } from "src/shared/constants/other.const";
import { GetFoodItemDetailDTO } from "./food-item.dto";
import { FoodItemType } from "src/shared/models/shared-food-item.model";

@Injectable()
export class FoodItemRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async list(pagination: PaginationQueryType, languageId: string) : Promise<GetFoodItemsResType> {
        const skip = (pagination.page - 1) * pagination.limit;
        const take = pagination.limit;
        const [totalItems, data] = await Promise.all([
            this.prismaService.foodItem.count({
                where: {
                    deletedAt: null
                }
            }),
            this.prismaService.foodItem.findMany({
                where: {
                    deletedAt: null
                },
                include: {
                    foodItemTranslations: {
                        where: languageId === ALL_LANGUAGE_CODE ? { deletedAt: null } : { languageId, deletedAt: null }
                    }
                },
                skip,
                take,
                orderBy: {
                    createdAt: 'desc'
                }
            })
        ])

        const totalPages = Math.ceil(totalItems / take);

        return {
            data,
            totalItems,
            page: pagination.page,
            limit: take,
            totalPages
        } 
    }

    create(body: CreateFoodItemBodyType, createdById: number) : Promise<GetFoodItemDetailType> {
        const foodItem = this.prismaService.foodItem.create({
            data: {
                ...body,
                createdById,
                tags: body.tags || [],
            },
            include: {
                foodItemTranslations: true
            }
        })
        return foodItem;
        
    }

    findById(foodItemId: number, languageId: string) : Promise<GetFoodItemDetailType | null> {
        const foodItem = this.prismaService.foodItem.findUnique({
            where: {
                id: foodItemId,
                deletedAt: null
            },
            include: {
                foodItemTranslations: {
                    where: languageId === ALL_LANGUAGE_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
                }
            }
        })
        return foodItem
    }

    update({
        foodItemId,
        body,
        updatedById
        
    }: {
        foodItemId: number,
        body: UpdateFoodItemBodyType,
        updatedById: number
    }) : Promise<GetFoodItemDetailType> {
        const foodItem = this.prismaService.foodItem.update({
            where: {
                id: foodItemId,
            },
            data: {
                ...body,
                updatedById,
                tags: body.tags || [],
            },
            include: {
                foodItemTranslations: true
            }
        })
        return foodItem;
    }

    delete({
        foodItemId,
        deletedById,
    }: {
        foodItemId: number,
        deletedById: number
    }, isHard? : boolean
    ) : Promise<FoodItemType> {
        return isHard ? this.prismaService.foodItem.delete({
            where: {
                id: foodItemId,
            }
        }) : this.prismaService.foodItem.update({
            where: {
                id: foodItemId,
            },
            data: {
                deletedAt: new Date(),
                deletedById,
            }
        });
    }
}