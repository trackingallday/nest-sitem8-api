import { Test, TestingModule } from '@nestjs/testing';
import { WorkerController } from '../src/worker/worker.controller';
import { WorkerModule } from '../src/worker/worker.module';
import { DatabaseModule } from '../src/db/database.module';
import { mockPost, mockGet } from './utils/httpUtils';


function genWorker(isSupervisor, isWorker, isAdministrator, email, supervisor, deviceId = null) {
  return {
    id: undefined,
    name: 'babby',
    mobile: '02345234234',
    email,
    payrollId: '234234234',
    supervisor: supervisor,
    mobileNotifications: true,
    emailNotifications: true,
    isEnabled: true,
    isWorker,
    isSupervisor,
    isAdministrator,
    deviceId: deviceId,
    companyId: 1,
    authId: '',
    base64Image: null,
    isSuperAdministrator: false,
  };
}

// To mock classes using typescript follow this pattern exactly or it breaks
let mockCreateUser = jest.fn();
mockCreateUser.mockReturnValue({ user_id: "authid" });
 //do not use an arrow function here
jest.mock('../src/common/auth0.gateway', function() {
  return {
    //that default is very important
    default: jest.fn().mockImplementation(() => {
      return { createUser: mockCreateUser };
    }),
  };
});

describe('tests the worker controller', () => {

  let workerController: WorkerController;
  let supervisorId = null;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, WorkerModule],
    }).compile();
    workerController = app.get<WorkerController>(WorkerController);
  });

  describe('CRUD for worker - make sure auth0 gets called', () => {

    it('creates a admin', async () => {
      const params = genWorker(false, true, false, 'admin1@gmail.com', null);
      const data = await workerController.create(mockPost('/worker', params, { companyId: 1 }), params);
      expect(data.email).toBe('admin1@gmail.com');
      expect(data.authId).toBe("authid");
      expect(mockCreateUser).toBeCalled();
    });

    it('creates a supervisor', async () => {
      const params = genWorker(true, false, false, 'supervisor1@gmail.com', null);
      const data = await workerController.create(mockPost('/worker', params, { companyId: 1 }), params);
      expect(data.email).toBe('supervisor1@gmail.com');
      expect(data.authId).toBe("authid");
      expect(mockCreateUser).toBeCalledTimes(2);

    });

    it('creates a worker', async () => {
      const params = genWorker(false, false, true, 'worker1@gmail.com', supervisorId, 1);
      const data = await workerController.create(mockPost('/worker', params, { companyId: 1 }), params);
      expect(data.email).toBe('worker1@gmail.com');
      expect(data.authId).toBe("authid");
      expect(mockCreateUser).toBeCalledTimes(3);
    });

    it('gets all the workers', async () => {
      const data = await workerController.findAll(mockGet('/worker', { companyId: 1 }));
      expect(data.length).toBe(7);
    });

    it('updates the admin', async () => {
      const adminWorker = await workerController.findById(mockGet('/worker/1', { companyId: 1 }), 1);
      expect(adminWorker.email).toBe('admin@email.com');
      const newAdmin = genWorker(false, true, false, 'admin2@gmail.com', null);
      const data = await workerController.update(mockPost('/worker/1', newAdmin, { companyId: 1 }), 1, newAdmin);
      expect(data.email).toBe('admin2@gmail.com');
    });

    it('getsenabledsupervisors', async () => {
      const data = await workerController.getEnabledSupervisors(
        mockGet('/worker/getenabledsupervisors', { companyId: 1}));
      expect(data.length).toBe(2);
      expect(data[0].id).toBe(2);
    });

  });
});
