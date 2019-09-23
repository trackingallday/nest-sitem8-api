
import { Get, Post, Body, Param, Controller, UsePipes  } from '@nestjs/common';
import { LocationTimestampService } from './locationTimestamp.service';
import { LocationTimestamp } from './locationTimestamp.entity';
import LocationTimestampDto from './locationTimestamp.dto';
import { ValidationPipe } from '../common/validation.pipe';


@Controller('locationTimestamp')
export class LocationTimestampController {

  constructor(private readonly locationTimestampService: LocationTimestampService) {}

  @Get()
  async findAll(): Promise<LocationTimestamp[]> {
    return this.locationTimestampService.findAll();
  }

  @Get('/:id')
  async findById(@Param() params): Promise<LocationTimestamp> {
    return this.locationTimestampService.findById(parseInt(params.id));
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() locationTimestamp: LocationTimestampDto) {
    this.locationTimestampService.create(locationTimestamp);
  }

  @Post('/:id')
  @UsePipes(new ValidationPipe())
  async update(@Param() id: number, @Body() locationTimestamp: LocationTimestampDto) {
    const thisLocationTimestamp = await this.locationTimestampService.findById(id);
    thisLocationTimestamp.set(locationTimestamp);
    await thisLocationTimestamp.save();
    return thisLocationTimestamp;
  }
}

