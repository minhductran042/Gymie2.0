import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repo';
import { GoogleService } from './google.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [AuthService,  AuthRepository, GoogleService],
  controllers: [AuthController]
})
export class AuthModule {}
