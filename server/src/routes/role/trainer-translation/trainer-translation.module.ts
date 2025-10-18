import { Module } from '@nestjs/common';
import { TrainerTranslationController } from './trainer-translation.controller';
import { TrainerTranslationService } from './trainer-translation.service';

@Module({
  controllers: [TrainerTranslationController],
  providers: [TrainerTranslationService]
})
export class TrainerTranslationModule {}
