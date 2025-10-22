import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TrainerClientService } from './trainer-client.service';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  RequestTrainerBodyDTO,
  UpdateRelationshipBodyDTO,
  UpdateRelationshipParamsDTO,
  AcceptRequestParamsDTO,
  RejectRequestParamsDTO,
  CancelRelationshipParamsDTO,
  CompleteRelationshipParamsDTO,
  GetMyTrainersQueryDTO,
  GetMyClientsQueryDTO,
  GetRelationshipDetailParamsDTO,
  UpdatePaymentStatusBodyDTO,
  UpdatePaymentStatusParamsDTO,
  GetTrainerClientsResDTO,
  TrainerClientDetailResDTO,
} from './trainer-client.dto';
import { ActiveUser } from 'src/shared/decorator/active-user.decorator';
import type { AccessTokenPayload } from 'src/shared/types/jwt.type';


@Controller('trainer-client')
export class TrainerClientController {
  constructor(private readonly trainerClientService: TrainerClientService) {}


  @Post('request')
  @ZodSerializerDto(TrainerClientDetailResDTO)
  async requestTrainer(
    @ActiveUser() user: AccessTokenPayload,
    @Body() body: RequestTrainerBodyDTO
  ) {
    return await this.trainerClientService.requestTrainer(user.userId, body);
  }


  @Get('my-trainers')
  @ZodSerializerDto(GetTrainerClientsResDTO)
  async getMyTrainers(
    @ActiveUser() user: AccessTokenPayload,
    @Query() query: GetMyTrainersQueryDTO
  ) {
    return await this.trainerClientService.getMyTrainers(user.userId, query);
  }

  @Delete(':relationshipId/cancel')
  @ZodSerializerDto(TrainerClientDetailResDTO)
  async cancelRelationship(
    @ActiveUser() user: AccessTokenPayload,
    @Param() params: CancelRelationshipParamsDTO
  ) {
    return await this.trainerClientService.cancelRelationship(
      params.relationshipId,
      user.userId
    );
  }

 
  @Get('my-clients')
  @ZodSerializerDto(GetTrainerClientsResDTO)
  async getMyClients(
    @ActiveUser() user: AccessTokenPayload,
    @Query() query: GetMyClientsQueryDTO
  ) {
    return await this.trainerClientService.getMyClients(user.userId, query);
  }

  @Post(':relationshipId/accept')
  @ZodSerializerDto(TrainerClientDetailResDTO)
  async acceptRequest(
    @ActiveUser() user: AccessTokenPayload,
    @Param() params: AcceptRequestParamsDTO
  ) {
    return await this.trainerClientService.acceptRequest(
      params.relationshipId,
      user.userId
    );
  }

 
  @Post(':relationshipId/reject')
  @ZodSerializerDto(TrainerClientDetailResDTO)
  async rejectRequest(
    @ActiveUser() user: AccessTokenPayload,
    @Param() params: RejectRequestParamsDTO
  ) {
    return await this.trainerClientService.rejectRequest(
      params.relationshipId,
      user.userId
    );
  }


  @Post(':relationshipId/complete')
  @ZodSerializerDto(TrainerClientDetailResDTO)
  async completeRelationship(
    @ActiveUser() user: AccessTokenPayload,
    @Param() params: CompleteRelationshipParamsDTO
  ) {
    return await this.trainerClientService.completeRelationship(
      params.relationshipId,
      user.userId
    );
  }


  @Get(':relationshipId')
  @ZodSerializerDto(TrainerClientDetailResDTO)
  async getRelationshipDetail(
    @ActiveUser() user: AccessTokenPayload,
    @Param() params: GetRelationshipDetailParamsDTO
  ) {
    return await this.trainerClientService.getRelationshipDetail(
      params.relationshipId,
      user.userId
    );
  }


  @Patch(':relationshipId')
  @ZodSerializerDto(TrainerClientDetailResDTO)
  async updateRelationship(
    @ActiveUser() user: AccessTokenPayload,
    @Param() params: UpdateRelationshipParamsDTO,
    @Body() body: UpdateRelationshipBodyDTO
  ) {
    return await this.trainerClientService.updateRelationship(
      params.relationshipId,
      user.userId,
      body
    );
  }

  @Patch(':relationshipId/payment')
  @ZodSerializerDto(TrainerClientDetailResDTO)
  async updatePaymentStatus(
    @ActiveUser() user: AccessTokenPayload,
    @Param() params: UpdatePaymentStatusParamsDTO,
    @Body() body: UpdatePaymentStatusBodyDTO
  ) {
    return await this.trainerClientService.updatePaymentStatus(
      params.relationshipId,
      user.userId,
      body.paymentStatus
    );
  }
}
