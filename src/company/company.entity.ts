
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Worker } from '../worker/worker.entity';
import { Timesheet } from '../timesheet/timesheet.entity';

@Table({ tableName: 'company', modelName: 'company', underscored: true })
export class Company extends Model<Company> {

  @Column(DataType.INTEGER)
  companyId: number;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.DATE)
  nextProcessingTime: Date;

  @Column(DataType.INTEGER)
  startDayOfWeek: number;

  @Column(DataType.DATE)
  nextApprovalReminderTime: Date;

  @Column(DataType.STRING)
  minimumWorkingDayDuration: string;

  @Column(DataType.STRING)
  workingDayEarliestStart: string;

  @Column(DataType.STRING)
  workingDayDefaultStart: string;

  @Column(DataType.STRING)
  workingDayLatestFinish: string;

  @Column(DataType.STRING)
  workingDayDefaultFinish: string;

  @Column(DataType.STRING)
  minimumLunchStart: string;

  @Column(DataType.STRING)
  defaultLunchStart: string;

  @Column(DataType.STRING)
  defaultLunchEnd: string;

  @Column(DataType.STRING)
  maximumLunchEnd: string;

  @Column(DataType.STRING)
  glitchRemovalPeriod: string;

  @Column(DataType.STRING)
  minimumWorkingTimeToRemoveLunchBreak: string;

  @Column(DataType.STRING)
  privateModeStart: string;

  @Column(DataType.STRING)
  privateModeFinish: string;

  @Column(DataType.STRING)
  dailyTimesheetProcessing: string;

  @Column(DataType.STRING)
  dailyApprovalReminder: string;

  @Column(DataType.INTEGER)
  demoCount: number;

  @Column(DataType.STRING)
  customSettings: string;

  @HasMany(() => Worker)
  workers: Worker[];

  /*@HasMany(() => Timesheet)
  timesheets: Timesheet[];*/

  eatsChickens() {
    return 'I ATE SOME CHICKENS'
  }

}
