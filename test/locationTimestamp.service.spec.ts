import { Test, TestingModule } from '@nestjs/testing';
import { LocationTimestampService } from '../src/locationTimestamp/locationTimestamp.service';
import { LocationTimestampModule } from '../src/locationTimestamp/locationTimestamp.module';
import { DatabaseModule } from '../src/db/database.module';
import moment = require('moment');


describe('tests the Location Timstamp Service', () => {

  let locService: LocationTimestampService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, LocationTimestampModule],
    }).compile();
    locService = app.get<LocationTimestampService>(LocationTimestampService);
  });

  describe('test up the location service functions', () => {

    it('checks last onsite', async () => {
      const allLocs = await locService.findAll();
      const lastOnSite = await locService.getLastOnSite(3, 40);
      const latestLoc = allLocs.sort((a, b) => {
        return moment(a.locationDateTime).isAfter(moment(b.locationDateTime)) ? -1 : 1;
      })[0];
      expect(lastOnSite.closestSiteDistance).toBe(latestLoc.closestSiteDistance);
      expect(lastOnSite.id).toBe(latestLoc.id);
    });

    it('checks findByCompanyIdDateRange', async () => {
      const allLocs = await locService.findAllWhere({ where: { deviceId: '32q453453145345' }})
      allLocs.sort((a, b) => {
        return moment(a.locationDateTime).isAfter(moment(b.locationDateTime)) ? 1 : -1;
      });
      const startDate = allLocs[1].locationDateTime;
      const endDate = allLocs[3].locationDateTime;
      const inRange = await locService.findByCompanyIdDateRange(startDate, endDate, 1);

      expect(inRange.length).toBe(3);
      expect(allLocs[2].locationDateTime.getTime()).toBeGreaterThan(
        inRange[inRange.length - 1].locationDateTime.getTime());

      expect(allLocs[0].locationDateTime.getTime()).toBeLessThan(
        inRange[0].locationDateTime.getTime());
    });

    it('checks findByDeviceIdDateRange', async () => {
      const allLocs = await locService.findAllWhere({ where: { deviceId: '32q453453145345' }});

      allLocs.sort((a, b) => {
        return moment(a.locationDateTime).isAfter(moment(b.locationDateTime)) ? 1 : -1;
      });

      const startDate = allLocs[1].locationDateTime;
      const endDate = allLocs[2].locationDateTime;

      const inRange = await locService.findByDeviceIdDateRange(startDate, endDate, '32q453453145345');

      expect(inRange.length).toBe(2);

      expect(allLocs[1].locationDateTime.getTime()).toBe(
        inRange[inRange.length - 1].locationDateTime.getTime());

      expect(allLocs[0].locationDateTime.getTime()).toBeLessThan(
        inRange[0].locationDateTime.getTime());
    });

  });

});

