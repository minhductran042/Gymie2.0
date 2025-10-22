import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { FoodItemTranslationService } from './food-item-translation.service';
import { ZodSerializerDto } from 'nestjs-zod';
import { 
    CreateFoodItemTranslationBodyDTO, 
    FoodItemTranslationParamsDTO, 
    GetFoodItemTranslationDetailDTO, 
    UpdateFoodItemTranslationBodyDTO 
} from './food-item-translation.dto';
import { ActiveUser } from 'src/shared/decorator/active-user.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('food-item-translation')
export class FoodItemTranslationController {
    constructor(private readonly foodItemTranslationService: FoodItemTranslationService) {}
    
    @Get(':foodItemTranslationId')
    @ZodSerializerDto(GetFoodItemTranslationDetailDTO)
    getById(@Param() params: FoodItemTranslationParamsDTO) {
        return this.foodItemTranslationService.findById(params.foodItemTranslationId);
    }

    @Post()
    @ZodSerializerDto(GetFoodItemTranslationDetailDTO)
    create(
        @Body() body: CreateFoodItemTranslationBodyDTO,
        @ActiveUser('userId') createdById: number
    ) {
        return this.foodItemTranslationService.create({data: body, createdById});
    } 

    @Put(':foodItemTranslationId')
    @ZodSerializerDto(GetFoodItemTranslationDetailDTO)
    update(
        @Param() params: FoodItemTranslationParamsDTO, 
        @Body() body: UpdateFoodItemTranslationBodyDTO,
        @ActiveUser('userId') updatedById: number
    ) {
        return this.foodItemTranslationService.update({
            data: body, 
            foodItemTranslationId: params.foodItemTranslationId, 
            updatedById
        });
    }

    @Delete(':foodItemTranslationId')
    @ZodSerializerDto(MessageResDTO)
    delete(
        @Param() params: FoodItemTranslationParamsDTO,
        @ActiveUser('userId') deletedById: number
    ) {
        return this.foodItemTranslationService.delete({
            foodItemTranslationId: params.foodItemTranslationId, 
            deletedById
        });
    }
}
