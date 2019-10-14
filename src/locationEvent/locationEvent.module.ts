
import { Module } from '@nestjs/common';
import { LocationEventController } from './locationEvent.controller';
import { LocationEventService } from './locationEvent.service';
import { LocationEventProvider } from './locationEvent.provider';
import { DatabaseModule } from '../db/database.module';
import { WorkerModule } from '../worker/worker.module';
import { SiteModule } from '../site/site.module';
import { SiteAssignmentModule } from '../siteAssignment/siteAssignment.module';
import { LocationTimestampModule } from '../locationTimestamp/locationTimestamp.module';
import { CompanyModule } from '../company/company.module';
import { DeviceModule } from '../device/device.module';

@Module({
  imports: [DatabaseModule], //, SiteModule, SiteAssignmentModule, DeviceModule, WorkerModule, ],
  controllers: [LocationEventController],
  providers: [
    LocationEventService,
    ...LocationEventProvider,
  ],
  exports: [LocationEventService],
})
export class LocationEventModule {}
