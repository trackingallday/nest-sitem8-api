import * as csv from 'csvtojson';
import * as fs from 'fs';
import * as parse from 'wellknown';
import { Test, TestingModule } from '@nestjs/testing';
import { LocationEventService, isPrivacyBlocked } from '../src/locationEvent/locationEvent.service';
import { LocationEventModule } from '../src/locationEvent/locationEvent.module';
import { Company } from '../src/company/company.entity';
import { DatabaseModule } from '../src/db/database.module';
import { CompanyModule } from '../src/company/company.module';
import { CompanyService } from '../src/company/company.service';
import { TimesheetEntryModule } from '../src/timesheetEntry/timesheetEntry.module';
import { TimesheetEntryService } from '../src/timesheetEntry/timesheetEntry.service';
import * as momenttz from 'moment-timezone';


describe('tests the Location Timstamp Service', () => {

  let locEvtService: LocationEventService;
  let companyService: CompanyService;
  let timesheetEntryService: TimesheetEntryService;
  let locs:any[] = [];
  let locEvts:any = [];
  let company:Company;
  let locationEventsContainer:any = [];

  const fakeFindOne = (props) => {
    const b = locEvts.find(le => le.locationTimestampId === props.where.locationTimestampId);
    return new Promise((res) => res(b));
  }

  const fakeSave = (locEvt) => {
    locEvt.id = locEvt.locationTimestampId;
    locEvts = [...locEvts, { ...locEvt }];
    return new Promise((res) => res({ ...locEvt }));
  }

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, LocationEventModule, CompanyModule, TimesheetEntryModule],
    }).compile();
    locEvtService = await app.get<LocationEventService>(LocationEventService);
    companyService = await app.get<CompanyService>(CompanyService);
    timesheetEntryService = await app.get<TimesheetEntryService>(TimesheetEntryService);
    const companyVals = companyService.initialiseDefaultValues();
    company = new Company();
    company.set(companyVals);
  });


  // big nasty long test - because I don't want to put in promises to wait on the next it each time
  it('generates location events from location timestamps', async () => {

    locs = await doImport('testdata/w146-locs.csv');
    locEvtService['findOneWhere'] = fakeFindOne;
    locEvtService['create'] = fakeSave;

    const locationEvents = [];
    const elevenmin = momenttz.duration(11, 'minutes');
    for(var i = 0; i < locs.length; i ++) {
      const last10Min = locs.slice(i - 11, i).filter(
        l => {
          const dt =  momenttz(l.locationDateTime);
          const start = momenttz(locs[i].locationDateTime).subtract(elevenmin);
          return dt.isAfter(start);
        }).map(lt => {
          const le = locationEvents.find(le => le.locationTimestampId === lt.id);
          return { ...lt, locationEvent: le };
        });

      const evt = await locEvtService.createFromLocationTimestamp(
        locs[i], last10Min, company, company);
      evt.locationTimestamp = locs[i];
      locationEvents.push(evt);
    }

    expect(locationEvents.filter(t => t.eventType === 'on_site').length).toBe(572);
    expect(locationEvents.filter(t => t.eventType === 'enter_site').length).toBe(2);
    expect(locationEvents.filter(t => t.eventType === 'exit_site').length).toBe(2);
    expect(locationEvents.filter(t => t.eventType === 'privacy_blocked').length).toBe(232);
    expect(locationEvents.filter(t => t.eventType === 'off_site').length).toBe(68);
    expect(locationEvents.length).toBe(locs.length);
    locationEventsContainer = [...locationEvents];
  });

  it('uses the location events to create timesheet entries', async () => {

    const onsiteEntries = timesheetEntryService.generateOnSiteTimesheetEntries(
      locationEventsContainer, company, 'Pacific/Auckland');
    const offsiteEntries = timesheetEntryService.generateOffSiteTimesheetEntries(onsiteEntries);
    expect(onsiteEntries.length).toBe(2);
    expect(offsiteEntries.length).toBe(0);
    expect(momenttz(onsiteEntries[0].startDateTime).format()).toBe('2018-09-02T19:44:50+00:00');
    expect(momenttz(onsiteEntries[0].finishDateTime).format()).toBe('2018-09-03T01:10:43+00:00');
    expect(momenttz(onsiteEntries[1].startDateTime).format()).toBe('2018-09-03T01:17:45+00:00');
    expect(momenttz(onsiteEntries[1].finishDateTime).format()).toBe('2018-09-03T05:36:02+00:00');

    /* for reference here is the results from the old system
      id,timesheetId,startDateTime,finishDateTime,modifiedWorkerId,siteId,travel,description,WorkerId
      3046,794,2018-09-02 19:16:00.000,2018-09-02 19:27:00.000,NULL,8,0,Calculated from GPS,146
      3047,794,2018-09-02 19:27:00.000,2018-09-02 19:35:00.000,NULL,NULL,1,Calculated from GPS,146
      3048,794,2018-09-02 19:35:00.000,2018-09-02 19:39:00.000,NULL,8,0,Calculated from GPS,146
      3049,879,2018-09-02 20:06:00.000,2018-09-03 01:10:00.000,NULL,12,0,Calculated from GPS,146
      3050,879,2018-09-03 01:17:00.000,2018-09-03 05:36:00.000,NULL,12,0,Calculated from GPS,146
    */

    const isBlocked1 = isPrivacyBlocked(locs[0], company, 'Pacific/Auckland');
    expect(isBlocked1).toBeTruthy();
    const isBlocked2 = isPrivacyBlocked(locs[200], company, 'Pacific/Auckland');
    expect(isBlocked2).toBeFalsy();
  });


});

function fixGeom(lt, i) {
  const geoj = parse(lt['geom']);
  lt.geom = geoj;
  return lt;
}

function setIds(lt, i) {
  lt.id = i + 1;
  lt.workerId = 3;
  return lt;
}

function setDates(lt) {
  lt.locationDateTime = new Date(lt.locationDateTime);
  lt.creationDateTime = new Date(lt.creationDateTime);
  return lt;
}

async function doImport(filename): Promise<any[]> {
  return new Promise(async (res) => {
    fs.readFile(`${__dirname}\\${filename}`, 'utf8', async (err, data) => {
      if(err) {
        console.error(err);
        return;
      }
      const csvRows = await csv().fromString(data);
      res(csvRows.map((l, i) => setDates(setIds(fixGeom(l, i), i))));
    });
  });
}

