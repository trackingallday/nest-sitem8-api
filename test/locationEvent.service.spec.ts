import * as csv from 'csvtojson';
import * as fs from 'fs';
import * as parse from 'wellknown';
import { Test, TestingModule } from '@nestjs/testing';
import { LocationEventService } from '../src/locationEvent/locationEvent.service';
import { LocationEventModule } from '../src/locationEvent/locationEvent.module';
import { Company } from '../src/company/company.entity';
import { DatabaseModule } from '../src/db/database.module';
import { CompanyModule } from '../src/company/company.module';
import { CompanyService } from '../src/company/company.service';
import { TimesheetEntryModule } from '../src/timesheetEntry/timesheetEntry.module';
import { TimesheetEntryService } from '../src/timesheetEntry/timesheetEntry.service';
import * as momenttz from 'moment-timezone';
import { LocationEvent } from '../src/locationEvent/locationEvent.entity';


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

  it('generates location events from location timestamps', async () => {
    locs = await doImport('w146-locs.csv');
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
        });

      const evt = await locEvtService.createFromLocationTimestamp(
        locs[i], last10Min, company, company);
        evt.locationTimestamp = locs[i];
        locationEvents.push(evt);
    }

    expect(locationEvents.filter(t => t.eventType === 'on_site').length).toBe(572);
    expect(locationEvents.filter(t => t.eventType === 'enter_site').length).toBe(2);
    expect(locationEvents.filter(t => t.eventType === 'exit_site').length).toBe(2);
    expect(locationEvents.filter(t => t.eventType === 'privacy_blocked').length).toBe(12);
    expect(locationEvents.filter(t => t.eventType === 'off_site').length).toBe(288);
    expect(locationEvents.length).toBe(locs.length);
    locationEventsContainer = [...locationEvents];
  });

  it('generates timesheetEntries From the locationEvents', async () => {

    await new Promise((res) => {
      if(locationEventsContainer && locationEventsContainer.length) {
        res();
      }
    });

    const onsiteEntries = timesheetEntryService.generateOnSiteTimesheetEntries(
      locationEventsContainer, company, 'Pacific/Auckland');
    const offsiteEntries = timesheetEntryService.generateOffSiteTimesheetEntries(onsiteEntries);
    expect(onsiteEntries.length).toBe(2);
    expect(offsiteEntries.length).toBe(0);
    expect(momenttz(onsiteEntries[0].startDateTime).format()).toBe('2018-09-01T019:44:50.000Z');
    expect(momenttz(onsiteEntries[0].finishDateTime).format()).toBe(' 2018-09-02T01:10:00.000Z');
    expect(momenttz(onsiteEntries[1].startDateTime).format()).toBe(' 2018-09-02T01:17:00.000Z');
    expect(momenttz(onsiteEntries[1].finishDateTime).format()).toBe('2018-09-02T05:36:00.000Z');

  });

  it('logs lots of things', () => {
    console.log(locationEventsContainer.filter(t => t.eventType === 'privacy_blocked').map(
      l => momenttz.utc(l.locationTimestamp.locationDateTime).tz('Pacific/Auckland')));
    console.log(locationEventsContainer.filter(t => t.eventType === 'enter_site').map(
      l => momenttz.utc(l.locationTimestamp.locationDateTime).tz('Pacific/Auckland')));
    console.log(locationEventsContainer.filter(t => t.eventType === 'exit_site').map(
      l => momenttz.utc(l.locationTimestamp.locationDateTime).tz('Pacific/Auckland')));

    console.log(locationEventsContainer.filter(t => t.eventType === 'privacy_blocked').map(
      l => l.locationTimestamp.locationDateTime));
    console.log(locationEventsContainer.filter(t => t.eventType === 'enter_site').map(
      l => l.locationTimestamp.locationDateTime));
    console.log(locationEventsContainer.filter(t => t.eventType === 'exit_site').map(
      l => l.locationTimestamp.locationDateTime));
  })


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

function unsetTZ(lt) {
  const lTime = momenttz(lt.locationDateTime).utc();
  lt.locationDateTime = momenttz(lTime.format('YYYY-MM-DD HH:mm')).toDate();
  lt.creationDateTime = momenttz(lTime.format('YYYY-MM-DD HH:mm')).toDate();
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
      res(csvRows.map((l, i) => unsetTZ(setIds(fixGeom(l, i), i))));
    });
  });
}

