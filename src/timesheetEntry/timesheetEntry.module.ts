
import { Module } from '@nestjs/common';
import { TimesheetEntryController } from './timesheetEntry.controller';
import { TimesheetEntryService } from './timesheetEntry.service';
import { TimesheetEntryProvider } from './timesheetEntry.provider';
import { DatabaseModule } from '../db/database.module';
import { WorkerModule } from '../worker/worker.module';

@Module({
  imports: [DatabaseModule, WorkerModule],
  controllers: [TimesheetEntryController],
  providers: [
    TimesheetEntryService,
    ...TimesheetEntryProvider,
  ],
  exports:[TimesheetEntryService],
})
export class TimesheetEntryModule {}
