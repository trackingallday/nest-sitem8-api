
import { Table, Column, Model, DataType, TableOptions } from 'sequelize-typescript';

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

}

