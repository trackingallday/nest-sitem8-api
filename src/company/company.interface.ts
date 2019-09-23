
export class CompanyInterface {
  readonly companyId: number;
  readonly name: string;
  readonly nextProcessingTime: Date;
  readonly startDayOfWeek: number;
  readonly nextApprovalReminderTime: Date;
  readonly minimumWorkingDayDuration: string;
  readonly workingDayEarliestStart: string;
  readonly workingDayDefaultStart: string;
  readonly workingDayLatestFinish: string;
  readonly workingDayDefaultFinish: string;
  readonly minimumLunchStart: string;
  readonly defaultLunchStart: string;
  readonly defaultLunchEnd: string;
  readonly maximumLunchEnd: string;
  readonly glitchRemovalPeriod: string;
  readonly minimumWorkingTimeToRemoveLunchBreak: string;
  readonly privateModeStart: string;
  readonly privateModeFinish: string;
  readonly dailyTimesheetProcessing: string;
  readonly dailyApprovalReminder: string;
  readonly demoCount: number;
  readonly customSettings: string;
}
  