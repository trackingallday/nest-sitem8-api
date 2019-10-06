import { Sequelize, DataType } from 'sequelize-typescript';
import  { Item } from '../items/items.entity';
import  { AccessToken } from '../accessToken/accessToken.entity';
import  { DayOfWeekTimeSetting } from '../dayOfWeekTimeSetting/dayOfWeekTimeSetting.entity';
import  { Device } from '../device/device.entity';
import  { LocationTimestamp } from '../locationTimestamp/locationTimestamp.entity';
import  { Notification } from '../notification/notification.entity';
import { TimesheetNote } from '../timesheetNote/timesheetNote.entity';
import  { Site } from '../site/site.entity';
import  { SiteAssignment } from '../siteAssignment/siteAssignment.entity';
import { Timesheet } from '../timesheet/timesheet.entity';
import { TimesheetEntry } from '../timesheetEntry/timesheetEntry.entity';
import { Worker } from '../worker/worker.entity';
import { WorkerAssignment } from '../workerAssignment/workerAssignment.entity';
import { Company } from '../company/company.entity';


const { DBDATABASE, DBPASSWORD, DBPROVIDE, DBPOSTGRESUSERNAME, DBDIALECT, DBHOST, DBPORT } = process.env;

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',//MUST BE A STRING AND NOT A VARIABLE OTHERWISE ERROR
    useFactory: async () => {
      const sequelize = new Sequelize(DBDATABASE, DBPOSTGRESUSERNAME, DBPASSWORD, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: { decimalNumbers: true },
      });

      sequelize.addModels([
        TimesheetNote,
        Company,
        Item,
        AccessToken,
        DayOfWeekTimeSetting,
        Device,
        LocationTimestamp,
        Notification,
        Site,
        SiteAssignment,
        Timesheet,
        TimesheetEntry,
        Worker,
        WorkerAssignment,
      ]);

      sequelize.addHook('afterConnect', function setParsers() {
        this.connectionManager.refreshTypeParser({
          DECIMAL: { ...DataType.DECIMAL, parse: v => (v === null) ? v : parseFloat(v) },
        });
      });

      await sequelize.sync();
      return sequelize;
    },
  },
];
