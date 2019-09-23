
import { Worker } from './worker.entity';


export const WorkerProvider = [
  {
    provide: 'WORKER_REPOSITORY',
    useValue: Worker,
  },
];

