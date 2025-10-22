import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TrainerReviewService } from './trainer-review.service';
import { ZodSerializerDto } from 'nestjs-zod';
import { CreateTrainerReviewBodyDTO, CreateTrainerReviewResDTO, GetReviewsResDTO, GetTrainerReviewsParamsDTO, UpdateTrainerReviewBodyDTO, UpdateTrainerReviewResDTO } from './trainer-review.dto';
import { ActiveUser } from 'src/shared/decorator/active-user.decorator';
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto';
import { IsPublic } from 'src/shared/decorator/isPublic.decorator';

@Controller('trainer-reviews')
export class TrainerReviewController {
    constructor(private readonly trainerReviewService: TrainerReviewService) {}

    @Get(':trainerId')
    @ZodSerializerDto(GetReviewsResDTO)
    @IsPublic()
    list(
        @Param() params: GetTrainerReviewsParamsDTO,
        @Query() query: PaginationQueryDTO
    ) {
        return this.trainerReviewService.list(params.trainerId, query);
    }

    @Post()
    @ZodSerializerDto(CreateTrainerReviewResDTO)
    create(
        @Body() body: CreateTrainerReviewBodyDTO,
        @ActiveUser('userId') clientId: number
    ) {
        return this.trainerReviewService.create({
            body,
            clientId
        });
    }

    @Put(':reviewId')
    @ZodSerializerDto(UpdateTrainerReviewResDTO)
    update(
        @Param('reviewId') reviewId: number,
        @Body() body: UpdateTrainerReviewBodyDTO,
        @ActiveUser('userId') clientId: number
    ) {
        return this.trainerReviewService.update({
            reviewId,
            body,
            clientId
        });
    }
}
