import { Injectable } from '@nestjs/common';
import { TrainerTranslationRepository } from './trainer-translation.repo';
import { NotFoundRecordException } from 'src/shared/error';
import { CreateTrainerTranslationType } from './trainer-translation.model';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helper';
import { TrainerTranslationAlreadyExists } from './trainer-translation.error';

@Injectable()
export class TrainerTranslationService {
    constructor(private readonly trainerTranslationRepository: TrainerTranslationRepository) {}

    async findById(trainerTranslationId: number) {
        const trainer = await this.trainerTranslationRepository.findById(trainerTranslationId);
        if(!trainer) {
            throw NotFoundRecordException
        }
        return trainer;
    }

    async create({data, createdById}: {data: CreateTrainerTranslationType, createdById: number}) {
        try{
            return await this.trainerTranslationRepository.create({data, createdById});
        } catch(error) {
            if(isUniqueConstraintPrismaError(error)) {
                throw TrainerTranslationAlreadyExists
            }
        }
    }

    async update({data, trainerTranslationId, updatedById} : {data: CreateTrainerTranslationType, trainerTranslationId: number, updatedById: number}) {
        try {
            const trainer = await this.trainerTranslationRepository.update({trainerTranslationId, data, updatedById});
            
        } catch(error) {
            if(isUniqueConstraintPrismaError(error)) {
                throw TrainerTranslationAlreadyExists
            }
            if(isNotFoundPrismaError(error)) {
                throw NotFoundRecordException
            }
        }
    }

    async delete({trainerTranslationId, deletedById} : {trainerTranslationId: number, deletedById: number}) {
        try {
            await this.trainerTranslationRepository.delete({trainerTranslationId, deletedById});
        }
        catch(error) {
            if(isNotFoundPrismaError(error)) {
                throw NotFoundRecordException
            }
        }
    }
}
