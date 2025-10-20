import { Module } from '@nestjs/common';
import { TrainerService } from './trainer.service';
import { TrainerController } from './trainer.controller';
import { TrainerRepository } from './trainer.repo';
import { ManageTrainerController } from './manage-trainer/manage-trainer.controller';
import { ManageTrainerService } from './manage-trainer/manage-trainer.service';

@Module({
  providers: [TrainerService, ManageTrainerService, TrainerRepository],
  controllers: [TrainerController, ManageTrainerController]
})
export class TrainerModule {}
