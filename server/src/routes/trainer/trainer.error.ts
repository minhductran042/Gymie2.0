import { UnprocessableEntityException } from "@nestjs/common";

export const TrainerAlreadyExistsError = new UnprocessableEntityException({
    message: 'Trainer profile already exists for this user',
    errorCode: 'TRAINER_ALREADY_EXISTS',
})