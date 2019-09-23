
import { IsString, IsInt, IsOptional, IsNumber, IsDate, IsBoolean } from 'class-validator';

export default class TimesheetEntryDto {

  @IsNumber() readonly timesheetEntryId: number;

  @IsNumber() readonly timesheetId: number;

  @IsDate() readonly startDateTime: Date;

  @IsDate() readonly finishDateTime: Date;

  @IsNumber() readonly modifiedWorkerId: number;

  @IsNumber() readonly siteId: number;

  @IsBoolean() readonly travel: boolean;

  @IsString() readonly description: string;

  @IsNumber() readonly siteAssignmentId: number;

  @IsNumber() readonly workerAssignmentStatus: number;

}
