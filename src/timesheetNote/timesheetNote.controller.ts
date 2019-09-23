
import { Get, Post, Body, Param, Controller, UsePipes  } from '@nestjs/common';
import { TimesheetNoteService } from './timesheetNote.service';
import { TimesheetNote } from './timesheetNote.entity';
import TimesheetNoteDto from './timesheetNote.dto';
import { ValidationPipe } from '../common/validation.pipe';


@Controller('timesheetNote')
export class TimesheetNoteController {

  constructor(private readonly timesheetNoteService: TimesheetNoteService) {}

  @Get()
  async findAll(): Promise<TimesheetNote[]> {
    return this.timesheetNoteService.findAll();
  }

  @Get('/:id')
  async findById(@Param() params): Promise<TimesheetNote> {
    return this.timesheetNoteService.findById(parseInt(params.id));
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() timesheetNote: TimesheetNoteDto) {
    this.timesheetNoteService.create(timesheetNote);
  }

  @Post('/:id')
  @UsePipes(new ValidationPipe())
  async update(@Param() id: number, @Body() timesheetNote: TimesheetNoteDto) {
    const thisTimesheetNote = await this.timesheetNoteService.findById(id);
    thisTimesheetNote.set(timesheetNote);
    await thisTimesheetNote.save();
    return thisTimesheetNote;
  }
}

