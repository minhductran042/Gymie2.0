import { Module } from '@nestjs/common';
import { FoodItemTranslationController } from './food-item-translation.controller';
import { FoodItemTranslationService } from './food-item-translation.service';
import { FoodItemTranslationRepository } from './food-item-translation.repo';

@Module({
  controllers: [FoodItemTranslationController],
  providers: [FoodItemTranslationService, FoodItemTranslationRepository]
})
export class FoodItemTranslationModule {}
