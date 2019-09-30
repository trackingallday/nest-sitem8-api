
import { Injectable, Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import { LocationTimestamp } from './locationTimestamp.entity';
import { LocationTimestampInterface } from './locationTimestamp.interface';
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
  async findByDeviceIdDateRange(startDate: Date, endDate: Date, deviceId: string) {
    const props = {
      where: {
        deviceId,
        locationDateTime: {
          [Op.and]: {
            [Op.lte]: endDate,
            [Op.gte]: startDate,
          },
        },
      },
    };
    return await this.findAllWhere(props);
  }

  async findByCompanyIdDateRange(startDate: Date, endDate: Date, companyId: string) {
    const props = {
      where: {
        companyId,
        locationDateTime: {
          [Op.and]: {

            [Op.lte]: endDate,
            [Op.gte]: startDate,
          },
        },
      },
      order: [
        'locationDateTime', 'DESC',
      ],
    };
    return await this.findAllWhere(props);
  }

  async getLastOnSite(workerId: number, maxDistance: number) {
    const props = {
      where: {
        [Op.and]: {
          workerId,
          closestSiteId: {
            [Op.not]: null,
          },
          closestSiteDistance: {
            [Op.lte]: maxDistance,
          },
        },
      },
      order: [
        'locationDateTime', 'DESC',
      ],
      limit: 1,
    };
    return await this.findOneWhere(props);
  }
}

