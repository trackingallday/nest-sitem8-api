
import { Table, Column, Model, DataType } from 'sequelize-typescript';

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
  timesheetId: number;

  @Column(DataType.INTEGER)
  priority: number;

}

