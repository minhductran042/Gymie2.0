import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { FoodItemCategoryService } from './food-item-category.service';
import {
    CreateFoodCategoryBodyDTO,
    FoodCategoryParamsDTO,
    GetFoodCategoriesResDTO,
    GetFoodCategoryDetailDTO,
    UpdateFoodCategoryBodyDTO,
} from './food-item-category.dto';
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto';
import { ActiveUser } from 'src/shared/decorator/active-user.decorator';
import { ZodSerializerDto } from 'nestjs-zod';

@Controller('food-item-categories')
export class FoodItemCategoryController {
    constructor(private readonly foodCategoryService: FoodItemCategoryService) {}

    @Get()
    @ZodSerializerDto(GetFoodCategoriesResDTO)
    async list(
        @Query() query: PaginationQueryDTO,
    ) {
        return await this.foodCategoryService.list(query);
    }

    @Get(':foodCategoryId')
    @ZodSerializerDto(GetFoodCategoryDetailDTO)
    async getDetail(
        @Param() params: FoodCategoryParamsDTO,
    ) {
        return await this.foodCategoryService.getById(params.foodCategoryId);
    }

    @Post()
    @ZodSerializerDto(GetFoodCategoryDetailDTO)
    async create(
        @Body() body: CreateFoodCategoryBodyDTO,
        @ActiveUser('userId') user
    ) {
        return await this.foodCategoryService.create(body, user.userId);
    }

    @Put(':foodCategoryId')
    @ZodSerializerDto(GetFoodCategoryDetailDTO)
    async update(
        @Param() params: FoodCategoryParamsDTO,
        @Body() body: UpdateFoodCategoryBodyDTO,
        @ActiveUser('userId') user
    ) {
        return await this.foodCategoryService.update(params.foodCategoryId, body, user.userId);
    }

    @Delete(':foodCategoryId')
    async delete(
        @Param() params: FoodCategoryParamsDTO,
        @ActiveUser() user
    ) {
        return await this.foodCategoryService.delete(params.foodCategoryId, user.userId);
    }
}
