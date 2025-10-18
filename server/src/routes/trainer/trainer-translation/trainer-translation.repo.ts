import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { CreateTrainerTranslationType, GetTrainerTranslationDetailResType, UpdateTrainerTranslationType } from "./trainer-translation.model";
import { TrainerType } from "src/shared/models/shared-trainer.model";
import { TrainerTranslationType } from "src/shared/models/shared-trainer-translation.model";


@Injectable()
export class TrainerTranslationRepository {
    constructor(private readonly prismaService: PrismaService) {}

    findById(trainerTranslationId: number) : Promise<GetTrainerTranslationDetailResType | null> {
        return this.prismaService.trainerTranslation.findUnique({
            where: {
                id: trainerTranslationId,
                deletedAt: null
            }
        }) 
    }

    create({
        data,
        createdById
    }: {
        data: CreateTrainerTranslationType,
        createdById: number
    }) : Promise<GetTrainerTranslationDetailResType> {
        return this.prismaService.trainerTranslation.create({
            data: {
                ...data,
                createdById
            }
        }) 
    } 

    update({
        trainerTranslationId,
        data,
        updatedById
    }: {
        trainerTranslationId: number,
        data: UpdateTrainerTranslationType,
        updatedById: number
    }) : Promise<GetTrainerTranslationDetailResType> {
        return this.prismaService.trainerTranslation.update({
            where: {
                id: trainerTranslationId
            },
            data: {
                ...data,
                updatedById
            }
        }) as any
    }

    delete({
        trainerTranslationId,
        deletedById
    }: {
        trainerTranslationId: number,
        deletedById: number
    }, 
    isHard? : boolean ) : Promise<TrainerTranslationType> {
        return isHard ? 
            this.prismaService.trainerTranslation.delete({
                where: {
                    id: trainerTranslationId
                }
            }) : 
            this.prismaService.trainerTranslation.update({
                where: {
                    id: trainerTranslationId
                },
                data: {
                    deletedAt: new Date(),
                    deletedById
                }
            }) 
    }
}

