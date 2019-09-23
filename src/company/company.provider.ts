
import { Company } from './company.entity';


export const CompanyProvider = [
  {
    provide: 'COMPANY_REPOSITORY',
    useValue: Company,
  },
];

