
import { IsString, IsInt, IsOptional, IsNumber, IsDate, IsBoolean } from 'class-validator';

export default class TimesheetNoteDto {

  @IsNumber() readonly timesheetNoteId: number;

  @IsDate() readonly creationDateTime: Date;

  @IsNumber() readonly workerId: number;

  @IsString() readonly details: string;

  @IsNumber() readonly timesheetId: number;

  @IsNumber() readonly priority: number;

}
