
export class TimesheetInterface {
  readonly timesheetId: number;
  readonly startDateTime: Date;
  readonly finishDateTime: Date;
  readonly status: number;
  readonly workerId: number;
  readonly companyId: number;
}
// tslint:disable-next-line:max-classes-per-file
export class TimesheetViewInterface {
  rowNumber: number;
  siteId: number;
  siteName: string;
  name: string;
  payrollId: string;
  hoursWorked: number;
  timesheetId: number;
  dayWorked: Date;
  status: number;
  companyId: number;
  startDateTime: Date;
  finishDateTime: Date;
}
