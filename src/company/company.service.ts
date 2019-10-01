
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

  async updateCompany(props: Company): Promise<void> {
    const company = await this.findById(props.id);
    company.set(props);
    await company.save();
  }

  async addCompany(companyName: string): Promise<Company> {
    let company: Company = new Company();
    company = await this.initialiseDefaultValues(company);
    company.name = companyName;
    return await this.COMPANY_REPOSITORY.create<Company>(company);
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

  async initialiseDefaultValues(company: Company) {
    company.startDayOfWeek = 1; // 0 = Sunday, 1 = Monday.
    company.minimumWorkingDayDuration = '00:30:00';
    company.workingDayEarliestStart = '05:45:00';
    company.workingDayDefaultStart = '07:00:00';
    company.workingDayLatestFinish = '18:00:00';
    company.workingDayDefaultFinish = '16:00:00';
    company.minimumLunchStart = '11:45:00';
    company.defaultLunchStart = '12:00:00';
    company.defaultLunchEnd = '12:30:00';
    company.maximumLunchEnd = '13:15:00';
    company.glitchRemovalPeriod = '00:08:00';
    company.minimumWorkingTimeToRemoveLunchBreak = '05:30:00';
    company.privateModeStart = '07:00:00';
    company.privateModeFinish = '15:00:00';
    company.dailyTimesheetProcessing = '19:00:00';
    company.dailyApprovalReminder = '09:00:00';
    company.nextProcessingTime = new Date();
    company.nextApprovalReminderTime = new Date();

    return company;
  }
}
