
import { Module } from '@nestjs/common';
import { TimesheetNoteController } from './timesheetNote.controller';
import { TimesheetNoteService } from './timesheetNote.service';
import { TimesheetNoteProvider } from './timesheetNote.provider';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TimesheetNoteController],
  providers: [
    TimesheetNoteService,
    ...TimesheetNoteProvider,
  ],
})
export class TimesheetNoteModule {}
