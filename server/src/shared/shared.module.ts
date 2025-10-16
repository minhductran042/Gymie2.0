import { Global, Module } from "@nestjs/common";
import { TwoFactorAuthService } from "./services/2fa.service";
import { EmailService } from "./services/email.service";
import { HashingService } from "./services/hashing.service";
import { PrismaService } from "./services/prisma.service";
import { TokenService } from "./services/token.service";
import { AccessTokenGuard } from "./guards/access-token.guard";
import { ApiKeyGuard } from "./guards/api-key.guard";
import { APP_GUARD } from "@nestjs/core";
import { AuthenticationGuard } from "./guards/authentication.guard";
import { JwtModule } from "@nestjs/jwt";
import { ShareUserRepository } from "./repository/share-user.repo";
import { ShareRoleRepository } from "./repository/share-role.repo";
import { S3Service } from "./services/s3.service";


const sharedServices = [
    PrismaService, 
    HashingService, 
    TokenService, 
    ShareUserRepository, 
    EmailService, 
    TwoFactorAuthService,
    ShareRoleRepository,
    S3Service
];

@Global()
@Module({
    providers: [...sharedServices, AccessTokenGuard, ApiKeyGuard, {
        provide: APP_GUARD,
        useClass: AuthenticationGuard
    }],
    exports: sharedServices, 
    imports: [JwtModule]
})
export class SharedModule {

}
