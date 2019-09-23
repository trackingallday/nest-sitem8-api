
import { Module } from '@nestjs/common';
import { TimesheetController } from './timesheet.controller';
import { TimesheetService } from './timesheet.service';
import { TimesheetProvider } from './timesheet.provider';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TimesheetController],
  providers: [
    TimesheetService,
    ...TimesheetProvider,
  ],
})
export class TimesheetModule {}
