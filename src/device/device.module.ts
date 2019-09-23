
import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { DeviceProvider } from './device.provider';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DeviceController],
  providers: [
    DeviceService,
    ...DeviceProvider,
  ],
})
export class DeviceModule {}
