
import { Injectable, Inject } from '@nestjs/common';
import { Timesheet } from './timesheet.entity';
import { TimesheetInterface, TimesheetViewInterface } from './timesheet.interface';
import { Company } from '../company/company.entity';
import { DayOfWeek } from './constants';
import { Worker } from '../worker/worker.entity';
import moment from '../../node_modules/moment/src/moment';
import { Op, Model } from 'sequelize';
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

  async createTimesheetsIfMissing(utcNow: Date, company: Company) {
    let count: number = 0;
    let errorCount: number = 0;
    if (company.startDayOfWeek < DayOfWeek.Sunday || company.startDayOfWeek > DayOfWeek.Saturday) {
      // todo:
      // 	throw new SiteM8Exception("Invalid start day of week");
    }
    const startDayOfWeek = company.startDayOfWeek;

    // All these dates are in local time.
    // This is because we want the timesheet to start on Monday midnight local time, but be stored in UTC.
    let now = moment(utcNow).tz('Pacific/Auckland');
    let lastMonday = now;
    while (lastMonday.format('D') !== startDayOfWeek) {
      lastMonday = lastMonday.subtract(-1, 'd');
    }
    let nextMonday = lastMonday.subtract(7, 'd');

    // Convert dates back to UTC.
    now = moment.tz(now, 'Pacific/Auckland').utc();
    lastMonday = moment.tz(lastMonday, 'Pacific/Auckland').utc();
    nextMonday = moment.tz(nextMonday, 'Pacific/Auckland').utc();

    const timesheetsToCreateForAWorker = await this.TIMESHEET_REPOSITORY.findAll<Timesheet>({
      include: [{
        model: Worker,
        as: 'worker',
        where: { isEnabled: true, IsWorker: true, companyId: company.companyId },
      }],
      where: {
        startDateTime: {
          [Op.lte]: now,
        },
        finishDateTime: {
          [Op.gt]: now,
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

  // WIP : GetTimesheetViews
  async getTimesheetViews(timesheetId: number, timesheetStatus: number, companyId: number): Promise<TimesheetViewInterface[]> {
    const referenceTimesheet: Timesheet = await  this.findOneWhere({ timesheetId });
    if (isNil(referenceTimesheet)) {
      // logger.Trace($"Reference timesheet not found {timesheetId}");
      // throw new SiteM8Exception("Timesheet not found");
    }

    const timesheetViews = [];
    const timesheet: Timesheet = await this.TIMESHEET_REPOSITORY.findOne<Timesheet>(
      {
        subQuery: false,
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
            required : true,
            as: 'worker',
        }, {
          attributes: ['siteId', 'startDateTime', 'finishDateTime', 'site' ],
          model: TimesheetEntry,
          required : true,
          as: 'timesheetEntry',
          include: [ {model: Site, required: true, as: 'Site', attributes: ['name', 'siteId']} ],
      },
        ],
      },
    );

    timesheet.timesheetEntry.forEach(r => {
        const timesheetView: TimesheetViewInterface = new TimesheetViewInterface();
        timesheetView.siteId = r.siteId; // todo: recheck this
        timesheetView.payrollId = timesheet.worker.payrollId;
        timesheetView.name = timesheet.worker.name;
        timesheetView.timesheetId = timesheet.timesheetId;
        timesheetView.status = timesheet.status;
        timesheetView.companyId = companyId;
        timesheetView.startDateTime = r.startDateTime;
        timesheetView.finishDateTime = r.finishDateTime;
        timesheetView.siteName = r.site.name;

        timesheetViews.push(timesheetView);
    });
    return timesheetViews;
  }

}
