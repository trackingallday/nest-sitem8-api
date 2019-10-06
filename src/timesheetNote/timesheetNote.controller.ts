
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

  // GetTimesheetNotes
  @Get('/:timesheetNoteId')
  async findById(@Param() params): Promise<TimesheetNote> {
    return this.timesheetNoteService.findById(params.timesheetNoteId);
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

  @Post('mytimesheet/addtimesheetnote/')
  @UsePipes(new ValidationPipe())
  async addTimesheetNote(@Body() timesheetNote: TimesheetNote = null, @Body() companyId: number) {
    this.timesheetNoteService.addTimesheetNote(timesheetNote, companyId);
  }

  @Get('timesheetnotes/:id')
  async GetTimesheetNotes(@Param() params): Promise<TimesheetNote> {
    return await this.timesheetNoteService.getTimesheetNotes(params.timesheetId, params.companyId);
  }

}
