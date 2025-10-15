import { Injectable } from '@nestjs/common';
import { PermissionRepository } from './permission.repo';
import { CreatePermissionBodyType, GetPermissionQueryType, GetPermissionsResType } from './permission.model';
import { isUniqueConstraintPrismaError } from 'src/shared/helper';
import { PermissionHasAlreadyExistsError } from './permission.error';
import { NotFoundRecordException } from 'src/shared/error';

@Injectable()
export class PermissionService {
    constructor(private readonly permissionRepo: PermissionRepository) {}

    async list(pagination: GetPermissionQueryType) {
        const data = await this.permissionRepo.list(pagination)
        return data
    }

    async findById(permissionId: number) {
        try {
            const permission = await this.permissionRepo.findById(permissionId)
            if(!permission) {
                throw NotFoundRecordException
            }
            return permission
        } catch (error) {
            if(isUniqueConstraintPrismaError(error)) {
                throw PermissionHasAlreadyExistsError
            } 
            throw error
        }
    }

    async create({data, createdById}: {data: CreatePermissionBodyType, createdById: number}) {
        try {
            return await this.permissionRepo.create(
               {
                 data, 
                 createdById
               }
            )
        } catch (error) {
            
            if(isUniqueConstraintPrismaError(error)) {
                throw PermissionHasAlreadyExistsError
            }
            throw error
        }
    }

    async update({permissionId, data, updatedById} : {permissionId: number, data: CreatePermissionBodyType, updatedById: number}) {
        try {

            const permission = await this.permissionRepo.findById(permissionId)
            if(!permission) {
                throw NotFoundRecordException
            }
            
            return await this.permissionRepo.update({
                permissionId,
                data,
                updatedById
            })
        } catch (error) {
            if(isUniqueConstraintPrismaError(error)) {
                throw PermissionHasAlreadyExistsError
            }
            throw error
        }
    }

    async delete(permissionId: number) {
        try {

            const permission = await this.permissionRepo.findById(permissionId)
            if(!permission) {
                throw NotFoundRecordException
            }

            await this.permissionRepo.delete(permissionId)
            return {
                message: 'Delete permission successfully'
            }
        } catch (error) {
             if(isUniqueConstraintPrismaError(error)) {
                throw PermissionHasAlreadyExistsError
            }
            throw error
        }
    }

}
