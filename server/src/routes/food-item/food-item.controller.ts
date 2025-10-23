import { Body, Controller, Delete, Param, Put, Query } from '@nestjs/common';
import { FoodItemService } from './food-item.service';
import { ZodSerializerDto } from 'nestjs-zod';
import { CreateFoodItemBodyDTO, FoodItemParamsDTO, GetFoodItemDetailDTO, GetFoodItemsResDTO, UpdateFoodItemBodyDTO } from './food-item.dto';
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto';
import { Get, Post } from '@nestjs/common';
import { ActiveUser } from 'src/shared/decorator/active-user.decorator';


@Controller('food-items')
export class FoodItemController {
    constructor(private readonly foodItemService: FoodItemService) {}

    @Get()
    @ZodSerializerDto(GetFoodItemsResDTO)
    list(@Query() query: PaginationQueryDTO) {
        return this.foodItemService.list(query);
    }

    @Get(':foodItemId')
    @ZodSerializerDto(GetFoodItemDetailDTO)
    getDetails(@Param() params: FoodItemParamsDTO) {
        return this.foodItemService.getDetails(params.foodItemId);
    }

    @Post()
    @ZodSerializerDto(GetFoodItemDetailDTO)
    create(@Body() body: CreateFoodItemBodyDTO, @ActiveUser('userId') createdById: number) {
        return this.foodItemService.create({data: body, createdById});
    }

    @Put(':foodItemId')
    @ZodSerializerDto(GetFoodItemDetailDTO)
    update(
        @Param() params: FoodItemParamsDTO, 
        @Body() body: UpdateFoodItemBodyDTO,
        @ActiveUser('userId') updatedById: number
    ) {
        return this.foodItemService.update({data: body, foodItemId: params.foodItemId, updatedById});
    }

    @Delete(':foodItemId')
    delete(
        @Param() params: FoodItemParamsDTO,
        @ActiveUser('userId') deletedById: number
    ) {
        return this.foodItemService.delete({foodItemId: params.foodItemId, deletedById});
    }


}
