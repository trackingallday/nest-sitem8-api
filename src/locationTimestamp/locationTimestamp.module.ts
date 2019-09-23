
import { Module } from '@nestjs/common';
import { LocationTimestampController } from './locationTimestamp.controller';
import { LocationTimestampService } from './locationTimestamp.service';
import { LocationTimestampProvider } from './locationTimestamp.provider';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LocationTimestampController],
  providers: [
    LocationTimestampService,
    ...LocationTimestampProvider,
  ],
})
export class LocationTimestampModule {}
