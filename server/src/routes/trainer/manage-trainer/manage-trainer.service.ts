import { BadRequestException, Injectable } from '@nestjs/common';
import { TrainerRepository } from '../trainer.repo';
import { CreateTrainerBodyType, UpdateTrainerBodyType } from '../trainer.model';
import { I18nContext } from 'nestjs-i18n';
import { isUniqueConstraintPrismaError } from 'src/shared/helper';
import { TrainerAlreadyExistsError } from '../trainer.error';

@Injectable()
export class ManageTrainerService {
    constructor(private readonly trainerRepo: TrainerRepository) {}

    async create({data, createdById}: {data: CreateTrainerBodyType, createdById: number}) {
        try {
            // Admin tạo trainer, userId được lấy từ body
        return this.trainerRepo.create({
            data: {
                specialties: data.specialties,
                certifications: data.certifications,
                experienceYears: data.experienceYears,
                hourlyRate: data.hourlyRate,
                isAvailable: data.isAvailable,
                maxClients: data.maxClients,
            },
            createdById,
            userId: data.userId
        });
        } catch (error) {
            if(isUniqueConstraintPrismaError(error)) {
                throw TrainerAlreadyExistsError
            }
            throw error;
        }

        
    }

    async update({trainerId, data, updatedById}: {trainerId: number, data: UpdateTrainerBodyType, updatedById: number}) {
        return this.trainerRepo.updateByAdmin({trainerId, data, updatedById});
    }

    async delete({trainerId, deletedById}: {trainerId: number, deletedById: number}) {
        await this.trainerRepo.delete({trainerId, deletedById});
        return "Delete trainer successfully";
    }

}
