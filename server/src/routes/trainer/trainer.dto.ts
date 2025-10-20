import { createZodDto } from 'nestjs-zod';
import { CreateTrainerBodySchema, DeleteTrainerParamsSchema, GetTrainerParamsSchema, GetTrainerQuerySchema, GetTrainersResSchema, UpdateTrainerBodySchema, UpdateTrainerParamsSchema } from './trainer.model';
import { extendedDuration } from 'node_modules/zod/v4/core/regexes.cjs';
import { create } from 'domain';

export class GetTrainerResDTO extends createZodDto(GetTrainersResSchema) {}

export class CreateTrainerBodyDTO extends createZodDto(CreateTrainerBodySchema) {}

export class UpdateTrainerBodyDTO extends createZodDto(UpdateTrainerBodySchema) {}

export class UpdateTrainerParamsDTO extends createZodDto(UpdateTrainerParamsSchema) {}

export class DeleteTrainerParamsDTO extends createZodDto(DeleteTrainerParamsSchema) {}

export class GetTrainerParamsDTO extends createZodDto(GetTrainerParamsSchema) {}

export class GetTrainerQueryDTO extends createZodDto(GetTrainerQuerySchema) {}