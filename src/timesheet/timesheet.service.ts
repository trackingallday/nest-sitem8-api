
import { Injectable, Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import { Timesheet } from './timesheet.entity';
import { TimesheetInterface, TimesheetViewInterface } from './timesheet.interface';
import { TimesheetDto } from './timesheet.dto';
import { Company } from '../company/company.entity';
import { DayOfWeek, TimesheetStatus } from './constants';
import { Worker } from '../worker/worker.entity';
import * as momenttz from 'moment-timezone';
import * as moment from 'moment';
import { Sequelize } from 'sequelize-typescript';
import { isNil } from 'lodash';
import { TimesheetEntry } from '../timesheetEntry/timesheetEntry.entity';
import { Site } from '../site/site.entity';

@Injectable()
export class TimesheetService {

  @Inject('TIMESHEET_REPOSITORY') private readonly TIMESHEET_REPOSITORY: typeof Timesheet;

  async findAll(): Promise<Timesheet[]> {
    return await this.TIMESHEET_REPOSITORY.findAll<Timesheet>();
  }

  async create(props: any): Promise<Timesheet> {
    const ts = await this.TIMESHEET_REPOSITORY.create<Timesheet>(props);
    return ts;
  }

  async findAllWhere(props: any): Promise<Timesheet[]> {
    return await this.TIMESHEET_REPOSITORY.findAll<Timesheet>(props);
  }

  async findOneWhere(props: any): Promise<Timesheet> {
    return await this.TIMESHEET_REPOSITORY.findOne<Timesheet>(props);
  }

  async findById(timesheetId: number): Promise<Timesheet> {
    return await this.TIMESHEET_REPOSITORY.findByPk<Timesheet>(timesheetId,  {
      include: [
        {
          model: Worker,
        },
      ]});
  }

  async findByIdWithWorkerAndEntries(id:number): Promise<Timesheet> {
    return this.TIMESHEET_REPOSITORY.findByPk(id, {
      include: [
        {
          model: Worker,
        },
        {
          model: TimesheetEntry,
        }
      ]
    })
  }

  async getTimesheetViews(timesheetId: number, timesheetStatus: number, companyId: number): Promise<TimesheetViewInterface[]> {
    const referenceTimesheet: Timesheet = await this.findOneWhere({ timesheetId });
    const ts = await this.TIMESHEET_REPOSITORY.findOne<Timesheet>(
      {
        where: {
          companyId,
          startDateTime: referenceTimesheet.startDateTime.getDate(),
          finishDateTime: referenceTimesheet.finishDateTime.getDate(),
          status: timesheetStatus,
        },
        include: [
          {
            attributes: ['payrollId', 'name'],
            model: Worker,
            required: true,
            as: 'worker',
          },
          {
            attributes: ['siteId', 'startDateTime', 'finishDateTime', 'site'],
            model: TimesheetEntry,
            required: true,
            as: 'timesheetEntry',
            include: [
              {
                model: Site,
                required: false,
                as: 'site',
                attributes: ['name', 'siteId'],
              },
            ],
          },
        ],
      },
    );

    return ts.timesheetEntrys.map((tse, i) => {
      const timesheetView: TimesheetViewInterface = new TimesheetViewInterface();
      timesheetView.siteId = tse.siteId; // todo: recheck this
      timesheetView.payrollId = ts.worker.payrollId;
      timesheetView.name = ts.worker.name;
      timesheetView.timesheetId = tse.timesheetId;
      timesheetView.status = ts.status;
      timesheetView.companyId = companyId;
      timesheetView.startDateTime = tse.startDateTime;
      timesheetView.finishDateTime = tse.finishDateTime;
      timesheetView.rowNumber = i;
      timesheetView.siteName = tse.site.name;

      return timesheetView;
    });
  }

  async getTimesheet(when: Date, workerId: number, companyId: number): Promise<Timesheet> {
    return await this.findOneWhere({
      where: { workerId, companyId, startDateTime: { $lte: when }, finishDateTime: { $gt: when } },
    });
  }

  async getTimesheetsAndTimesheetEntries(when: any, companyId: number): Promise<Timesheet[]> {
    return await this.TIMESHEET_REPOSITORY.findAll<Timesheet>(
      {
        where: {
          companyId,
          startDateTime: { $lte: when },
          finishDateTime: { $gt: when },
        },
        include: [{
          model: TimesheetEntry,
          required: true,
          as: 'timesheetEntry',
        }],
      },
    );
  }

  // DeleteTimesheetEntries: moved to timesheetEntry.service.ts file

  async getDistinctTimesheets(companyId: number, workerId: number = null): Promise<Timesheet[]> {
    return await this.TIMESHEET_REPOSITORY.findAll<Timesheet>(
      {
        where: {
          workerId,
          companyId,
        },
        include: [{
          model: TimesheetEntry,
          required: true,
          as: 'timesheetEntry',
        }],
        limit: 100,
        order: ['startDateTime'],
      },
    );
  }

  async countTimesheetsWithStatus(timesheetId: number, timesheetStatus: number, companyId: number): Promise<number> {
    const timesheet = await this.findOneWhere(timesheetId);
    return await this.TIMESHEET_REPOSITORY.count({
      where: {
        status: timesheetStatus,
        startDateTime: timesheet.startDateTime.getDate(),
        finishDateTime: timesheet.finishDateTime.getDate(),
        companyId,
      },
    });
  }

  async setTimesheetStatus(timesheetId: number, timesheetStatus: number, companyId: number): Promise<void> {
    const timesheet: Timesheet = await this.findOneWhere(timesheetId);

    if (timesheet.status === timesheetStatus) {
      return;
    } else {
      timesheet.status = timesheetStatus;
      await timesheet.save();
    }
  }

  /*async getUnlockedTimesheetsBySupervisorWorkerId(supervisorWorkerId: number, companyId: number): Promise<Timesheet[]> {
    return await this.TIMESHEET_REPOSITORY.findAll<Timesheet>(
      {
        where: {
          companyId,
          status: { $ne: TimesheetStatus.Locked },
        },
        include: [{
          model: Worker,
          required: true,
          as: 'worker',
          where: { supervisor: supervisorWorkerId },
        }],
        order: ['startDateTime'],
      },
    );
  }

  async getUnlockedTimesheets(companyId: number): Promise<Timesheet[]> {
    return await this.TIMESHEET_REPOSITORY.findAll<Timesheet>(
      {
        where: {
          companyId,
          status: { $ne: TimesheetStatus.Locked },
        },
        order: ['startDateTime'],
      },
    );
  }*/

  // AddDeleteUpdateTimesheetEntries: moved to timesheetentry.service.ts

  // Returns list of timesheetId that are locked for which timesheetnote can be created by calling createTimesheetnoteForLockedTimesheets()
  // createTimesheetnoteForLockedTimesheets : function in timesheetnotes
  // LockTimesheet : This method can be used for locking single timesheet as well.
  /*async LockTimesheets(timesheetIds: number[], companyId: number): Promise<number[]> {
    const timesheetsUpdated = await this.TIMESHEET_REPOSITORY.update(
      { status: TimesheetStatus.Locked },
      {
        where: {
          id: timesheetIds,
          status: TimesheetStatus.Approved,
          companyId,
          finishDateTime: { $gte: moment().utc() },
        },
      });
    // Returns timesheet id's of updated rows
    return timesheetsUpdated[1].map((m) => m.timesheetId);
  }

  // GetTimesheetEntries: moved to timesheetEntry.service.ys

  // Returns true if the timesheet exists and is in the correct company. Returns false otherwise.
  async isTimesheetExistForCompany(referenceTimesheetId: number, companyId: number): Promise<boolean> {
    return (await this.TIMESHEET_REPOSITORY.count({ where: { timesheetId: referenceTimesheetId, companyId } })) > 0;
  }*/

  // OverwriteTimesheetEntries: Moved to timesheetentry.service.ts file
}
