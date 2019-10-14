
import { Module } from '@nestjs/common';
import { TimesheetController } from './timesheet.controller';
import { TimesheetService } from './timesheet.service';
import { TimesheetProvider } from './timesheet.provider';
import { DatabaseModule } from '../db/database.module';
import { AccessTokenModule } from '../accessToken/accessToken.module';
import { WorkerModule } from '../worker/worker.module';
import { SiteModule } from '../site/site.module';
import { AccessTokenService } from '../accessToken/accessToken.service';
import { WorkerService } from '../worker/worker.service';
import { SiteService } from '../site/site.service';

@Module({
  imports: [DatabaseModule, AccessTokenModule, WorkerModule, SiteModule],
  controllers: [TimesheetController],
  providers: [
    ...TimesheetProvider,
    TimesheetService,
  ],
})
export class TimesheetModule {}
