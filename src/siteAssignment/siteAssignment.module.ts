
import { Module } from '@nestjs/common';
import { SiteAssignmentController } from './siteAssignment.controller';
import { SiteAssignmentService } from './siteAssignment.service';
import { SiteAssignmentProvider } from './siteAssignment.provider';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SiteAssignmentController],
  providers: [
    SiteAssignmentService,
    ...SiteAssignmentProvider,
  ],
  exports: [SiteAssignmentService],
})
export class SiteAssignmentModule {}
