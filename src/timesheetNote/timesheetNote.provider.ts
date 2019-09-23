
import { TimesheetNote } from './timesheetNote.entity';


export const TimesheetNoteProvider = [
  {
    provide: 'TIMESHEETNOTE_REPOSITORY',
    useValue: TimesheetNote,
  },
];

