import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { CreateTrainerBodyType, GetTrainersResType, TrainerDetailResType } from "./trainer.model";
import { ALL_LANGUAGE_CODE } from "src/shared/constants/other.const";
import { TrainerType } from "src/shared/models/shared-trainer.model";

@Injectable()
export class TrainerRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async list(
    {
        page,
        limit,
        languageId,
        isAvailable,
        minHourlyRate,
        maxHourlyRate,
        minExperienceYears,
        maxExperienceYears
    }: {
        page: number,
        limit: number,
        languageId: string,
        isAvailable?: boolean,
        minHourlyRate?: number,
        maxHourlyRate?: number,
        minExperienceYears?: number,
        maxExperienceYears?: number
    }
    ) : Promise<GetTrainersResType>  {
        const skip = (page - 1) * limit;
        const take = limit;

        let where: any = {
            deletedAt: null
        }

        if (isAvailable !== undefined) {
            where.isAvailable = isAvailable
        }

        if (minHourlyRate !== undefined) {
            where.hourlyRate = {
                ...where.hourlyRate,
                gte: minHourlyRate
            }
        }

        if (maxHourlyRate !== undefined) {
            where.hourlyRate = {
                ...where.hourlyRate,
                lte: maxHourlyRate
            }
        }

        if (minExperienceYears !== undefined) {
            where.experienceYears = {
                ...where.experienceYears,
                gte: minExperienceYears
            }
        }

        if (maxExperienceYears !== undefined) {
            where.experienceYears = {
                ...where.experienceYears,
                lte: maxExperienceYears
            }
        }

        const [totalItems, data] = await Promise.all([
            this.prismaService.trainer.count({ where }),
            this.prismaService.trainer.findMany({
                where,
                include: {
                    trainerTranslations: {
                        where: languageId === ALL_LANGUAGE_CODE ? {deletedAt: null} : {languageId, deletedAt: null},
                    }
                },
                skip,
                take,
                orderBy: {
                    createdAt: 'desc'
                }
            })
        ])


        const totalPages = Math.ceil(totalItems / limit);
        return {
            data,
            totalItems,
            page,
            limit,
            totalPages
        }
    }

    async getDetail(trainerId: number, languageId: string) : Promise<TrainerDetailResType | null> {
        const trainer = await this.prismaService.trainer.findUnique({
            where: {
                id: trainerId,
                deletedAt: null
            },
            include: {
                trainerTranslations: {
                    where: languageId === ALL_LANGUAGE_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
                },
                user: {
                    select: {
                        id: true,

                        email: true,
                        name: true,
                        avatar: true,
                        phoneNumber: true,
                    }   
                },
            }
        })
        return trainer
    }


    async create({
        data,
        createdById,
        userId,
    }: {
        data: Omit<CreateTrainerBodyType, 'userId'>,
        createdById: number,
        userId: number
    }) : Promise<TrainerDetailResType> {
        const trainer = await this.prismaService.trainer.create({
            data: {
                ...data,
                createdById,
                userId
            },
            include: {
                trainerTranslations: {
                    where: {
                        deletedAt: null
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        avatar: true,
                        phoneNumber: true,
                    }
                }
            }
        })

        return trainer
    }

    // Update by trainer themselves (profile update)
    async update({
        userId,
        data,
        trainerId,
        updatedById
    }: {
        userId: number,
        data: CreateTrainerBodyType,
        trainerId: number,
        updatedById: number
    }) : Promise<TrainerDetailResType> {
        const trainer = await this.prismaService.trainer.update({
            where: {
                id: trainerId,
                userId,
                deletedAt: null
            },
            data: {
                ...data,
                updatedById
            },
            include: {
                trainerTranslations: {
                    where: {
                        deletedAt: null
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        avatar: true,
                        phoneNumber: true,
                    }
                },
            }
        })
        return trainer
    }

    // Update by admin (can update any trainer)
    async updateByAdmin({
        data,
        trainerId,
        updatedById
    }: {
        data: Omit<CreateTrainerBodyType, 'userId'>,
        trainerId: number,
        updatedById: number
    }) : Promise<TrainerDetailResType> {
        const trainer = await this.prismaService.trainer.update({
            where: {
                id: trainerId,
                deletedAt: null
            },
            data: {
                ...data,
                updatedById
            },
            include: {
                trainerTranslations: {
                    where: {
                        deletedAt: null
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        avatar: true,
                        phoneNumber: true,
                    }
                },
            }
        })
        return trainer
    }

    delete({
        trainerId,
        deletedById
    }: {
        trainerId: number,
        deletedById: number
    }, isHard? : boolean
    ) : Promise<TrainerType> {
        return isHard ? 
        this.prismaService.trainer.delete({
            where: {
                id: trainerId
            }
        }) : 
        this.prismaService.trainer.update({
            where: {
                id: trainerId
            },
            data: {
                deletedAt: new Date(),
                deletedById
            }
        })
    }
}