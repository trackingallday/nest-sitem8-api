
import { Injectable, Inject } from '@nestjs/common';
import { Op, QueryTypes } from 'sequelize';
import * as convertKeys from 'convert-keys';
import { LocationEvent } from './locationEvent.entity';
import { LocationEventDto } from './locationEvent.dto';
import constants from '../constants'

@Injectable()
export class LocationEventService {

  @Inject('LOCATIONEVENT_REPOSITORY') private readonly LOCATIONTIMESTAMP_REPOSITORY: typeof LocationEvent;

  //AddLocationTimestamp
  async create(props: LocationEventDto): Promise<LocationEvent> {
    return await this.LOCATIONTIMESTAMP_REPOSITORY.create<LocationEvent>(props);
  }

  async findAllWhere(props): Promise<LocationEvent[]> {
    return await this.LOCATIONTIMESTAMP_REPOSITORY.findAll<LocationEvent>(props);
  }

}

