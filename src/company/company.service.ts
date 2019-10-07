import { Injectable, Inject } from '@nestjs/common';
import { Company } from './company.entity';
import { CompanyInterface } from './company.interface';
import * as moment from 'moment';

@Injectable()
export class CompanyService {

  @Inject('COMPANY_REPOSITORY') private readonly COMPANY_REPOSITORY: typeof Company;

  // GetAllCompanies
  async findAll(): Promise<Company[]> {
    return await this.COMPANY_REPOSITORY.findAll<Company>({ order: ['name'] });
  }

  async create(props: CompanyInterface): Promise<Company> {
    return await this.COMPANY_REPOSITORY.create<Company>(props);
  }

  async findAllWhere(props): Promise<Company[]> {
    return await this.COMPANY_REPOSITORY.findAll<Company>(props);
  }

  async findOneWhere(props): Promise<Company> {
    return await this.COMPANY_REPOSITORY.findOne<Company>(props);
  }

  // GetCompany
  async findById(id): Promise<Company> {
    return await this.COMPANY_REPOSITORY.findByPk<Company>(id);
  }

  async updateCompany(props: any): Promise<Company> {
    const company = await this.findById(props.id);
    await company.update(props);
    return company;
  }

  async addCompany(companyName: string): Promise<Company> {
    const props = this.initialiseDefaultValues();
    return await this.COMPANY_REPOSITORY.create<Company>({ name: companyName, ...props });
  }

  // Also can be used for getCompanyName
  // getCompany
  // todo: This method is duplicate. Can be removed as well.
  async getCompanyByWorkerId(workerCompanyId: number): Promise<Company> {
    return await this.findById(workerCompanyId);
  }

  async updateCompanyCustomSettings(companyId: number, customSettingsJson: string): Promise<Company> {
    const c: Company = await this.findById(companyId);
    c.customSettings = customSettingsJson;
    this.updateCompany(c);
    return c;
  }

  initialiseDefaultValues() {
    return {
      startDayOfWeek: 1, // 0 = Sunday, 1 = Monday.
      minimumWorkingDayDuration : '00:30:00',
      workingDayEarliestStart : '05:45:00',
      workingDayDefaultStart : '07:00:00',
      workingDayLatestFinish : '18:00:00',
      workingDayDefaultFinish : '16:00:00',
      minimumLunchStart : '11:45:00',
      defaultLunchStart : '12:00:00',
      defaultLunchEnd : '12:30:00',
      maximumLunchEnd : '13:15:00',
      glitchRemovalPeriod : '00:08:00',
      minimumWorkingTimeToRemoveLunchBreak : '05:30:00',
      privateModeStart : '07:00:00',
      privateModeFinish : '15:00:00',
      dailyTimesheetProcessing : '19:00:00',
      dailyApprovalReminder : '09:00:00',
      nextProcessingTime : new Date(),
      nextApprovalReminderTime : new Date(),
      customSettings: '',
    };
  }
}
