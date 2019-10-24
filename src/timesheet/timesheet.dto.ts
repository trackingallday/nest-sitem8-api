
import { IsNumber, IsDate } from 'class-validator';

export class TimesheetDto {

  @IsDate() readonly startDateTime: Date;

  @IsDate() readonly finishDateTime: Date;

  @IsNumber() readonly status: number;

  @IsNumber() readonly workerId: number;

}
