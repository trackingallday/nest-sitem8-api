
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Timesheet } from '../timesheet/timesheet.entity';

@Table({ tableName: 'timesheetnote', modelName: 'timesheetnote', underscored: true })
export class TimesheetNote extends Model<TimesheetNote> {

  @Column(DataType.INTEGER)
  timesheetNoteId: number;

  @Column(DataType.DATE)
  creationDateTime: Date;

  @Column(DataType.INTEGER)
  workerId: number;

  @Column(DataType.STRING)
  details: string;

  @Column(DataType.INTEGER)
  priority: number;

  @ForeignKey(() => Timesheet)
  @Column(DataType.INTEGER)
  timesheetId: number;

  @BelongsTo(() => Timesheet)
  timesheet: Timesheet;

}
