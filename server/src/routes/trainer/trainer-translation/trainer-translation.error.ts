import { UnprocessableEntityException } from "@nestjs/common";

export const TrainerTranslationAlreadyExists = new UnprocessableEntityException({
    message: 'Error.TrainerTranslationAlreadyExists',
    path: 'TrainerTranslationId'
})