
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Worker } from '../worker/worker.entity';
import { TimesheetEntry } from '../timesheetEntry/timesheetEntry.entity';
import { Company } from '../company/company.entity';
import { TimesheetNote } from '../timesheetNote/timesheetNote.entity';

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

  @ForeignKey(() => Worker)
  @Column(DataType.INTEGER)
  workerId: number;

  @BelongsTo(() => Worker)
  worker: Worker;

  @HasMany(() => TimesheetEntry)
  timesheetEntrys: TimesheetEntry[];

  @ForeignKey(() => Company)
  @Column(DataType.INTEGER)
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @HasMany(() => TimesheetNote)
  timesheetNotes: TimesheetNote[];
}
