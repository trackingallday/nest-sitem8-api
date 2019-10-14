
import { Module } from '@nestjs/common';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';
import { SiteProvider } from './site.provider';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SiteController],
  providers: [
    SiteService,
    ...SiteProvider,
  ],
  exports: [SiteService],
})
export class SiteModule {}
