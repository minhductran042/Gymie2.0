import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TrainerClientRepo } from './trainer-client.repo';
import { 
  RequestTrainerBodyType,
  UpdateRelationshipBodyType,
  GetMyTrainersQueryType,
  GetMyClientsQueryType,
} from './trainer-client.model'; 
import { TrainerClientStatus } from '@prisma/client';
import { PaymentStatusType } from 'src/shared/constants/payment.constant';

@Injectable()
export class TrainerClientService {
  constructor(private readonly trainerClientRepo: TrainerClientRepo) {}

  // ==================== CLIENT OPERATIONS ====================

  /**
   * Client requests a trainer
   */
  async requestTrainer(clientId: number, data: RequestTrainerBodyType) {
    // 1. Validate trainer exists
    const trainerExists = await this.trainerClientRepo.checkTrainerExists(data.trainerId);
    if (!trainerExists) {
      throw new NotFoundException('Trainer not found');
    }

    // 2. Check if relationship already exists
    const existingRelationship = await this.trainerClientRepo.findByTrainerAndClient(
      data.trainerId,
      clientId
    );

    if (existingRelationship) {
      throw new BadRequestException(
        `You already have a ${existingRelationship.status.toLowerCase()} relationship with this trainer`
      );
    }

    // 3. Create relationship
    const relationship = await this.trainerClientRepo.create({
      trainerId: data.trainerId,
      clientId,
      packageType: data.packageType,
      packagePrice: data.packagePrice,
      totalSessions: data.totalSessions,
      startDate: new Date(data.startDate),
      notes: data.notes,
      createdById: clientId,
    });

    return relationship;
  }

  /**
   * Get client's trainers
   */
  async getMyTrainers(clientId: number, query: GetMyTrainersQueryType) {
    return await this.trainerClientRepo.findMyTrainers({
      clientId,
      status: query.status,
      page: query.page,
      limit: query.limit,
    });
  }

  /**
   * Client cancels relationship
   */
  async cancelRelationship(relationshipId: number, clientId: number) {
    const relationship = await this.trainerClientRepo.findById(relationshipId);

    if (!relationship) {
      throw new NotFoundException('Relationship not found');
    }

    if (relationship.clientId !== clientId) {
      throw new ForbiddenException('You can only cancel your own relationships');
    }

    if (relationship.status === TrainerClientStatus.CANCELLED) {
      throw new BadRequestException('Relationship is already cancelled');
    }

    if (relationship.status === TrainerClientStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed relationship');
    }

    return await this.trainerClientRepo.cancelRelationship(relationshipId, clientId);
  }

  // ==================== TRAINER OPERATIONS ====================

  /**
   * Get trainer's clients
   */
  async getMyClients(trainerId: number, query: GetMyClientsQueryType) {
    return await this.trainerClientRepo.findMyClients({
      trainerId,
      status: query.status,
      page: query.page,
      limit: query.limit,
    });
  }

  /**
   * Trainer accepts client request
   */
  async acceptRequest(relationshipId: number, userId: number) {
    // Get trainer info
    const trainer = await this.trainerClientRepo.getTrainerByUserId(userId);
    if (!trainer) {
      throw new NotFoundException('Trainer profile not found');
    }

    const relationship = await this.trainerClientRepo.findById(relationshipId);

    if (!relationship) {
      throw new NotFoundException('Relationship request not found');
    }

    if (relationship.trainerId !== trainer.id) {
      throw new ForbiddenException('You can only accept requests for your own training services');
    }

    if (relationship.status !== TrainerClientStatus.PENDING) {
      throw new BadRequestException(`Cannot accept request with status: ${relationship.status}`);
    }

    return await this.trainerClientRepo.acceptRequest(relationshipId, userId);
  }

  /**
   * Trainer rejects client request
   */
  async rejectRequest(relationshipId: number, userId: number) {
    // Get trainer info
    const trainer = await this.trainerClientRepo.getTrainerByUserId(userId);
    if (!trainer) {
      throw new NotFoundException('Trainer profile not found');
    }

    const relationship = await this.trainerClientRepo.findById(relationshipId);

    if (!relationship) {
      throw new NotFoundException('Relationship request not found');
    }

    if (relationship.trainerId !== trainer.id) {
      throw new ForbiddenException('You can only reject requests for your own training services');
    }

    if (relationship.status !== TrainerClientStatus.PENDING) {
      throw new BadRequestException(`Cannot reject request with status: ${relationship.status}`);
    }

    return await this.trainerClientRepo.rejectRequest(relationshipId, userId);
  }

  /**
   * Update relationship details (trainer or client can update)
   */
  async updateRelationship(
    relationshipId: number,
    userId: number,
    data: UpdateRelationshipBodyType
  ) {
    const relationship = await this.trainerClientRepo.findById(relationshipId);

    if (!relationship) {
      throw new NotFoundException('Relationship not found');
    }

    // Check if user is trainer or client in this relationship
    const trainer = await this.trainerClientRepo.getTrainerByUserId(userId);
    const isTrainer = trainer && trainer.id === relationship.trainerId;
    const isClient = relationship.clientId === userId;

    if (!isTrainer && !isClient) {
      throw new ForbiddenException('You can only update relationships you are part of');
    }

    // Convert endDate string to Date if provided
    const updateData: any = { ...data };
    if (data.endDate) {
      updateData.endDate = new Date(data.endDate);
    }

    return await this.trainerClientRepo.update(relationshipId, {
      ...updateData,
      updatedById: userId,
    });
  }

  /**
   * Mark relationship as completed
   */
  async completeRelationship(relationshipId: number, userId: number) {
    const trainer = await this.trainerClientRepo.getTrainerByUserId(userId);
    if (!trainer) {
      throw new NotFoundException('Trainer profile not found');
    }

    const relationship = await this.trainerClientRepo.findById(relationshipId);

    if (!relationship) {
      throw new NotFoundException('Relationship not found');
    }

    if (relationship.trainerId !== trainer.id) {
      throw new ForbiddenException('Only the trainer can mark a relationship as completed');
    }

    if (relationship.status === TrainerClientStatus.COMPLETED) {
      throw new BadRequestException('Relationship is already completed');
    }

    return await this.trainerClientRepo.completeRelationship(relationshipId, userId);
  }

  // ==================== SHARED OPERATIONS ====================

  /**
   * Get relationship detail (accessible to both trainer and client)
   */
  async getRelationshipDetail(relationshipId: number, userId: number) {
    const relationship = await this.trainerClientRepo.findById(relationshipId);

    if (!relationship) {
      throw new NotFoundException('Relationship not found');
    }

    // Check if user is trainer or client
    const trainer = await this.trainerClientRepo.getTrainerByUserId(userId);
    const isTrainer = trainer && trainer.id === relationship.trainerId;
    const isClient = relationship.clientId === userId;

    if (!isTrainer && !isClient) {
      throw new ForbiddenException('You can only view relationships you are part of');
    }

    return relationship;
  }

  /**
   * Update payment status (can be called by both trainer and client)
   */
  async updatePaymentStatus(
    relationshipId: number,
    userId: number,
    paymentStatus: PaymentStatusType
  ) {
    const relationship = await this.trainerClientRepo.findById(relationshipId);

    if (!relationship) {
      throw new NotFoundException('Relationship not found');
    }

    // Check if user is trainer or client
    const trainer = await this.trainerClientRepo.getTrainerByUserId(userId);
    const isTrainer = trainer && trainer.id === relationship.trainerId;
    const isClient = relationship.clientId === userId;

    if (!isTrainer && !isClient) {
      throw new ForbiddenException('You can only update payment status for your own relationships');
    }

    return await this.trainerClientRepo.updatePaymentStatus(
      relationshipId,
      paymentStatus,
      userId
    );
  }
}
