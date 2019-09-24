
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'timesheetentry', modelName: 'timesheetentry', underscored: true })
export class TimesheetEntry extends Model<TimesheetEntry> {

  @Column(DataType.INTEGER)
  timesheetEntryId: number;

  @Column(DataType.INTEGER)
  timesheetId: number;

  @Column(DataType.DATE)
  startDateTime: Date;

  @Column(DataType.DATE)
  finishDateTime: Date;

  @Column(DataType.INTEGER)
  modifiedWorkerId: number;

  @Column(DataType.INTEGER)
  siteId: number;

  @Column(DataType.BOOLEAN)
  travel: boolean;

  @Column(DataType.STRING)
  description: string;

  @Column(DataType.INTEGER)
  siteAssignmentId: number;

  @Column(DataType.INTEGER)
  workerAssignmentStatus: number;

}

