import { createZodDto } from "nestjs-zod"
import z from "zod"
import { CreateTrainerTranslationSchema, DeleteTrainerParamsSchema, GetTrainerTranslationDetailSchema, TrainerTranslationParamsSchema, TrainerTranslationQuerySchema, UpdateTrainerTranslationSchema } from "./trainer-translation.model"
import { extend } from "zod/mini"

export class TrainerTranslationParamsDTO extends createZodDto(TrainerTranslationParamsSchema) {}

export class GetTrainerTranslationDetailDTO extends createZodDto(GetTrainerTranslationDetailSchema) {}

export class CreateTrainerTranslationDTO extends createZodDto(CreateTrainerTranslationSchema) {}

export class UpdateTrainerTranslationDTO extends createZodDto(UpdateTrainerTranslationSchema) {}

export class DeleteTrainerTranslationDTO extends createZodDto(DeleteTrainerParamsSchema) {}

export class  TrainerTranslationQueryDTO extends createZodDto(TrainerTranslationQuerySchema) {}

