import { Sequelize } from 'sequelize-typescript';
import  { Item } from '../items/items.entity';
import  { AccessToken } from '../accessToken/accessToken.entity';
import  { DayOfWeekTimeSetting } from '../dayOfWeekTimeSetting/dayOfWeekTimeSetting.entity';
import  { Device } from '../device/device.entity';
import  { LocationTimestamp } from '../locationTimestamp/locationTimestamp.entity';
import  { Notification } from '../notification/notification.entity';
import  { Site } from '../site/site.entity';
import  { SiteAssignment } from '../siteAssignment/siteAssignment.entity';
import { Timesheet } from '../timesheet/timesheet.entity';
import { TimesheetEntry } from '../timesheetEntry/timesheetEntry.entity';
import { Worker } from '../worker/worker.entity';
import { WorkerAssignment } from '../workerAssignment/workerAssignment.entity';
import { Company } from '../company/company.entity';
import constants from '../constants';
import defineModelRelationships from './defineModelRelationships';

const { DBDATABASE, DBPASSWORD, DBPROVIDE, DBPOSTGRESUSERNAME, DBDIALECT, DBHOST, DBPORT } = process.env;

export const databaseProviders = [
  {
    provide: DBPROVIDE,
    useFactory: async () => {
      const sequelize = new Sequelize(DBDATABASE, DBPOSTGRESUSERNAME, DBPASSWORD, {
        dialect: 'postgres',
        logging: false,
      });
      sequelize.addModels([
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
      await sequelize.sync();
      return sequelize;
    },
  },
];
