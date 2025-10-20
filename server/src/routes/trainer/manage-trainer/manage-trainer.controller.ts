import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ManageTrainerService } from './manage-trainer.service';
import { ZodSerializerDto } from 'nestjs-zod';
import { CreateTrainerBodyDTO, DeleteTrainerParamsDTO, GetTrainerResDTO, UpdateTrainerBodyDTO, UpdateTrainerParamsDTO } from '../trainer.dto';
import { ActiveUser } from 'src/shared/decorator/active-user.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('manage-trainer')
export class ManageTrainerController {
    constructor(private readonly manageTrainer: ManageTrainerService) {}

    @Post()
    @ZodSerializerDto(GetTrainerResDTO)
    create(@Body() body: CreateTrainerBodyDTO, @ActiveUser('userId') createdById: number) {
        return this.manageTrainer.create({data: body, createdById});
    }

    @Put(':trainerId')
    @ZodSerializerDto(GetTrainerResDTO)
    update(
        @Param() params: UpdateTrainerParamsDTO, 
        @Body() body: UpdateTrainerBodyDTO,
        @ActiveUser('userId') updatedById: number
    ) {
        return this.manageTrainer.update({trainerId: params.trainerId, data: body, updatedById});
    }

    @Delete(':trainerId')
    @ZodSerializerDto(MessageResDTO)
    delete(
        @Param() params: DeleteTrainerParamsDTO,
        @ActiveUser('userId') deletedById: number
    ) {
        return this.manageTrainer.delete({trainerId: params.trainerId, deletedById});
    }
}
