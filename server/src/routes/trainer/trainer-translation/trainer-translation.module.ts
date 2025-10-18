import { Module } from '@nestjs/common';
import { TrainerTranslationController } from './trainer-translation.controller';
import { TrainerTranslationService } from './trainer-translation.service';
import { TrainerTranslationRepository } from './trainer-translation.repo';

@Module({
  controllers: [TrainerTranslationController],
  providers: [TrainerTranslationService, TrainerTranslationRepository]
})
export class TrainerTranslationModule {}
