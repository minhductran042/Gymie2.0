import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TrainerService } from './trainer.service';
import { ZodSerializerDto } from 'nestjs-zod';
import { CreateTrainerBodyDTO, GetTrainerQueryDTO, GetTrainerResDTO } from './trainer.dto';
import { IsPublic } from 'src/shared/decorator/isPublic.decorator';
import { ActiveUser } from 'src/shared/decorator/active-user.decorator';


@Controller('trainer')
export class TrainerController {
    constructor(private readonly trainerService: TrainerService) {}

    @Get()
    @ZodSerializerDto(GetTrainerResDTO)
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
    @ZodSerializerDto(GetTrainerResDTO)
    getDetail(@Param() params: number) {
        return this.trainerService.getDetail({ trainerId: params });
    }
}
