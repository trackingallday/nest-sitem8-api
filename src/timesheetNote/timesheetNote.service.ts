
import { Injectable, Inject } from '@nestjs/common';
import { TimesheetNote } from './timesheetNote.entity';
import { TimesheetNoteInterface } from './timesheetNote.interface';
import constants from '../constants'

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

}

