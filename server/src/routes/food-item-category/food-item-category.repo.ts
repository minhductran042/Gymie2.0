import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { PaginationQueryType } from "src/shared/models/request.model";
import { ALL_LANGUAGE_CODE } from "src/shared/constants/other.const";
import { GetFoodCategoriesResType, CreateFoodCategoryBodyType } from "./food-item-category.model";

@Injectable()
export class FoodItemCategoryRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async list(pagination: PaginationQueryType, languageId: string): Promise<GetFoodCategoriesResType> {
        const skip = (pagination.page - 1) * pagination.limit;
        const take = pagination.limit;
        
        const [totalItems, data] = await Promise.all([
            this.prismaService.foodCategory.count({
                where: {
                    deletedAt: null
                }
            }),
            this.prismaService.foodCategory.findMany({
                where: {
                    deletedAt: null
                },
                include: {
                    translations: {
                        where: languageId === ALL_LANGUAGE_CODE 
                            ? { deletedAt: null } 
                            : { languageId, deletedAt: null }
                    }
                },
                skip,
                take,
                orderBy: {
                    id: 'asc'
                }
            })
        ]);

        const totalPages = Math.ceil(totalItems / take);

        return {
            data,
            totalItems,
            page: pagination.page,
            limit: take,
            totalPages
        };
    }

    async findById(foodCategoryId: number, languageId: string) {
        return await this.prismaService.foodCategory.findUnique({
            where: {
                id: foodCategoryId,
                deletedAt: null
            },
            include: {
                translations: {
                    where: languageId === ALL_LANGUAGE_CODE 
                        ? { deletedAt: null } 
                        : { languageId, deletedAt: null }
                }
            }
        });
    }

    async findByCode(code: string) {
        return await this.prismaService.foodCategory.findUnique({
            where: {
                code,
                deletedAt: null
            }
        });
    }

    async create(body: CreateFoodCategoryBodyType, createdById: number) {
        return await this.prismaService.foodCategory.create({
            data: {
                code: body.code,
                createdById
            },
            include: {
                translations: true
            }
        });
    }

    async update(foodCategoryId: number, body: CreateFoodCategoryBodyType, updatedById: number) {
        return await this.prismaService.foodCategory.update({
            where: { id: foodCategoryId },
            data: {
                code: body.code,
                updatedById
            },
            include: {
                translations: true
            }
        });
    }

    async delete(foodCategoryId: number, deletedById: number) {
        return await this.prismaService.foodCategory.update({
            where: { id: foodCategoryId },
            data: {
                deletedAt: new Date(),
                deletedById
            }
        });
    }
}
