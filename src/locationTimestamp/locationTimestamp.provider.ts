
import { LocationTimestamp } from './locationTimestamp.entity';


export const LocationTimestampProvider = [
  {
    provide: 'LOCATIONTIMESTAMP_REPOSITORY',
    useValue: LocationTimestamp,
  },
];

