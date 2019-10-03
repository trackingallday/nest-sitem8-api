
import { Module } from '@nestjs/common';
import { AccessTokenController } from './accessToken.controller';
import { AccessTokenService } from './accessToken.service';
import { AccessTokenProvider } from './accessToken.provider';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AccessTokenController],
  providers: [
    AccessTokenService,
    ...AccessTokenProvider,
  ],
  exports: [AccessTokenService],
})
export class AccessTokenModule {}
