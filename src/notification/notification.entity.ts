
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Notification extends Model<Notification> {

  @Column(DataType.INTEGER)
  notificationId: number;

  @Column(DataType.INTEGER)
  workerId: number;

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

