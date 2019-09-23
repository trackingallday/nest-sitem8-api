
import { IsString, IsInt, IsOptional, IsNumber, IsDate, IsBoolean } from 'class-validator';

export default class NotificationDto {

  @IsNumber() readonly notificationID: number;

  @IsNumber() readonly workerId: number;

  @IsDate() readonly creationDateTime: Date;

  @IsDate() readonly smsSentDateTime: Date;

  @IsDate() readonly emailSentDateTime: Date;

  @IsString() readonly category: string;

  @IsString() readonly description: string;

  @IsNumber() readonly smsStatus: number;

  @IsNumber() readonly emailStatus: number;

  @IsString() readonly mobileNumber: string;

  @IsString() readonly emailAddress: string;

}
