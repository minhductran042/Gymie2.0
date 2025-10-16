import { createZodDto } from 'nestjs-zod'
import { PresignedUploadFileBodySchema, UploadFilesResSchema } from './media.model';


export class PresignedUploadFileBodyDTO extends createZodDto(PresignedUploadFileBodySchema) {}

export class UploadFilesResDTO extends createZodDto(UploadFilesResSchema) {}

export class PresignedUploadFileResDTO extends createZodDto(PresignedUploadFileBodySchema) {}
