
import { Injectable, Inject } from '@nestjs/common';
import { Company } from './company.entity';
import { CompanyInterface } from './company.interface';
import constants from '../constants'

@Injectable()
export class CompanyService {

  @Inject('COMPANY_REPOSITORY') private readonly COMPANY_REPOSITORY: typeof Company;

  async findAll(): Promise<Company[]> {
    return await this.COMPANY_REPOSITORY.findAll<Company>();
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

  async findById(id): Promise<Company> {
    return await this.COMPANY_REPOSITORY.findByPk<Company>(id);
  }

}

