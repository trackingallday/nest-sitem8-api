import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthenticationMiddleware } from './common/authentication.middleware';
import { DbUserMiddleware } from './common/dbuser.middlware';
import { AppController } from './app.controller';
import { WorkerService } from './worker/worker.service';
import { AppService } from './app.service';
import { ItemsModule } from './items/items.module';
import { SiteModule } from './site/site.module';
import { TimesheetModule } from './timesheet/timesheet.module';
import { TimesheetEntryModule } from './timesheetEntry/timesheetEntry.module';
import { WorkerModule } from './worker/worker.module';
import { WorkerAssignmentModule } from './workerAssignment/workerAssignment.module';
import { SiteAssignmentModule } from './siteAssignment/siteAssignment.module';
import { LocationTimestampModule } from './locationTimestamp/locationTimestamp.module';
import { WorkerController } from './worker/worker.controller';
import { ItemsController } from './items/items.controller';
import { TimesheetController } from './timesheet/timesheet.controller';
import { CompanyController } from './company/company.controller';
import { WorkerAssignmentController } from './workerAssignment/workerAssignment.controller';



@Module({
  imports: [
    ItemsModule, SiteModule, TimesheetEntryModule,
    TimesheetModule, WorkerAssignmentModule,
    WorkerModule, SiteAssignmentModule,
    LocationTimestampModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware, DbUserMiddleware)
      .exclude({ path: '/', method: RequestMethod.ALL })
      .forRoutes(WorkerController, ItemsController)
  }

}
