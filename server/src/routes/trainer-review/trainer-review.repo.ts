import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { CreateTrainerReviewBodyType, GetTrainerReviewsType, UpdateTrainerReviewResType, UpdateTrainerReviewBodyType,  } from "./trainer-review.model";
import { isUniqueConstraintPrismaError } from "src/shared/helper";
import { PaginationQueryType } from "src/shared/models/request.model";

@Injectable()
export class TrainerReviewRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async list({
        trainerId,
        pagination
    }: {
        trainerId: number,
        pagination: PaginationQueryType
    }) : Promise<GetTrainerReviewsType> {
        const skip = (pagination.page - 1) * pagination.limit;
        const take = pagination.limit;

        const [totalItems, data] = await Promise.all([
            this.prismaService.trainerReview.count({
               where: {
                    trainerId,
               }
            }),
            this.prismaService.trainerReview.findMany({
                where: {
                    trainerId,
                },
                include: {
                    client: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true
                        }
                    },
                    medias: true
                },
                skip,
                take,
                orderBy: {
                    createdAt: 'desc'
                }
            })
        ]);
        const totalPages = Math.ceil(totalItems / pagination.limit);
        return {
            data,
            totalItems,
            page: pagination.page,
            limit: pagination.limit,
            totalPages
        }
    }
    
    // Phải là người tạo review thì mới được update
    private async validateUpdateReview({reviewId, clientId}: {reviewId: number, clientId: number}) {
        const review = await this.prismaService.trainerReview.findUnique({
            where: {
                id: reviewId,
                clientId: clientId
            }
        })

        if(!review) {
            throw new NotFoundException("Review not found or you are not the owner of this review");
        }

        return review 
    }

    async create({
        data,
        clientId
    }: {
        data: CreateTrainerReviewBodyType,
        clientId: number
    }) {
        const { content, medias, rating, trainerId } = data;
        
        return this.prismaService.$transaction(async (prisma) => {

            const review = await prisma.trainerReview.create({
                data: {
                    content,
                    rating,
                    trainerId,
                    clientId

                },
                include: {
                    client: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true
                        }
                    }
                }
            }).catch(error => {
                if (isUniqueConstraintPrismaError(error)) {
                    throw new Error("You have already reviewed this trainer");
                }
                throw error;
            })

            const reviewMedia = await prisma.reviewMedia.createManyAndReturn({
                data: medias.map(media => ({
                    url: media.url,
                    type: media.type,
                    reviewId: review.id
                }))
            })
            return {
                ...review,
                medias: reviewMedia
            } as any
        })
    }

    async update({
        reviewId,
        data,
        clientId
    }: {
        reviewId: number,
        data: UpdateTrainerReviewBodyType,
        clientId: number
    }) : Promise<UpdateTrainerReviewResType> {
        const { content, medias, rating, trainerId } = data;
        await this.validateUpdateReview({reviewId, clientId}); // Đảm bảo người update là người tạo review

        return this.prismaService.$transaction(async (prisma) => {
            const review = await prisma.trainerReview.update({
                where: {
                    id: reviewId
                },
                data: {
                    content,
                    rating,
                    trainerId,
                    clientId
                },
                include: {
                    client: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true
                        }
                    }
                }
            })

            await prisma.reviewMedia.deleteMany({
                where: {
                    reviewId: reviewId
                }
            })

            const reviewMedia = await prisma.reviewMedia.createManyAndReturn({
                data: medias.map(media => ({
                    url: media.url,
                    type: media.type,
                    reviewId: review.id
                }))
            })

            return {
                ...review,
                medias: reviewMedia
            } as any
        })
    }
        
} 