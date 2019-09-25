
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Worker } from '../worker/worker.entity';

@Table({ tableName: 'notification', modelName: 'notification', underscored: true })
export class Notification extends Model<Notification> {

  @Column(DataType.INTEGER)
  notificationId: number;

  @ForeignKey(() => Worker)
  @Column(DataType.INTEGER)
  workerId: number;

  @BelongsTo(() => Worker)
  worker: Worker;

  @Column(DataType.DATE)
  creationDateTime: Date;

  @Column(DataType.DATE)
  smsSentDateTime: Date;

  @Column(DataType.DATE)
  emailSentDateTime: Date;

  @Column(DataType.STRING)
  category: string;

  @Column(DataType.STRING)
  description: string;

  @Column(DataType.INTEGER)
  smsStatus: number;

  @Column(DataType.INTEGER)
  emailStatus: number;

  @Column(DataType.STRING)
  mobileNumber: string;

  @Column(DataType.STRING)
  emailAddress: string;

}
