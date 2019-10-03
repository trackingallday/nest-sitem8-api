import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenService } from '../src/accessToken/accessToken.service';
import { AccessTokenModule } from '../src/accessToken/accessToken.module';
import { WorkerModule } from '../src/worker/worker.module';
import { DatabaseModule } from '../src/db/database.module';


let mockCreatePassword = jest.fn();
mockCreatePassword.mockReturnValue("password");

jest.mock('../src/common/global', function() {
  return { createPassword: jest.fn().mockImplementation(() => {
    return mockCreatePassword();
  })
  }
});


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
      expect(token).toBe("password");
      expect(mockCreatePassword).toBeCalled();
    });

    it('gets the worker from the token', async () => {
      const worker = await accService.getWorkerFromAccessToken('password');
      expect(worker.id).toBe(3);
    });

    it('gets the access token', async () => {
      const actoken = await accService.getAccessToken("password");
      expect(actoken.id).toBe(1);
    });


  });

});

