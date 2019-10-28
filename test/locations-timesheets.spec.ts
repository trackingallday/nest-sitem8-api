import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../src/db/database.module';
import { LocationTimestampModule } from '../src/locationTimestamp/locationTimestamp.module';
import { LocationTimestampController } from '../src/locationTimestamp/locationTimestamp.controller';
import { TimesheetModule } from '../src/timesheet/timesheet.module';
import { TimesheetController } from '../src/timesheet/timesheet.controller';
import { TimesheetEntry } from '../src/timesheetEntry/timesheetEntry.entity';
import { mockPost, mockGet } from './utils/httpUtils';
import * as testlocs from './testdata/orbica-morning.json';
import { genLocationTimestamp } from './utils/dataGenerators';
import testConstants from './testdata/test-constants';
import * as momenttz from 'moment-timezone';


// To mock classes using typescript follow this pattern exactly or it breaks
let mockCreateUser = jest.fn();
mockCreateUser.mockReturnValue({ user_id: "authid" });
 //do not use an arrow function here

describe('tests the company controller', () => {

  let locController: LocationTimestampController;
  let timesheetController: TimesheetController;
  let locs = [];
  let createdLocs = [];
  let timesheetEntries:TimesheetEntry[];
  let savedEntries:TimesheetEntry[];

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, LocationTimestampModule, TimesheetModule],
    }).compile();

    locController = app.get<LocationTimestampController>(LocationTimestampController);
    timesheetController = app.get<TimesheetController>(TimesheetController);
  });

  it('creates locations for a timesheet and pings the timesheet controller and gets the timesheet entries', async () => {
    // start the date at 6am nz time yesterday;
    const sDate = momenttz().subtract(1, 'days');
    sDate.hour(16).minute(20);

    locs = testlocs.features.filter(f => f.geometry.type === "Point").map((f, i) => {
      const c = f.geometry.coordinates;
      sDate.add(3, 'minutes');
      const d = sDate.toDate();
        return genLocationTimestamp(testConstants.device2.deviceId, c[1], c[0], i, d);
    });

    for(var i = 0; i < locs.length; i ++) {
      const loct:any = await locController.create(mockPost('/locationtimestamp', locs[i], { companyId: 1, id: 4 }), locs[i]);
      createdLocs.push(loct);
      expect(loct.locationEvent).toBeTruthy();
    }
    const startDate = createdLocs[0].locationDateTime;
    const endDate = createdLocs[createdLocs.length - 1].locationDateTime;
    const workerId = createdLocs[0].workerId;
    const params = { startDate, endDate };
    timesheetEntries = await timesheetController.getTimesheetEntriesByDateRange(
      mockPost(`/timesheetentriesbydaterange/${workerId}`, params, { companyId: 1, id: 4 }), workerId, params);

    expect(timesheetEntries.length).toBe(2);

    expect(timesheetEntries[0].startDateTime.getTime()).toBeLessThan(timesheetEntries[0].finishDateTime.getTime());
    expect(Math.abs(momenttz.duration(momenttz(timesheetEntries[0].startDateTime).diff(
      timesheetEntries[0].finishDateTime)).asMinutes())).toBe(102);

    expect(timesheetEntries[1].startDateTime.getTime()).toBeLessThan(timesheetEntries[1].finishDateTime.getTime());
    expect(Math.abs(momenttz.duration(momenttz(timesheetEntries[1].startDateTime).diff(
      timesheetEntries[1].finishDateTime)).asMinutes())).toBe(111);
    // expect no saved entries
    expect(timesheetEntries.find(e => !!e.id)).toBeFalsy();
  });

  it('saves a timesheet and timesheet entries', async () => {

    const ts = {
      startDateTime: momenttz().tz('Pacific/Auckland').subtract(1, 'days').startOf('day').toDate(),
      finishDateTime: momenttz().tz('Pacific/Auckland').add(5, 'days').endOf('day').toDate(),
      status: 0,
      workerId: 4,
    };

    const tsres = await timesheetController.create(
      mockPost(`/createtimesheet`, ts, { companyId: 1, id: 4 }), ts);
    expect(tsres.id).toBeTruthy();

    const tseJson = timesheetEntries.map(tse => tse.toJSON());

    const tseres = await timesheetController.savemanyentries(
      mockPost(`/savemanyentries/${tsres.id}`, tseJson, { companyId: 1, id: 4 }), tsres.id, tseJson);
    expect(tseres.length).toBe(2);
    expect(tseres.every((t) => !t.id));
  });

  it('gets timesheet entries and checks for ids on them', async () => {

    const startDate = createdLocs[0].locationDateTime;
    const endDate = createdLocs[createdLocs.length - 1].locationDateTime;
    const workerId = createdLocs[0].workerId;
    const params = { startDate, endDate };
    savedEntries = await timesheetController.getTimesheetEntriesByDateRange(
      mockPost(`/timesheetentriesbydaterange/${workerId}`, params, { companyId: 1, id: 4 }), workerId, params);
    expect(savedEntries.length).toBe(2);
    expect(savedEntries.every(a => !!a.id)).toBeTruthy();
  });

  it('updates a saved entry add an hour to the end of it', async () => {

    const savedEntry:any = { ...savedEntries[1].toJSON() };
    savedEntry.finishDateTime = momenttz(savedEntry.finishDateTime).add(1, 'hours').toDate();
    const updateEntry = await timesheetController.update(
      mockPost(`/updateoneentry`, savedEntry, { companyId: 1, id: 4 }), savedEntry);

    expect(updateEntry.startDateTime.toISOString()).toBe(savedEntry.startDateTime.toISOString());
    expect(updateEntry.finishDateTime.toISOString()).toBe(savedEntry.finishDateTime.toISOString());

  });


});
