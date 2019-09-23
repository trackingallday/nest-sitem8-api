
import { Get, Post, Body, Param, Controller, UsePipes  } from '@nestjs/common';
import { TimesheetService } from './timesheet.service';
import { Timesheet } from './timesheet.entity';
import TimesheetDto from './timesheet.dto';
import { ValidationPipe } from '../common/validation.pipe';


@Controller('timesheet')
export class TimesheetController {

  constructor(private readonly timesheetService: TimesheetService) {}

  @Get()
  async findAll(): Promise<Timesheet[]> {
    return this.timesheetService.findAll();
  }

  @Get('/:id')
  async findById(@Param() params): Promise<Timesheet> {
    return this.timesheetService.findById(parseInt(params.id));
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() timesheet: TimesheetDto) {
    this.timesheetService.create(timesheet);
  }

  @Post('/:id')
  @UsePipes(new ValidationPipe())
  async update(@Param() id: number, @Body() timesheet: TimesheetDto) {
    const thisTimesheet = await this.timesheetService.findById(id);
    thisTimesheet.set(timesheet);
    await thisTimesheet.save();
    return thisTimesheet;
  }
}

