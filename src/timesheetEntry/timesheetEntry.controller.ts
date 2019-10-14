
import { Get, Post, Body, Param, Controller, UsePipes, Req  } from '@nestjs/common';
import { TimesheetEntryService } from './timesheetEntry.service';
import { TimesheetEntry } from './timesheetEntry.entity';
import TimesheetEntryDto from './timesheetEntry.dto';
import { ValidationPipe } from '../common/validation.pipe';

@Controller('timesheetEntry')
export class TimesheetEntryController {

  constructor(private readonly timesheetEntryService: TimesheetEntryService) {}

  @Get()
  async findAll(): Promise<TimesheetEntry[]> {
    return this.timesheetEntryService.findAll();
  }

  @Get('/:id')
  async findById(@Param() params): Promise<TimesheetEntry> {
    return this.timesheetEntryService.findById(parseInt(params.id));
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() timesheetEntry: TimesheetEntryDto) {
    this.timesheetEntryService.create(timesheetEntry);
  }

  @Post('/:id')
  @UsePipes(new ValidationPipe())
  async update(@Param() id: number, @Body() timesheetEntry: TimesheetEntryDto) {
    const thisTimesheetEntry = await this.timesheetEntryService.findById(id);
    thisTimesheetEntry.set(timesheetEntry);
    await thisTimesheetEntry.save();
    return thisTimesheetEntry;
  }

  @Get('mytimesheet/timesheetentries/:token/:id')
  async getTimesheetEntries(@Param() params): Promise<TimesheetEntry[]> {
    return await this.timesheetEntryService.getTimesheetEntriesByTimesheetIdForCompany(params.id, params.companyId);
  }

  @Post('updatetimesheetentries')
  @UsePipes(new ValidationPipe())
  async updateTimesheetEntries(@Req() req, @Body() timesheetEntries: TimesheetEntry[], @Body() timesheetId: number) {
    this.timesheetEntryService.overwriteTimesheetEntries(timesheetEntries, timesheetId, req.dbUser.name, req.dbUser.workerId);
  }
}
