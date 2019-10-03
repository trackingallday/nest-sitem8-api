
import { Module } from '@nestjs/common';
import { AccessTokenController } from './accessToken.controller';
import { AccessTokenService } from './accessToken.service';
import { AccessTokenProvider } from './accessToken.provider';
import { WorkerModule } from '../worker/worker.module';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule, WorkerModule],
  controllers: [AccessTokenController],
  providers: [
    AccessTokenService,
    ...AccessTokenProvider,
  ],
  exports: [AccessTokenService],
})
export class AccessTokenModule {}
