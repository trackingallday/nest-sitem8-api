
import { Injectable, Inject } from '@nestjs/common';
import { Device } from './device.entity';
import { DeviceInterface } from './device.interface';
import constants from '../constants'

@Injectable()
export class DeviceService {

  @Inject('DEVICE_REPOSITORY') private readonly DEVICE_REPOSITORY: typeof Device;

  async findAll(): Promise<Device[]> {
    return await this.DEVICE_REPOSITORY.findAll<Device>();
  }

  async create(props: DeviceInterface): Promise<Device> {
    return await this.DEVICE_REPOSITORY.create<Device>(props);
  }

  async findAllWhere(props): Promise<Device[]> {
    return await this.DEVICE_REPOSITORY.findAll<Device>(props);
  }

  async findOneWhere(props): Promise<Device> {
    return await this.DEVICE_REPOSITORY.findOne<Device>(props);
  }

  async findById(id): Promise<Device> {
    return await this.DEVICE_REPOSITORY.findByPk<Device>(id);
  }

}

