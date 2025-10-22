import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TrainerTranslationService } from './trainer-translation.service';
import { ZodSerializerDto } from 'nestjs-zod';
import { CreateTrainerTranslationDTO, GetTrainerTranslationDetailDTO, TrainerTranslationParamsDTO, UpdateTrainerTranslationDTO } from './trainer-translation.dto';
import { ActiveUser } from 'src/shared/decorator/active-user.decorator';

@Controller('trainer-translation')
export class TrainerTranslationController {
    constructor(private readonly trainerTranslationService: TrainerTranslationService) {}
    
    @Get(':trainerTranslationId')
    @ZodSerializerDto(GetTrainerTranslationDetailDTO)
    getById(@Param() params: TrainerTranslationParamsDTO) {
        return this.trainerTranslationService.findById(params.trainerTranslationId);
    }

    @Post()
    @ZodSerializerDto(GetTrainerTranslationDetailDTO)
    create(@Body() body: CreateTrainerTranslationDTO,@ActiveUser('userId') createdById: number) {
        return this.trainerTranslationService.create({data: body, createdById});
    } 

    @Put(':trainerTranslationId')
    @ZodSerializerDto(GetTrainerTranslationDetailDTO)
    update(@Param() params: TrainerTranslationParamsDTO, @Body() body: UpdateTrainerTranslationDTO,@ActiveUser('userId')  updatedById: number) {
        return this.trainerTranslationService.update({data: body, trainerTranslationId: params.trainerTranslationId, updatedById});
    }

    @Delete(':trainerTranslationId')
    delete(@Param() params: TrainerTranslationParamsDTO,@ActiveUser('userId') deletedById: number) {
        return this.trainerTranslationService.delete({trainerTranslationId: params.trainerTranslationId, deletedById});
    }
}
