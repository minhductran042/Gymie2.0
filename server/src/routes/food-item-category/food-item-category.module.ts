import { Module } from '@nestjs/common';
import { FoodItemCategoryController } from './food-item-category.controller';
import { FoodItemCategoryService } from './food-item-category.service';
import { FoodItemCategoryRepository } from './food-item-category.repo';
import { SharedModule } from 'src/shared/shared.module';

@Module({
    imports: [SharedModule],
    controllers: [FoodItemCategoryController],
    providers: [FoodItemCategoryService, FoodItemCategoryRepository]
})
export class FoodItemCategoryModule {}
