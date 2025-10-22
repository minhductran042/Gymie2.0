import { Injectable } from '@nestjs/common';
import { TrainerReviewRepository } from './trainer-review.repo';
import { CreateTrainerReviewBodyType, UpdateTrainerReviewBodyType } from './trainer-review.model';
import { PaginationQueryType } from 'src/shared/models/request.model';

@Injectable()
export class TrainerReviewService {
    constructor(private readonly TrainerReviewRepo: TrainerReviewRepository) {}

    async list(trainerId: number, pagination: PaginationQueryType) {
        const data = await this.TrainerReviewRepo.list({
            trainerId,
            pagination
        });
        return data;
    }

    async create({body, clientId}: {body: CreateTrainerReviewBodyType, clientId: number}) {
        return this.TrainerReviewRepo.create({
            data: body,
            clientId
        });
    }

    async update({reviewId, body, clientId}: {reviewId: number, body: UpdateTrainerReviewBodyType, clientId: number}) {
        return this.TrainerReviewRepo.update({
            reviewId,
            data: body,
            clientId
        });
    }
}
