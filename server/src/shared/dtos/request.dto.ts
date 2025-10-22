import { createZodDto } from "nestjs-zod";
import { EmptyBodySchema, PaginationQuerySchema } from "../models/request.model";
import z from "zod";

export class EmptyBodyDTO extends createZodDto(EmptyBodySchema) {}

export class PaginationQueryDTO extends createZodDto(PaginationQuerySchema) {}