import { createZodDto } from "nestjs-zod";
import { CreateTrainerReviewBodySchema, CreateTrainerReviewResSchema, GetReviewsSchema, GetTrainerReviewDetailParamsSchema, GetTrainerReviewsParamsSchema, UpdateTrainerReviewBodySchema, UpdateTrainerReviewResSchema } from "./trainer-review.model";

export class CreateTrainerReviewBodyDTO extends createZodDto(CreateTrainerReviewBodySchema) {}

export class CreateTrainerReviewResDTO extends createZodDto(CreateTrainerReviewResSchema) {}

export class UpdateTrainerReviewBodyDTO extends createZodDto(UpdateTrainerReviewBodySchema) {}

export class UpdateTrainerReviewResDTO extends createZodDto(UpdateTrainerReviewResSchema) {}

export class GetTrainerReviewsParamsDTO extends createZodDto(GetTrainerReviewsParamsSchema) {}

export class GetTrainerReviewDetailParamsDTO extends createZodDto(GetTrainerReviewDetailParamsSchema) {}

export class GetReviewsResDTO extends createZodDto(GetReviewsSchema) {}
