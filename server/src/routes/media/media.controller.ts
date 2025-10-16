import {  Body, Controller,  Get, MaxFileSizeValidator, NotFoundException, Param, ParseFilePipe, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import {  FilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import path from 'path';
import { UPLOAD_DIR } from 'src/shared/constants/other.const';
import { IsPublic } from 'src/shared/decorator/isPublic.decorator';
import { S3Service } from 'src/shared/services/s3.service';
import { MediaService } from './media.service';
import { ParseFilePipeWithUnlink } from './parse-file-pipe-with-unlink.pipe';
import { ZodSerializerDto } from 'nestjs-zod';
import { PresignUploadResSchema, UploadFilesResSchema,  } from './media.model';

@Controller('media')
export class MediaController {

    constructor(private readonly mediaService: MediaService) {}
    
    @Post('/images/upload')
    @ZodSerializerDto(UploadFilesResSchema)
    @UseInterceptors(
      FilesInterceptor('files' , 10, {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      }
    }))
    async uploadFile(@UploadedFiles( 
      new ParseFilePipeWithUnlink({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
        ]
      })
    ) files: Array<Express.Multer.File>) {

      return this.mediaService.uploadFile(files)
    
    }


    @Get('static/:filename') 
    @IsPublic()
    serveFile(@Param('filename') filename: string, @Res() res: Response) {
      return res.sendFile(path.resolve(UPLOAD_DIR, filename), error => {
        const notfound = new NotFoundException('File not found')
        res.status(404).send({
          message: notfound.message,
          path: 'filename',
          code: notfound.getStatus()
        })
      })
    }


    @Post('images/upload/presign-url')
    @IsPublic()
    @ZodSerializerDto(PresignUploadResSchema)
    async createPresignUrl(@Body() body: {fileName: string}) {
      return this.mediaService.getPresignUrl(body)
    }
}
