
import { LocationEvent } from './locationEvent.entity';
import { Company } from '../company/company.entity';
import { SiteAssignment } from '../siteAssignment/siteAssignment.entity';


export const LocationEventProvider = [
  {
    provide: 'LOCATIONEVENT_REPOSITORY',
    useValue: LocationEvent,
  },
  {
    provide: 'COMPANY_REPOSITORY',
    useValue: Company,
  },
  {
    provide: 'SITEASSIGNMENT_REPOSITORY',
    useValue: SiteAssignment,
  },
];
