
import { Injectable, Inject } from '@nestjs/common';
import { Timesheet } from './timesheet.entity';
import { TimesheetInterface, TimesheetViewInterface } from './timesheet.interface';
import { Company } from '../company/company.entity';
import { DayOfWeek, TimesheetStatus } from './constants';
import { Worker } from '../worker/worker.entity';
import { Site } from '../site/site.entity';
import * as momenttz from 'moment-timezone';
import { Op, Model } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { isNil } from 'lodash';
import { TimesheetEntry } from '../timesheetEntry/timesheetEntry.entity';

@Injectable()
export class TimesheetService {

  @Inject('TIMESHEET_REPOSITORY') private readonly TIMESHEET_REPOSITORY: typeof Timesheet;

  async findAll(): Promise<Timesheet[]> {
    return await this.TIMESHEET_REPOSITORY.findAll<Timesheet>();
  }

  async create(props: TimesheetInterface): Promise<Timesheet> {
    return await this.TIMESHEET_REPOSITORY.create<Timesheet>(props);
  }

  async findAllWhere(props: any): Promise<Timesheet[]> {
    return await this.TIMESHEET_REPOSITORY.findAll<Timesheet>(props);
  }

  async findOneWhere(props: any): Promise<Timesheet> {
    return await this.TIMESHEET_REPOSITORY.findOne<Timesheet>(props);
  }

  async findById(id: number): Promise<Timesheet> {
    return await this.TIMESHEET_REPOSITORY.findByPk<Timesheet>(id);
  }

  async createTimesheetsIfMissing(utcNow: Date, company: Company): Promise<void> {
    let count: number = 0;
    let errorCount: number = 0;
    if (company.startDayOfWeek < DayOfWeek.Sunday || company.startDayOfWeek > DayOfWeek.Saturday) {
      // todo:
      // 	throw new SiteM8Exception("Invalid start day of week");
    }
    const startDayOfWeek = company.startDayOfWeek;

    // All these dates are in local time.
    // This is because we want the timesheet to start on Monday midnight local time, but be stored in UTC.

    let now = momenttz(utcNow).tz('Pacific/Auckland');
    let lastMonday = now;
    while (lastMonday.format('D') !== startDayOfWeek) {
      lastMonday = lastMonday.subtract(-1, 'd');
    }
    let nextMonday = lastMonday.subtract(7, 'd');

    // Convert dates back to UTC.
    now = momenttz.tz(now, 'Pacific/Auckland').utc();
    lastMonday = momenttz.tz(lastMonday, 'Pacific/Auckland').utc();
    nextMonday = momenttz.tz(nextMonday, 'Pacific/Auckland').utc();

    const timesheetsToCreateForAWorker = await this.TIMESHEET_REPOSITORY.findAll<Timesheet>({
      include: [{
        model: Worker,
        as: 'worker',
        where: { isEnabled: true, IsWorker: true, companyId: company.companyId },
      }],
      where: {
        startDateTime: {
          $lte: now,
        },
        finishDateTime: {
          $gt: now,
        },
      },
    });

    if (!isNil(timesheetsToCreateForAWorker)) {
      const allNewTimesheets: Timesheet[] = [];
      timesheetsToCreateForAWorker.forEach(async element => {
        const newtimesheet = new Timesheet();
        newtimesheet.startDateTime = lastMonday;
        newtimesheet.finishDateTime = nextMonday;
        newtimesheet.workerId = element.workerId;
        newtimesheet.companyId = company.companyId;

         // It is unexpected, but possible that the start day of the week has changed, which requires us to
      // create a timesheet that is not 7 days long.

        const lastTimesheetFinishDateTime = await this.TIMESHEET_REPOSITORY.findOne<Timesheet>({
         attributes: [[Sequelize.fn('max', Sequelize.col('finishDateTime')), 'max']],
         where: { workerId: element.workerId, finishDateTime : { $ne: null } },
        });
        if (!isNil(lastTimesheetFinishDateTime) && lastTimesheetFinishDateTime.finishDateTime > newtimesheet.startDateTime) {
          // Unit test has timesheets in year 2000, and we don't want these to be screwed up by future data.
          if (newtimesheet.startDateTime.getFullYear() > 2001) {
            newtimesheet.startDateTime = lastTimesheetFinishDateTime.finishDateTime;
          }
        }
        // Should never happen, but check just in case.
        if (newtimesheet.finishDateTime <= newtimesheet.startDateTime) {
          errorCount++;
        } else {
          allNewTimesheets.push(newtimesheet);
          count++;
        }
      });
      this.TIMESHEET_REPOSITORY.bulkCreate(allNewTimesheets);
    }

    if (count > 0) {
      // todo:
      // logger.Trace("Added " + count + " timesheets to company " + companyId);
    }
    if (errorCount > 0) {
      // todo:
      // throw new SiteM8Exception("A timesheet to be created has start before finish");
    }
  }

  async getTimesheetViews(timesheetId: number, timesheetStatus: number, companyId: number): Promise<TimesheetViewInterface[]> {
    const referenceTimesheet: Timesheet = await  this.findOneWhere({ timesheetId });
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
            attributes: [ 'payrollId', 'name'],
            model: Worker,
            required: true,
            as: 'worker',
          },
          {
            attributes: ['siteId', 'startDateTime', 'finishDateTime', 'site' ],
            model: TimesheetEntry,
            required : true,
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

    return ts.timesheetEntry.map((tse, i) => {
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
      where: { workerId, companyId, startDateTime: { $lte: when }, finishDateTime: { $gt: when} },
    });
  }

  async getTimesheetsAndTimesheetEntries(when: any, companyId: number): Promise<Timesheet[]> {
    return await this.TIMESHEET_REPOSITORY.findAll<Timesheet>(
      {
        where: {
          companyId,
          startDateTime: { $lte: when },
          finishDateTime: { $gt: when},
        },
        include: [{
          model: TimesheetEntry,
          required : true,
          as: 'timesheetEntry',
      }],
      },
    );
  }

  // DeleteTimesheetEntries: moved to timesheetEntry.service.ts file

  async getDistinctTimesheets(workerId: number, companyId: number): Promise<Timesheet[]> {
    return await this.TIMESHEET_REPOSITORY.findAll<Timesheet>(
      {
        where: {
          workerId,
          companyId,
        },
        include: [{
          model: TimesheetEntry,
          required : true,
          as: 'timesheetEntry',
      }],
      limit: 100,
      order: [ 'startDateTime' ],
      },
    );
  }

  async setTimesheetStatus(timesheetId: number, timesheetStatus: number, companyId: number): Promise<void> {
    const timesheet: Timesheet = await this.findOneWhere(timesheetId);
    if (isNil(timesheet)) {
      // todo:
      // throw new SiteM8Exception($"Timesheet with ID of {timesheetId} could not be found.");
    }
    if (timesheet.companyId !== companyId) {
      // todo:
      // throw new SiteM8Exception("Timesheet not modified because it of different company Id");
    }

    if (timesheet.status === timesheetStatus) {
      return;
    } else if (timesheet.status === TimesheetStatus.Locked) {
      // todo:
      // throw new SiteM8Exception($"Timesheet with ID of {timesheetId} could not have status modified because it is locked.");
    } else {
      timesheet.status = timesheetStatus;
      await timesheet.save();
    }
  }

  async getUnlockedTimesheetsBySupervisorWorkerId(supervisorWorkerId: number, companyId: number): Promise<Timesheet[]> {
    return await this.TIMESHEET_REPOSITORY.findAll<Timesheet>(
      {
        where: {
          companyId,
          status: { $ne: TimesheetStatus.Locked},
        },
        include: [{
          model: Worker,
          required : true,
          as: 'worker',
          where: { supervisor: supervisorWorkerId },
      }],
      order: [ 'startDateTime' ],
      },
    );
  }

  async getUnlockedTimesheets(companyId: number): Promise<Timesheet[]> {
    return await this.TIMESHEET_REPOSITORY.findAll<Timesheet>(
      {
        where: {
          companyId,
          status: { $ne: TimesheetStatus.Locked},
        },
      order: [ 'startDateTime' ],
      },
    );
  }

}
