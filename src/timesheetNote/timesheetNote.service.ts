
import { Injectable, Inject } from '@nestjs/common';
import { TimesheetNote } from './timesheetNote.entity';
import { TimesheetNoteInterface } from './timesheetNote.interface';
import moment from '../../node_modules/moment/src/moment';

@Injectable()
export class TimesheetNoteService {

  @Inject('TIMESHEETNOTE_REPOSITORY') private readonly TIMESHEETNOTE_REPOSITORY: typeof TimesheetNote;

  async findAll(): Promise<TimesheetNote[]> {
    return await this.TIMESHEETNOTE_REPOSITORY.findAll<TimesheetNote>();
  }

  async create(props: TimesheetNoteInterface): Promise<TimesheetNote> {
    return await this.TIMESHEETNOTE_REPOSITORY.create<TimesheetNote>(props);
  }

  async findAllWhere(props): Promise<TimesheetNote[]> {
    return await this.TIMESHEETNOTE_REPOSITORY.findAll<TimesheetNote>(props);
  }

  async findOneWhere(props): Promise<TimesheetNote> {
    return await this.TIMESHEETNOTE_REPOSITORY.findOne<TimesheetNote>(props);
  }

  async findById(id): Promise<TimesheetNote> {
    return await this.TIMESHEETNOTE_REPOSITORY.findByPk<TimesheetNote>(id);
  }

  async addTimesheetNote(timesheetNote: TimesheetNote, companyId: number): Promise<number> {
    if (timesheetNote.details.length > 160) {
      // todo:
      // throw new SiteM8Exception("Timesheet note text is more than 160 characters.");
    }
    // Ensure the timesheet exists and is for correct company.
    await this.findOneWhere({ where: { timesheetId: timesheetNote.timesheetId, companyId }});
    timesheetNote.creationDateTime = new moment(new Date()).utc();
    await this.TIMESHEETNOTE_REPOSITORY.create<TimesheetNote>(timesheetNote);
    return timesheetNote.timesheetNoteId;
  }

  async getTimesheetNotes(timesheetId: number, companyId: number): Promise<TimesheetNote> {
    return await this.findOneWhere({ where: {  timesheetId, companyId  }});
  }

  // todo: check logic in netcore app. Some part of this method to be called at controller level.
  async AddTimesheetNoteFromUser(timesheetNote: TimesheetNote, companyId: number): Promise<number> {
    timesheetNote.priority = 1;
    return await this.addTimesheetNote(timesheetNote, companyId);
  }

}
