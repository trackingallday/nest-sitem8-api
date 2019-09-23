
export class DayOfWeekTimeSettingInterface {
  readonly dayOfWeekTimeSettingId: number;
  readonly siteAssignmentId: number;
  readonly dayInWeek: number;
  readonly workingDayEarliestStart: string;
  readonly workingDayDefaultStart: string;
  readonly workingDayLatestFinish: string;
  readonly workingDayDefaultFinish: string;
  readonly minimumLunchStart: string;
  readonly defaultLunchStart: string;
  readonly defaultLunchEnd: string;
  readonly maximumLunchEnd: string;
}
  