import  { AccessToken } from '../accessToken/accessToken.entity';
import  { DayOfWeekTimeSetting } from '../dayOfWeekTimeSetting/dayOfWeekTimeSetting.entity';
import  { Device } from '../device/device.entity';
import  { Company } from '../company/company.entity';
import  { LocationTimestamp } from '../locationTimestamp/locationTimestamp.entity';
import  { Notification } from '../notification/notification.entity';
import  { Site } from '../site/site.entity';
import  { SiteAssignment } from '../siteAssignment/siteAssignment.entity';
import { Timesheet } from '../timesheet/timesheet.entity';
import { TimesheetEntry } from '../timesheetEntry/timesheetEntry.entity';
import { Worker } from '../worker/worker.entity';
import { WorkerAssignment } from '../workerAssignment/workerAssignment.entity';

export default function() {

  Device.hasOne(Company);
  AccessToken.hasOne(Worker);

  LocationTimestamp.belongsTo(Device);
  Device.hasMany(LocationTimestamp)
  LocationTimestamp.hasOne(Company);

  Notification.hasOne(Worker);

  Site.hasOne(Company);

  SiteAssignment.hasOne(Site);
  Site.hasMany(SiteAssignment);

  SiteAssignment.hasMany(DayOfWeekTimeSetting);
  SiteAssignment.hasMany(WorkerAssignment);
  DayOfWeekTimeSetting.belongsTo(SiteAssignment);
  WorkerAssignment.belongsTo(SiteAssignment);
  WorkerAssignment.hasOne(Worker);

  Timesheet.hasOne(Company);
  Timesheet.belongsTo(Worker);
  Timesheet.hasMany(TimesheetEntry);
  Timesheet.belongsTo(Timesheet);

  Notification.hasOne(Worker);
  Worker.hasMany(Notification);
  Worker.hasMany(Timesheet);
  Worker.hasOne(Device);

};
