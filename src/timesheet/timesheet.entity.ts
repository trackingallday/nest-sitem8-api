
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'timesheet', modelName: 'timesheet', underscored: true })
export class Timesheet extends Model<Timesheet> {

  @Column(DataType.INTEGER)
  timesheetId: number;

  @Column(DataType.DATE)
  startDateTime: Date;

  @Column(DataType.DATE)
  finishDateTime: Date;

  @Column(DataType.INTEGER)
  status: number;

  @Column(DataType.INTEGER)
  workerId: number;

  @Column(DataType.INTEGER)
  companyId: number;

}

