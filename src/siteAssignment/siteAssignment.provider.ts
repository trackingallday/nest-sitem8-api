
import { SiteAssignment } from './siteAssignment.entity';
// import { WorkerAssignment } from '../workerAssignment/workerAssignment.entity';
// import { DayOfWeekTimeSetting } from '../dayOfWeekTimeSetting/dayOfWeekTimeSetting.entity';

export const SiteAssignmentProvider = [
  {
    provide: 'SITEASSIGNMENT_REPOSITORY',
    useValue: SiteAssignment,
  },
  // {
  //   provide: 'DAYOFWEEKTIMESETTING_REPOSITORY',
  //   useValue: DayOfWeekTimeSetting,
  // },
  // {
  //   provide: 'WORKERASSIGNMENT_REPOSITORY',
  //   useValue: WorkerAssignment,
  // },
];
