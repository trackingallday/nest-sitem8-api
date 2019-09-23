
import { WorkerAssignment } from './workerAssignment.entity';


export const WorkerAssignmentProvider = [
  {
    provide: 'WORKERASSIGNMENT_REPOSITORY',
    useValue: WorkerAssignment,
  },
];

