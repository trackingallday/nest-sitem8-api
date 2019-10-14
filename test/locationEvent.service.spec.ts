import * as csv from 'csvtojson';
import * as fs from 'fs';
import * as parse from 'wellknown';
import { Test, TestingModule } from '@nestjs/testing';
import { LocationEventService } from '../src/locationEvent/locationEvent.service';
import { LocationEventModule } from '../src/locationEvent/locationEvent.module';
import { LocationTimestampModule } from '../src/locationTimestamp/locationTimestamp.module';
import { LocationTimestampService } from '../src/locationTimestamp/locationTimestamp.service';
import { Company } from '../src/company/company.entity';
import { DatabaseModule } from '../src/db/database.module';
import { CompanyModule } from '../src/company/company.module';
import { CompanyService } from '../src/company/company.service';
import * as momenttz from 'moment-timezone';


describe('tests the Location Timstamp Service', () => {

  let locEvtService: LocationEventService;
  let companyService: CompanyService;
  let locs:any[] = [];
  let locEvts:any = [];

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
      imports: [DatabaseModule, LocationEventModule, CompanyModule],
    }).compile();
    locEvtService = await app.get<LocationEventService>(LocationEventService);
    companyService = await app.get<CompanyService>(CompanyService);
  });

  it('generates location events from location timestamps', async () => {
    locs = await doImport('w146-locs.csv');
    const companyVals = companyService.initialiseDefaultValues();
    const company = new Company();
    company.set(companyVals);
    locEvtService['findOneWhere'] = fakeFindOne;
    locEvtService['create'] = fakeSave;
    const evtvtvttvtv = [];
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
      evtvtvttvtv.push(evt);
    }
    expect(evtvtvttvtv.filter(t => t.eventType === 'on_site').length).toBe(572);
    expect(evtvtvttvtv.filter(t => t.eventType === 'enter_site').length).toBe(2);
    expect(evtvtvttvtv.filter(t => t.eventType === 'exit_site').length).toBe(2);
    expect(evtvtvttvtv.filter(t => t.eventType === 'privacy_blocked').length).toBe(6);
    expect(evtvtvttvtv.filter(t => t.eventType === 'off_site').length).toBe(294);
    expect(evtvtvttvtv.length).toBe(locs.length);
  });

});

function fixGeom(lt, i) {
  const geoj = parse(lt['geom']);
  lt.geom = geoj;
  lt.id = i + 1;
  lt.workerId = 3;
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
      res(csvRows.map(fixGeom));
    });
  });
}

