import { Test, TestingModule } from '@nestjs/testing';
import { LocationTimestampController } from '../src/locationTimestamp/locationTimestamp.controller';
import { LocationTimestampModule } from '../src/locationTimestamp/locationTimestamp.module';
import { DatabaseModule } from '../src/db/database.module';
import { mockPost, mockGet } from './httpUtils';
import testconstants from './test-constants';
import { genLocationTimestamp } from './dataGenerators';
import * as moment from 'moment';

const expectedDistance0 = 0;
const expectedDistance1 = 18;
const expectedDistance2 = 32;
const expectedDistance3 = 35;


describe('tests the LocationTimestampController', () => {

  let locController: LocationTimestampController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, LocationTimestampModule],
    }).compile();
    locController = app.get<LocationTimestampController>(LocationTimestampController);
  });

  describe('CRUD for locs', () => {

    it('creates some locations testing (also tests site service -> getClosestSite and getDistanceToSite)', async () => {

      const locs = testconstants.nearOrbicaPoints.map((c, i) => {
        return genLocationTimestamp(testconstants.device.deviceId, c[1], c[0], i);
      });

      const data = await Promise.all(locs.map(
        async l => await locController.create(
          mockPost('/locationtimestamp', l, { companyId: 1, id: 1 }), l)));

      const dsorted = data.sort((a, b) => {
        return a.closestSiteDistance < b.closestSiteDistance ? -1 : 1;
      });

      console.log(dsorted);
      expect(dsorted.map(d => d.closestSiteId).every(i => i === 1)).toBeTruthy();

      expect(Math.round(dsorted[0].closestSiteDistance)).toBe(expectedDistance0);
      expect(Math.round(dsorted[1].closestSiteDistance)).toBe(expectedDistance1);
      expect(Math.round(dsorted[2].closestSiteDistance)).toBe(expectedDistance2);
      expect(Math.round(dsorted[3].closestSiteDistance)).toBe(expectedDistance3);
    });

    it('gets the latest timestamps for the workers', async () => {
      const locs = await locController.getLatestLocations(
        mockGet('/latestlocationtimestamps', { companyId: 1, id: 1 }));

      expect(locs.length).toBe(1);
      expect(locs[0].closestSiteDistance).toBe(0);
    });

  });

});
