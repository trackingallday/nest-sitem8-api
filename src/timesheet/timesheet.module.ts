
import { Module } from '@nestjs/common';
import { TimesheetController } from './timesheet.controller';
import { TimesheetService } from './timesheet.service';
import { TimesheetProvider } from './timesheet.provider';
import { DatabaseModule } from '../db/database.module';
import { AccessTokenService } from '../accessToken/accessToken.service';
import { WorkerService } from '../worker/worker.service';
import { SiteService } from '../site/site.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TimesheetController],
  providers: [
    TimesheetService,
    AccessTokenService,
    WorkerService,
    SiteService,

    ...TimesheetProvider,
  ],
})
export class TimesheetModule {}
