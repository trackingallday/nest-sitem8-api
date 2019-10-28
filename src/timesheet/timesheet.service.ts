
import { Op } from 'sequelize';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Timesheet } from './timesheet.entity';
import { TimesheetInterface, TimesheetViewInterface } from './timesheet.interface';
import { TimesheetDto } from './timesheet.dto';
import { Company } from '../company/company.entity';
import { DayOfWeek, TimesheetStatus, TimesheetFormat, ExportTimesheetCSVHeaders } from './constants';
import { Worker } from '../worker/worker.entity';
import * as momenttz from 'moment-timezone';
import * as moment from 'moment';
import { Sequelize } from 'sequelize-typescript';
import { isNil, isEmpty, groupBy, forOwn, minBy, maxBy, join, sumBy, invert } from 'lodash';
import { TimesheetEntry } from '../timesheetEntry/timesheetEntry.entity';
import { Site } from '../site/site.entity';
import { Parser } from 'json2csv';

@Injectable()
export class TimesheetService {

  @Inject('TIMESHEET_REPOSITORY') private readonly TIMESHEET_REPOSITORY: typeof Timesheet;

  async findAll(): Promise<Timesheet[]> {
    return await this.TIMESHEET_REPOSITORY.findAll<Timesheet>();
  }

  async create(props: any): Promise<Timesheet> {
    return await this.TIMESHEET_REPOSITORY.create<Timesheet>(props);
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

  async findByIdWithWorkerAndEntries(id: number): Promise<Timesheet> {
    return this.TIMESHEET_REPOSITORY.findByPk(id, {
      include: [
        {
          model: Worker,
        },
        {
          model: TimesheetEntry,
        },
      ],
    });
  }

  async getTimesheetViews(timesheetId: number, companyId: number, timesheetStatus: number): Promise<TimesheetViewInterface[]> {
    const referenceTimesheet: Timesheet = await this.findOneWhere({ timesheetId });

    const whereProps: any = { status: timesheetStatus, startDateTime: null, finishDateTime: null };
    if (!isNil(referenceTimesheet)) {
      whereProps.startDateTime = referenceTimesheet.startDateTime;
      whereProps.finishDateTime = referenceTimesheet.finishDateTime;
    }

    const ts = await this.TIMESHEET_REPOSITORY.findOne<Timesheet>(
      {
        where: whereProps,
        include: [
          {
            attributes: ['payrollId', 'name'],
            model: Worker,
            required: true,
            as: 'worker',
          },
          {
            attributes: ['siteId', 'startDateTime', 'finishDateTime'],
            model: TimesheetEntry,
            required: true,
            as: 'timesheetEntrys',
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

    if (isNil(ts)) { return; }
    return ts.timesheetEntrys.map((tse, i) => {
      const timesheetView: TimesheetViewInterface = new TimesheetViewInterface();
      timesheetView.payrollId = ts.worker.payrollId;
      timesheetView.name = ts.worker.name;
      timesheetView.timesheetId = tse.timesheetId;
      timesheetView.status = ts.status;
      timesheetView.companyId = companyId;
      timesheetView.startDateTime = tse.startDateTime;
      timesheetView.finishDateTime = tse.finishDateTime;
      timesheetView.rowNumber = i;
      timesheetView.siteName = isNil(tse.site) ? '' : tse.site.name;
      timesheetView.siteId = isNil(tse.site) ? 0 : tse.site.siteId;

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
          as: 'timesheetEntrys',
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
          as: 'timesheetEntrys',
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
  async getGroupedTimesheetViews(
        timesheetId: number,
        companyId: number,
        timesheetFormat: any = null,
        timesheetStatus: any = null): Promise<TimesheetViewInterface[]> {
    const timesheetViews: TimesheetViewInterface[] = await this.getTimesheetViews(timesheetId, companyId, timesheetStatus);

    let i = 0;
    if ( isNil(timesheetViews)) { return; }
    timesheetViews.map((m: TimesheetViewInterface) => {
      m.rowNumber = ++i;
      m.startDateTime = moment(m.startDateTime).local().toDate();
      m.finishDateTime = moment(m.finishDateTime).local().toDate();
      m.dayWorked = moment(m.startDateTime).toDate();
      m.hoursWorked = moment.duration(moment(m.finishDateTime).diff(moment(m.startDateTime))).asHours();
      m.groupedTimesheetViewsColumn = '';
      if (timesheetFormat === TimesheetFormat.GroupByWorkerDaySite) {
        m.groupedTimesheetViewsColumn = `${m.status}~;${m.payrollId}~;${m.dayWorked}~;${m.siteName}`;
      } else if (timesheetFormat === TimesheetFormat.GroupByWorkerDay) {
        m.groupedTimesheetViewsColumn = `${m.status}~;${m.payrollId}~;${m.dayWorked}`;
      } else if (timesheetFormat === TimesheetFormat.GroupByTimesheetEntry) {
        m.groupedTimesheetViewsColumn = `${m.status}~;${m.payrollId}~;${m.dayWorked}~;${m.siteName}~;${m.startDateTime}~;${m.finishDateTime}`;
      } else {
        m.groupedTimesheetViewsColumn = '';
      }
    });

    const returnResult: any[] = [];
    const groupedTimesheetViews = groupBy(timesheetViews, 'groupedTimesheetViewsColumn');
    const timesheetStatusValue = invert(TimesheetStatus);
    forOwn(groupedTimesheetViews, (value, key) => {
      const tv: any = value[0];
      tv.startDateTimeValue =  moment(minBy(value, x => x.startDateTime).startDateTime).format('YYYY-MM-DD HH:mm:ss');
      tv.finishDateTimeValue = moment(minBy(value, x => x.finishDateTime).finishDateTime).format('YYYY-MM-DD HH:mm:ss');
      tv.dayWorked = moment(tv.startDateTime).format('YYYY-MM-DD HH:mm:ss');
      tv.hoursWorked = sumBy(value, x => x.hoursWorked);
      tv.hoursBreak = moment.duration(
                        (moment(
                          moment(tv.finishDateTime)
                          .diff(moment(tv.startDateTime)))
                        ).diff(moment(tv.hoursWorked))).asHours();
      tv.status = value[0].status;
      tv.statusValue = timesheetStatusValue[tv.status];
      const groupedBySites = value.map(x => x.siteId);
      if (groupedBySites.length > 0) {
        tv.siteIds = join(value.map(x => x.siteId), ', ');
        tv.siteName = join(value.map(x => x.siteName), ', ');
      }
      returnResult.push(tv);
    });
    return returnResult;
  }
  async exportTimesheets(timesheetId: number, companyId: number, timesheetFormat: number, timesheetStatus: number): Promise<string> {
    const timesheetsData = await this.getGroupedTimesheetViews(timesheetId, companyId, timesheetFormat, timesheetStatus);
    if ( isNil(timesheetsData)) { return ; }
    try {
      const fields = ExportTimesheetCSVHeaders;
      const parser = new Parser({ fields, delimiter: '\t' });
      const csv = parser.parse(timesheetsData);
      return csv;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
