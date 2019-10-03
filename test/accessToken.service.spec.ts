import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenService } from '../src/accessToken/accessToken.service';
import { AccessTokenController } from '../src/accessToken/accessToken.controller';
import { WorkerService } from '../src/worker/worker.service';
import { WorkerProvider } from '../src/worker/worker.provider';
import { AccessTokenModule } from '../src/accessToken/accessToken.module';
import { AppModule } from '../src/app.module';
import { WorkerModule } from '../src/worker/worker.module';
import { DatabaseModule } from '../src/db/database.module';
import { mockPost, mockGet } from './httpUtils';
import testconstants from './test-constants';
import { genLocationTimestamp } from './dataGenerators';


describe('tests the Access Token', () => {

  let accService: AccessTokenService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, WorkerModule, AccessTokenModule],
    }).compile();
    accService = app.get<AccessTokenService>(AccessTokenService);
  });

  describe('test up the accessToken service', () => {

    it('creates an access token', async () => {
      const token = await accService.createAccessToken(3);//OUR 3RD WORKER IS THE WORKER
      expect(token).toBe("234234234243");
    });

  });

});

