
import { Module } from '@nestjs/common';
import { TimesheetController } from './timesheet.controller';
import { TimesheetService } from './timesheet.service';
import { TimesheetEntryModule } from '../timesheetEntry/timesheetEntry.module';
import { TimesheetProvider } from './timesheet.provider';
import { DatabaseModule } from '../db/database.module';
import { LocationTimestampModule } from '../locationTimestamp/locationTimestamp.module';
import { WorkerModule } from '../worker/worker.module';
import { SiteModule } from '../site/site.module';

@Module({
  imports: [DatabaseModule, WorkerModule, SiteModule, TimesheetEntryModule, LocationTimestampModule],
  controllers: [TimesheetController],
  providers: [
    ...TimesheetProvider,
    TimesheetService,
  ],
  exports: [TimesheetService],
})
export class TimesheetModule {}
