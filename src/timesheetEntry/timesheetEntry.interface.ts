
export class TimesheetEntryInterface {
  readonly timesheetEntryId: number;
  readonly timesheetId: number;
  readonly startDateTime: Date;
  readonly finishDateTime: Date;
  readonly modifiedWorkerId: number;
  readonly siteId: number;
  readonly travel: boolean;
  readonly description: string;
  readonly siteAssignmentId: number;
  readonly workerAssignmentStatus: number;
}
