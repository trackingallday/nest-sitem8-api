import { Test, TestingModule } from '@nestjs/testing';
import { LocationTimestampController } from '../src/locationTimestamp/locationTimestamp.controller';
import { LocationTimestampModule } from '../src/locationTimestamp/locationTimestamp.module';
import { DatabaseModule } from '../src/db/database.module';
import { mockPost, mockGet } from './httpUtils';
import testconstants from './test-constants';
import { genLocationTimestamp } from './dataGenerators';



describe('tests the worker controller', () => {

  let locController: LocationTimestampController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, LocationTimestampModule],
    }).compile();
    locController = app.get<LocationTimestampController>(LocationTimestampController);
  });

  describe('CRUD for worker - make sure auth0 gets called', () => {

    it('creates some locations', async () => {
      const locs = testconstants.nearOrbicaPoints.map(c => {
        return genLocationTimestamp(testconstants.device.deviceId, c[1], c[0]);
      });

      const data = await Promise.all(locs.map(
        async l => await locController.create(mockPost('/locationtimestamp', l, { companyId: 1, id: 1 }), l)
      ));

    });

  });

});
