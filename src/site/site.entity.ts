
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { TimesheetEntry } from '../timesheetEntry/timesheetEntry.entity';

@Table({ tableName: 'site', modelName: 'site', underscored: true })
export class Site extends Model<Site> {

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.GEOMETRY)
  geom: any;

  @Column(DataType.BOOLEAN)
  active: boolean;

  @Column(DataType.INTEGER)
  companyId: number;

  @Column(DataType.STRING)
  sitePayrollId: string;

  @Column(DataType.INTEGER)
  siteId: number;

  @HasMany(() => TimesheetEntry)
  timesheetEntry: TimesheetEntry[];

}
