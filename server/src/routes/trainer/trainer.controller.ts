import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TrainerService } from './trainer.service';
import { ZodSerializerDto } from 'nestjs-zod';
import { CreateTrainerBodyDTO, GetTrainerParamsDTO, GetTrainerQueryDTO, GetTrainersResDTO, TrainerDetailResDTO, } from './trainer.dto';
import { IsPublic } from 'src/shared/decorator/isPublic.decorator';
import { ActiveUser } from 'src/shared/decorator/active-user.decorator';


@Controller('trainers')
export class TrainerController {
    constructor(private readonly trainerService: TrainerService) {}

    @Get()
    @ZodSerializerDto(GetTrainersResDTO)
    @IsPublic()
    list(@Query() query: GetTrainerQueryDTO) {
        return this.trainerService.list({
            page: query.page,
            limit: query.limit,
            isAvailable: query.isAvailable,
            minHourlyRate: query.minHourlyRate,
            maxHourlyRate: query.maxHourlyRate,
            minExperienceYears: query.minExperienceYears,
            maxExperienceYears: query.maxExperienceYears
        });
    }

    @Get(':trainerId')
    @IsPublic()
    @ZodSerializerDto(TrainerDetailResDTO)
    getDetail(@Param() params: GetTrainerParamsDTO) {
        return this.trainerService.getDetail(params.trainerId);
    }
}
