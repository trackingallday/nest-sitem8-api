
import { Injectable, Inject } from '@nestjs/common';
import { DayOfWeekTimeSetting } from './dayOfWeekTimeSetting.entity';
import { DayOfWeekTimeSettingInterface } from './dayOfWeekTimeSetting.interface';
import constants from '../constants'

@Injectable()
export class DayOfWeekTimeSettingService {

  @Inject('DAYOFWEEKTIMESETTING_REPOSITORY') private readonly DAYOFWEEKTIMESETTING_REPOSITORY: typeof DayOfWeekTimeSetting;

  async findAll(): Promise<DayOfWeekTimeSetting[]> {
    return await this.DAYOFWEEKTIMESETTING_REPOSITORY.findAll<DayOfWeekTimeSetting>();
  }

  async create(props: DayOfWeekTimeSettingInterface): Promise<DayOfWeekTimeSetting> {
    return await this.DAYOFWEEKTIMESETTING_REPOSITORY.create<DayOfWeekTimeSetting>(props);
  }

  async findAllWhere(props): Promise<DayOfWeekTimeSetting[]> {
    return await this.DAYOFWEEKTIMESETTING_REPOSITORY.findAll<DayOfWeekTimeSetting>(props);
  }

  async findOneWhere(props): Promise<DayOfWeekTimeSetting> {
    return await this.DAYOFWEEKTIMESETTING_REPOSITORY.findOne<DayOfWeekTimeSetting>(props);
  }

  async findById(id): Promise<DayOfWeekTimeSetting> {
    return await this.DAYOFWEEKTIMESETTING_REPOSITORY.findByPk<DayOfWeekTimeSetting>(id);
  }

}

