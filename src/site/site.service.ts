
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

  async getClosestAssignedSiteId(lat: number, lon: number, excludedIds: number[], companyId: number): Promise<any> {
    const sql = `
      SELECT id from site
      WHERE id NOT IN (${excludedIds.length ? excludedIds.join(",") : 0})
        AND company_id = ${companyId}
      ORDER BY
        ST_DISTANCE(
          site.geom,
          ST_MakePoint(${lon}, ${lat})
        )
        ASC
      LIMIT 1;
    `;
    const res:any = await this.SITE_REPOSITORY.sequelize.query(sql, { raw: true });

    return res[0].length ? parseInt(res[0][0]['id']) : null;
  }

  async getDistanceToSite(siteId: number, lat: number, lon: number): Promise<any> {
    const sql = `
      SELECT
        ST_Distance_Sphere(
          ST_SetSRID(site.geom, 4326),
          ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)
      ) AS distance_meters
      FROM site where site.id = ${siteId}
      LIMIT 1;
    `
    const res:any = await this.SITE_REPOSITORY.sequelize.query(sql, { raw: true });
    return res[0].length ? parseFloat(res[0][0]['distance_meters']) : null;
  }

}

