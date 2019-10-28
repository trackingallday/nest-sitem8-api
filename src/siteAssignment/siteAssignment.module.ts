
import { Module } from '@nestjs/common';
import { SiteAssignmentController } from './siteAssignment.controller';
import { SiteAssignmentService } from './siteAssignment.service';
import { DayOfWeekTimeSettingService } from '../dayOfWeekTimeSetting/dayOfWeekTimeSetting.service';
import { WorkerAssignmentService } from '../workerAssignment/workerAssignment.service';
import { NotificationService } from '../notification/notification.service';
import { SiteAssignmentProvider } from './siteAssignment.provider';
import { DatabaseModule } from '../db/database.module';
import { DayOfWeekTimeSettingModule } from '../dayOfWeekTimeSetting/dayOfWeekTimeSetting.module';
import { NotificationModule } from '../notification/notification.module';
import { WorkerAssignmentModule } from '../workerAssignment/workerAssignment.module';
import { SiteModule } from '../site/site.module';

@Module({
  imports: [DatabaseModule, DayOfWeekTimeSettingModule, WorkerAssignmentModule, NotificationModule, SiteModule],
  controllers: [SiteAssignmentController],
  providers: [
    ...SiteAssignmentProvider,
    SiteAssignmentService,
  ],
  exports: [SiteAssignmentService],
})
export class SiteAssignmentModule {}
