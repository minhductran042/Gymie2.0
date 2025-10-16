import {z} from 'zod'

export const PresignedUploadFileBodySchema = z.object({
    fileName: z.string(),
    fileSize: z.number()
})

export const UploadFilesResSchema = z.object({
    data: z.array(z.object({
        url: z.string()
    }))
})

export const PresignUploadResSchema = z.object({    
    presignedUrl: z.string(),
    url: z.string()
})

export type PresignUploadFileBodyType = z.infer<typeof PresignedUploadFileBodySchema>
export type UploadFilesResType = z.infer<typeof UploadFilesResSchema>
export type PresignUploadResType = z.infer<typeof PresignUploadResSchema>