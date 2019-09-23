
import { Site } from './site.entity';


export const SiteProvider = [
  {
    provide: 'SITE_REPOSITORY',
    useValue: Site,
  },
];

