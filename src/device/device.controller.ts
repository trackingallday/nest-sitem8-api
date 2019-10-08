
import { Get, Post, Body, Param, Controller, UsePipes  } from '@nestjs/common';
import { DeviceService } from './device.service';
import { Device } from './device.entity';
import DeviceDto from './device.dto';
import { ValidationPipe } from '../common/validation.pipe';


@Controller('device')
export class DeviceController {

  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  async findAll(): Promise<any[]> {
    const res = await this.deviceService.findAll();
    return res.map(r => r.toJSON());
  }

  @Get('/:id')
  async findById(@Param() id:number) {
    const device = await this.deviceService.findById(id);
    return device.toJSON();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() device: DeviceDto) {
    const res = await this.deviceService.create(device);
    return res.toJSON();
  }

  @Post('/:id')
  @UsePipes(new ValidationPipe())
  async update(@Param() id: number, @Body() device: DeviceDto) {
    const thisDevice = await this.deviceService.findById(id);
    const res = await thisDevice.update(device);
    return res.toJSON();
  }
}

