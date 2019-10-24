
import { Module } from '@nestjs/common';
import { LocationEventController } from './locationEvent.controller';
import { LocationEventService } from './locationEvent.service';
import { LocationEventProvider } from './locationEvent.provider';
import { DatabaseModule } from '../db/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [LocationEventController],
  providers: [
    LocationEventService,
    ...LocationEventProvider,
  ],
  exports: [LocationEventService],
})
export class LocationEventModule {}
