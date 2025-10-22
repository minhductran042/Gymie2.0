import { Module } from '@nestjs/common';
import { TrainerReviewService } from './trainer-review.service';
import { TrainerReviewController } from './trainer-review.controller';
import { TrainerReviewRepository } from './trainer-review.repo';

@Module({
  providers: [TrainerReviewService, TrainerReviewRepository],
  controllers: [TrainerReviewController]
})
export class TrainerReviewModule {}
