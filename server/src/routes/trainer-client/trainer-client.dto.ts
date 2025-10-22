import { createZodDto } from 'nestjs-zod';
import {
  RequestTrainerBodySchema,
  UpdateRelationshipBodySchema,
  UpdateRelationshipParamsSchema,
  AcceptRequestParamsSchema,
  RejectRequestParamsSchema,
  CancelRelationshipParamsSchema,
  CompleteRelationshipParamsSchema,
  GetMyTrainersQuerySchema,
  GetMyClientsQuerySchema,
  GetRelationshipDetailParamsSchema,
  UpdatePaymentStatusBodySchema,
  UpdatePaymentStatusParamsSchema,
  GetTrainerClientsResSchema,
  TrainerClientDetailResSchema,
} from './trainer-client.model';

// Request DTOs
export class RequestTrainerBodyDTO extends createZodDto(RequestTrainerBodySchema) {}
export class UpdateRelationshipBodyDTO extends createZodDto(UpdateRelationshipBodySchema) {}
export class UpdatePaymentStatusBodyDTO extends createZodDto(UpdatePaymentStatusBodySchema) {}

// Param DTOs
export class UpdateRelationshipParamsDTO extends createZodDto(UpdateRelationshipParamsSchema) {}
export class AcceptRequestParamsDTO extends createZodDto(AcceptRequestParamsSchema) {}
export class RejectRequestParamsDTO extends createZodDto(RejectRequestParamsSchema) {}
export class CancelRelationshipParamsDTO extends createZodDto(CancelRelationshipParamsSchema) {}
export class CompleteRelationshipParamsDTO extends createZodDto(CompleteRelationshipParamsSchema) {}
export class GetRelationshipDetailParamsDTO extends createZodDto(GetRelationshipDetailParamsSchema) {}
export class UpdatePaymentStatusParamsDTO extends createZodDto(UpdatePaymentStatusParamsSchema) {}

// Query DTOs
export class GetMyTrainersQueryDTO extends createZodDto(GetMyTrainersQuerySchema) {}
export class GetMyClientsQueryDTO extends createZodDto(GetMyClientsQuerySchema) {}

// Response DTOs
export class GetTrainerClientsResDTO extends createZodDto(GetTrainerClientsResSchema) {}
export class TrainerClientDetailResDTO extends createZodDto(TrainerClientDetailResSchema) {}
