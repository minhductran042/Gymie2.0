import { Module } from '@nestjs/common';
import { FoodItemService } from './food-item.service';
import { FoodItemController } from './food-item.controller';
import { FoodItemRepository } from './food-item.repo';

@Module({
  providers: [FoodItemService, FoodItemRepository],
  controllers: [FoodItemController]
})
export class FoodItemModule {}
