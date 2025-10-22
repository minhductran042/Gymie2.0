import { Module } from '@nestjs/common';
import { TrainerClientController } from './trainer-client.controller';
import { TrainerClientService } from './trainer-client.service';
import { TrainerClientRepo } from './trainer-client.repo';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [TrainerClientController],
  providers: [TrainerClientService, TrainerClientRepo],
  exports: [TrainerClientService, TrainerClientRepo],
})
export class TrainerClientModule {}
