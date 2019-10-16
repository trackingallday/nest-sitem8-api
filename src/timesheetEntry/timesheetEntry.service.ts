
import { Injectable, Inject } from '@nestjs/common';
import { TimesheetEntry } from './timesheetEntry.entity';
import { LocationEvent } from '../locationEvent/locationEvent.entity';
import { TimesheetEntryInterface } from './timesheetEntry.interface';
import { isNil, isEmpty, intersectionBy, differenceBy } from 'lodash';
import { eventTypeEnum } from '../locationEvent/constants';
import { mtzFromDateTimeTZ } from '../utils/dateUtils';
import * as moment from 'moment';


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

  // delete timesheet entries by ids in imput array
  async deleteByTimesheetEntryIds(timesheetEntryId: number[]): Promise<void> {
    await this.TIMESHEETENTRY_REPOSITORY.destroy({ where: { timesheetEntryId } });
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

  async overwriteTimesheetEntries(newEntries: TimesheetEntry[], timesheetId: number, loggedInWorkerName: string, loggedInWorkerId: number) {
    const oldEntries = await this.getTimesheetEntriesByTimesheetId(timesheetId);

    if ((await this.TIMESHEETENTRY_REPOSITORY.count({ where: { timesheetId: { $ne: timesheetId } } })) > 0) {
      // todo:
      // throw new SiteM8Exception("Bad timesheet ID");
    }

    // Timesheet entries to add.
    const entriesToAdd = newEntries.filter(x => x.timesheetId === 0);
    if (!isNil(entriesToAdd) && !isEmpty(entriesToAdd)) { await this.addByTimesheetId(entriesToAdd); }

    // Timesheet entries to update.
    const entriesToUpdate = intersectionBy(newEntries, oldEntries, 'timesheetEntryId');
    if (!isNil(entriesToUpdate) && !isEmpty(entriesToUpdate)) {
      const timesheetEntriesUpdate: TimesheetEntry[] = [];
      entriesToUpdate.forEach(u => {
        const o = oldEntries.find(f => f.timesheetEntryId === u.timesheetEntryId);
        if (o.startDateTime !== u.startDateTime || o.finishDateTime !== u.finishDateTime
          || u.siteId !== u.siteId || o.travel !== u.travel) {
            u.description = `Update by ${loggedInWorkerName}`;
            u.modifiedWorkerId = loggedInWorkerId;
            timesheetEntriesUpdate.push(u);
        }
      });
      await this.updateByTimesheetEntryIds(timesheetId, timesheetEntriesUpdate);
    }

    // Timesheet entries to delete.
    const entriesToDelete = differenceBy(oldEntries, newEntries, 'timesheetEntryId');
    if (!isNil(entriesToDelete) && !isEmpty(entriesToDelete)) {
      await this.deleteByTimesheetEntryIds(entriesToDelete.map(x => x.timesheetEntryId));
    }
  }

  //location events are sorted by time and have their locationTimestamp included
  //timesettings can be a company or a dayOfWeekTimeSetting object
  generateOnSiteTimesheetEntries(locationEvents: LocationEvent[], timeSettings:any, tzStr: string) : TimesheetEntry[] {
    const { ENTER_SITE, EXIT_SITE } = eventTypeEnum;
    const { workingDayLatestFinish } = timeSettings;
    const entries:TimesheetEntry[] = [];
    locationEvents.forEach(le => {
      switch(le.eventType) {
        case ENTER_SITE:
          const tse = new TimesheetEntry();
          tse.startDateTime = le.locationTimestamp.locationDateTime;
          tse.siteId = le.locationTimestamp.closestSiteId;
          entries.push(tse);
        case EXIT_SITE:
          entries[entries.length - 1].finishDateTime = le.locationTimestamp.locationDateTime;
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
