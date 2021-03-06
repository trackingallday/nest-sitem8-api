import { Test, TestingModule } from '@nestjs/testing';
import { LocationTimestampController } from '../src/locationTimestamp/locationTimestamp.controller';
import { LocationTimestampModule } from '../src/locationTimestamp/locationTimestamp.module';
import { DatabaseModule } from '../src/db/database.module';
import { mockPost, mockGet } from './utils/httpUtils';
import testconstants from './testdata/test-constants';
import { genLocationTimestamp } from './utils/dataGenerators';
import * as moment from 'moment';
import testConstants from './testdata/test-constants';

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
        // -120 to put these into the future so no overlap
        return genLocationTimestamp(testconstants.device.deviceId, c[1], c[0], i - 120);
      });

      const data = await Promise.all(locs.map(
        async l => await locController.create(
          mockPost('/locationtimestamp', l, { companyId: 1, id: 1 }), l)));

      const dsorted:any[] = data.sort((a:any, b:any) => {
        return a.closestSiteDistance < b.closestSiteDistance ? -1 : 1;
      });

      expect(dsorted.map((d:any) => d.closestSiteId).every(i => i === 1)).toBeTruthy();
      expect(Math.round(dsorted[0].closestSiteDistance)).toBe(expectedDistance0);
      expect(Math.round(dsorted[1].closestSiteDistance)).toBe(expectedDistance1);
      expect(Math.round(dsorted[2].closestSiteDistance)).toBe(expectedDistance2);
      expect(Math.round(dsorted[3].closestSiteDistance)).toBe(expectedDistance3);
    });

    it('gets the latest timestamps for the workers', async () => {
      const locs = await locController.getLatestLocations(
        mockGet('/latestlocationtimestamps', { companyId: 1, id: 1 }));

      expect(locs.find(l => l.deviceId === testConstants.device.deviceId)).toBeDefined();
      expect(locs.filter(l => l.deviceId === testConstants.device.deviceId).length).toBe(1);
    });

  });

});
