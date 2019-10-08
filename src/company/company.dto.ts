
import { IsString, IsInt, IsOptional, IsNumber, IsDate, IsBoolean } from 'class-validator';

export class CompanyDto {

  @IsNumber() readonly companyId: number;

  @IsString() readonly name: string;

  @IsDate() readonly nextProcessingTime: Date;

  @IsNumber() readonly startDayOfWeek: number;

  @IsDate() readonly nextApprovalReminderTime: Date;

  @IsString() readonly minimumWorkingDayDuration: string;

  @IsString() readonly workingDayEarliestStart: string;

  @IsString() readonly workingDayDefaultStart: string;

  @IsString() readonly workingDayLatestFinish: string;

  @IsString() readonly workingDayDefaultFinish: string;

  @IsString() readonly minimumLunchStart: string;

  @IsString() readonly defaultLunchStart: string;

  @IsString() readonly defaultLunchEnd: string;

  @IsString() readonly maximumLunchEnd: string;

  @IsString() readonly glitchRemovalPeriod: string;

  @IsString() readonly minimumWorkingTimeToRemoveLunchBreak: string;

  @IsString() readonly privateModeStart: string;

  @IsString() readonly privateModeFinish: string;

  @IsString() readonly dailyTimesheetProcessing: string;

  @IsString() readonly dailyApprovalReminder: string;

  @IsNumber() readonly demoCount: number;

  @IsString() readonly customSettings: string;

}
