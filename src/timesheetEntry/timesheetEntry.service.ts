
import { Injectable, Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import { TimesheetEntry } from './timesheetEntry.entity';
import { Timesheet } from '../timesheet/timesheet.entity';
import { LocationEvent } from '../locationEvent/locationEvent.entity';
import { TimesheetEntryDto } from './timesheetEntry.dto';
import { isNil, isEmpty, intersectionBy, differenceBy } from 'lodash';
import { eventTypeEnum } from '../locationEvent/constants';
import { mtzFromDateTimeTZ } from '../utils/dateUtils';
import * as momenttz from 'moment-timezone';


@Injectable()
export class TimesheetEntryService {

  @Inject('TIMESHEETENTRY_REPOSITORY') private readonly TIMESHEETENTRY_REPOSITORY: typeof TimesheetEntry;

  async findAll(): Promise<TimesheetEntry[]> {
    return await this.TIMESHEETENTRY_REPOSITORY.findAll<TimesheetEntry>();
  }

  async create(props: TimesheetEntryDto): Promise<TimesheetEntry> {
    return await this.TIMESHEETENTRY_REPOSITORY.create<TimesheetEntry>(props);
  }

  async findAllWhere(props:any): Promise<TimesheetEntry[]> {
    return await this.TIMESHEETENTRY_REPOSITORY.findAll<TimesheetEntry>(props);
  }

  async findOneWhere(props:any): Promise<TimesheetEntry> {
    return await this.TIMESHEETENTRY_REPOSITORY.findOne<TimesheetEntry>(props);
  }

  async findById(id:number): Promise<TimesheetEntry> {
    return await this.TIMESHEETENTRY_REPOSITORY.findByPk<TimesheetEntry>(id,  {
      include: [
        {
          model: Timesheet,
        },
      ]});
  }

  async createMany(props: TimesheetEntryDto[]): Promise<TimesheetEntry[]> {
    return await this.TIMESHEETENTRY_REPOSITORY.bulkCreate(props);
  }

  async update(props: TimesheetEntryDto):Promise<TimesheetEntry> {
    const ts = await this.findById(props.id);
    await ts.update(props);
    return ts;
  }

  // bulk add timesheet entries
  async addByTimesheetId(itemsToAdd: TimesheetEntry[]): Promise<void> {
    await this.TIMESHEETENTRY_REPOSITORY.bulkCreate(itemsToAdd);
  }

  // bulk update timesheet entries
  async updateByTimesheetEntryIds(timesheetId: number, updateProps: any): Promise<void> {
    await this.TIMESHEETENTRY_REPOSITORY.update(updateProps, { where: { timesheetId } });
  }

  async getTimesheetEntriesByTimesheetIdForCompany(timesheetId: number, companyId: number): Promise<TimesheetEntry[]> {
    return await this.TIMESHEETENTRY_REPOSITORY.findAll<TimesheetEntry>({ where: { timesheetId, companyId } });
  }

  async getTimesheetEntriesByTimesheetId(timesheetId: number): Promise<TimesheetEntry[]> {
    return await this.TIMESHEETENTRY_REPOSITORY.findAll<TimesheetEntry>({ where: { timesheetId } });
  }

  async getEntriesBetween(startDate: Date, endDate: Date, workerId: number): Promise<TimesheetEntry[]> {
    return await this.findAllWhere({
      where: {
        [Op.and]:[
          { finishDateTime: {
            [Op.lte]: endDate },
          },
          { startDateTime: {
            [Op.gte]: startDate },
          },
        ],
      },
      include: [
        { model: Timesheet, where: workerId }
      ],
      order: [
        ['finish_date_time', 'DESC'],
      ],
    });
  }

  //location events have their locationTimestamp included
  //timesettings can be a company or a dayOfWeekTimeSetting object
  generateOnSiteTimesheetEntries(locationEvents: LocationEvent[], timeSettings:any, tzStr: string) : TimesheetEntry[] {
    const { ENTER_SITE, EXIT_SITE } = eventTypeEnum;
    const { workingDayLatestFinish } = timeSettings;
    locationEvents.sort(
      (a, b) => momenttz(a.locationTimestamp.locationDateTime).isBefore(
        momenttz(b.locationTimestamp.locationDateTime)) ? -1 : 1);

    const entries:TimesheetEntry[] = [];
    locationEvents.forEach(le => {
      switch(le.eventType) {
        case ENTER_SITE:
          const tse = new TimesheetEntry();
          tse.startDateTime = le.locationTimestamp.locationDateTime;
          tse.siteId = le.locationTimestamp.closestSiteId;
          entries.push(tse);
        case EXIT_SITE:
          if(entries.length) {
            entries[entries.length - 1].finishDateTime = le.locationTimestamp.locationDateTime;
          }
      }
    });

    // check out the last entry, if it doesn't have a finishTime
    // then set it tho the default finish time and add a shouldCheck flag
    // if the battery runs out or device left onsite this can happen
    const lastEntry = entries[entries.length - 1];
    if(lastEntry && !lastEntry.finishDateTime) {
      lastEntry.finishDateTime = mtzFromDateTimeTZ(lastEntry.startDateTime,
        tzStr, workingDayLatestFinish).utc();
      lastEntry.shouldCheck = true;
      //TODO Add a timesheet note
    }
    entries[entries.length - 1] = lastEntry;
    return entries;
  }

  //location events are sorted by time and have their locationTimestamp included
  //Entries are in order of time aswell
  //timesettings can be a company or a dayOfWeekTimeSetting object
  generateOffSiteTimesheetEntries(onsiteEntries: TimesheetEntry[]) : TimesheetEntry[] {
    const entries:TimesheetEntry[] = [];

    onsiteEntries.forEach((e, i) => {
      //only looking for travel between sites so skip 1st one and the last one.
      if(i === 0 || i === onsiteEntries.length) {
        return;
      }
      const previousEntry = onsiteEntries[i - 1];
      if(e.siteId !== previousEntry.siteId) {
        const entry = new TimesheetEntry();
        entry.startDateTime = previousEntry.finishDateTime;
        entry.finishDateTime = e.startDateTime;
        entry.travel = true;
        entries.push(entry);
      }
    });
    return entries;
  }

  generateTimesheetEntries(locationEvents: LocationEvent[], timeSettings:any, tzStr: string) {
    const onsites = this.generateOnSiteTimesheetEntries(locationEvents, timeSettings, tzStr);
    const offsites = this.generateOffSiteTimesheetEntries(onsites);
    return [...onsites, ...offsites];
  }

  //if the total time does not include
  insertDerivedLunchBreakIntoEntries(entries: TimesheetEntry[], timeSetttings:any, minimumWorkingTimeToRemoveLunchBreak: number) {
    const { defaultLunchStart, defaultLunchEnd } = timeSetttings;
    const expectedLunchBreakTime = '';
    //const totalDayMinutes = moment(entries[0].startDateTime).diff(entries[entries.length - 1].finishDateTime, 'minutes');
    /*const totalTimeMinutes = entries.map(
      e => moment(e.startDateTime).diff(moment(e.finishDateTime, 'minutes'))).reduce((
        a, b) => a + b);*/

    //if(totalTimeMinutes < )

  }

}
