
import { Module } from '@nestjs/common';
import { TimesheetEntryController } from './timesheetEntry.controller';
import { TimesheetEntryService } from './timesheetEntry.service';
import { TimesheetEntryProvider } from './timesheetEntry.provider';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TimesheetEntryController],
  providers: [
    TimesheetEntryService,
    ...TimesheetEntryProvider,
  ],
})
export class TimesheetEntryModule {}
