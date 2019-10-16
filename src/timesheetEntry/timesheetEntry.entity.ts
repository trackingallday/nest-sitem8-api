
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Timesheet } from '../timesheet/timesheet.entity';
import { Site } from '../site/site.entity';

@Table({ tableName: 'timesheetentry', modelName: 'timesheetentry', underscored: true })
export class TimesheetEntry extends Model<TimesheetEntry> {

  @Column(DataType.DATE)
  startDateTime: Date;

  @Column(DataType.DATE)
  finishDateTime: Date;

  @Column(DataType.INTEGER)
  modifiedWorkerId: number;

  @Column(DataType.BOOLEAN)
  travel: boolean;

  @Column(DataType.STRING)
  description: string;

  @Column(DataType.BOOLEAN)
  shouldCheck: boolean;

  @ForeignKey(() => Timesheet)
  @Column(DataType.INTEGER)
  timesheetId: number;

  @BelongsTo(() => Timesheet)
  timesheet: Timesheet;

  @ForeignKey(() => Site)
  @Column(DataType.INTEGER)
  siteId: number;

  @BelongsTo(() => Site)
  site: Site;

}
