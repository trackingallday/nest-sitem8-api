
import { Module } from '@nestjs/common';
import { LocationTimestampController } from './locationTimestamp.controller';
import { LocationTimestampService } from './locationTimestamp.service';
import { LocationTimestampProvider } from './locationTimestamp.provider';
import { DatabaseModule } from '../db/database.module';
import { WorkerModule } from '../worker/worker.module';
import { SiteModule } from '../site/site.module';
import { SiteAssignmentModule } from '../siteAssignment/siteAssignment.module';
import { DeviceModule } from '../device/device.module';

@Module({
  imports: [DatabaseModule, SiteModule, SiteAssignmentModule, DeviceModule, WorkerModule],
  controllers: [LocationTimestampController],
  providers: [
    LocationTimestampService,
    ...LocationTimestampProvider,
  ],
  exports: [LocationTimestampService],
})
export class LocationTimestampModule {}
