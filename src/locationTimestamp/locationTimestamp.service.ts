
import { Injectable, Inject } from '@nestjs/common';
import { LocationTimestamp } from './locationTimestamp.entity';
import { LocationTimestampInterface } from './locationTimestamp.interface';
import constants from '../constants'

@Injectable()
export class LocationTimestampService {

  @Inject('LOCATIONTIMESTAMP_REPOSITORY') private readonly LOCATIONTIMESTAMP_REPOSITORY: typeof LocationTimestamp;

  async findAll(): Promise<LocationTimestamp[]> {
    return await this.LOCATIONTIMESTAMP_REPOSITORY.findAll<LocationTimestamp>();
  }

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

}

