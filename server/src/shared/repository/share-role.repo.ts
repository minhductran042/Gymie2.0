import { Injectable } from '@nestjs/common';
import { RoleName } from 'src/shared/constants/role.constant';
import { PrismaService } from 'src/shared/services/prisma.service';
import { RoleType } from '../models/shared-role.model';
import { Prisma } from '@prisma/client';


@Injectable()
export class ShareRoleRepository {
    private clientRoleId: number | null = null;
    private adminRoleId: number | null = null;
    private trainerRoleId: number | null = null;

    constructor(private readonly prismaService: PrismaService) {}

    private async getRole(roleName : string) {
        const [role] = await this.prismaService.$queryRaw<Array<RoleType>>(Prisma.sql`
            SELECT *
            FROM "Role"
            WHERE "name" = ${roleName} AND "deletedAt" IS NULL
            LIMIT 1
        `)

        if(!role) {
            throw new Error(`Role ${roleName} not found`);
        }

        return role
    }

    async getClientRoleId() {
        if(this.clientRoleId) {
            return this.clientRoleId;
        }

        const role = await this.getRole(RoleName.CLIENT)

        this.clientRoleId = role.id;
        return role.id;
    }

    
    async getAdminRoleId() {
        if(this.adminRoleId) {
            return this.adminRoleId;
        }

        const role = await this.getRole(RoleName.ADMIN)

        this.adminRoleId = role.id;
        return role.id;
    }

    async getTrainerRoleId() {
        if(this.trainerRoleId) {
            return this.trainerRoleId;
        }
        const role = await this.getRole(RoleName.TRAINER)

        this.trainerRoleId = role.id;
        return role.id;
    }
    
}
