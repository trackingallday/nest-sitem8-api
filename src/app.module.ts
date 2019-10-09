import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthenticationMiddleware } from './common/authentication.middleware';
import { DbUserMiddleware } from './common/dbuser.middlware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessTokenModule } from './accessToken/accessToken.module';
import { CompanyModule } from './company/company.module';
import { ItemsModule } from './items/items.module';
import { SiteModule } from './site/site.module';
import { TimesheetModule } from './timesheet/timesheet.module';
import { TimesheetEntryModule } from './timesheetEntry/timesheetEntry.module';
import { TimesheetNoteModule } from './timesheetNote/timesheetNote.module';
import { WorkerModule } from './worker/worker.module';
import { WorkerAssignmentModule } from './workerAssignment/workerAssignment.module';
import { SiteAssignmentModule } from './siteAssignment/siteAssignment.module';
import { LocationTimestampModule } from './locationTimestamp/locationTimestamp.module';
import { LocationEventModule } from './locationEvent/locationEvent.module';
import { DeviceModule } from './device/device.module';
import { NotificationModule } from './notification/notification.module';
import { DatabaseModule } from './db/database.module';
import { WorkerController } from './worker/worker.controller';
import { ItemsController } from './items/items.controller';


@Module({
  imports: [
    CompanyModule,
    ItemsModule,
    SiteModule,
    TimesheetEntryModule,
    WorkerModule,
    AccessTokenModule,
    DatabaseModule,
    TimesheetModule,
    WorkerAssignmentModule,
    SiteAssignmentModule,
    LocationTimestampModule,
    NotificationModule,
    TimesheetNoteModule,
    DeviceModule,
    LocationEventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

 public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware, DbUserMiddleware)
      .exclude({ path: '/', method: RequestMethod.ALL })
      .forRoutes(WorkerController, ItemsController);
  }

}
