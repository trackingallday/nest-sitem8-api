import { Test, TestingModule } from '@nestjs/testing';
import { TimesheetController } from '../src/timesheet/timesheet.controller';
import { TimesheetModule } from '../src/timesheet/timesheet.module';
import { DatabaseModule } from '../src/db/database.module';
import { ExportTimesheetCSVHeaders } from '../src/timesheet/constants';
// tslint:disable-next-line:no-var-requires
const Email = require('../src/common/send.email');
jest.mock('../src/common/send.email');
// tslint:disable-next-line:no-var-requires
const nodemailer = require('nodemailer');
jest.mock('nodemailer');

let sendMailMock;

describe('tests timesheet export', () => {

  let timesheetController: TimesheetController;

  beforeEach(async () => {
    jest.mock('../src/common/send.sms', () => ({
      sendSMS: jest.fn().mockResolvedValue({code: 200, info: {}}),
    }));
    sendMailMock = jest.fn().mockResolvedValue({code: 200, info: {}});
    nodemailer.createTransport.mockReturnValue({sendMail: sendMailMock});

    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, TimesheetModule],
    }).compile();
    timesheetController = app.get<TimesheetController>(TimesheetController);
  });

  describe('timesheet controller', () => {

    it('timesheet controller should be defined', async () => {
      expect(timesheetController).toBeDefined();
    });

    it('export timesheet with valid data response', async () => {
      const result = await timesheetController.exportTimesheet(1, 1, 0, 1);
      const headers = ExportTimesheetCSVHeaders.map(x => x.label);
      headers.forEach(h => {
        expect(result).toContain(h);
      });
    });

    it('export timesheet with empty data response', async () => {
      const result = await timesheetController.exportTimesheet(1, 1, 1, 2);
      expect(result).not.toBeDefined();
    });

  });

});
