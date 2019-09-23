
import { TimesheetEntry } from './timesheetEntry.entity';


export const TimesheetEntryProvider = [
  {
    provide: 'TIMESHEETENTRY_REPOSITORY',
    useValue: TimesheetEntry,
  },
];

