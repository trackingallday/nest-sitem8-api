
import { Module } from '@nestjs/common';
import { AccessTokenController } from './accessToken.controller';
import { AccessTokenService } from './accessToken.service';
import { WorkerService } from '../worker/worker.service';

import { AccessTokenProvider } from './accessToken.provider';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AccessTokenController],
  providers: [
    AccessTokenService,
    WorkerService,
    ...AccessTokenProvider,
  ],
})
export class AccessTokenModule {}
