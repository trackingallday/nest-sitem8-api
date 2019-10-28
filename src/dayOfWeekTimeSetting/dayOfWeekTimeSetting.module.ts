
import { Module } from '@nestjs/common';
import { DayOfWeekTimeSettingController } from './dayOfWeekTimeSetting.controller';
import { DayOfWeekTimeSettingService } from './dayOfWeekTimeSetting.service';
import { DayOfWeekTimeSettingProvider } from './dayOfWeekTimeSetting.provider';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DayOfWeekTimeSettingController],
  providers: [
    DayOfWeekTimeSettingService,
    ...DayOfWeekTimeSettingProvider,
  ],
  exports: [DayOfWeekTimeSettingService],
})
export class DayOfWeekTimeSettingModule {}
