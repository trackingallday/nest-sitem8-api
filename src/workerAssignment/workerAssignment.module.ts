
import { Module } from '@nestjs/common';
import { WorkerAssignmentController } from './workerAssignment.controller';
import { WorkerAssignmentService } from './workerAssignment.service';
import { WorkerAssignmentProvider } from './workerAssignment.provider';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WorkerAssignmentController],
  providers: [
    WorkerAssignmentService,
    ...WorkerAssignmentProvider,
  ],
  exports: [WorkerAssignmentService],
})
export class WorkerAssignmentModule {}
