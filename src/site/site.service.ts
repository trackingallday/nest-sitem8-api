
import { Injectable, Inject } from '@nestjs/common';
import { Site } from './site.entity';
import { SiteInterface } from './site.interface';

@Injectable()
export class SiteService {

  @Inject('SITE_REPOSITORY') private readonly SITE_REPOSITORY: typeof Site;

  async findAll(): Promise<Site[]> {
    return await this.SITE_REPOSITORY.findAll<Site>();
  }

  //AddSite
  async create(props: SiteInterface): Promise<Site> {
    return await this.SITE_REPOSITORY.create<Site>(props);
  }

  //GetSites
  async findAllWhere(props): Promise<Site[]> {
    return await this.SITE_REPOSITORY.findAll<Site>(props);
  }

  async findOneWhere(props): Promise<Site> {
    return await this.SITE_REPOSITORY.findOne<Site>(props);
  }

  //GetSite
  async findById(id): Promise<Site> {
    return await this.SITE_REPOSITORY.findByPk<Site>(id);
  }

  //UpdateSite
  async updateOne(id:number, props: any): Promise<Site> {
    const item = await this.findById(props);
    item.set(props);
    await item.save();
    return item;
  }

  async getClosestAssignedSite(lat: number, lon: number, excludedIds: number[], companyId: number): Promise<any> {
    const sql = `
      SELECT * from site
      WHERE NOT (site.id = ANY ARRAY[${excludedIds.toString()}])
        AND site.companyId = ${companyId}
      ORDER BY ST_DISTANCE(site.geom, ST_MakePoint(${lon}, ${lat})) ASC
      LIMIT 1;
    `;
    return await this.SITE_REPOSITORY.sequelize.query(sql, { raw: false });
  }

  async getDistanceToSite(siteId: number, lat: number, lon: number): Promise<any> {
    const sql = `
      SELECT ST_DISTANCE(site.geom, ST_MakePoint(${lon}, ${lat}))
      FROM site where siteId = ${siteId};
    `
    return await this.SITE_REPOSITORY.sequelize.query(sql, { raw: true });
  }

}

