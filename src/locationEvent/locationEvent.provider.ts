
import { LocationEvent } from './locationEvent.entity';
import { SiteAssignment } from '../siteAssignment/siteAssignment.entity';
import { LocationTimestamp } from '../locationTimestamp/locationTimestamp.entity';

export const LocationEventProvider = [
  {
    provide: 'LOCATIONEVENT_REPOSITORY',
    useValue: LocationEvent,
  },
  {
    provide: 'LOCATIONTIMESTAMP_REPOSITORY',
    useValue: LocationTimestamp,
  },
  {
    provide: 'SITEASSIGNMENT_REPOSITORY',
    useValue: SiteAssignment,
  },
];
