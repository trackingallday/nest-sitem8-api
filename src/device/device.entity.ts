
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Device extends Model<Device> {

  @Column(DataType.STRING)
  deviceId: string;

  @Column(DataType.INTEGER)
  companyId: number;

}

