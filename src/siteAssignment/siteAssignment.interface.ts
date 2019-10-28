import { DayOfWeekTimeSetting } from '../dayOfWeekTimeSetting/dayOfWeekTimeSetting.entity';
import { SiteAssignment } from './siteAssignment.entity';
import { WorkerAssignment } from '../workerAssignment/workerAssignment.entity';

export class SiteAssignmentInterface {
  readonly siteAssignmentId: number;
  readonly siteId: number;
  readonly supervisingWorkerId: number;
  readonly createdAt: Date;
  readonly archived: boolean;
  readonly canAddWorkerFromLocationTimestamp: boolean;
}

// tslint:disable-next-line:max-classes-per-file
export class AddSiteAssignmentParams {
     dayOfWeekSettings: DayOfWeekTimeSetting[];
     siteAssignment: SiteAssignment;
     workerAssignments: WorkerAssignment[];
     message: string;
     assignmentMessage: WorkerAssignment;
}
