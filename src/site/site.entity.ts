
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Site extends Model<Site> {

  @Column(DataType.INTEGER)
  siteId: number;
  
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

