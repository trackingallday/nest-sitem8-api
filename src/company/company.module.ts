
import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CompanyProvider } from './company.provider';
import { DatabaseModule } from '../db/database.module';
import { WorkerService } from '../worker/worker.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CompanyController],
  providers: [
    CompanyService,
    WorkerService,
    ...CompanyProvider,
  ],
})
export class CompanyModule {}
