
import { IsString, IsInt, IsOptional, IsNumber, IsDate, IsBoolean } from 'class-validator';

export default class TimesheetDto {

  @IsNumber() readonly timesheetId: number;

  @IsDate() readonly startDateTime: Date;

  @IsDate() readonly finishDateTime: Date;

  @IsNumber() readonly status: number;

  @IsNumber() readonly workerId: number;

  @IsNumber() readonly companyId: number;

}
