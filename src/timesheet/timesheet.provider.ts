
import { Timesheet } from './timesheet.entity';


export const TimesheetProvider = [
  {
    provide: 'TIMESHEET_REPOSITORY',
    useValue: Timesheet,
  },
];

