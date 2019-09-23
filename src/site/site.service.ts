
import { Injectable, Inject } from '@nestjs/common';
import { Site } from './site.entity';
import { SiteInterface } from './site.interface';
import constants from '../constants'

@Injectable()
export class SiteService {

  @Inject('SITE_REPOSITORY') private readonly SITE_REPOSITORY: typeof Site;

  async findAll(): Promise<Site[]> {
    return await this.SITE_REPOSITORY.findAll<Site>();
  }

  async create(props: SiteInterface): Promise<Site> {
    return await this.SITE_REPOSITORY.create<Site>(props);
  }

  async findAllWhere(props): Promise<Site[]> {
    return await this.SITE_REPOSITORY.findAll<Site>(props);
  }

  async findOneWhere(props): Promise<Site> {
    return await this.SITE_REPOSITORY.findOne<Site>(props);
  }

  async findById(id): Promise<Site> {
    return await this.SITE_REPOSITORY.findByPk<Site>(id);
  }

}

