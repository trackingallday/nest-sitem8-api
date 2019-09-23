
import { Get, Post, Body, Param, Controller, UsePipes  } from '@nestjs/common';
import { DayOfWeekTimeSettingService } from './dayOfWeekTimeSetting.service';
import { DayOfWeekTimeSetting } from './dayOfWeekTimeSetting.entity';
import DayOfWeekTimeSettingDto from './dayOfWeekTimeSetting.dto';
import { ValidationPipe } from '../common/validation.pipe';


@Controller('dayOfWeekTimeSetting')
export class DayOfWeekTimeSettingController {

  constructor(private readonly dayOfWeekTimeSettingService: DayOfWeekTimeSettingService) {}

  @Get()
  async findAll(): Promise<DayOfWeekTimeSetting[]> {
    return this.dayOfWeekTimeSettingService.findAll();
  }

  @Get('/:id')
  async findById(@Param() params): Promise<DayOfWeekTimeSetting> {
    return this.dayOfWeekTimeSettingService.findById(parseInt(params.id));
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() dayOfWeekTimeSetting: DayOfWeekTimeSettingDto) {
    this.dayOfWeekTimeSettingService.create(dayOfWeekTimeSetting);
  }

  @Post('/:id')
  @UsePipes(new ValidationPipe())
  async update(@Param() id: number, @Body() dayOfWeekTimeSetting: DayOfWeekTimeSettingDto) {
    const thisDayOfWeekTimeSetting = await this.dayOfWeekTimeSettingService.findById(id);
    thisDayOfWeekTimeSetting.set(dayOfWeekTimeSetting);
    await thisDayOfWeekTimeSetting.save();
    return thisDayOfWeekTimeSetting;
  }
}

