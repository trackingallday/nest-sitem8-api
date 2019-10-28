export const DayOfWeek = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export const TimesheetStatus = {
  Draft: 0,
  Approved: 1,
  Locked: 2,
};

export const TimesheetFormat = {
  GroupByWorkerDaySite : 0,
  GroupByWorkerDay : 1,
  GroupByTimesheetEntry : 2,
};

export const ExportTimesheetCSVHeaders = [
  { label: 'Payroll ID', value: 'payrollId' },
  { label: 'Name', value: 'name' },
  { label: 'Site ID', value: 'siteIds' },
  { label: 'Site', value: 'siteName' },
  { label: 'Date', value: 'dayWorked' },
  { label: 'Start time', value: 'startDateTimeValue' },
  { label: 'Finish time', value: 'finishDateTimeValue' },
  { label: 'status', value: 'statusValue' },
];
