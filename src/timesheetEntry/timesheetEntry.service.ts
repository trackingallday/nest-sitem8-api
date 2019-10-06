
import { Injectable, Inject } from '@nestjs/common';
import { TimesheetEntry } from './timesheetEntry.entity';
import { TimesheetEntryInterface } from './timesheetEntry.interface';
import { isNil, isEmpty, intersectionBy, differenceBy } from 'lodash';

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
}
