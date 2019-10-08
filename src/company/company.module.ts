
import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CompanyProvider } from './company.provider';
import { DatabaseModule } from '../db/database.module';
import { WorkerModule } from '../worker/worker.module';
import { AccessTokenModule } from '../accessToken/accessToken.module';

@Module({
  imports: [DatabaseModule, AccessTokenModule, WorkerModule],
  controllers: [CompanyController],
  providers: [
    CompanyService,
    ...CompanyProvider,
  ],
})
export class CompanyModule {}
