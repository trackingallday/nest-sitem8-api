
import { Module } from '@nestjs/common';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';
import { WorkerProvider } from './worker.provider';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WorkerController],
  providers: [
    WorkerService,
    ...WorkerProvider,
  ],
  exports: [WorkerService]
})
export class WorkerModule {}
