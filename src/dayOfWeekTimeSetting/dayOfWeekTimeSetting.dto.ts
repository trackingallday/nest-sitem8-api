
import { IsString, IsInt, IsOptional, IsNumber, IsDate, IsBoolean } from 'class-validator';

export default class DayOfWeekTimeSettingDto {

  @IsNumber() readonly dayOfWeekTimeSettingId: number;

  @IsNumber() readonly siteAssignmentId: number;

  @IsNumber() readonly dayInWeek: number;

  @IsString() readonly workingDayEarliestStart: string;

  @IsString() readonly workingDayDefaultStart: string;

  @IsString() readonly workingDayLatestFinish: string;

  @IsString() readonly workingDayDefaultFinish: string;

  @IsString() readonly minimumLunchStart: string;

  @IsString() readonly defaultLunchStart: string;

  @IsString() readonly defaultLunchEnd: string;

  @IsString() readonly maximumLunchEnd: string;

}
