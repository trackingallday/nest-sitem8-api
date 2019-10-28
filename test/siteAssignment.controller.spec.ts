import { Test, TestingModule } from '@nestjs/testing';
import { SiteAssignmentController } from '../src/siteAssignment/siteAssignment.controller';
import { SiteAssignmentModule } from '../src/siteAssignment/siteAssignment.module';
import { DayOfWeekTimeSettingModule } from '../src/dayOfWeekTimeSetting/dayOfWeekTimeSetting.module';
import { WorkerAssignmentModule } from '../src/workerAssignment/workerAssignment.module';
import { NotificationModule } from '../src/notification/notification.module';
import { DatabaseModule } from '../src/db/database.module';
import { AddSiteAssignmentParams } from '../src/siteAssignment/siteAssignment.interface';
import { SiteAssignment } from '../src/siteAssignment/siteAssignment.entity';
import { WorkerAssignment } from '../src/workerAssignment/workerAssignment.entity';
import { DayOfWeekTimeSetting } from '../src/dayOfWeekTimeSetting/dayOfWeekTimeSetting.entity';
import { DayOfWeekTimeSettingService } from '../src/dayOfWeekTimeSetting/dayOfWeekTimeSetting.service';
import { WorkerAssignmentService } from '../src/workerAssignment/workerAssignment.service';
import { NotificationService } from '../src/notification/notification.service';
import { SiteAssignmentService } from '../src/siteAssignment/siteAssignment.service';
// tslint:disable-next-line:no-var-requires
const Email = require('../src/common/send.email');
jest.mock('../src/common/send.email');
// tslint:disable-next-line:no-var-requires
const nodemailer = require('nodemailer');
jest.mock('nodemailer');

let sendMailMock;

function genWorker(email, workerId, deviceId = null) {
  return {
    id: undefined,
    workerId,
    name: 'babby',
    mobile: '02345234234',
    email,
    payrollId: '234234234',
    supervisor: null,
    mobileNotifications: true,
    emailNotifications: true,
    isEnabled: true,
    isWorker: true,
    isSupervisor: false,
    isAdministrator: false,
    deviceId,
    companyId: 1,
    authId: '',
    base64Image: null,
    isSuperAdministrator: false,
  };
}

function genSiteAssignment() {
  const result = new SiteAssignment();
  result.id = undefined;
  result.siteId = 1;
  result.siteAssignmentId = 1;
  return result;
}

function genWorkerAssignment(workerId, email) {
  const result = new WorkerAssignment();
  result.id = undefined;
  result.workerId = workerId;
  return result;
}
function genDayOfWeekSettings(dayInweek) {
  const result = new DayOfWeekTimeSetting();
  result.id = undefined;
  result.dayInWeek = dayInweek;
  return result;
}

describe('tests the siteAssignment controller', () => {

  let siteAssignmentController: SiteAssignmentController;

  beforeEach(async () => {
    jest.mock('../src/common/send.sms', () => ({
      sendSMS: jest.fn().mockResolvedValue({code: 200, info: {}}),
    }));
    sendMailMock = jest.fn().mockResolvedValue({code: 200, info: {}});
    nodemailer.createTransport.mockReturnValue({sendMail: sendMailMock});

    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, SiteAssignmentModule],
    }).compile();
    siteAssignmentController = app.get<SiteAssignmentController>(SiteAssignmentController);
  });

  it('should be defined', async () => {
      expect(siteAssignmentController).toBeDefined();
    });

  it('creates a siteAssignment', async () => {
      const params: AddSiteAssignmentParams = new AddSiteAssignmentParams();
      params.siteAssignment = genSiteAssignment();
      params.message = 'testing site assignment';
      params.dayOfWeekSettings = [genDayOfWeekSettings(1), genDayOfWeekSettings(2)];
      params.workerAssignments = [genWorkerAssignment(1, 'a1@gmail.com'), genWorkerAssignment(2, 'a2@gmail.com'),
                                  genWorkerAssignment(3, 'a3@gmail.com')];
      const savedAssignment = await siteAssignmentController.addAssignment(params);

      expect(savedAssignment.id).toBeDefined();
      expect(savedAssignment.workerAssignments.length).toBe(3);
      expect(savedAssignment.dayOfWeekTimeSettings.length).toBe(2);
    });

});
