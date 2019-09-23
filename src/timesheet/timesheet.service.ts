
import { Injectable, Inject } from '@nestjs/common';
import { Timesheet } from './timesheet.entity';
import { TimesheetInterface } from './timesheet.interface';
import constants from '../constants'

@Injectable()
export class TimesheetService {

  @Inject('TIMESHEET_REPOSITORY') private readonly TIMESHEET_REPOSITORY: typeof Timesheet;

  async findAll(): Promise<Timesheet[]> {
    return await this.TIMESHEET_REPOSITORY.findAll<Timesheet>();
  }

  async create(props: TimesheetInterface): Promise<Timesheet> {
    return await this.TIMESHEET_REPOSITORY.create<Timesheet>(props);
  }

  async findAllWhere(props): Promise<Timesheet[]> {
    return await this.TIMESHEET_REPOSITORY.findAll<Timesheet>(props);
  }

  async findOneWhere(props): Promise<Timesheet> {
    return await this.TIMESHEET_REPOSITORY.findOne<Timesheet>(props);
  }

  async findById(id): Promise<Timesheet> {
    return await this.TIMESHEET_REPOSITORY.findByPk<Timesheet>(id);
  }

}

