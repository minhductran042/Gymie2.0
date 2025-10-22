import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { Prisma, TrainerClientStatus, PaymentStatus, Trainer } from '@prisma/client';
import { TrainerClientDetailResType, GetTrainerClientsResType } from './trainer-client.model';

@Injectable()
export class TrainerClientRepo {
  constructor(private readonly prisma: PrismaService) {}


  async create(data: {
    trainerId: number;
    clientId: number;
    packageType: string;
    packagePrice: number;
    totalSessions: number;
    startDate: Date;
    notes?: string;
    createdById?: number;
  }) : Promise<TrainerClientDetailResType>  {
    return await this.prisma.trainerClient.create({
      data: {
        trainerId: data.trainerId,
        clientId: data.clientId,
        packageType: data.packageType,
        packagePrice: data.packagePrice,
        totalSessions: data.totalSessions,
        startDate: data.startDate,
        notes: data.notes,
        status: TrainerClientStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        sessionCount: 0,
        createdById: data.createdById,
      },
      include: {
        trainer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                phoneNumber: true,
              },
            },
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phoneNumber: true,
          },
        },
      },
    });
  }

  // ==================== READ ====================

  async findById(id: number): Promise<TrainerClientDetailResType | null> {
    return await this.prisma.trainerClient.findUnique({
      where: { id, deletedAt: null },
      include: {
        trainer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                phoneNumber: true,
              },
            },
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phoneNumber: true,
          },
        },
      },
    });
  }

  async findByTrainerAndClient(trainerId: number, clientId: number): Promise<TrainerClientDetailResType | null> {
    return await this.prisma.trainerClient.findUnique({
      where: {
        trainerId_clientId: { trainerId, clientId },
        deletedAt: null,
      },
      include: {
        trainer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                phoneNumber: true,
              },
            },
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phoneNumber: true,
          },
        },
      },
    });
  }

  // Lấy tất cả khách hàng của một huấn luyện viên (góc nhìn của huấn luyện viên)
  async findMyClients(params: {
    trainerId: number;
    status?: TrainerClientStatus;
    page: number;
    limit: number;
  }): Promise<GetTrainerClientsResType> {
    const { trainerId, status, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.TrainerClientWhereInput = {
      trainerId,
      deletedAt: null,
      ...(status && { status }),
    };

    const [data, totalItems] = await Promise.all([
      this.prisma.trainerClient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          trainer: {
            select: {
              id: true,
              userId: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
              hourlyRate: true,
              specialties: true,
            },
          },
          client: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      }),
      this.prisma.trainerClient.count({ where }),
    ]);

    return {
      data,
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
    };
  }

  // LẤy tất cả huấn luyện viên của một khách hàng (góc nhìn của khách hàng)
  async findMyTrainers(params: {
    clientId: number;
    status?: TrainerClientStatus;
    page: number;
    limit: number;
  }): Promise<GetTrainerClientsResType> {
    const { clientId, status, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.TrainerClientWhereInput = {
      clientId,
      deletedAt: null,
      ...(status && { status }),
    };

    const [data, totalItems] = await Promise.all([
      this.prisma.trainerClient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          trainer: {
            select: {
              id: true,
              userId: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
              hourlyRate: true,
              specialties: true,
            },
          },
          client: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      }),
      this.prisma.trainerClient.count({ where }),
    ]);

    return {
      data,
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
    };
  }


  async update(
    id: number,
    data: {
      packageType?: string;
      packagePrice?: number;
      totalSessions?: number;
      endDate?: Date;
      notes?: string;
      updatedById?: number;
    }
  ): Promise<TrainerClientDetailResType> {
    return await this.prisma.trainerClient.update({
      where: { id },
      data: {
        ...data,
        updatedById: data.updatedById,
      },
      include: {
        trainer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                phoneNumber: true,
              },
            },
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phoneNumber: true,
          },
        },
      },
    });
  }

  // ==================== STATUS CHANGES ====================

  async acceptRequest(id: number, updatedById?: number): Promise<TrainerClientDetailResType> {
    return await this.prisma.trainerClient.update({
      where: { id },
      data: {
        status: TrainerClientStatus.ACTIVE,
        updatedById,
      },
      include: {
        trainer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                phoneNumber: true,
              },
            },
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phoneNumber: true,
          },
        },
      },
    });
  }

  async rejectRequest(id: number, updatedById?: number): Promise<TrainerClientDetailResType> {
    return await this.prisma.trainerClient.update({
      where: { id },
      data: {
        status: TrainerClientStatus.CANCELLED,
        updatedById,
      },
      include: {
        trainer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                phoneNumber: true,
              },
            },
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phoneNumber: true,
          },
        },
      },
    });
  }

  async cancelRelationship(id: number, updatedById?: number): Promise<TrainerClientDetailResType> {
    return await this.prisma.trainerClient.update({
      where: { id },
      data: {
        status: TrainerClientStatus.CANCELLED,
        endDate: new Date(),
        updatedById,
      },
      include: {
        trainer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                phoneNumber: true,
              },
            },
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phoneNumber: true,
          },
        },
      },
    });
  }

  async completeRelationship(id: number, updatedById?: number): Promise<TrainerClientDetailResType> {
    return await this.prisma.trainerClient.update({
      where: { id },
      data: {
        status: TrainerClientStatus.COMPLETED,
        endDate: new Date(),
        updatedById,
      },
      include: {
        trainer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                phoneNumber: true,
              },
            },
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phoneNumber: true,
          },
        },
      },
    });
  }

  async updatePaymentStatus(
    id: number,
    paymentStatus: PaymentStatus,
    updatedById?: number
  ): Promise<TrainerClientDetailResType> {
    return await this.prisma.trainerClient.update({
      where: { id },
      data: {
        paymentStatus,
        updatedById,
      },
      include: {
        trainer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                phoneNumber: true,
              },
            },
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phoneNumber: true,
          },
        },
      },
    });
  }

  // ==================== DELETE (SOFT) ====================

  async softDelete(id: number, deletedById?: number): Promise<TrainerClientDetailResType> {
    return await this.prisma.trainerClient.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedById,
      },
      include: {
        trainer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                phoneNumber: true,
              },
            },
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phoneNumber: true,
          },
        },
      },
    });
  }

  // ==================== HELPERS ====================

  async checkTrainerExists(trainerId: number): Promise<boolean> {
    const trainer = await this.prisma.trainer.findUnique({
      where: { id: trainerId, deletedAt: null },
    });
    return !!trainer;
  }

  async checkUserExists(userId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
    });
    return !!user;
  }

  async getTrainerByUserId(userId: number): Promise<Trainer | null> {
    return await this.prisma.trainer.findUnique({
      where: { userId, deletedAt: null },
    });
  }
}
