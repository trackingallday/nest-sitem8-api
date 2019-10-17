import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../src/db/database.module';
import { WorkerModule } from '../src/worker/worker.module';
import { NotificationModule } from '../src/notification/notification.module';
import { NotificationService } from '../src/notification/notification.service';
import { Worker } from '../src/worker/worker.entity';
import { NotificationStatus } from '../src/notification/constants';

// tslint:disable-next-line:no-var-requires
const Email = require('../src/common/send.email');
jest.mock('../src/common/send.email');
// tslint:disable-next-line:no-var-requires
const nodemailer = require('nodemailer');
jest.mock('nodemailer');

let sendMailMock;

function genWorker() {
  return new Worker({
    id: undefined,
    name: 'babby',
    mobile: '+64224766245',
    email: 'admin@gmail.com',
    payrollId: '234234234',
    supervisor: null,
    mobileNotifications: true,
    emailNotifications: true,
    isEnabled: true,
    isWorker: true,
    isSupervisor: false,
    isAdministrato: false,
    deviceId: null,
    companyId: 1,
    authId: '',
    base64Image: null,
    isSuperAdministrator: false,
  });
}

describe('Tests notification service', () => {

  let notificationService: NotificationService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, NotificationModule, WorkerModule],
    }).compile();
    notificationService = await app.get<NotificationService>(NotificationService);
  });

  it('Add notification on sms sent and email sent unsuccessfully', async () => {
    jest.mock('../src/common/send.sms', () => ({
      sendSMS: jest.fn().mockResolvedValue({code: 404, info: {}}),
    }));
    sendMailMock = jest.fn().mockResolvedValue({code: 404, info: {}});
    nodemailer.createTransport.mockReturnValue({sendMail: sendMailMock});

    const worker: Worker = genWorker();
    worker.mobile = '';
    worker.email = '';
    const notification = await notificationService.addNotification('category1', 'testing add notification description', worker);
    expect(notification).not.toBeNull();
    expect(notification.smsStatus).toBe(NotificationStatus.NotSent);
    expect(notification.emailStatus).toBe(NotificationStatus.NotSent);
    });

  it('Add notification on sms sent and email sent successfully', async () => {
    jest.mock('../src/common/send.sms', () => ({
      sendSMS: jest.fn().mockResolvedValue({code: 200, info: {}}),
    }));
    sendMailMock = jest.fn().mockResolvedValue({code: 200, info: {}});
    nodemailer.createTransport.mockReturnValue({sendMail: sendMailMock});

    const worker: Worker = genWorker();
    const notification = await notificationService.addNotification('category1', 'testing add notification description', worker);
    expect(notification).not.toBeNull();
    expect(notification.emailAddress).toBe('admin@gmail.com');
    expect(notification.mobileNumber).toBe('+64224766245');
    });
});
