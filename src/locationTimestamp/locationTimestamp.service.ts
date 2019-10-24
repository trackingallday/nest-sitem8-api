
import { Injectable, Inject } from '@nestjs/common';
import { Op, QueryTypes } from 'sequelize';
import * as convertKeys from 'convert-keys';
import { LocationTimestamp } from './locationTimestamp.entity';
import { LocationTimestampInterface } from './locationTimestamp.interface';
import { LocationEvent } from '../locationEvent/locationEvent.entity';
import constants from '../constants'

@Injectable()
export class LocationTimestampService {

  @Inject('LOCATIONTIMESTAMP_REPOSITORY') private readonly LOCATIONTIMESTAMP_REPOSITORY: typeof LocationTimestamp;

  async findAll(): Promise<LocationTimestamp[]> {
    return await this.LOCATIONTIMESTAMP_REPOSITORY.findAll<LocationTimestamp>();
  }

  //AddLocationTimestamp
  async create(props: LocationTimestampInterface): Promise<LocationTimestamp> {
    return await this.LOCATIONTIMESTAMP_REPOSITORY.create<LocationTimestamp>(props);
  }

  async findAllWhere(props): Promise<LocationTimestamp[]> {
    return await this.LOCATIONTIMESTAMP_REPOSITORY.findAll<LocationTimestamp>(props);
  }

  async findOneWhere(props): Promise<LocationTimestamp> {
    return await this.LOCATIONTIMESTAMP_REPOSITORY.findOne<LocationTimestamp>(props);
  }

  async findById(id): Promise<LocationTimestamp> {
    return await this.LOCATIONTIMESTAMP_REPOSITORY.findByPk<LocationTimestamp>(id);
  }

   // GetLocationTimestamps(DateTime startInclusive, DateTime finishExclusive, string DeviceId, bool includeNullLocations)
   async findByWorkerIdDateRange(startDate: Date, endDate: Date, workerId: number): Promise<LocationTimestamp[]> {
    const props = {
      where: {
        [Op.and]:[
          {workerId},
          {
            locationDateTime: {
              [Op.and]:[
                { [Op.gte]: startDate },
                { [Op.lte]: endDate },
              ],
            },
          }
        ],
      },
      order:  [
        ['location_date_time', 'DESC']
      ],
      include: [LocationEvent],
    };
    const locs = await this.findAllWhere(props);
    return locs;
  }

  // GetLocationTimestamps(DateTime startInclusive, DateTime finishExclusive, string DeviceId, bool includeNullLocations)
  async findByDeviceIdDateRange(startDate: Date, endDate: Date, deviceId: string): Promise<LocationTimestamp[]> {
    const props = {
      where: {
        [Op.and]:[
          {deviceId},
          {
            locationDateTime: {
              [Op.and]:[
                { [Op.gte]: startDate },
                { [Op.lte]: endDate },
              ],
            },
          }
        ],
      },
      order:  [
        ['location_date_time', 'DESC']
      ],
      include: [LocationEvent],
    };
    const locs = await this.findAllWhere(props);
    return locs;
  }

  async findByCompanyIdDateRange(startDate: Date, endDate: Date, companyId: number): Promise<LocationTimestamp[]> {
    const props = {
      where: {
        [Op.and]:[
          {companyId},
          {
            locationDateTime: {
              [Op.and]:[
                { [Op.gte]: startDate },
                { [Op.lte]: endDate },
              ],
            },
          }
        ],
      },
      order: [
        ['location_date_time', 'DESC']
      ],
    };
    return await this.findAllWhere(props);
  }

  async getLastOnSite(workerId: number, maxDistance: number): Promise<LocationTimestamp> {
    const props = {
      where: {
        workerId,
        closestSiteId: { [Op.ne]: null },
        closestSiteDistance: { [Op.lt]: maxDistance },
      },
      order: [
        ['location_date_time', 'DESC']
      ],
      limit: 1,
    };
    return await this.findOneWhere(props);
  }

  // Typescript doesnt know that the toCamel will make them
  async getLatestByWorkerIds(workerIds: number[]): Promise<any[]> {
    if(!workerIds.length) {
      return [];
    }

    const sql = `
    SELECT q1.* from locationTimestamp AS q1 INNER JOIN

    (
      SELECT l.worker_id, MAX(l.creation_date_time) as max_time FROM locationtimestamp as l
      WHERE l.worker_id in (${workerIds.join(',')})
      GROUP BY l.worker_id
    ) as q2

    ON q1.creation_date_time = q2.max_time
    `;
    const res:LocationTimestamp[] = await this.LOCATIONTIMESTAMP_REPOSITORY.sequelize.query(sql, {
      raw: false,
      type: QueryTypes.SELECT
    });
    return res.map((l) => convertKeys.toCamel(l));
  }
}

