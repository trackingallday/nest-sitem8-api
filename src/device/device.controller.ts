
import { Get, Post, Body, Param, Controller, UsePipes  } from '@nestjs/common';
import { DeviceService } from './device.service';
import { Device } from './device.entity';
import DeviceDto from './device.dto';
import { ValidationPipe } from '../common/validation.pipe';


@Controller('device')
export class DeviceController {

  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  async findAll(): Promise<Device[]> {
    return this.deviceService.findAll();
  }

  @Get('/:id')
  async findById(@Param() params): Promise<Device> {
    return this.deviceService.findById(parseInt(params.id));
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() device: DeviceDto) {
    this.deviceService.create(device);
  }

  @Post('/:id')
  @UsePipes(new ValidationPipe())
  async update(@Param() id: number, @Body() device: DeviceDto) {
    const thisDevice = await this.deviceService.findById(id);
    thisDevice.set(device);
    await thisDevice.save();
    return thisDevice;
  }
}

