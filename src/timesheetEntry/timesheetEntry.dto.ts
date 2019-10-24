
import { IsString, IsNumber, IsDate, IsBoolean, IsOptional } from 'class-validator';

export class TimesheetEntryDto {

  @IsOptional() readonly id: number;

  @IsNumber() readonly timesheetId: number;

  @IsDate() readonly startDateTime: Date;

  @IsDate() readonly finishDateTime: Date;

  @IsNumber() readonly modifiedWorkerId: number;

  @IsNumber() readonly siteId: number;

  @IsBoolean() readonly travel: boolean;

  @IsString() readonly description: string;

  @IsNumber() readonly siteAssignmentId: number;

  @IsNumber() readonly workerAssignmentStatus: number;

  @IsBoolean() readonly shouldCheck: boolean;

}
