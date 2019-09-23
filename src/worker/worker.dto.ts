
import { IsString, IsInt, IsOptional, IsNumber, IsDate, IsBoolean } from 'class-validator';

export default class WorkerDto {

  @IsNumber() readonly workerId: number;

  @IsString() readonly name: string;

  @IsString() readonly mobile: string;

  @IsString() readonly email: string;

  @IsString() readonly payrollId: string;

  @IsNumber() readonly supervisor: number;

  @IsBoolean() readonly mobileNotifications: boolean;

  @IsBoolean() readonly emailNotifications: boolean;

  @IsBoolean() readonly isEnabled: boolean;

  @IsBoolean() readonly isWorker: boolean;

  @IsBoolean() readonly isSupervisor: boolean;

  @IsBoolean() readonly isAdministrator: boolean;

  @IsString() readonly deviceID: string;

  @IsNumber() readonly companyId: number;

  @IsString() readonly authId: string;

  @IsString() readonly base64Image: string;

  @IsBoolean() readonly isSuperAdministrator: boolean;

}
