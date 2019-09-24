
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'worker', modelName: 'worker', underscored: true })
export class Worker extends Model<Worker> {

  @Column(DataType.INTEGER)
  workerId: number;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  mobile: string;

  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  payrollId: string;

  @Column(DataType.INTEGER)
  supervisor: number;

  @Column(DataType.BOOLEAN)
  mobileNotifications: boolean;

  @Column(DataType.BOOLEAN)
  emailNotifications: boolean;

  @Column(DataType.BOOLEAN)
  isEnabled: boolean;

  @Column(DataType.BOOLEAN)
  isWorker: boolean;

  @Column(DataType.BOOLEAN)
  isSupervisor: boolean;

  @Column(DataType.BOOLEAN)
  isAdministrator: boolean;

  @Column(DataType.STRING)
  deviceId: string;

  @Column(DataType.INTEGER)
  companyId: number;

  @Column(DataType.STRING)
  authId: string;

  @Column(DataType.STRING)
  base64Image: string;

  @Column(DataType.BOOLEAN)
  isSuperAdministrator: boolean;

}

