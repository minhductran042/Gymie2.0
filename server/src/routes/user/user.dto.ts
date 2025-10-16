import { createZodDto } from "nestjs-zod";
import { CreateUserBodySchema, GetUserParamsSchema, GetUserQuerySchema, GetUsersResSchema, UpdateUserBodySchema } from "./user.model";
import {  UpdateProfileResDTO } from "src/shared/dtos/share-user.dto";

export class GetUsersResDTO extends createZodDto(GetUsersResSchema) {}
export class GetUserQueryDTO extends createZodDto(GetUserQuerySchema) {}
export class GetUserParamsDTO extends createZodDto(GetUserParamsSchema) {}
export class CreateUserBodyDTO extends createZodDto(CreateUserBodySchema) {}
export class UpdateUserBodyDTO extends createZodDto(UpdateUserBodySchema) {}
export class CreateUserResDTO extends UpdateProfileResDTO {}

