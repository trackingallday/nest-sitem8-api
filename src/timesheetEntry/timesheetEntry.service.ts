
import { Injectable, Inject } from '@nestjs/common';
import { TimesheetEntry } from './timesheetEntry.entity';
import { TimesheetEntryInterface } from './timesheetEntry.interface';
import constants from '../constants';

@Injectable()
export class TimesheetEntryService {

  @Inject('TIMESHEETENTRY_REPOSITORY') private readonly TIMESHEETENTRY_REPOSITORY: typeof TimesheetEntry;

  async findAll(): Promise<TimesheetEntry[]> {
    return await this.TIMESHEETENTRY_REPOSITORY.findAll<TimesheetEntry>();
  }

  async create(props: TimesheetEntryInterface): Promise<TimesheetEntry> {
    return await this.TIMESHEETENTRY_REPOSITORY.create<TimesheetEntry>(props);
  }

  async findAllWhere(props): Promise<TimesheetEntry[]> {
    return await this.TIMESHEETENTRY_REPOSITORY.findAll<TimesheetEntry>(props);
  }

  async findOneWhere(props): Promise<TimesheetEntry> {
    return await this.TIMESHEETENTRY_REPOSITORY.findOne<TimesheetEntry>(props);
  }

  async findById(id): Promise<TimesheetEntry> {
    return await this.TIMESHEETENTRY_REPOSITORY.findByPk<TimesheetEntry>(id);
  }

  async deleteTimesheetEntries(startInclusive: Date, finishExclusive: Date, timesheetId: number[]): Promise<void> {
   await this.TIMESHEETENTRY_REPOSITORY.destroy({
     where:
     {
       id: timesheetId,
       startDateTime: {
        $lte: startInclusive.getDate(),
      },
      finishDateTime: {
        $gt: finishExclusive.getDate(),
      },
     },
    });
  }

}
